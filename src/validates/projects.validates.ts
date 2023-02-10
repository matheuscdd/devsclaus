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
    
    if (verifyTypes) {
        req.projectData = {
            startDate: projectDate!,
            name: projectData.name!,
            description: projectData.description!,
            estimatedTime: projectData.estimatedTime!,
            repository: projectData.repository!,
            developerId: projectData.developerId!
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

export function validateUpdateProject(req: Request): iValidade {
    const requiredKeys: string [] = ["name", "description", "estimatedTime", "repository", "startDate", "developerId"];
    const projectData: iProjectRequest = req.body;
    const projectDate: null | string | boolean = projectData.startDate ? verifyDateRequest(projectData.startDate) : true;
   
    const verifyTypes: boolean = 
        (projectData.name ? typeof projectData.name === "string" : true) &&
        (projectData.description ? typeof projectData.description === "string" : true) &&
        (projectData.estimatedTime ?  typeof projectData.estimatedTime === "string" : true) &&
        (projectData.repository ? typeof projectData.repository === "string" : true) &&
        projectDate !== null;
    
    if (verifyTypes) {
        req.projectData = {};
        projectDate !== true ? req.projectData.startDate = projectDate! : null;
        projectData.name ? req.projectData.name = projectData.name : null;
        projectData.description ? req.projectData.description = projectData.description : null;
        projectData.estimatedTime ? req.projectData.estimatedTime = projectData.estimatedTime : null;
        projectData.repository ? req.projectData.repository = projectData.repository : null;
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
}