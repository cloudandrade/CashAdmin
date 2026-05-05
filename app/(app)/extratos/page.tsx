import Link from "next/link";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { getSessionUserId } from "@/lib/auth";
import { formatBRL, formatMonthYearPt } from "@/lib/expense-labels";
import { ensureMonthlyRollover } from "@/lib/month-rollover";
import { connectDB } from "@/lib/mongodb";
import { MonthlyStatement } from "@/models/MonthlyStatement";

export default async function ExtratosPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  await ensureMonthlyRollover(userId);
  await connectDB();
  const oid = new mongoose.Types.ObjectId(userId);

  const statements = await MonthlyStatement.find({ userId: oid })
    .sort({ year: -1, month: -1 })
    .lean();

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-10 pt-4">
      <Link
        href="/dashboard"
        className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        Voltar ao painel
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Extratos mensais
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Resumo gravado ao virar o mês: total de despesas e quanto estava pago.
        O status do extrato fica preservado como estava no fechamento; no mês
        seguinte, as despesas são replicadas no painel como &quot;Em aberto&quot;.
      </p>

      {statements.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400">
          Ainda não há extratos. Quando um mês calendarial terminar e você
          acessar o app no mês seguinte, o fechamento é registrado
          automaticamente.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {statements.map((s) => {
            const open = s.totalExpenses - s.totalPaid;
            const label = formatMonthYearPt(s.year, s.month);
            return (
              <li
                key={s._id.toString()}
                className="rounded-xl border border-zinc-200 bg-white transition hover:border-emerald-400/70 hover:bg-emerald-50/30 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/60 dark:hover:bg-zinc-900"
              >
                <Link
                  href={`/extratos/${s.year}/${s.month}`}
                  className="block px-3 py-3"
                >
                  <p className="text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-50">
                    {label}
                  </p>
                  <dl className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-3">
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-500">
                        Total despesas
                      </dt>
                      <dd className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                        {formatBRL(s.totalExpenses)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-500">
                        Total pago
                      </dt>
                      <dd className="font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                        {formatBRL(s.totalPaid)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-500">
                        Em aberto (no fecho)
                      </dt>
                      <dd className="font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
                        {formatBRL(open)}
                      </dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
