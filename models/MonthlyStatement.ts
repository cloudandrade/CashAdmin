import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const monthlyStatementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    month: { type: Number, required: true, min: 1, max: 12 },
    /** Soma dos valores de todas as despesas do mês no fechamento */
    totalExpenses: { type: Number, required: true, min: 0 },
    /** Soma dos valores com status PAGO no fechamento */
    totalPaid: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

monthlyStatementSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export type MonthlyStatementDoc = InferSchemaType<
  typeof monthlyStatementSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const MonthlyStatement: Model<MonthlyStatementDoc> =
  mongoose.models.MonthlyStatement ??
  mongoose.model<MonthlyStatementDoc>(
    "MonthlyStatement",
    monthlyStatementSchema
  );
