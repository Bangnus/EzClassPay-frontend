import { createRoomApi } from "./repository";
import { CreateRoomPayload } from "./types";

export const createRoom = async (payload: CreateRoomPayload) => {
  // สามารถแทรก Business Logic ก่อนส่งข้อมูลให้ API (Repository) ได้ที่นี่
  const data = await createRoomApi(payload);
  
  // สามารถแทรก Data Mapping หลังจากได้ Response กลับมาได้ที่นี่
  return data;
};
