import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AccountService } from "./account.service";
import { LedgerService } from "../ledger/ledger.service";

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const { userName, currency } = req.body;
  const account = await AccountService.createAccount(userName, currency);
  res.status(201).json(account);
});

export const getBalance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const balance = await AccountService.getBalance(id);
  res.json(balance);
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const history = await AccountService.getHistory(id, page, limit);
  res.json(history);
});

// Deposit / Withdraw
export const recordTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, amount, description } = req.body;
    await LedgerService.recordTransaction(id, type, amount, description);
    res.status(201).json({ success: true });
  }
);
