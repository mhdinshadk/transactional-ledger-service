export type Currency = "USD" | "INR";

export interface AccountDTO {
  id: string;
  userName: string;
  currency: Currency;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
