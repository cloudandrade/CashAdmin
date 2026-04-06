"use client";

import { useEffect, useState } from "react";
import type { ExpenseStatus } from "@/lib/expense-constants";
import { formatBRL } from "@/lib/expense-labels";
import { ExpenseListItem } from "@/components/ExpenseListItem";

const STORAGE_KEY = "cashadmin-expense-compact";

export type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  status: ExpenseStatus;
};

type Props = {
  expenses: ExpenseRow[];
};

function LayoutComfortIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function LayoutCompactIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 6h16M4 10h16M4 14h16M4 18h10" />
    </svg>
  );
}

export function ExpenseListSection({ expenses }: Props) {
  const [compact, setCompact] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCompact(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  function toggleCompact() {
    setCompact((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (expenses.length === 0) {
    return (
      <section className="mx-auto mt-2 w-full max-w-lg">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Despesas deste mês
        </h2>
        <ul className="mt-2 flex flex-col gap-2">
          <li className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400">
            Nenhuma despesa ainda. Use o botão{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              +
            </span>{" "}
            ao lado do mês para incluir uma despesa.
          </li>
        </ul>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-2 w-full max-w-lg">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Despesas deste mês
      </h2>

      <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-2 py-1 dark:border-zinc-700/90 dark:bg-zinc-900/50">
        <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
          <span className="shrink-0 text-[9px] font-medium uppercase leading-none tracking-wide text-zinc-500 dark:text-zinc-500">
            Total mês
          </span>
          <span className="min-w-0 truncate text-sm font-semibold tabular-nums leading-none text-zinc-900 dark:text-zinc-50">
            {formatBRL(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleCompact}
          disabled={!hydrated}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          title={
            compact
              ? "Modo confortável — lista com mais espaço e menu na linha"
              : "Modo compacto — uma linha por despesa; toque para opções"
          }
          aria-label={
            compact ? "Ativar lista confortável" : "Ativar lista compacta"
          }
          aria-pressed={compact}
        >
          {compact ? <LayoutComfortIcon /> : <LayoutCompactIcon />}
        </button>
      </div>

      <ul className={`mt-1.5 flex flex-col ${compact ? "gap-1" : "gap-2"}`}>
        {expenses.map((e) => (
          <ExpenseListItem
            key={e.id}
            id={e.id}
            title={e.title}
            amount={e.amount}
            status={e.status}
            compact={compact}
          />
        ))}
      </ul>
    </section>
  );
}
