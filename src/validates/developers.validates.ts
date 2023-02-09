import { Request } from "express";
import { iDeveloperCreateRequest, iDeveloperUpdateRequest, iValidateDeveloper,
} from "../interfaces/developers.interfaces";

export function validateCreateDevData(req: Request): iValidateDeveloper {
  const devData: iDeveloperCreateRequest = req.body;
  const requiredKeys: string[] = ["name", "email"];
  const verifyTypes: boolean =
    typeof devData.name === "string" &&
    typeof devData.email === "string";

  if (verifyTypes) {
    req.dev = {
      name: devData.name,
      email: devData.email,
      developerInfoId: null
    };
    return {
      status: true,
      rightFormat: [true],
      keysMissing: [],
    };
  }
  const keysMissing: string[] = requiredKeys.filter(
    (key) => !Object.keys(devData).includes(key)
  );

  return {
    status: false,
    keysMissing,
    rightFormat: [verifyTypes]
  };
}

// export function validateUpdateDevData(req: Request): iValidateDeveloper {
//   const devData: iDeveloperUpdateRequest = req.body;
//   const requiredKeys: string[] = ["name", "email"];
//   const verifyTypes: boolean = 

// }
