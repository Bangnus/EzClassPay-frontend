import {
  createRoomApi,
  getPendingPaymentsApi,
  approvePaymentApi,
  rejectPaymentApi,
  getRoomApi,
} from "./repository";
import { CreateRoomPayload } from "./types";

export const createRoom = async (payload: CreateRoomPayload) => {
  const data = await createRoomApi(payload);
  return data;
};

export const getPendingPayments = async (roomId: string) => {
  const res = await getPendingPaymentsApi(roomId);
  return res.data || [];
};

export const approvePayment = async (paymentId: string) => {
  return approvePaymentApi(paymentId);
};

export const rejectPayment = async (paymentId: string) => {
  return rejectPaymentApi(paymentId);
};

export const getRoom = async (roomId: string) => {
  const res = await getRoomApi(roomId);
  return res.data || null;
};
