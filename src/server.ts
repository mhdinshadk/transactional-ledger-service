import { createApp } from "./app";
import { connectMongo } from "./db/mongoose";
import { env } from "./config/env";

async function start() {
  await connectMongo();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 Server listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
