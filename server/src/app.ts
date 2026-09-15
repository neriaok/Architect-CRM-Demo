import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { ApiResponse } from "./types/ApiResponse";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  const body: ApiResponse<{ status: string }> = { success: true, data: { status: "ok" } };
  res.json(body);
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
