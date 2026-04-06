import { redirect } from "next/navigation";

/** Links antigos para /dashboard/nova passam a abrir só o painel. */
export default function NovaDespesaRedirectPage() {
  redirect("/dashboard");
}
