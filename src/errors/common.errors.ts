import { Response } from "express";

export function keysMissing(res: Response, keys: string[]): Response {
    return res.status(400).json({
        message: `Some keys are missing: ${keys}`
    });
}

export function outFormat(res: Response, arr: string[] = []): Response {
    return res.status(400).json({
        message: `Some values are out of format. ${arr}`
    });
}

export function internalServerError(res: Response, message: string): Response {
    return res.status(500).json({
        message: `Internal Server Error`,
        type: message
    });
}