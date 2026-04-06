import type { ExpenseStatus } from "@/lib/expense-constants";

/**
 * Cores por status (reconhecimento rápido):
 * - PAGO: verde — quitado
 * - PARCIALMENTE_PAGO: amarelo escuro — atenção parcial
 * - PENDENTE: laranja — aguardando pagamento
 * - EM_ABERTO: violeta — em aberto / a vencer
 */
export const STATUS_CARD_CLASS: Record<ExpenseStatus, string> = {
  PAGO:
    "border-emerald-300/85 bg-emerald-50 dark:border-emerald-600/55 dark:bg-emerald-950/50",
  PARCIALMENTE_PAGO:
    "border-yellow-800/75 bg-yellow-200/45 dark:border-yellow-700 dark:bg-yellow-950/65",
  PENDENTE:
    "border-orange-300/85 bg-orange-50 dark:border-orange-600/50 dark:bg-orange-950/42",
  EM_ABERTO:
    "border-violet-300/80 bg-violet-50 dark:border-violet-600/50 dark:bg-violet-950/42",
};

export const STATUS_CONTROL_CLASS: Record<ExpenseStatus, string> = {
  PAGO:
    "border-emerald-200/95 bg-white/90 dark:border-emerald-700/55 dark:bg-emerald-900/35",
  PARCIALMENTE_PAGO:
    "border-yellow-700/90 bg-yellow-50/95 dark:border-yellow-600 dark:bg-yellow-900/45",
  PENDENTE:
    "border-orange-200/95 bg-white/90 dark:border-orange-700/50 dark:bg-orange-900/32",
  EM_ABERTO:
    "border-violet-200/95 bg-white/90 dark:border-violet-700/50 dark:bg-violet-900/32",
};

export const STATUS_LABEL_TEXT_CLASS: Record<ExpenseStatus, string> = {
  PAGO: "text-emerald-950 dark:text-emerald-100",
  PARCIALMENTE_PAGO: "text-yellow-950 dark:text-yellow-100",
  PENDENTE: "text-orange-950 dark:text-orange-100",
  EM_ABERTO: "text-violet-950 dark:text-violet-100",
};

export const STATUS_CHEVRON_CLASS: Record<ExpenseStatus, string> = {
  PAGO:
    "border-emerald-200 text-emerald-800 hover:bg-emerald-100/90 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-900/55",
  PARCIALMENTE_PAGO:
    "border-yellow-700 text-yellow-950 hover:bg-yellow-200/80 dark:border-yellow-600 dark:text-yellow-100 dark:hover:bg-yellow-900/55",
  PENDENTE:
    "border-orange-200 text-orange-900 hover:bg-orange-100/90 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-900/50",
  EM_ABERTO:
    "border-violet-200 text-violet-900 hover:bg-violet-100/90 dark:border-violet-700 dark:text-violet-200 dark:hover:bg-violet-900/50",
};

/** Selo minúsculo na linha compacta */
export const STATUS_COMPACT_BADGE_CLASS: Record<ExpenseStatus, string> = {
  PAGO:
    "border border-emerald-300/80 bg-white/80 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-900/45 dark:text-emerald-100",
  PARCIALMENTE_PAGO:
    "border border-yellow-800/85 bg-yellow-100/90 text-yellow-950 dark:border-yellow-600 dark:bg-yellow-900/55 dark:text-yellow-100",
  PENDENTE:
    "border border-orange-300/80 bg-white/80 text-orange-950 dark:border-orange-600 dark:bg-orange-900/40 dark:text-orange-100",
  EM_ABERTO:
    "border border-violet-300/80 bg-white/80 text-violet-950 dark:border-violet-600 dark:bg-violet-900/40 dark:text-violet-100",
};
