import type { ExpenseStatus } from "@/lib/expense-constants";

type WithStatusAndCreated = {
  status: ExpenseStatus;
  createdAt?: Date | string | null;
};

/** Pagas primeiro; demais abaixo. Dentro de cada grupo, mais recentes primeiro. */
export function sortExpensesForDisplay<T extends WithStatusAndCreated>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const rank = (s: ExpenseStatus) => (s === "PAGO" ? 0 : 1);
    const ra = rank(a.status);
    const rb = rank(b.status);
    if (ra !== rb) return ra - rb;
    const ta = new Date(a.createdAt ?? 0).getTime();
    const tb = new Date(b.createdAt ?? 0).getTime();
    return tb - ta;
  });
}
