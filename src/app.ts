import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createDeveloper, showDevelopers } from "./logics/dev.logics";

const app: Application = express();

app.use(json());
app.get("/developers", showDevelopers);
app.post("/developers", createDeveloper);

const PORT: number = 3000;
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});