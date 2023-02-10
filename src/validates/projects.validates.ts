import { Request } from "express";
import { iProjectRequest, iTechRequest, iValidateCreateTech } from "../interfaces/projects.interfaces";
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

export function validateCreateTech(req: Request): iValidateCreateTech {
    const requiredTypesTechs: string[] = ["JavaScript", "Python", "React", "Express.js", "HTML", "CSS", "Django", "PostgreSQL", "MongoDB"];
    const techData: iTechRequest = req.body;
    const status: boolean = requiredTypesTechs.includes(techData.name);
    if (status) {
        req.techName = techData.name
    }
    return {
        status,
        requiredTechs: requiredTypesTechs
    }
    ;
}