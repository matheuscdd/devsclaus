import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createDeveloper, deleteDeveloper, findDeveloper, showDevelopers, showProjectsDev, updateDeveloper } from "./logics/developers.logics";
import { ensureDevEmailOnly, ensureIdDeveloperExists } from "./middlewares/developer.middlewares";
import { createInfo, updateInfo } from "./logics/infos.logics";
import { isBodyEmpty } from "./middlewares/common.middlewares";
import { ensureDevHaveInfo, ensureDevNoInfo } from "./middlewares/infos.middlewares";
import { findProject, showProjects } from "./logics/projects.logics";
import { ensureIdProjectsExists } from "./middlewares/projects.middlewares";


const app: Application = express();

app.use(json());
app.get("/developers", showDevelopers);
app.get("/developers/:id", ensureIdDeveloperExists, findDeveloper);
app.post("/developers", isBodyEmpty, ensureDevEmailOnly, createDeveloper);
app.delete("/developers/:id", ensureIdDeveloperExists, deleteDeveloper);
app.post("/developers/:id/infos", isBodyEmpty, ensureIdDeveloperExists, ensureDevNoInfo, createInfo);
app.patch("/developers/:id", isBodyEmpty, ensureIdDeveloperExists, ensureDevEmailOnly, updateDeveloper);
app.patch("/developers/:id/infos", isBodyEmpty, ensureIdDeveloperExists, ensureDevHaveInfo, updateInfo);
app.get("/projects", showProjects);
app.get("/projects/:id", ensureIdProjectsExists, findProject);
app.get("/developers/:id/projects", ensureIdDeveloperExists, showProjectsDev);

const PORT: number = 3000; 
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});