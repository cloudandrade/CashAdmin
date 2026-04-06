export const EXPENSE_STATUSES = [
  "PAGO",
  "PARCIALMENTE_PAGO",
  "PENDENTE",
  "EM_ABERTO",
] as const;

export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];
