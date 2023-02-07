import express, { Application, json } from "express";
import { startDatabase } from "./database";
const app: Application = express();
app.use(json());

const PORT: number = 3000;
const url: string = `http://localhost:${PORT}`;
const runningMsg: string = `Server running on ${url}`;
app.listen(PORT, async (): Promise<void> => {
    console.log(runningMsg);
    await startDatabase();
});