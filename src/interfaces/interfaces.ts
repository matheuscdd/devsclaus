import { QueryResult } from "pg";

export interface iDeveloperRequest {
    name: string;
    email: string;
    developerInfoId?: null | number;
}

export interface iDeveloper extends iDeveloperRequest {
    id: number;
}

export type iDeveloperResult = QueryResult<iDeveloper>;