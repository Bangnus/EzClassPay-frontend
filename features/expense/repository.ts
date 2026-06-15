import { axiosInstance } from "@/lib/axios";
import { CreateExpensePayload } from "./types";

export const createExpenseApi = async (payload: CreateExpensePayload) => {
  const response = await axiosInstance.post("/api/expenses", payload);
  return response.data;
};
