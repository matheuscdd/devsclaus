import { iInfoRequest, iValidadeCreateInfo } from "../interfaces/infos.interfaces";
import { Request } from "express";

export function validateCreateInfo(req: Request): iValidadeCreateInfo {
    const infoData: iInfoRequest = req.body;
    let infoDate: number | null | string | Date = new Date(infoData.developerSince);
    if (typeof infoDate !== "string") {
        infoDate = infoDate.toLocaleString("pt-BR");
    }
    const systemOSRequired: string[] = ["Windows", "Linux", "MacOS"];
    const requiredKeys: string[] = ["preferredOS", "developerSince"];
    const verifyTypes: boolean = 
        typeof infoData.preferredOS === "string" &&
        infoDate !== "Invalid Date";
    const isPreferredOSRightFormat: boolean = systemOSRequired.includes(infoData.preferredOS);
    if (verifyTypes && isPreferredOSRightFormat) {
        req.infoDev = {
            developerSince: infoDate,
            preferredOS: infoData.preferredOS
        }
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
        rightFormat: [isPreferredOSRightFormat, verifyTypes]
    }
}
