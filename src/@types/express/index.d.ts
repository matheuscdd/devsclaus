import * as express from "express";
import { iDeveloperRequest } from "../../interfaces/developers.interfaces";
import { iDeveloperRequest } from "../../interfaces/developers.interfaces";

declare global {
  namespace Express {
    interface Request {
      dev?: iDeveloperRequest;
      idDev?: number;
      idProject?: number;
      infoDev?: iInfoRequest;
    }
  }
}
