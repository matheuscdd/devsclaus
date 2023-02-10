import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { iProjectResult, iProjectWithTechResult } from "../interfaces/projects.interfaces";

export async function showProjects(req: Request, res: Response): Promise<Response> {
    const queryString: string = `--sql
        SELECT
            pj."id" "projectId",
            pj."name" "projectName",
            pj."description" "projectDescription",
            pj."estimatedTime" "projectEstimatedTime",
            pj."repository" "projectRepository",
            pj."startDate" "projectStartDate",
            pj."endDate" "projectEndDate",
            pj."developerId" "projectDeveloperId",
            ti."id" "technologyId",
            ti."name" "technologyName"
        FROM
            projects_technologies pt
        JOIN 
            projects pj ON pt."projectId" = pj.id
        JOIN 
            technologies ti ON pt."technologyId" = ti.id
    `;

    const queryResult: iProjectWithTechResult = await client.query(queryString);
    
    return res.status(200).json(queryResult.rows);
}

export async function findProject(req: Request, res: Response): Promise<Response> {
    const idProject: number = req.idProject!;
    console.log(idProject)
    const queryString: string = `--sql
        SELECT
            pj."id" "projectId",
            pj."name" "projectName",
            pj."description" "projectDescription",
            pj."estimatedTime" "projectEstimatedTime",
            pj."repository" "projectRepository",
            pj."startDate" "projectStartDate",
            pj."endDate" "projectEndDate",
            pj."developerId" "projectDeveloperId",
            ti."id" "technologyId",
            ti."name" "technologyName"
        FROM
            projects_technologies pt
        JOIN 
            projects pj ON pt."projectId" = pj.id
        JOIN 
            technologies ti ON pt."technologyId" = ti.id
        WHERE
            pt.id = $1
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    const queryResult: iProjectWithTechResult = await client.query(queryConfig);
    
    
    return res.status(200).json(queryResult.rows[0]);
}

