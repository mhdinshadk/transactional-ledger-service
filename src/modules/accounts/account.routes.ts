import { Router } from "express";
import { z } from "zod";
import { createAccount, getBalance, getHistory, recordTransaction } from "./account.controller";
import { validateBody } from "../../middleware/validate";

const router = Router();

// Validation 
const createAccountSchema = z.object({
  userName: z.string().min(1),
  currency: z.enum(["USD", "INR"]),
});

const transactionSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
  amount: z.number().positive(),
  description: z.string().optional(),
});

// ROUTES
router.post("/", validateBody(createAccountSchema), createAccount);

router.get("/:id/balance", getBalance);

router.get("/:id/transactions", getHistory);

router.post(
  "/:id/transactions",
  validateBody(transactionSchema),
  recordTransaction
);

export const accountRoutes = router;
