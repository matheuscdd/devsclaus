import { NextFunction, Request, Response } from "express";

export async function isBodyEmpty(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: `Body is empty`
        });
    }
    return next();
}