import { Room } from "@/features/rooms/types";

export interface DashboardState {
  rooms: Room[];
  loading: boolean;
  error: string;
  selectedRoomId: string | null;
  setRooms: (rooms: Room[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSelectedRoomId: (id: string | null) => void;
}
