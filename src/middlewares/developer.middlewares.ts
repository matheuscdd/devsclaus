import { NextFunction, Request } from "express";

export async function ensureDevIdOnly(req: Request, res: Response, next: NextFunction): Promise<