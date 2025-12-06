import { Currency } from "../accounts/account.types";

export type LedgerEntryType = "CREDIT" | "DEBIT";

export interface LedgerEntryDTO {
  id: string;
  accountId: string;
  amount: number;
  type: LedgerEntryType;
  currency: Currency;
  description?: string;
  transferId?: string;
  createdAt: string;
}
