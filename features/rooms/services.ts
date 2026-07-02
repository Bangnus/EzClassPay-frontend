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
  initiatePaymentApi,
  getRoomPaymentHistoryApi,
  getRoomBillsApi,
  getAllRoomBillsApi,
  notifyRoomApi,
  getUserPaymentsApi,
  getUserBillsApi,
  getUserSummaryApi,
  getRoomTransactionsApi,
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

export const getRoomPayments = async (roomId: string, filter?: { userId?: string; lineUid?: string }) => {
  const res = await getRoomPaymentsApi(roomId, filter);
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

export const generateBills = async (
  roomId: string,
  month: number,
  year: number
) => {
  try {
    const data = await generateBillsApi(roomId, month, year);
    return data;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    console.error("Error generating bills:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างบิล",
    };
  }
};

export const initiatePayment = async (payload: {
  lineUid: string;
  roomId: string;
  amount: number;
  billId?: string | null;
}) => {
  return initiatePaymentApi(payload);
};

export const getRoomPaymentHistory = async (roomId: string) => {
  const res = await getRoomPaymentHistoryApi(roomId);
  return res.data || [];
};

export const getRoomBills = async (roomId: string, lineUid?: string) => {
  const res = await getRoomBillsApi(roomId, lineUid);
  return res.data || [];
};

export const getAllRoomBills = async (roomId: string, lineUid?: string) => {
  const res = await getAllRoomBillsApi(roomId, lineUid);
  return res.data || [];
};

export const getUserPayments = async (lineUid: string, page = 1, limit = 10) => {
  const res = await getUserPaymentsApi(lineUid, page, limit);
  return res.data;
};

export const getUserSummary = async (lineUid: string) => {
  const res = await getUserSummaryApi(lineUid);
  return res.data;
};

export const getUserBills = async (userId: string) => {
  const res = await getUserBillsApi(userId);
  return res.data || [];
};

export const notifyRoom = async (roomId: string, payload: { title: string; message: string; type: string }) => {
  return notifyRoomApi(roomId, payload);
};

export const getRoomTransactions = async (roomId: string, month?: number, year?: number) => {
  const res = await getRoomTransactionsApi(roomId, month, year);
  return res.data;
};
