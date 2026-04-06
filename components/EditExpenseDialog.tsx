"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type ExpenseSlice = {
  id: string;
  title: string;
  amount: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseSlice | null;
};

export function EditExpenseDialog({ open, onOpenChange, expense }: Props) {
  const router = useRouter();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !expense) return;
    setTitle(expense.title);
    setAmount(String(expense.amount).replace(".", ","));
    setError(null);
  }, [open, expense]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>("input#edit-title")?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!expense) return;
    setError(null);
    const parsed = parseFloat(amount.replace(",", "."));
    if (Number.isNaN(parsed) || parsed < 0) {
      setError("Informe um valor válido");
      return;
    }
    const t = title.trim();
    if (!t) {
      setError("Nome é obrigatório");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t, amount: parsed }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Erro ao salvar");
      return;
    }
    onOpenChange(false);
    router.refresh();
  }

  if (!open || !expense) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        aria-label="Fechar"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92dvh,480px)] w-full max-w-lg flex-col rounded-t-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2
            id={titleId}
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Editar despesa
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-11 min-w-11 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Fechar"
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="min-h-0 overflow-y-auto px-5 py-5"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="edit-title"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nome
              </label>
              <input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-base dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-amount"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Valor (R$)
              </label>
              <input
                id="edit-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="min-h-[48px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-base dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-[48px] rounded-xl border border-zinc-300 px-5 text-sm font-medium dark:border-zinc-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
