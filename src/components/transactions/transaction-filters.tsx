"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/categories";
import type { Category, TransactionFilters } from "@/types";
import { getCurrentMonthRange } from "@/lib/utils";
import { X } from "lucide-react";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersPanel({ filters, onFiltersChange }: TransactionFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  function handleReset() {
    const { start, end } = getCurrentMonthRange();
    onFiltersChange({ startDate: start, endDate: end, type: "all", category_id: undefined });
  }

  const isFiltered =
    filters.type !== "all" || !!filters.category_id;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1 min-w-[130px]">
        <Label className="text-xs">Data inicial</Label>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1 min-w-[130px]">
        <Label className="text-xs">Data final</Label>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1 min-w-[140px]">
        <Label className="text-xs">Tipo</Label>
        <Select
          value={filters.type || "all"}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, type: v as TransactionFilters["type"] })
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Categoria</Label>
        <Select
          value={filters.category_id || "all"}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, category_id: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-1 text-sm">
          <X className="h-3.5 w-3.5" />
          Limpar
        </Button>
      )}
    </div>
  );
}
