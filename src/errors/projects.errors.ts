import { Response } from "express";

export function notFoundProjectId(res: Response): Response {
    return res.status(404).json({
        message: `Not found project with this id`
    });
}