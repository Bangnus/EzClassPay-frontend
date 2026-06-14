import { axiosInstance } from "@/lib/axios";
import { CreateRoomPayload } from "./types";

export const createRoomApi = async (payload: CreateRoomPayload) => {
  const response = await axiosInstance.post("/api/rooms", payload);
  return response.data;
};
