import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { notFoundProjectId } from "../errors/projects.errors";
import { iProjectResult } from "../interfaces/projects.interfaces";
import { client } from "../database"

export async function ensureIdProjectsExists(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id: number = Number(req.params.id);

    if(isNaN(id)) {
        return notFoundProjectId(res);
    }

    const queryString: string = `--sql
        SELECT
            *
        FROM 
            projects
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: iProjectResult = await client.query(queryConfig);

    if(queryResult.rowCount === 0){
        return notFoundProjectId(res);
    }

    return next();
}