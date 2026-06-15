import { createExpenseApi } from "./repository";
import { CreateExpensePayload } from "./types";

export const createExpense = async (payload: CreateExpensePayload) => {
  const data = await createExpenseApi(payload);
  return data;
};
