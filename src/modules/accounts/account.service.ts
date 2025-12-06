import mongoose from "mongoose";
import { AccountModel, AccountDocument } from "./account.model";
import { AccountDTO, Currency } from "./account.types";
import { AppError } from "../../utils/AppError";
import { LedgerEntryModel } from "../ledger/ledger-entry.model";

function toAccountDTO(doc: AccountDocument): AccountDTO {
  return {
    id: doc._id.toString(),
    userName: doc.userName,
    currency: doc.currency,
    balance: doc.balance,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export const AccountService = {
  async createAccount(userName: string, currency: Currency): Promise<AccountDTO> {
    const account = await AccountModel.create({ userName, currency, balance: 0 });
    return toAccountDTO(account);
  },

  async getAccountById(id: string): Promise<AccountDocument> {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, "INVALID_ID", "Invalid account id");
    }

    const account = await AccountModel.findById(id);
    if (!account) {
      throw new AppError(404, "ACCOUNT_NOT_FOUND", "Account not found");
    }
    return account;
  },

  async getBalance(id: string): Promise<{ balance: number; currency: Currency }> {
    const account = await this.getAccountById(id);
    return {
      balance: account.balance,
      currency: account.currency,
    };
  },

  async getHistory(
    id: string,
    page: number,
    limit: number
  ): Promise<{ total: number; items: any[] }> {
    const account = await this.getAccountById(id);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LedgerEntryModel.find({ accountId: account._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LedgerEntryModel.countDocuments({ accountId: account._id }),
    ]);

    return { total, items };
  },
};
