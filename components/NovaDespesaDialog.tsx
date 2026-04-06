"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { NovaDespesaForm } from "@/components/NovaDespesaForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NovaDespesaDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

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
      panelRef.current?.querySelector<HTMLInputElement>("input#title")?.focus();
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        aria-label="Fechar modal"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92dvh,640px)] w-full max-w-lg flex-col rounded-t-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2
            id={titleId}
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Nova despesa
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-11 min-w-11 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Fechar"
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-5 py-5">
          <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
            Novas despesas começam em aberto; você pode marcar como paga na
            lista.
          </p>
          <NovaDespesaForm
            embedded
            onCancel={() => onOpenChange(false)}
            onSaved={() => {
              onOpenChange(false);
              router.refresh();
            }}
          />
        </div>
      </div>
    </div>
  );
}
