import express from "express";
import cors from "cors";
import { accountRoutes } from "./modules/accounts/account.routes";
import { transferRoutes } from "./modules/transfers/transfer.routes";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/accounts", accountRoutes);
  app.use("/api/transfers", transferRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
