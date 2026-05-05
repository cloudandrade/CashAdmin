import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { MonthlyStatement } from "@/models/MonthlyStatement";

function prevCalendarMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month <= 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

function addOneMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month >= 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

function monthKey(year: number, month: number): number {
  return year * 12 + month;
}

/**
 * Fecha meses passados: grava extrato (total + pago) e replica despesas para
 * o mês seguinte em EM_ABERTO, preservando o status histórico do mês fechado.
 * Idempotente por usuário/mês e por despesa de origem.
 */
async function closeMonthIfNeeded(
  userOid: mongoose.Types.ObjectId,
  year: number,
  month: number
): Promise<void> {
  const expenses = await Expense.find({ userId: userOid, year, month }).lean();
  if (expenses.length === 0) return;

  const next = addOneMonth(year, month);
  await Expense.bulkWrite(
    expenses.map((e) => ({
      updateOne: {
        filter: {
          userId: userOid,
          year: next.year,
          month: next.month,
          rolloverSourceExpenseId: e._id,
        },
        update: {
          $setOnInsert: {
            userId: userOid,
            title: e.title,
            amount: e.amount,
            status: "EM_ABERTO",
            year: next.year,
            month: next.month,
            rolloverSourceExpenseId: e._id,
            rolloverSourceYear: year,
            rolloverSourceMonth: month,
          },
        },
        upsert: true,
      },
    }))
  );

  const existing = await MonthlyStatement.findOne({
    userId: userOid,
    year,
    month,
  }).lean();
  if (existing) return;

  let totalExpenses = 0;
  let totalPaid = 0;
  for (const e of expenses) {
    totalExpenses += e.amount;
    if (e.status === "PAGO") totalPaid += e.amount;
  }

  await MonthlyStatement.create({
    userId: userOid,
    year,
    month,
    totalExpenses,
    totalPaid,
  });
}

/**
 * Processa todos os meses entre o último extrato (ou primeira despesa) e o
 * mês anterior ao atual. Deve ser chamado em páginas autenticadas relevantes.
 */
export async function ensureMonthlyRollover(userId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;
  await connectDB();
  const oid = new mongoose.Types.ObjectId(userId);

  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;
  const end = prevCalendarMonth(cy, cm);

  const latest = await MonthlyStatement.findOne({ userId: oid })
    .sort({ year: -1, month: -1 })
    .lean();

  let y: number;
  let m: number;

  if (latest) {
    const n = addOneMonth(latest.year, latest.month);
    y = n.year;
    m = n.month;
  } else {
    const first = await Expense.findOne({ userId: oid })
      .sort({ year: 1, month: 1 })
      .lean();
    if (!first) return;
    y = first.year;
    m = first.month;
  }

  if (monthKey(y, m) <= monthKey(end.year, end.month)) {
    let cyIter = y;
    let cmIter = m;
    while (monthKey(cyIter, cmIter) <= monthKey(end.year, end.month)) {
      await closeMonthIfNeeded(oid, cyIter, cmIter);
      const n = addOneMonth(cyIter, cmIter);
      cyIter = n.year;
      cmIter = n.month;
    }
  }

  const previousMonth = prevCalendarMonth(cy, cm);
  await closeMonthIfNeeded(oid, previousMonth.year, previousMonth.month);
}
