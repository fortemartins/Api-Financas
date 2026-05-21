export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  user_id?: string;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category_id: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category_id?: string;
  type?: TransactionType | "all";
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  color: string;
  amount: number;
  percentage: number;
}
