import { create } from "zustand";
import { DashboardState } from "./types";

export const useDashboardStore = create<DashboardState>((set) => ({
  rooms: [],
  loading: true,
  error: "",
  selectedRoomId: null,
  setRooms: (rooms) => set({ rooms }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
}));
