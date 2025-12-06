import mongoose, { Document, Schema } from "mongoose";
import { Currency } from "../accounts/account.types";
import { LedgerEntryType } from "./ledger.types";

export interface LedgerEntryDocument extends Document {
  accountId: mongoose.Types.ObjectId;
  amount: number; 
  type: LedgerEntryType;
  currency: Currency;
  description?: string;
  transferId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ledgerEntrySchema = new Schema<LedgerEntryDocument>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      required: true,
    },
    description: { type: String },
    transferId: { type: Schema.Types.ObjectId, ref: "Transfer" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LedgerEntryModel = mongoose.model<LedgerEntryDocument>(
  "LedgerEntry",
  ledgerEntrySchema
);
