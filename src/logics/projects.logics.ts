import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { internalServerError, keysMissing, outFormat } from "../errors/common.errors";
import { iValidade } from "../interfaces/common.interfaces";
import { iProjectCreate, iProjectRequest, iProjectResult, iProjectTechnologiesResult, iProjectWithTechResult, iTechResult, iValidateCreateTech } from "../interfaces/projects.interfaces";
import { validateCreateProject, validateCreateTech, validateUpdateProject } from "../validates/projects.validates";

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
            projects pj
        LEFT JOIN 
            projects_technologies pt ON pt."projectId" = pj.id
        LEFT JOIN 
            technologies ti ON pt."technologyId" = ti.id;
    `;

    const queryResult: iProjectWithTechResult = await client.query(queryString);
    
    return res.status(200).json(queryResult.rows);
}

export async function findProject(req: Request, res: Response): Promise<Response> {
    const idProject: number = req.idProject!;
    
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
            projects pj
        LEFT JOIN 
            projects_technologies pt ON pt."projectId" = pj.id
        LEFT JOIN 
            technologies ti ON pt."technologyId" = ti.id
        WHERE
            pj.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    const queryResult: iProjectWithTechResult = await client.query(queryConfig);
    
    return res.status(200).json(queryResult.rows);
}

export async function deleteProject(req: Request, res: Response): Promise<Response> {
    const idProject: number = req.idProject!;

    const queryString: string = `--sql
        DELETE FROM
            projects
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    await client.query(queryConfig);

    return res.status(204).send();
}

export async function deleteTech(req: Request, res: Response): Promise<Response> {
    const idProject: number = req.idProject!;
    const idTech: number = req.idTech!;
 
    let queryString: string = `--sql
        SELECT 
            *
        FROM
            projects_technologies pj
        WHERE
            pj."projectId" = $1 and pj."technologyId" = $2;
    `; 

    let queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject, idTech]
    }

    const queryResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
        return res.status(404).json({
            message: `Not found tech`
        });
    }

    queryString = `--sql
        DELETE FROM
            projects_technologies pj
        WHERE
            pj."projectId" = $1 and pj."technologyId" = $2;
    `;

    queryConfig = {
        text: queryString,
        values: [idProject, idTech]
    }

    await client.query(queryConfig);

    return res.status(204).send();
}

export async function createProject(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidade = validateCreateProject(req);
    if (!resultValidate.status) {
        if (resultValidate.keysMissing.length > 0) {
            return keysMissing(res, resultValidate.keysMissing);
        }
        return outFormat(res);
    }

    const projectData: iProjectRequest = req.projectData!;

    let queryString: string = format(`--sql
        INSERT INTO
            projects(%I)
        VALUES 
            (%L)
        RETURNING *;        
    `,
    Object.keys(projectData),
    Object.values(projectData)
    );
    try {
        const queryResult: iProjectResult = await client.query(queryString);
        return res.status(201).json(queryResult.rows[0]);
    } catch(error: any) {
        return internalServerError(res, error.message);
    }   
}

export async function createTech(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidateCreateTech = validateCreateTech(req);
    if (!resultValidate.status) {
        return res.status(400).json({
            message: `Technology not supported`,
            options: resultValidate.requiredTechs
        });
    } 

    const idProject: number = req.idProject!;
    const techName: string = req.techName!;

    let queryString: string = `--sql
        SELECT
            *
        FROM
            technologies  
        WHERE   
            name = $1;
    `;

    let queryConfig: QueryConfig = {
        text: queryString,
        values: [techName]
    }

    const queryResult: iTechResult = await client.query(queryConfig);
    const idTech: number = queryResult.rows[0].id;

    queryString = `--sql
        INSERT INTO
            projects_technologies("projectId", "technologyId", "addedIn")
        VALUES
            ($1, $2, $3)
        RETURNING *;      
    `;

    queryConfig = {
        text: queryString,
        values: [idProject, idTech, new Date().toLocaleDateString("pt-br")]
    }

    await client.query(queryConfig);

    queryString = `--sql
        SELECT 
            pj."id" "projectId",
            pj."name" "projectName",
            pj."description" "projectDescription",
            pj."estimatedTime" "projectEstimatedTime",
            pj."repository" "projectRepository",
            pj."startDate" "projectsStartDate",
            pj."endDate" "projectsEndDate",
            pj."developerId" "projectDeveloperId",
            ti."id" "technologyId",
            ti."name" "technologyName"
        FROM 
            projects_technologies pt 
        JOIN
            projects pj ON pt."projectId" = pj.id
        JOIN 
            technologies ti ON pt."technologyId" = ti.id
        WHERE pj.id = $1;
    `;

    queryConfig = {
        text: queryString,
        values: [idProject]
    }

    const queryResponse: iProjectWithTechResult = await client.query(queryConfig);

    return res.status(201).json(queryResponse.rows[0]);
}

export async function updateProject(req: Request, res: Response): Promise<Response> {
    const resultValidate: iValidade = validateUpdateProject(req);
    if (!resultValidate.status) {
        if (resultValidate.keysMissing.length > 0) {
            return keysMissing(res, resultValidate.keysMissing);
        }
        return outFormat(res);
    }
    const idProject: number = req.idProject!;
    const projectData: iProjectRequest = req.projectData!

    const queryString: string = format(`--sql
        UPDATE 
            projects
        SET(%I) = ROW(%L)
        WHERE 
            id = %s
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData),
    idProject
    );

    try {
        const queryResult: iProjectResult = await client.query(queryString);
        return res.status(200).json(queryResult.rows);
    } catch(error: any) {
        return internalServerError(res, error.message);
    }
}