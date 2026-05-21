import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${user?.id},is_default.eq.true`)
    .order("name");

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(category: Omit<Category, "id" | "created_at" | "is_default">) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...category, user_id: user.id, is_default: false })
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
