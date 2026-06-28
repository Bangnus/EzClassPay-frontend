import { axiosInstance } from "@/lib/axios";
import { CreateExpensePayload } from "./types";

export const createExpenseApi = async (payload: CreateExpensePayload) => {
  const response = await axiosInstance.post("/api/expenses", payload);
  return response.data;
};

export const getRoomExpensesApi = async (roomId: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
  }>(`/api/expenses/room/${roomId}`);
  return response.data;
};
