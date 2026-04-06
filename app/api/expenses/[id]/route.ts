import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { patchExpenseSchema } from "@/lib/validations";
import { getSessionUserId } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Despesa inválida" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchExpenseSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { status: nextStatus, title, amount } = parsed.data;
  const $set: Record<string, string | number> = {};
  if (nextStatus !== undefined) $set.status = nextStatus;
  if (title !== undefined) $set.title = title;
  if (amount !== undefined) $set.amount = amount;

  try {
    await connectDB();
    const oid = new mongoose.Types.ObjectId(userId);
    const expenseId = new mongoose.Types.ObjectId(id);

    const updated = await Expense.findOneAndUpdate(
      { _id: expenseId, userId: oid },
      { $set },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      expense: {
        id: updated._id.toString(),
        title: updated.title,
        amount: updated.amount,
        status: updated.status,
        year: updated.year,
        month: updated.month,
        createdAt: updated.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível atualizar" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Despesa inválida" }, { status: 400 });
  }

  try {
    await connectDB();
    const oid = new mongoose.Types.ObjectId(userId);
    const expenseId = new mongoose.Types.ObjectId(id);

    const result = await Expense.deleteOne({ _id: expenseId, userId: oid });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível excluir" },
      { status: 500 }
    );
  }
}
