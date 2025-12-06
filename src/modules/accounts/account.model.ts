import mongoose, { Document, Schema } from "mongoose";
import { Currency } from "./account.types";

export interface AccountDocument extends Document {
  userName: string;
  currency: Currency;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Account = wallet. We keep a balance and also maintain ledger entries.
const accountSchema = new Schema<AccountDocument>(
  {
    userName: { type: String, required: true },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "INR"],
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const AccountModel = mongoose.model<AccountDocument>(
  "Account",
  accountSchema
);
