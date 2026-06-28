import { createExpenseApi, getRoomExpensesApi } from "./repository";
import { CreateExpensePayload } from "./types";

export const createExpense = async (payload: CreateExpensePayload) => {
  const data = await createExpenseApi(payload);
  return data;
};

export const getRoomExpenses = async (roomId: string) => {
  const res = await getRoomExpensesApi(roomId);
  return res.data || [];
};
