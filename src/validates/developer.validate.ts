import { Request } from "express";
import { iDeveloperRequest } from "../interfaces/interfaces";

export function validateCreateUserData(req: Request): boolean {
  const devData: iDeveloperRequest = req.body;
  const verifyTypes: boolean =
    typeof devData.name === "string" &&
    typeof devData.email === "string" &&
    (devData.developerInfoId ? typeof devData.developerInfoId === "number" : true);

  if (verifyTypes) {
    req.dev = {
      name: devData.name,
      email: devData.email,
    };
    devData.developerInfoId ? req.dev.developerInfoId = devData.developerInfoId : undefined;
    return true;
  }
  return false;
}
