import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { iDeveloperInfoIdResult } from "../interfaces/developers.interfaces";
import { client } from "../database";

export async function ensureDevNoInfo(req: Request, res: Response, next: NextFunction): Promise<Response | void>  {
    const id: number = req.idDev!;

    const queryString: string = `--sql
        SELECT
            dv."developerInfoId"
        FROM
            developers dv
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: iDeveloperInfoIdResult = await client.query(queryConfig);
    const developerInfoId: number | null = queryResult.rows[0].developerInfoId;
    if (developerInfoId !== null) {
        return res.status(409).json({
            message: `This developer already has additional information. Use the upgrade route` 
        });
    }

    return next();
}

export async function ensureDevHaveInfo(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id: number = req.idDev!;

    const queryString: string = `--sql
        SELECT  
            dv."developerInfoId"
        FROM 
            developers dv
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: iDeveloperInfoIdResult = await client.query(queryConfig);
    const developerInfoId: number | null = queryResult.rows[0].developerInfoId;
    if (developerInfoId === null) {
        return res.status(400).json({
            message: `This developer does not have additional information`
        });
    }
    req.idInfo = developerInfoId;

    return next();
}