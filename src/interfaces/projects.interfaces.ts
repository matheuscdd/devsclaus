import { QueryResult } from "pg";

export interface iProjectRequest {
    name: string;
    description: string;
    estimatedTime: string;
    repository: string;
    startDate: Date; //Talvez precise trocar para string
    developerId: number;
}

export interface iProjectCreate extends iProjectRequest {
    endDate: Date | null;
    id: number;
}

export type iProjectResult = QueryResult<iProjectCreate>;

export interface iProjectWithTech {
    projectID: number;
    projectName: string;
    projectDescription: string;
    projectEstimatedTime: string;
    projectRepository: URL;
    projectStartDate: Date;
    projectEndDate: null | Date;
    projectDeveloperId: number;
    technologyID: null | number;
    technologyName: null | string;
}

export type iProjectWithTechResult = QueryResult<iProjectWithTech>;

interface iProjectTechnologies {
    id: number;
    addedIn: Date;
    projectId: number;
    technologyId: number | null;
}

export type iProjectTechnologiesResult = QueryResult<iProjectTechnologies>;

interface iTech {
    id: number;
    name: string;
}

export type iTechResult = QueryResult<iTech>;