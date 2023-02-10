import { QueryResult } from "pg";
import { iProjectWithTech } from "./projects.interfaces";

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

export interface iDeveloper {
    developerId: number;
	developerName: string;
	developerEmail: string;
	developerInfoId: null | number;
	developerInfoDeveloperSince: null | Date;
	developerInfoPreferredOS: null | string;
}

export interface iDeveloperCreate extends iDeveloperRequest {
    id: number;
    developerInfoId: null;
}

export type iDeveloperCreateResult = QueryResult<iDeveloper>;

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

type iDeveloperProject  = iDeveloper & Omit<iProjectWithTech, 'projectDeveloperId'>;

export type iDeveloperProjectResult = QueryResult<iDeveloperProject>;
