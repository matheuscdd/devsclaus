export interface iValidadeCreateInfo {
    status: boolean;
    keysMissing: string[];
    outFormat: boolean[];
}

export interface iInfoRequest {
    developerSince: string;
    preferredOS: "Windows" | "Linux" | "MacOS";
}

export interface iInfo extends iInfoRequest {
    id: number;
}