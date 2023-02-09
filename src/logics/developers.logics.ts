import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { iDeveloperRequest, iDeveloperResult, iValidateCreateDeveloper } from "../interfaces/developers.interfaces";
import { validateCreateUserData } from "../validates/developers.validates";

export async function createDeveloper(req: Request, res: Response): Promise<Response> {
  const resultValidate: iValidateCreateDeveloper = validateCreateUserData(req);
  if (!resultValidate.status) {
    return res.status(400).json({
      message: `Some keys are missing ${resultValidate.keysMissing}`,
    });
  }

  const devData: iDeveloperRequest = req.dev!;

  let queryString: string = format(`--sql
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
      type: error.message,
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
  const id: number = req.idDev!;
  
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
    values: [id],
  };

  const queryResult: iDeveloperResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
}

export async function deleteDeveloper(req: Request, res: Response): Promise<Response> {
  const id: number = req.idDev!;
  //Depois preciso criar uma forma de apagar as tecnologias também
  const queryString = `--sql
        DELETE FROM
            developers
        WHERE  
            id = $1
        RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
}
