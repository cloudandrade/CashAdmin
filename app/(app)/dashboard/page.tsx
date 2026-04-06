import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { getSessionUserId } from "@/lib/auth";
import { ensureMonthlyRollover } from "@/lib/month-rollover";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { formatMonthYearPt } from "@/lib/expense-labels";
import { sortExpensesForDisplay } from "@/lib/sort-expenses";
import { DashboardExpenseToolbar } from "@/components/DashboardExpenseToolbar";
import { ExpenseListSection } from "@/components/ExpenseListSection";

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  await ensureMonthlyRollover(userId);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await connectDB();
  const oid = new mongoose.Types.ObjectId(userId);
  const raw = await Expense.find({ userId: oid, year, month }).lean();
  const expenses = sortExpensesForDisplay(raw);

  const monthLabel = formatMonthYearPt(year, month);

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-10 pt-4">
      <DashboardExpenseToolbar monthLabel={monthLabel} />

      <ExpenseListSection
        expenses={expenses.map((e) => ({
          id: e._id.toString(),
          title: e.title,
          amount: e.amount,
          status: e.status,
        }))}
      />
    </div>
  );
}
