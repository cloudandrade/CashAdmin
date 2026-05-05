import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { EXPENSE_STATUSES, type ExpenseStatus } from "@/lib/expense-constants";

export type { ExpenseStatus };
export { EXPENSE_STATUSES };

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: EXPENSE_STATUSES,
      required: true,
      default: "EM_ABERTO",
    },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    month: { type: Number, required: true, min: 1, max: 12 },
    rolloverSourceExpenseId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      required: false,
    },
    rolloverSourceYear: { type: Number, required: false, min: 2000, max: 2100 },
    rolloverSourceMonth: { type: Number, required: false, min: 1, max: 12 },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, year: 1, month: 1 });
expenseSchema.index(
  { userId: 1, year: 1, month: 1, rolloverSourceExpenseId: 1 },
  { unique: true, sparse: true }
);

export type ExpenseDoc = InferSchemaType<typeof expenseSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Expense: Model<ExpenseDoc> =
  mongoose.models.Expense ??
  mongoose.model<ExpenseDoc>("Expense", expenseSchema);
