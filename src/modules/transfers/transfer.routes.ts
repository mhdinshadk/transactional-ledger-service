import { Router } from "express";
import { z } from "zod";
import { createTransfer } from "./transfer.controller";
import { validateBody } from "../../middleware/validate";

const router = Router();

const transferSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["USD", "INR"]),
  description: z.string().optional(),
});

router.post("/", validateBody(transferSchema), createTransfer);

export const transferRoutes = router;
