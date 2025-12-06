import mongoose, { Document, Schema } from "mongoose";
import { Currency } from "../accounts/account.types";
import { TransferStatus } from "./transfer.types";

export interface TransferDocument extends Document {
  fromAccountId: mongoose.Types.ObjectId;
  toAccountId: mongoose.Types.ObjectId;
  amount: number;
  currency: Currency;
  status: TransferStatus;
  idempotencyKey: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new Schema<TransferDocument>(
  {
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: true,
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true, 
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const TransferModel = mongoose.model<TransferDocument>(
  "Transfer",
  transferSchema
);
