import { Request } from "express";
import { iDeveloperRequest, iDeveloperUpdateRequest, iValidateDeveloper } from "../interfaces/developers.interfaces";

export function validateCreateDevData(req: Request): iValidateDeveloper {
  const devData: iDeveloperRequest = req.body;
  const requiredKeys: string[] = ["name", "email"];
  const verifyTypes: boolean =
    typeof devData.name === "string" &&
    typeof devData.email === "string";

  if (verifyTypes) {
    req.dev = {
      name: devData.name!,
      email: devData.email!,
      developerInfoId: null
    }
    return {
      status: true,
      rightFormat: [true],
      keysMissing: [],
    }
  }
  const keysMissing: string[] = requiredKeys.filter((key) => !Object.keys(devData).includes(key));

  return {
    status: false,
    keysMissing,
    rightFormat: [verifyTypes]
  }
}

export function validateUpdateDevData(req: Request): iValidateDeveloper {
  const devData: iDeveloperUpdateRequest = req.body;
  const requiredKeys: string[] = ["name", "email"];
  const verifyTypes: boolean = 
    (devData.name ? typeof devData.name === "string" : true) &&
    (devData.email ? typeof devData.email === "string" : true)
  const requestHaveRightData = Object.keys(devData).some((key) => requiredKeys.includes(key));
  if (verifyTypes && requestHaveRightData) {
    req.dev = {};
    devData.name ? req.dev.name = devData.name : null;
    devData.email ? req.dev.email = devData.email : null;
    return {
      status: true,
      rightFormat: [true],
      keysMissing: []
    }
  }
  return {
    status: false,
    keysMissing: [...requiredKeys],
    rightFormat: [verifyTypes, requestHaveRightData]
  }

}
