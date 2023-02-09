import { Request, Response } from "express";
import format from "pg-format";
import { iInfoResult, iValidadeCreateInfo } from "../interfaces/infos.interfaces";
import { validateCreateInfo } from "../validates/infos.validates";
import { client } from "../database";

export async function createInfo(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidadeCreateInfo = validateCreateInfo(req);
    if (!resultValidate.status) {
        if (resultValidate.keysMissing.length > 0) {
            return res.status(400).json({
                message: `Some keys are missing ${resultValidate.keysMissing}`
            });
        }
        return res.status(400).json({
            message: `Some keys or values are out of format`
        });
    }

    const infoData = req.infoDev!;
    const queryString: string = format(`--sql
            INSERT INTO
                developer_infos(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(infoData),
        Object.values(infoData)
    );

    try {
        const queryResult: iInfoResult = await client.query(queryString);
        return res.status(201).json(queryResult.rows[0])
    } catch(error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            type: error.message
        });
    }
}