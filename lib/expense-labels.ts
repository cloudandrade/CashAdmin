import type { ExpenseStatus } from "@/lib/expense-constants";

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  PAGO: "Pago",
  PARCIALMENTE_PAGO: "Parcialmente pago",
  PENDENTE: "Pendente",
  EM_ABERTO: "Em aberto",
};

/** Rótulos curtos para lista em uma linha */
export const EXPENSE_STATUS_COMPACT: Record<ExpenseStatus, string> = {
  PAGO: "Pago",
  PARCIALMENTE_PAGO: "Parc.",
  PENDENTE: "Pend.",
  EM_ABERTO: "Aberto",
};

export function formatMonthYearPt(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
