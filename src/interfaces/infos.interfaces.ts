import { QueryResult } from "pg";

export interface iValidadeInfo {
    status: boolean;
    keysMissing: string[];
    rightFormat: boolean[];
}

export interface iInfoRequest {
    developerSince?: string;
    preferredOS?: "Windows" | "Linux" | "MacOS";
}

export interface iInfo extends iInfoRequest {
    id: number;
}

export type iInfoResult = QueryResult<iInfo>;

