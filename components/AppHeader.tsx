"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SessionUserProfile } from "@/lib/session-user";

type Props = {
  user: SessionUserProfile | null;
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6L6 18M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </>
      )}
    </svg>
  );
}

export function AppHeader({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-40 shrink-0 border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-950/95"
    >
      <div className="mx-auto flex h-11 max-w-lg items-center justify-between gap-3 px-4">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-sm font-semibold tracking-tight text-emerald-800 dark:text-emerald-400"
        >
          CashAdmin
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          {user ? (
            <div className="mx-auto max-w-lg space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  Conectado como
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>
              <nav className="flex flex-col gap-1 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[40px] rounded-lg px-2 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Painel
                </Link>
                <Link
                  href="/extratos"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[40px] rounded-lg px-2 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Extratos
                </Link>
                <Link
                  href="/relatorios"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[40px] rounded-lg px-2 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Relatórios
                </Link>
              </nav>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[44px] w-full rounded-xl border border-zinc-300 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-lg space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Entre para gerenciar suas despesas.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-[40px] items-center rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-[40px] items-center rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}
