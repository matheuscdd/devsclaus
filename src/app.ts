import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createDeveloper, deleteDeveloper, findDeveloper, showDevelopers, updateDeveloper } from "./logics/developers.logics";
import { ensureDevEmailOnly, ensureIdDeveloperExists } from "./middlewares/developer.middlewares";
import { createInfo } from "./logics/infos.logics";
import { isBodyEmpty } from "./middlewares/common.middlewares";
import { ensureDevNoInfo } from "./middlewares/infos.middlewares";
import { validateUpdateDevData } from "./validates/developers.validates";

const app: Application = express();

app.use(json());
app.get("/developers", showDevelopers);
app.get("/developers/:id", ensureIdDeveloperExists, findDeveloper);
app.post("/developers", isBodyEmpty, ensureDevEmailOnly, createDeveloper);
app.delete("/developers/:id", ensureIdDeveloperExists, deleteDeveloper);
app.post("/developers/:id/infos", isBodyEmpty, ensureIdDeveloperExists, ensureDevNoInfo, createInfo);
app.patch("/developers/:id", isBodyEmpty, ensureIdDeveloperExists, ensureDevEmailOnly, updateDeveloper);

const PORT: number = 3000; 
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});