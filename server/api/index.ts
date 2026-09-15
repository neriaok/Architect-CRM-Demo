import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import { connectDB } from "../src/db/connectDB";

// Vercel reuses a warm lambda instance across invocations, so this promise is
// cached at module scope instead of connecting to Atlas on every request. On
// failure the cache is cleared so a transient Atlas hiccup doesn't wedge the
// warm instance into failing forever.
let dbConnection: Promise<void> | null = null;

function ensureDbConnected(): Promise<void> {
  if (!dbConnection) {
    dbConnection = connectDB().catch((err) => {
      dbConnection = null;
      throw err;
    });
  }
  return dbConnection;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await ensureDbConnected();
  app(req, res);
}
