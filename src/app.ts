import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createDeveloper, deleteDeveloper, findDeveloper, showDevelopers, showProjectsDev, updateDeveloper } from "./logics/developers.logics";
import { ensureDevEmailOnly, ensureIdDeveloperExists as ensureIdDeveloperExistsDev } from "./middlewares/developer.middlewares";
import { ensureIdDeveloperExists as ensureIdDeveloperExistsProj } from "./middlewares/projects.middlewares";
import { createInfo, updateInfo } from "./logics/infos.logics";
import { isBodyEmpty } from "./middlewares/common.middlewares";
import { ensureDevHasInfo, ensureDevNoInfo } from "./middlewares/infos.middlewares";
import { createProject, createTech, deleteProject, deleteTech, findProject, showProjects, updateProject } from "./logics/projects.logics";
import { ensureIdProjectsExists, ensureProjectHasTech } from "./middlewares/projects.middlewares";


const app: Application = express();

app.use(json());
app.get("/developers", showDevelopers);
app.get("/developers/:id", ensureIdDeveloperExistsDev, findDeveloper);
app.post("/developers", isBodyEmpty, ensureDevEmailOnly, createDeveloper);
app.delete("/developers/:id", ensureIdDeveloperExistsDev, deleteDeveloper);
app.patch("/developers/:id", isBodyEmpty, ensureIdDeveloperExistsDev, ensureDevEmailOnly, updateDeveloper);

app.post("/developers/:id/infos", isBodyEmpty, ensureIdDeveloperExistsDev, ensureDevNoInfo, createInfo);
app.patch("/developers/:id/infos", isBodyEmpty, ensureIdDeveloperExistsDev, ensureDevHasInfo, updateInfo);

app.get("/developers/:id/projects", ensureIdDeveloperExistsDev, showProjectsDev);
app.get("/projects", showProjects);
app.post("/projects", isBodyEmpty, ensureIdDeveloperExistsProj, createProject);
app.get("/projects/:id", ensureIdProjectsExists, findProject);
app.delete("/projects/:id", ensureIdProjectsExists, deleteProject);
app.patch("/projects/:id", isBodyEmpty, ensureIdProjectsExists, updateProject);

app.post("/projects/:id/technologies", isBodyEmpty, ensureIdProjectsExists, createTech);
app.delete("/projects/:id/technologies/:name", ensureIdProjectsExists, ensureProjectHasTech, deleteTech);

const PORT: number = 3000; 
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});