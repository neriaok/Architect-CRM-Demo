import app from "./app";
import { config } from "./config";
import { connectDB } from "./db/connectDB";

async function start(): Promise<void> {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
