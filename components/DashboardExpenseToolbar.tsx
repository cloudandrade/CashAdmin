"use client";

import { useState } from "react";
import { NovaDespesaDialog } from "@/components/NovaDespesaDialog";

type Props = {
  monthLabel: string;
};

export function DashboardExpenseToolbar({ monthLabel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="mx-auto w-full max-w-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Mês atual
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-2xl font-semibold capitalize leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {monthLabel}
          </h1>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-emerald-600 text-[1.35rem] font-light leading-none text-white shadow-md ring-1 ring-zinc-950/[0.08] transition hover:bg-emerald-500 active:scale-[0.97] dark:ring-white/10"
            aria-label="Adicionar despesa neste mês"
            title="Nova despesa"
          >
            <span aria-hidden className="relative -top-px">
              +
            </span>
          </button>
        </div>
      </header>

      <NovaDespesaDialog open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
