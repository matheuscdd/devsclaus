import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { iDeveloperResult } from "../interfaces/developers.interfaces";
import { notFoundDevId } from "../errors/developer.errors";

export async function ensureDevEmailOnly(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const emailDev: string = req.body.email;

  if (!emailDev) {
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
    values: [emailDev],
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
  const idDev: number = Number(req.params.id);

  if (isNaN(idDev)) {
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
    values: [idDev],
  };

  const queryResult: iDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return notFoundDevId(res);
  }

  req.idDev = idDev;

  return next();
}