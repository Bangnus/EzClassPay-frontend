import {
  createRoomApi,
  getPendingPaymentsApi,
  approvePaymentApi,
  rejectPaymentApi,
  getRoomApi,
  getRoomPaymentsApi,
  getRoomByGroupApi,
  getManagerRoomsApi,
  getRoomMembersApi,
  removeRoomMemberApi,
  updateRoomApi,
  deleteRoomApi,
  generateBillsApi,
} from "./repository";
import { CreateRoomPayload, Room } from "./types";

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

export const getRoomPayments = async (roomId: string, lineUid?: string) => {
  const res = await getRoomPaymentsApi(roomId, lineUid);
  return res.data || [];
};

export const getRoomByGroup = async (groupId: string) => {
  try {
    const res = await getRoomByGroupApi(groupId);
    return res.data || null;
  } catch {
    return null;
  }
};

export const getManagerRooms = async (lineUid: string) => {
  const res = await getManagerRoomsApi(lineUid);
  return res.data || [];
};

export const getRoomMembers = async (roomId: string) => {
  const res = await getRoomMembersApi(roomId);
  return res.data || [];
};

export const removeRoomMember = async (roomId: string, userId: string) => {
  return removeRoomMemberApi(roomId, userId);
};

export const updateRoom = async (roomId: string, payload: Partial<Room>) => {
  return updateRoomApi(roomId, payload);
};

export const deleteRoom = async (roomId: string) => {
  return deleteRoomApi(roomId);
};

export const generateBills = async (roomId: string, month: number, year: number) => {
  try {
    const data = await generateBillsApi(roomId, month, year);
    return data;
  } catch (error: any) {
    console.error("Error generating bills:", error);
    return { success: false, message: error?.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างบิล" };
  }
};
