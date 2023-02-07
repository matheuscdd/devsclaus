import { client } from "./config";

export async function startDatabase(): Promise<void> {
    await client.connect();
    console.log("Database connected!");
}