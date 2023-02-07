import * as express from "express";
import { iDeveloperRequest } from "../../interfaces/interfaces";

declare global {
    namespace Express {
        interface Request {
            dev?: iDeveloperRequest;
        }
    }
}