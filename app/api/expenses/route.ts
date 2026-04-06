import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { createExpenseSchema } from "@/lib/validations";
import { sortExpensesForDisplay } from "@/lib/sort-expenses";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const now = new Date();
  const year = Number(searchParams.get("year")) || now.getFullYear();
  const month = Number(searchParams.get("month")) || now.getMonth() + 1;

  if (month < 1 || month > 12) {
    return NextResponse.json({ error: "Mês inválido" }, { status: 400 });
  }

  try {
    await connectDB();
    const oid = new mongoose.Types.ObjectId(userId);
    const list = await Expense.find({ userId: oid, year, month })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      expenses: list.map((e) => ({
        id: e._id.toString(),
        title: e.title,
        amount: e.amount,
        status: e.status,
        year: e.year,
        month: e.month,
        createdAt: e.createdAt,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível listar despesas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const now = new Date();
  const year = parsed.data.year ?? now.getFullYear();
  const month = parsed.data.month ?? now.getMonth() + 1;

  try {
    await connectDB();
    const oid = new mongoose.Types.ObjectId(userId);
    const doc = await Expense.create({
      userId: oid,
      title: parsed.data.title,
      amount: parsed.data.amount,
      status: "EM_ABERTO",
      year,
      month,
    });

    return NextResponse.json({
      expense: {
        id: doc._id.toString(),
        title: doc.title,
        amount: doc.amount,
        status: doc.status,
        year: doc.year,
        month: doc.month,
        createdAt: doc.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível criar a despesa" },
      { status: 500 }
    );
  }
}
