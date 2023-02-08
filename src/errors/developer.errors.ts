import { Response } from "express";

export function notFoundDevId(res: Response): Response {
    return res.status(404).json({
        message: `Not found developer with this id`
    });
}