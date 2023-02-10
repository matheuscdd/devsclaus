import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { notFoundProjectId } from "../errors/projects.errors";
import { iProjectResult, iProjectTechnologiesResult, iTechResult } from "../interfaces/projects.interfaces";
import { client } from "../database"
import { iDeveloperCreateResult as iDeveloper } from "../interfaces/developers.interfaces";
import { notFoundDevId } from "../errors/developer.errors";

export async function ensureIdProjectsExists(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const idProject: number = Number(req.params.id);

    if (isNaN(idProject)) {
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
        values: [idProject]
    }

    const queryResult: iProjectResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0){
        return notFoundProjectId(res);
    }
    req.idProject = queryResult.rows[0].id;

    return next();
}

export async function ensureProjectHasTech(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const idProject: number = req.idProject!;
    const requiredTypesTechs: string[] = ["JavaScript", "Python", "React", "Express.js", "HTML", "CSS", "Django", "PostgreSQL", "MongoDB"];
    const nameTech: string = req.params.name;
    if (!requiredTypesTechs.includes(nameTech)) {
        return res.status(404).json({
            message: `Tech name is not valid`
        });
    }

    let queryString: string = `--sql
        SELECT
            *
        FROM
            projects_technologies
        WHERE
            "projectId" = $1;
    `;

    let queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    let queryResult: iProjectTechnologiesResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
        return res.status(400).json({
            message: `This project does not have a tech`
        });
    }

    queryString = `--sql
        SELECT
            *
        FROM
            technologies
        WHERE
            name = $1;
    `;

    queryConfig = {
        text: queryString,
        values: [nameTech]
    }

    const queryResponse: iTechResult = await client.query(queryConfig);

    if (queryResponse.rowCount === 0) {
        return res.status(400).json({
            message: `This project does not have this tech`
        });
    }

    req.idTech = queryResponse.rows[0].id;
    
    return next();
}

export async function ensureIdDeveloperExists(req: Request, res: Response, next: NextFunction): Promise <Response | void> {
    const idDev: number = req.body.developerId;
    
    if (!idDev) {
        return res.status(400).json({
            message: `You need put the developer id`
        });
    }

    const queryString: string = `--sql
        SELECT
            * 
        FROM
            developers dv
        WHERE
            dv.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }

    const queryResult: iDeveloper = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
        return notFoundDevId(res);
    }

    req.idDev = idDev;
    
    return next();
}

