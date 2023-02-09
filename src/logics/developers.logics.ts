import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { iDeveloperRequest, iDeveloperResult, iDeveloperUpdateRequest, iValidateDeveloper } from "../interfaces/developers.interfaces";
import { validateCreateDevData, validateUpdateDevData } from "../validates/developers.validates";

export async function createDeveloper(req: Request, res: Response): Promise<Response> {
  const resultValidate: iValidateDeveloper = validateCreateDevData(req);
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

  const devData: iDeveloperRequest = req.dev!;
  const queryString: string = format(`--sql
        INSERT INTO
            developers(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(devData),
    Object.values(devData)
  );

  try {
    const queryResult: iDeveloperResult = await client.query(queryString);
    return res.status(201).json(queryResult.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      type: error.message
    });
  }
}

export async function showDevelopers(req: Request, res: Response): Promise<Response> {
  const queryString = `--sql
          SELECT
              dv."id" "developerId",
              dv."name" "developerName",
              dv."email" "developerEmail",
              di."id" "developerInfoId",
              di."developerSince" "developerInfoDeveloperSince",
              di."preferredOS" "developerInfoPreferredOS"
          FROM 
              developers dv
          LEFT JOIN 
              developer_infos di ON dv. "developerInfoId" = di.id;
    `;

  const queryResult: iDeveloperResult = await client.query(queryString);

  return res.status(200).json(queryResult.rows);
}

export async function findDeveloper(req: Request, res: Response): Promise<Response> {
  const idDev: number = req.idDev!;
  
  const queryString: string = `--sql
        SELECT
            dv."id" "developerId",
            dv."name" "developerName",
            dv."email" "developerEmail",
            di."id" "developerInfoId",
            di."developerSince" "developerInfoDeveloperSince",
            di."preferredOS" "developerInfoPreferredOS"
        FROM    
            developers dv
        LEFT JOIN
            developer_infos di ON dv. "developerInfoId" = di."id"
        WHERE
            dv."id" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idDev],
  };

  const queryResult: iDeveloperResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
}

export async function deleteDeveloper(req: Request, res: Response): Promise<Response> {
  const idDev: number = req.idDev!;

  let queryString = `--sql
        DELETE FROM
            developers
        WHERE  
            id = $1
        RETURNING *;
    `;

  let queryConfig: QueryConfig = {
    text: queryString,
    values: [idDev],
  };

  const queryResult: iDeveloperResult = await client.query(queryConfig);
  const developerInfoId: number | null = queryResult.rows[0].developerInfoId;

  if (developerInfoId !== null) {
    queryString = `--sql
      DELETE FROM 
        developer_infos
      WHERE
        id = $1;
    `;

    queryConfig = {
      text: queryString,
      values: [developerInfoId]
    }

    await client.query(queryConfig);
  }

  return res.status(204).send();
}


export async function updateDeveloper(req: Request, res: Response): Promise<Response> {
  const resultValidate: iValidateDeveloper = validateUpdateDevData(req);
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
  
  const idDev: number = req.idDev!;
  const dev: iDeveloperUpdateRequest = req.dev!;

  const queryString: string = format(`--sql
    UPDATE
      developers
    SET (%I) = ROW(%L)
    WHERE
      id = %s
    RETURNING *;
  `,
  Object.keys(dev),
  Object.values(dev),
  idDev
  );

  try {
    const queryResult: iDeveloperResult = await client.query(queryString);
    console.log(queryResult.rows)
    return res.status(200).json(queryResult.rows[0]) 
  } catch(error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      type: error.message
    });
  }
}