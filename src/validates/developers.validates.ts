import { Request } from "express";
import { iDeveloperRequest, iValidateCreateDeveloper,
} from "../interfaces/developers.interfaces";

export function validateCreateUserData(req: Request): iValidateCreateDeveloper {
  const devData: iDeveloperRequest = req.body;
  const requiredKeys: string[] = ["name", "email"];
  const verifyTypes: boolean =
    typeof devData.name === "string" &&
    typeof devData.email === "string" &&
    (devData.developerInfoId ? typeof devData.developerInfoId === "number" : true);

  if (verifyTypes) {
    req.dev = {
      name: devData.name,
      email: devData.email,
    };
    devData.developerInfoId ? req.dev.developerInfoId = devData.developerInfoId  : undefined;
    return {
      status: true,
      keysMissing: [],
    };
  }
  const keysMissing: string[] = requiredKeys.filter(
    (key) => !Object.keys(devData).includes(key)
  );

  return {
    status: false,
    keysMissing,
  };
}
