import { axiosInstance } from "@/lib/axios";
import { CreateRoomPayload, Payment, Room } from "./types";

export const createRoomApi = async (payload: CreateRoomPayload) => {
  const response = await axiosInstance.post("/api/rooms", payload);
  return response.data;
};

export const getPendingPaymentsApi = async (roomId: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Payment[];
  }>(`/api/payments/room/${roomId}/pending`);
  return response.data;
};

export const approvePaymentApi = async (paymentId: string) => {
  const response = await axiosInstance.patch(
    `/api/payments/${paymentId}/approve`
  );
  return response.data;
};

export const rejectPaymentApi = async (paymentId: string) => {
  const response = await axiosInstance.patch(
    `/api/payments/${paymentId}/reject`
  );
  return response.data;
};

export const getRoomApi = async (roomId: string) => {
  const response = await axiosInstance.get(`/api/rooms/${roomId}`);
  return response.data;
};

export const getRoomPaymentsApi = async (roomId: string, filter?: { userId?: string; lineUid?: string }) => {
  const qp = new URLSearchParams();
  if (filter?.userId) qp.set("userId", filter.userId);
  if (filter?.lineUid) qp.set("lineUid", filter.lineUid);
  const qs = qp.toString();
  const response = await axiosInstance.get<{
    success: boolean;
    data: Payment[];
  }>(`/api/payments/room/${roomId}/history${qs ? `?${qs}` : ""}`);
  return response.data;
};

export const getRoomByGroupApi = async (groupId: string) => {
  const response = await axiosInstance.get<{ success: boolean; data: unknown }>(
    `/api/rooms/by-group/${groupId}`
  );
  return response.data;
};

export const getManagerRoomsApi = async (lineUid: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: unknown[];
  }>(`/api/rooms/my-rooms?lineUid=${lineUid}`);
  return response.data;
};

export const getRoomMembersApi = async (roomId: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Room["members"];
  }>(`/api/rooms/${roomId}/members`);
  return response.data;
};

export const removeRoomMemberApi = async (roomId: string, userId: string) => {
  const response = await axiosInstance.delete(
    `/api/rooms/${roomId}/members/${userId}`
  );
  return response.data;
};

export const updateRoomApi = async (roomId: string, payload: Partial<Room>) => {
  const response = await axiosInstance.patch(`/api/rooms/${roomId}`, payload);
  return response.data;
};

export const deleteRoomApi = async (roomId: string) => {
  const response = await axiosInstance.delete(`/api/rooms/${roomId}`);
  return response.data;
};

export const generateBillsApi = async (
  roomId: string,
  month: number,
  year: number
) => {
  const response = await axiosInstance.post(
    `/api/rooms/${roomId}/generate-bills`,
    { month, year }
  );
  return response.data;
};

export const initiatePaymentApi = async (payload: {
  lineUid: string;
  roomId: string;
  amount: number;
  billId?: string | null;
}) => {
  const response = await axiosInstance.post("/api/payments/initiate", payload);
  return response.data;
};

export const getRoomPaymentHistoryApi = async (roomId: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Payment[];
  }>(`/api/payments/room/${roomId}/history`);
  return response.data;
};

export const getRoomBillsApi = async (roomId: string, lineUid?: string) => {
  const params = new URLSearchParams();
  params.set("limit", "10");
  if (lineUid) params.set("lineUid", lineUid);
  const response = await axiosInstance.get(
    `/api/bills/room/${roomId}?${params.toString()}`
  );
  return response.data;
};

export const getAllRoomBillsApi = async (roomId: string, lineUid?: string) => {
  const params = new URLSearchParams();
  params.set("limit", "100"); // Use a high limit to get all periods
  if (lineUid) params.set("lineUid", lineUid);
  const response = await axiosInstance.get(
    `/api/bills/room/${roomId}?${params.toString()}`
  );
  return response.data;
};

export const notifyRoomApi = async (roomId: string, payload: { title: string; message: string; type: string }) => {
  const response = await axiosInstance.post(`/api/rooms/${roomId}/notify`, payload);
  return response.data;
};

export const getUserPaymentsApi = async (lineUid: string, page = 1, limit = 10) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: {
      data: Payment[];
      total: number;
      page: number;
      totalPages: number;
    };
  }>(`/api/payments/user/${lineUid}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserSummaryApi = async (lineUid: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: {
      totalBilled: number;
      totalPaid: number;
      totalMissing: number;
      roomStats: {
        roomId: string;
        roomName: string;
        billed: number;
        paid: number;
        missing: number;
      }[];
    };
  }>(`/api/payments/user/${lineUid}/summary`);
  return response.data;
};

export const getUserBillsApi = async (userId: string) => {
  const response = await axiosInstance.get(
    `/api/bills/user/${userId}`
  );
  return response.data;
};

export const getRoomTransactionsApi = async (roomId: string, month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  
  const response = await axiosInstance.get<{
    success: boolean;
    data: {
      transactions: any[];
      summary: { totalIncome: number; totalExpense: number; balance: number };
    };
  }>(`/api/rooms/${roomId}/transactions?${params.toString()}`);
  return response.data;
};
