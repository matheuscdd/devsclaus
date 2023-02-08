import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { iDeveloperResult } from "../interfaces/developers.interfaces";
import { notFoundDevId } from "../errors/developer.errors";

export async function ensureDevEmailOnly(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const email: string = req.body.email;

  if (!email) {
    return next();
  }

  const queryString = `--sql
        SELECT
            *
        FROM 
            developers
        WHERE
            email = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  return next();
}

export async function ensureIdDeveloperExists(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const id: number = Number(req.params.id);

  if (isNaN(id)) {
    return notFoundDevId(res);
  }

  const queryString: string = `--sql
        SELECT
            *
        FROM 
            developers
        WHERE   
            id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: iDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return notFoundDevId(res);
  }

  req.idDev = id;

  return next();
}
