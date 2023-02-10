import { Request, Response } from "express";
import format from "pg-format";
import { iInfoResult } from "../interfaces/infos.interfaces";
import { iValidade } from "../interfaces/common.interfaces";
import { validateCreateInfo, validateUpdateInfo } from "../validates/infos.validates";
import { client } from "../database";
import { QueryConfig } from "pg";
import { iInfoRequest } from "../interfaces/infos.interfaces";
import { internalServerError, keysMissing, outFormat } from "../errors/common.errors";

export async function createInfo(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidade = validateCreateInfo(req);
    if (!resultValidate.status) {
        if (resultValidate.keysMissing.length > 0) {
            return keysMissing(res, resultValidate.keysMissing);
        }
        return outFormat(res);
    }

    const infoData = req.infoDev!;
    
    let queryString: string = format(`--sql
            INSERT INTO
                developer_infos(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(infoData),
        Object.values(infoData)
    );

    const queryResult: iInfoResult = await client.query(queryString);
    const idInfo: number = queryResult.rows[0].id;
    const idDev: number = req.idDev!;

    queryString = `--sql
        UPDATE
            developers
        SET 
            "developerInfoId" = $1
        WHERE
            "id" = $2
        RETURNING *;        
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idInfo, idDev]
    }

    try {
        await client.query(queryConfig);
        return res.status(201).json(queryResult.rows[0]);

    } catch(error: any) {
        return internalServerError(res, error.message);
    }
}

export async function updateInfo(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidade = validateUpdateInfo(req);

    if (!resultValidate.status) {
        if (!resultValidate.rightFormat[0]) {
            return outFormat(res);
        }
        return keysMissing(res, resultValidate.keysMissing);
    }

    const idInfo: number = req.idInfo!;
    const infoData: iInfoRequest = req.infoDev!;

    const queryString: string = format(`--sql
        UPDATE
            developer_infos
        SET(%I) = ROW(%L)
        WHERE
            id = %s
        RETURNING *; 
    `,
    Object.keys(infoData),
    Object.values(infoData),
    idInfo 
    );

    try {
        const queryResult: iInfoResult = await client.query(queryString);
        return res.status(200).json(queryResult.rows[0]);
    } catch(error: any) {
        return internalServerError(res, error.message);
    }
}



