import { Request, Response } from "express";
import format from "pg-format";
import { iInfoResult, iValidadeCreateInfo } from "../interfaces/infos.interfaces";
import { validateCreateInfo } from "../validates/infos.validates";
import { client } from "../database";
import { QueryConfig } from "pg";

export async function createInfo(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidadeCreateInfo = validateCreateInfo(req);
    if (!resultValidate.status) {
        if (resultValidate.keysMissing.length > 0) {
            return res.status(400).json({
                message: `Some keys are missing: ${resultValidate.keysMissing}`
            });
        }
        return res.status(400).json({
            message: `Some keys or values are out of format`
        });
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
        return res.status(500).json({
            message: "Internal Server Error",
            type: error.message
        });
    }
}



// --Assim que faz para atualizar uma tecnologia
// UPDATE 
// 	developer_infos 
// SET 
// 	"preferredOS" = 'Linux'
// WHERE 
// 	id = 13;