import { QueryResult } from "pg";

export interface iProjectRequest {
    name: string;
    description: string;
    estimatedTime: string;
    repository: string;
    startDate: Date; //Talvez precise trocar para string
    developerId: number;
}

export interface iProject extends iProjectRequest {
    endDate: Date | null;
    id: number;
}

export type iProjectResult = QueryResult<iProject>;