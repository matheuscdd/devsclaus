import { Request, Response } from "express";
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { iDeveloperRequest, iDeveloperResult } from "../interfaces/interfaces";
import { validateCreateUserData } from "../validates/developer.validate";

export async function createDeveloper(req: Request, res: Response): Promise<Response> {
    if(!validateCreateUserData(req)) {
        res.status(400).json({
            message: 'Some keys are missing'
        });
    }

    const devData: iDeveloperRequest = req.dev!;

    let queryString: string = format(`--sql
        INSERT INTO
            developers(%I)
        VALUES
            (%L)
        RETURNING *;
    `, Object.keys(devData), Object.values(devData));

    try {
        const queryResult: iDeveloperResult = await client.query(queryString);
        return res.status(201).json(queryResult.rows[0]);
    } catch(error: any) {
        if(error.message.includes("duplicate key value violates unique")) {
            return res.status(409).json({
                message: "Email already exists" //Não dá pra usar pois pula o id
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            rt: error.message
        });
    }
}

export async function showDevelopers(req: Request, res: Response): Promise<Response> {
    const queryString = `--sql
        SELECT
            *
        FROM 
            developers;
    `;

    const queryResult: iDeveloperResult = await client.query(queryString);
    return res.status(200).json(queryResult.rows);
}