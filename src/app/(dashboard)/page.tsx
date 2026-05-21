"use client";

import { useState, useEffect, useCallback } from "react";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTransactions } from "@/lib/transactions";
import { getMonthRange } from "@/lib/utils";
import type { Transaction, MonthlySummary, CategoryExpense } from "@/types";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function buildMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: format(d, "MMMM yyyy", { locale: ptBR }),
    });
  }
  return options;
}

export default function DashboardPage() {
  const monthOptions = buildMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const { start, end } = getMonthRange(year, month);
      const data = await getTransactions({ startDate: start, endDate: end });
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => { loadData(); }, [loadData]);

  // Calcular resumo
  const summary: MonthlySummary = transactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.totalIncome += tx.amount;
      else acc.totalExpense += tx.amount;
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  // Calcular despesas por categoria
  const expenseByCategory = transactions
    .filter((tx) => tx.type === "expense")
    .reduce<Record<string, { amount: number; color: string; name: string }>>((acc, tx) => {
      const key = tx.category_id || "sem-categoria";
      const name = tx.categories?.name || "Sem categoria";
      const color = tx.categories?.color || "#94a3b8";
      if (!acc[key]) acc[key] = { amount: 0, color, name };
      acc[key].amount += tx.amount;
      return acc;
    }, {});

  const categoryData: CategoryExpense[] = Object.values(expenseByCategory)
    .map((item) => ({
      category: item.name,
      color: item.color,
      amount: item.amount,
      percentage: summary.totalExpense > 0 ? (item.amount / summary.totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const selectedLabel = monthOptions.find((o) => o.value === selectedMonth)?.label || "";

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">{selectedLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="capitalize">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setFormOpen(true)} size="sm" className="gap-1.5 h-9">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova transação</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Carregando...
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart data={categoryData} />
            <RecentTransactions transactions={transactions} />
          </div>
        </>
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={loadData}
      />
    </div>
  );
}
