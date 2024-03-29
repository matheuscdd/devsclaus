import * as express from "express";
import { iDeveloperRequest } from "../../interfaces/developers.interfaces";
import { iInfoRequest } from "../../interfaces/infos.interfaces";
import { iProjectRequest } from "../../interfaces/projects.interfaces";

declare global {
  namespace Express {
    interface Request {
      dev?: iDeveloperRequest;
      idDev?: number;
      idProject?: number;
      idInfo:? number;
      idTech?: number;
      infoDev?: iInfoRequest;
      projectData?: iProjectRequest;
      techName?: string;
    }
  }
}
