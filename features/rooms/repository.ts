import { axiosInstance } from "@/lib/axios";
import { CreateRoomPayload, Payment } from "./types";

export const createRoomApi = async (payload: CreateRoomPayload) => {
  const response = await axiosInstance.post("/api/rooms", payload);
  return response.data;
};

export const getPendingPaymentsApi = async (roomId: string) => {
  const response = await axiosInstance.get<{ success: boolean; data: Payment[] }>(
    `/api/payments/room/${roomId}/pending`
  );
  return response.data;
};

export const approvePaymentApi = async (paymentId: string) => {
  const response = await axiosInstance.patch(`/api/payments/${paymentId}/approve`);
  return response.data;
};

export const rejectPaymentApi = async (paymentId: string) => {
  const response = await axiosInstance.patch(`/api/payments/${paymentId}/reject`);
  return response.data;
};

export const getRoomApi = async (roomId: string) => {
  const response = await axiosInstance.get(`/api/rooms/${roomId}`);
  return response.data;
};
