import mongoose from "mongoose";
import { AccountModel } from "../accounts/account.model";
import { Currency } from "../accounts/account.types";
import { LedgerEntryModel } from "../ledger/ledger-entry.model";
import { TransferModel, TransferDocument } from "./transfer.model";
import { AppError } from "../../utils/AppError";

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: Currency;
  description?: string;
}

function toTransferResponse(doc: TransferDocument) {
  return {
    id: doc._id.toString(),
    fromAccountId: doc.fromAccountId.toString(),
    toAccountId: doc.toAccountId.toString(),
    amount: doc.amount,
    currency: doc.currency,
    status: doc.status,
    idempotencyKey: doc.idempotencyKey,
    errorMessage: doc.errorMessage ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export const TransferService = {
  async createTransfer(
    input: TransferInput,
    idempotencyKey: string
  ): Promise<ReturnType<typeof toTransferResponse>> {
    const { fromAccountId, toAccountId, amount, currency, description } = input;

    if (!idempotencyKey) {
      throw new AppError(
        400,
        "MISSING_IDEMPOTENCY_KEY",
        "Idempotency-Key header is required"
      );
    }

    if (amount <= 0) {
      throw new AppError(400, "INVALID_AMOUNT", "Amount must be positive");
    }

    //  Idempotency: try to create transfer with this key
    let transfer: TransferDocument | null = null;
    try {
      transfer = await TransferModel.create({
        fromAccountId,
        toAccountId,
        amount,
        currency,
        status: "PENDING",
        idempotencyKey,
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        // Duplicate idempotency key
        const existing = await TransferModel.findOne({ idempotencyKey });
        if (!existing) {
          throw new AppError(
            500,
            "IDEMPOTENCY_CONFLICT",
            "Idempotency conflict"
          );
        }
        return toTransferResponse(existing);
      }
      throw err;
    }

    try {
      //  Load accounts 
      const [fromAcc, toAcc] = await Promise.all([
        AccountModel.findById(fromAccountId),
        AccountModel.findById(toAccountId),
      ]);

      if (!fromAcc || !toAcc) {
        transfer.status = "FAILED";
        transfer.errorMessage = "One or both accounts not found";
        await transfer.save();
        throw new AppError(
          404,
          "ACCOUNT_NOT_FOUND",
          "One or both accounts not found"
        );
      }

      if (fromAcc.currency !== currency || toAcc.currency !== currency) {
        transfer.status = "FAILED";
        transfer.errorMessage = "Currency mismatch";
        await transfer.save();
        throw new AppError(400, "CURRENCY_MISMATCH", "Currency mismatch");
      }

      //  debit using conditional update
         
      const debited = await AccountModel.findOneAndUpdate(
        {
          _id: fromAcc._id,
          balance: { $gte: amount },
        },
        {
          $inc: { balance: -amount },
        },
        { new: true }
      );

      if (!debited) {
        // This means balance < amount at the moment of update (overdraft protection)
        transfer.status = "FAILED";
        transfer.errorMessage = "Insufficient funds";
        await transfer.save();
        throw new AppError(
          400,
          "INSUFFICIENT_FUNDS",
          "Insufficient balance for transfer"
        );
      }

      //Credit receiver
      const credited = await AccountModel.findOneAndUpdate(
        {
          _id: toAcc._id,
        },
        {
          $inc: { balance: amount },
        },
        { new: true }
      );

      if (!credited) {
        // Try to compensate by refunding the source.
        await AccountModel.findByIdAndUpdate(fromAcc._id, {
          $inc: { balance: amount },
        });

        transfer.status = "FAILED";
        transfer.errorMessage = "Destination account not found during transfer";
        await transfer.save();

        throw new AppError(
          500,
          "DESTINATION_NOT_FOUND",
          "Destination account disappeared during transfer"
        );
      }

     // Create ledger entries
      await LedgerEntryModel.insertMany([
        {
          accountId: debited._id,
          amount,
          type: "DEBIT",
          currency,
          description: description ?? "Internal transfer - debit",
          transferId: transfer._id,
        },
        {
          accountId: credited._id,
          amount,
          type: "CREDIT",
          currency,
          description: description ?? "Internal transfer - credit",
          transferId: transfer._id,
        },
      ]);

      // transfer as SUCCESS
      transfer.status = "SUCCESS";
      await transfer.save();

      return toTransferResponse(transfer);
    } catch (err) {
      if (transfer && transfer.status === "PENDING") {
        transfer.status = "FAILED";
        transfer.errorMessage =
          transfer.errorMessage || "Unexpected error during transfer";
        await transfer.save();
      }
      throw err;
    }
  },
};
