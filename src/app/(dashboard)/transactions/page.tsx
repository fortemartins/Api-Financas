"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionFiltersPanel } from "@/components/transactions/transaction-filters";
import { getTransactions } from "@/lib/transactions";
import { getCurrentMonthRange } from "@/lib/utils";
import type { Transaction, TransactionFilters } from "@/types";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  const { start, end } = getCurrentMonthRange();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: start,
    endDate: end,
    type: "all",
  });

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingTransaction(null);
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} transação{transactions.length !== 1 ? "ões" : ""} encontrada{transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova transação</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFiltersPanel filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <TransactionList
            transactions={transactions}
            loading={loading}
            onEdit={handleEdit}
            onDeleted={loadTransactions}
          />
        </CardContent>
      </Card>

      <TransactionForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        transaction={editingTransaction}
        onSuccess={loadTransactions}
      />
    </div>
  );
}
