import mongoose from "mongoose";
import { AccountModel } from "../accounts/account.model";
import { Currency } from "../accounts/account.types";
import { LedgerEntryModel } from "./ledger-entry.model";
import { AppError } from "../../utils/AppError";

export type TransactionType = "CREDIT" | "DEBIT";

export const LedgerService = {
  // Deposit or withdraw from a single account
  async recordTransaction(
    accountId: string,
    type: TransactionType,
    amount: number,
    description?: string
  ): Promise<void> {
    if (amount <= 0) {
      throw new AppError(400, "INVALID_AMOUNT", "Amount must be positive");
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const account = await AccountModel.findById(accountId).session(session);

        if (!account) {
          throw new AppError(404, "ACCOUNT_NOT_FOUND", "Account not found");
        }

        let newBalance = account.balance;

        if (type === "DEBIT") {
          if (account.balance < amount) {
            throw new AppError(
              400,
              "INSUFFICIENT_FUNDS",
              "Insufficient balance for debit"
            );
          }
          newBalance -= amount;
        } else {
          newBalance += amount;
        }

        account.balance = newBalance;
        await account.save({ session });

        await LedgerEntryModel.create(
          [
            {
              accountId: account._id,
              amount,
              type,
              currency: account.currency as Currency,
              description,
            },
          ],
          { session }
        );
      });
    } finally {
      session.endSession();
    }
  },
};
