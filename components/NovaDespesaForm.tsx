"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  /** Dentro do modal: sem card duplicado */
  embedded?: boolean;
  onCancel?: () => void;
  onSaved?: () => void;
};

export function NovaDespesaForm({
  embedded = false,
  onCancel,
  onSaved,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const parsed = parseFloat(amount.replace(",", "."));
    if (Number.isNaN(parsed) || parsed < 0) {
      setError("Informe um valor válido");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), amount: parsed }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Erro ao salvar");
      return;
    }

    setTitle("");
    setAmount("");
    if (onSaved) {
      onSaved();
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const formClass = embedded
    ? "flex w-full flex-col gap-5"
    : "flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nome da despesa
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder="Ex.: Aluguel"
        />
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Valor (R$)
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder="0,00"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            else router.back();
          }}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-zinc-300 px-5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Salvando…" : "Cadastrar despesa"}
        </button>
      </div>
    </form>
  );
}
