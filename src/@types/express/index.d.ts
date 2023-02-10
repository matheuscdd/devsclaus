import * as express from "express";
import { iDeveloperRequest } from "../../interfaces/developers.interfaces";
import { iInfoRequest } from "../../interfaces/infos.interfaces";

declare global {
  namespace Express {
    interface Request {
      dev?: iDeveloperRequest;
      idDev?: number;
      idProject?: number;
      idInfo:? number;
      infoDev?: iInfoRequest;
    }
  }
}
