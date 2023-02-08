import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createDeveloper, deleteDeveloper, findDeveloper, showDevelopers } from "./logics/developers.logics";
import { ensureDevEmailOnly, ensureIdDeveloperExists } from "./middlewares/developer.middlewares";

const app: Application = express();

app.use(json());
app.get("/developers", showDevelopers);
app.get("/developers/:id", ensureIdDeveloperExists, findDeveloper);
app.post("/developers", ensureDevEmailOnly, createDeveloper);
app.delete("/developers/:id", ensureIdDeveloperExists, deleteDeveloper);

const PORT: number = 3000;
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});