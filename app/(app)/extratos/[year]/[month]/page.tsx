import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { getSessionUserId } from "@/lib/auth";
import { ensureMonthlyRollover } from "@/lib/month-rollover";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { MonthlyStatement } from "@/models/MonthlyStatement";
import {
  formatBRL,
  formatMonthYearPt,
} from "@/lib/expense-labels";
import { sortExpensesForDisplay } from "@/lib/sort-expenses";

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export default async function ExtratoDetalhePage({ params }: PageProps) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  await ensureMonthlyRollover(userId);

  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    notFound();
  }

  await connectDB();
  const oid = new mongoose.Types.ObjectId(userId);

  const [statement, rawExpenses] = await Promise.all([
    MonthlyStatement.findOne({ userId: oid, year, month }).lean(),
    Expense.find({ userId: oid, year, month }).lean(),
  ]);

  if (!statement) {
    notFound();
  }

  const expenses = sortExpensesForDisplay(rawExpenses);
  const monthLabel = formatMonthYearPt(year, month);
  const open = statement.totalExpenses - statement.totalPaid;

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-10 pt-4">
      <Link
        href="/extratos"
        className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        Voltar aos extratos
      </Link>
      <h1 className="mt-3 text-xl font-semibold capitalize text-zinc-900 dark:text-zinc-50">
        {monthLabel}
      </h1>

      <section className="mt-4 rounded-xl border border-zinc-200 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-zinc-900">
        <dl className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-3">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">Total despesas</dt>
            <dd className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatBRL(statement.totalExpenses)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">Total pago</dt>
            <dd className="font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatBRL(statement.totalPaid)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">Em aberto (no fecho)</dt>
            <dd className="font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
              {formatBRL(open)}
            </dd>
          </div>
        </dl>
      </section>

      {expenses.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400">
          Este mês não possui despesas para detalhar.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {expenses.map((expense) => (
            <li
              key={expense._id.toString()}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {expense.title}
                </p>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                  {formatBRL(expense.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
