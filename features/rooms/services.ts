import axios from "axios";
import { CreateRoomPayload } from "./types";

// Fallback to ngrok URL if environment variable is not set
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://equivocal-unmapped-pecan.ngrok-free.dev";

export const createRoom = async (payload: CreateRoomPayload) => {
  const response = await axios.post(`${BACKEND_URL}/api/rooms`, payload);
  return response.data;
};
