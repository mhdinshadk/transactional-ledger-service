import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { TransferService } from "./transfer.service";

export const createTransfer = asyncHandler(async (req: Request, res: Response) => {
  const idempotencyKey = req.header("Idempotency-Key") || "";
  const { fromAccountId, toAccountId, amount, currency, description } = req.body;

  const transfer = await TransferService.createTransfer(
    { fromAccountId, toAccountId, amount, currency, description },
    idempotencyKey
  );

  res.status(201).json(transfer);
});
