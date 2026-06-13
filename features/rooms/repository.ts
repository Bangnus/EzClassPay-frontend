"use server";

import { axiosInstance } from "@/lib/axios";
import { CreateRoomPayload } from "./types";

export const createRoomApi = async (payload: CreateRoomPayload) => {
  try {
    const response = await axiosInstance.post("/api/rooms", payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || JSON.stringify(error.response.data));
    }
    throw error;
  }
};
