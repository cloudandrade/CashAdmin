import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { ensureMonthlyRollover } from "@/lib/month-rollover";

export default async function RelatoriosPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  await ensureMonthlyRollover(userId);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-10 pt-4">
      <Link
        href="/dashboard"
        className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        Voltar ao painel
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Relatórios
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Área em evolução. Em breve você verá gráficos e indicadores aqui. Por
        enquanto, use os{" "}
        <Link
          href="/extratos"
          className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
        >
          extratos mensais
        </Link>{" "}
        para o histórico fechado.
      </p>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-5 dark:border-zinc-700 dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Ideias valiosas para acompanhar gastos de perto
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Evolução mensal
            </strong>{" "}
            — linha ou barras com total gasto mês a mês para ver tendência (sobe
            ou desce).
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Mês atual vs anterior
            </strong>{" "}
            — comparação lado a lado e variação percentual.
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Distribuição por status
            </strong>{" "}
            — quanto está pago, pendente ou em aberto no mês corrente (pizza ou
            barras empilhadas).
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Categorias
            </strong>{" "}
            — quando houver categorias nas despesas, ver onde o dinheiro vai
            (moradia, transporte, etc.).
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Ticket médio
            </strong>{" "}
            — valor médio por lançamento para perceber se os gastos são muitos
            pequenos ou poucos grandes.
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Ritmo do mês
            </strong>{" "}
            — gasto acumulado por dia e projeção simples para o fim do mês.
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Orçamento / meta
            </strong>{" "}
            — teto mensal com barra de progresso e alerta ao se aproximar do
            limite.
          </li>
          <li>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Despesas recorrentes
            </strong>{" "}
            — identificar contas que se repetem todo mês e somatório fixo
            esperado.
          </li>
        </ul>
      </section>
    </div>
  );
}
