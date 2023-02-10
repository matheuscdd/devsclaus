import { QueryResult } from "pg";

export interface iDeveloperRequest {
    name?: string;
    email?: string;
    developerInfoId?: null;
}

export interface iDeveloperUpdateRequest {
    name?: string;
    email?: string;
    developerInfoId?: null;
}

export interface iDeveloper extends iDeveloperRequest {
    id: number;
    developerInfoId: null;
}

export type iDeveloperResult = QueryResult<iDeveloper>;

export interface iValidateDeveloper {
    status: boolean;
    keysMissing: string[];
    rightFormat: boolean[];
}

export interface iDeveloperInfoId {
    developerInfoId: number | null;
}

export type iDeveloperInfoIdResult = QueryResult<iDeveloperInfoId>;
