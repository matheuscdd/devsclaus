import { iInfoRequest, iValidadeInfo } from "../interfaces/infos.interfaces";
import { verifyDateRequest } from "./common.validates";
import { Request } from "express";

export function validateCreateInfo(req: Request): iValidadeInfo {
    const infoData: iInfoRequest = req.body;
    const infoDate: null | string = infoData.developerSince ? verifyDateRequest(infoData.developerSince) : null;
    console.log(infoDate)
    const systemOSRequired: string[] = ["Windows", "Linux", "MacOS"];
    const requiredKeys: string[] = ["preferredOS", "developerSince"];
    const verifyTypes: boolean = 
        systemOSRequired.includes(infoData.preferredOS!) &&
        infoDate !== null;
    if (verifyTypes) {
        req.infoDev = {}
        req.infoDev.developerSince = infoDate!;
        req.infoDev.preferredOS = infoData.preferredOS!;
        return {
            status: true,
            keysMissing: [],
            rightFormat: [true]
        }
    }
    const keysMissing: string[] = requiredKeys.filter((key) => !Object.keys(infoData).includes(key));
    return {
        status: false,
        keysMissing,
        rightFormat: [verifyTypes]
    }
}

export function validateUpdateInfo(req: Request): iValidadeInfo {
    const infoData: iInfoRequest = req.body;
    const systemOSRequired: string[] = ["Windows", "Linux", "MacOS"];
    const infoDate: null | string = infoData.developerSince ? verifyDateRequest(infoData.developerSince) : null;
    const verifyTypes: boolean =
        (infoData.preferredOS ? systemOSRequired.includes(infoData.preferredOS!) : true) &&
        (infoData.developerSince ? infoDate !== null : true)
    if (verifyTypes && (infoData.developerSince || infoData.preferredOS)) {
        req.infoDev = {};
        infoData.preferredOS ? req.infoDev.preferredOS = infoData.preferredOS : null;
        infoData.developerSince ? req.infoDev.developerSince = infoDate! : null;
        return {
            status: true,
            keysMissing: [],
            rightFormat: [true]
        }
    }
    return {
        status: false,
        keysMissing: ["preferredOS", "developerSince"],
        rightFormat: [verifyTypes]
    }
}