export function AppLoading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-5 bg-zinc-50 px-6 dark:bg-zinc-950"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-11 w-11 animate-spin rounded-full border-[3px] border-zinc-200 border-t-emerald-600 dark:border-zinc-700 dark:border-t-emerald-500"
          aria-hidden
        />
        <p className="text-sm font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          {label}
        </p>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-600">CashAdmin</p>
    </div>
  );
}
