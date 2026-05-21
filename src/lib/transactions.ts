import { createClient } from "@/lib/supabase/client";
import type { Transaction, TransactionFilters } from "@/types";

export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const supabase = createClient();

  let query = supabase
    .from("transactions")
    .select("*, categories(id, name, color)")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.startDate) query = query.gte("date", filters.startDate);
  if (filters?.endDate) query = query.lte("date", filters.endDate);
  if (filters?.category_id) query = query.eq("category_id", filters.category_id);
  if (filters?.type && filters.type !== "all") query = query.eq("type", filters.type);

  const { data, error } = await query;
  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at" | "categories">
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...transaction, user_id: user.id })
    .select("*, categories(id, name, color)")
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Omit<Transaction, "id" | "user_id" | "created_at" | "categories">>
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update({ ...transaction, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, categories(id, name, color)")
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
