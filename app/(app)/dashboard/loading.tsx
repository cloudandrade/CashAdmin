export default function DashboardLoading() {
  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col bg-zinc-50 px-4 pb-10 pt-4 dark:bg-zinc-950"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-lg animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-start justify-between gap-3">
            <div className="h-8 flex-1 max-w-[12rem] rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-10 shrink-0 rounded-none bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <div className="h-3.5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 flex h-8 items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-zinc-100/50 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800/40">
            <div className="flex flex-1 items-center gap-2">
              <div className="h-2 w-10 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="h-8 w-8 shrink-0 rounded-md bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="mt-1.5 flex flex-col gap-2">
            <div className="h-[4.5rem] rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-[4.5rem] rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
      <span className="sr-only">Carregando painel…</span>
    </div>
  );
}
