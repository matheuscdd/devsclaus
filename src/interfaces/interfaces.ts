export interface iDeveloperRequest {
    name: string;
    email: string;
    developerInfoId?: null | number;
}

export interface iDeveloperResponse extends iDeveloperRequest {
    id: number;
}