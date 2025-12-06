import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || "4000";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

export const env = {
  port: Number(PORT),
  mongoUri: MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
