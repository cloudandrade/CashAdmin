import { z } from "zod";
import { EXPENSE_STATUSES } from "@/lib/expense-constants";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(120),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Nome da despesa é obrigatório").max(200),
  amount: z.coerce.number().nonnegative("Valor deve ser zero ou positivo"),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export const patchExpenseSchema = z
  .object({
    status: z.enum(EXPENSE_STATUSES).optional(),
    title: z.string().min(1, "Nome é obrigatório").max(200).optional(),
    amount: z.coerce.number().nonnegative("Valor inválido").optional(),
  })
  .refine(
    (d) =>
      d.status !== undefined ||
      d.title !== undefined ||
      d.amount !== undefined,
    { message: "Nada para atualizar" }
  );
