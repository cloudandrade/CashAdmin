"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EXPENSE_STATUSES,
  type ExpenseStatus,
} from "@/lib/expense-constants";
import {
  EXPENSE_STATUS_COMPACT,
  EXPENSE_STATUS_LABELS,
  formatBRL,
} from "@/lib/expense-labels";
import {
  STATUS_CARD_CLASS,
  STATUS_CHEVRON_CLASS,
  STATUS_COMPACT_BADGE_CLASS,
  STATUS_CONTROL_CLASS,
  STATUS_LABEL_TEXT_CLASS,
} from "@/lib/expense-status-styles";
import { EditExpenseDialog } from "@/components/EditExpenseDialog";

type Props = {
  id: string;
  title: string;
  amount: number;
  status: ExpenseStatus;
  compact?: boolean;
};

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ExpenseListItem({
  id,
  title: initialTitle,
  amount: initialAmount,
  status: initialStatus,
  compact = false,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState(initialAmount);
  const [status, setStatus] = useState<ExpenseStatus>(initialStatus);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
    setAmount(initialAmount);
    setStatus(initialStatus);
  }, [initialTitle, initialAmount, initialStatus]);

  useEffect(() => {
    if (!actionsOpen || compact) return;
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      setActionsOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActionsOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [actionsOpen, compact]);

  useEffect(() => {
    if (!actionsOpen || !compact) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActionsOpen(false);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [actionsOpen, compact]);

  function closeActions() {
    setActionsOpen(false);
  }

  async function updateStatus(next: ExpenseStatus) {
    if (next === status) {
      closeActions();
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(
        typeof data.error === "string" ? data.error : "Erro ao atualizar"
      );
      return;
    }
    setStatus(next);
    closeActions();
    router.refresh();
  }

  function openEdit() {
    closeActions();
    setEditOpen(true);
  }

  async function handleDelete() {
    closeActions();
    if (
      !confirm(
        "Excluir esta despesa? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(
        typeof data.error === "string" ? data.error : "Erro ao excluir"
      );
      return;
    }
    router.refresh();
  }

  const cardTone = STATUS_CARD_CLASS[status];
  const controlTone = STATUS_CONTROL_CLASS[status];
  const labelTone = STATUS_LABEL_TEXT_CLASS[status];
  const chevronTone = STATUS_CHEVRON_CLASS[status];
  const compactBadge = STATUS_COMPACT_BADGE_CLASS[status];

  const menuClass =
    "min-w-[11rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-900";

  const menuItems = (
    <>
      {EXPENSE_STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          role="menuitem"
          disabled={loading}
          onClick={() => updateStatus(s)}
          className={`flex w-full px-3 py-2 text-left text-sm transition hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800 ${
            s === status
              ? "font-medium text-emerald-700 dark:text-emerald-400"
              : "text-zinc-800 dark:text-zinc-200"
          }`}
        >
          {EXPENSE_STATUS_LABELS[s]}
        </button>
      ))}
      <div
        role="separator"
        className="my-1 border-t border-zinc-200 dark:border-zinc-700"
      />
      <button
        type="button"
        role="menuitem"
        disabled={loading}
        onClick={openEdit}
        className="flex w-full px-3 py-2 text-left text-sm text-zinc-800 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Editar
      </button>
      <button
        type="button"
        role="menuitem"
        disabled={loading}
        onClick={handleDelete}
        className="flex w-full px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        Excluir
      </button>
    </>
  );

  if (compact) {
    return (
      <li
        ref={rootRef}
        className={`relative rounded-lg border px-2 py-1 transition-colors ${cardTone}`}
      >
        <button
          type="button"
          disabled={loading}
          onClick={() => setActionsOpen(true)}
          className="flex w-full min-h-[32px] items-center gap-1.5 text-left outline-none ring-emerald-500/30 focus-visible:ring-2 disabled:opacity-50"
          aria-haspopup="dialog"
          aria-expanded={actionsOpen}
          aria-label={`Opções: ${title}`}
        >
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </span>
          <span className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
            {formatBRL(amount)}
          </span>
          <span
            className={`max-w-[3.25rem] shrink-0 truncate rounded px-1 py-0.5 text-[9px] font-semibold leading-none ${compactBadge}`}
            title={EXPENSE_STATUS_LABELS[status]}
          >
            {EXPENSE_STATUS_COMPACT[status]}
          </span>
        </button>

        {error ? (
          <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {actionsOpen ? (
          <div className="fixed inset-0 z-[45] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/45"
              aria-label="Fechar"
              onClick={closeActions}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ações da despesa"
              className="relative z-10 w-full max-w-lg rounded-t-2xl border border-zinc-200 bg-white px-3 pb-6 pt-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl sm:pb-4"
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            >
              <p className="mb-2 truncate border-b border-zinc-100 pb-2 text-center text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                {title}
              </p>
              <nav role="menu" className={menuClass}>
                {menuItems}
              </nav>
            </div>
          </div>
        ) : null}

        <EditExpenseDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          expense={editOpen ? { id, title, amount } : null}
        />
      </li>
    );
  }

  return (
    <li
      ref={rootRef}
      className={`relative rounded-xl border px-3 py-2.5 transition-colors ${cardTone}`}
    >
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </p>
          <p className="mt-0.5 text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatBRL(amount)}
          </p>
        </div>

        <div className="relative shrink-0">
          <div
            className={`flex items-stretch overflow-hidden rounded-lg border ${controlTone}`}
          >
            <span
              className={`flex max-w-[7.5rem] items-center truncate px-2 py-1.5 text-xs font-medium ${labelTone}`}
              title={EXPENSE_STATUS_LABELS[status]}
            >
              {EXPENSE_STATUS_LABELS[status]}
            </span>
            <button
              type="button"
              disabled={loading}
              onClick={() => setActionsOpen((v) => !v)}
              className={`flex min-h-[36px] min-w-[36px] items-center justify-center border-l transition disabled:opacity-50 ${chevronTone}`}
              aria-expanded={actionsOpen}
              aria-haspopup="menu"
              aria-label="Opções da despesa"
            >
              <ChevronDownIcon
                className={`transition-transform ${actionsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {actionsOpen ? (
            <div role="menu" className={`absolute right-0 top-[calc(100%+4px)] z-20 ${menuClass}`}>
              {menuItems}
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <EditExpenseDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        expense={editOpen ? { id, title, amount } : null}
      />
    </li>
  );
}
