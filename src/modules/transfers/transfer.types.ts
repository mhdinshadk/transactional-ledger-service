import { Currency } from "../accounts/account.types";

export type TransferStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface TransferDTO {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: Currency;
  status: TransferStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}
