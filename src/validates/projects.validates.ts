import { Request } from "express";
import { iProjectRequest } from "../interfaces/projects.interfaces";
import { verifyDateRequest } from "./common.validates";
import { iValidade } from "../interfaces/common.interfaces";

export function validateCreateProject(req: Request): iValidade {
    const requiredKeys: string [] = ["name", "description", "estimatedTime", "repository", "startDate", "developerId"];
    const projectData: iProjectRequest = req.body;
    const projectDate: null | string = projectData.startDate ? verifyDateRequest(projectData.startDate) : null;
   
    const verifyTypes: boolean = 
        typeof projectData.name === "string" &&
        typeof projectData.description === "string" &&
        typeof projectData.estimatedTime === "string" &&
        typeof projectData.repository === "string" &&
        typeof projectData.developerId === "number" &&
        projectDate !== null;
    console.log(verifyTypes) 
    if (verifyTypes) {
        req.projectData = {
            startDate: projectDate!,
            name: projectData.name,
            description: projectData.description,
            estimatedTime: projectData.estimatedTime,
            repository: projectData.repository,
            developerId: projectData.developerId
        }
        return {
            status: true,
            keysMissing: [],
            rightFormat: [true]
        }
    }     

    const keysMissing: string[] = requiredKeys.filter((key) => !Object.keys(projectData).includes(key));
    return {
        status: false,
        keysMissing,
        rightFormat: [verifyTypes]
    }

}
