import {
  getManagerRooms,
  getRoomByGroup,
  getRoom,
} from "@/features/rooms/services";
import { useDashboardStore } from "./store";
import { Room } from "@/features/rooms/types";

export const fetchDashboardRooms = async (
  userId: string,
  groupId?: string | null
) => {
  const { setRooms } = useDashboardStore.getState();
  let foundRooms: Room[] = [];

  if (groupId) {
    const roomData = await getRoomByGroup(groupId);
    if (roomData) foundRooms = [roomData as Room];
  }

  if (foundRooms.length === 0) {
    try {
      const roomsData = await getManagerRooms(userId);
      foundRooms = roomsData as Room[];
    } catch {
      /* silent */
    }
  }

  setRooms(foundRooms);
};

export const fetchRoomById = async (roomId: string) => {
  const { rooms, setRooms } = useDashboardStore.getState();
  const roomData = await getRoom(roomId);
  if (roomData) {
    const isExist = rooms.some((r) => r.id === roomId);
    setRooms(isExist ? rooms : [...rooms, roomData as Room]);
  }
};
