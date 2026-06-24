"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { useDashboardStore } from "../store";
import { fetchDashboardRooms, fetchRoomById } from "../services";
import type { Room } from "@/features/rooms/types";
import RoomOverviewCard from "../components/room-overview-card";
import MembersTable from "../components/members-table";
import DangerZone from "../components/danger-zone";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentSummary {
  id: string;
  slipUrl: string | null;
  status: string;
  user: { displayName: string };
}

export default function DashboardView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const { rooms, loading, setLoading, selectedRoomId, setSelectedRoomId } =
    useDashboardStore();

  const fetchRooms = async (
    userId: string,
    groupId: string | null | undefined
  ) => {
    await fetchDashboardRooms(userId, groupId);
  };

  useEffect(() => {
    console.log("[LIFF_OPEN] Dashboard URL:", window.location.href);
    const init = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_DASHBOARD as string,
        });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        const syncResult = await syncUserWithBackend({
          line_uid: userProfile.userId,
          name: userProfile.displayName,
          profile_url: userProfile.pictureUrl,
          action: "pay_bill",
        });

        const urlParams = new URLSearchParams(window.location.search);
        const roomIdFromUrl = urlParams.get("roomId");

        if (roomIdFromUrl) {
          await fetchRoomById(roomIdFromUrl);
          setSelectedRoomId(roomIdFromUrl);
        } else if (syncResult?.data?.activeRoomId) {
          await fetchRoomById(syncResult.data.activeRoomId);
          setSelectedRoomId(syncResult.data.activeRoomId);
        } else {
          const ctx = liff.getContext();
          await fetchRooms(userProfile.userId, ctx?.groupId);
        }
      } catch (error) {
        console.error("Dashboard Init Error:", error);
        setError("ไม่สามารถโหลดข้อมูลห้องได้ กรุณาลองอีกครั้ง");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const selectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleUpdateRoom = async () => {
    if (!profile) return;
    const ctx = liff.getContext();
    await fetchRooms(profile.userId, ctx?.groupId);
  };

  const handleDeletedRoom = async () => {
    if (!profile) return;
    const ctx = liff.getContext();
    await fetchRooms(profile.userId, ctx?.groupId);
  };

  const openInLiff = (path: string) => {
    window.location.href = new URL(path, window.location.origin).toString();
  };

  // Auto-select first room if available
  const activeRoomId =
    selectedRoomId || (rooms.length > 0 ? rooms[0].id : null);
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  useEffect(() => {
    if (!activeRoomId) return;
    const fetchStats = async () => {
      try {
        const [paymentsRes, expensesRes] = await Promise.all([
          fetch(`${API_URL}/api/payments/room/${activeRoomId}/history`, {
            headers: { "ngrok-skip-browser-warning": "true" },
          }).then((r) => r.json()),
          fetch(`${API_URL}/api/expenses/room/${activeRoomId}`, {
            headers: { "ngrok-skip-browser-warning": "true" },
          }).then((r) => r.json()),
        ]);

        if (paymentsRes.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const approved = paymentsRes.data.filter(
            (p: any) => p.status === "APPROVED"
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const income = approved.reduce(
            (sum: number, p: any) => sum + (p.period?.amount || 0),
            0
          );
          setTotalIncome(income);
        } else {
          setTotalIncome(0);
        }

        if (expensesRes.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const expense = expensesRes.data.reduce(
            (sum: number, e: any) => sum + (e.amount || 0),
            0
          );
          setTotalExpense(expense);
        } else {
          setTotalExpense(0);
        }
      } catch (err) {
        console.error("Error fetching room stats:", err);
      }
    };
    fetchStats();
  }, [activeRoomId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">จัดการห้อง</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {activeRoomId && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-linear-to-br from-primary to-primary/80 rounded-2xl p-4 shadow-sm border border-primary/20">
              <p className="text-2xl font-extrabold text-white">
                ฿{totalIncome.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-white/90">
                ยอดเงินทั้งหมด (เฉพาะห้องนี้)
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
              <p className="text-2xl font-extrabold text-primary">
                ฿{totalExpense.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-text-secondary">
                เงินที่ออก (เฉพาะห้องนี้)
              </p>
            </div>
          </div>
        )}

        {activeRoomId ? (
          <RoomManagementView
            roomId={activeRoomId}
            rooms={rooms}
            onUpdateRoom={handleUpdateRoom}
            onDeletedRoom={handleDeletedRoom}
          />
        ) : (
          <div className="bg-bg rounded-2xl p-8 text-center border border-border mt-6">
            <p className="text-text-secondary">ยังไม่มีห้องกองกลาง</p>
            <div className="mt-4">
              <Button
                type="primary"
                onClick={() => openInLiff("/create-room")}
                padding="12px 24px"
                borderRadius={12}
              >
                + สร้างห้อง
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function RoomIdInput({ onLoad }: { onLoad: (id: string) => void }) {
  const [input, setInput] = useState("");

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Room ID"
        />
      </div>
      <div>
        <Button
          type="primary"
          onClick={() => {
            if (input.trim()) onLoad(input.trim());
          }}
          padding="12px 16px"
          borderRadius={12}
        >
          ยืนยัน
        </Button>
      </div>
    </div>
  );
}

function RoomCard({
  room,
  onSelect,
}: {
  room: Room;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(room.id)}
      className="w-full text-left bg-bg rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-text-primary">{room.name}</p>
          <p className="text-sm text-text-secondary">
            {room.members?.length || 0} สมาชิก · ฿
            {Number(room.periodicAmount).toLocaleString()}
          </p>
        </div>
        <div className="text-text-secondary text-xl">›</div>
      </div>
    </button>
  );
}

function RoomManagementView({
  roomId,
  rooms,
  onUpdateRoom,
  onDeletedRoom,
}: {
  roomId: string;
  rooms: Room[];
  onUpdateRoom: () => void;
  onDeletedRoom: () => void;
}) {
  const room = rooms.find((r) => r.id === roomId);

  if (!room) return null;

  return (
    <div className="space-y-4">
      {/* Section 1: Room Card & Settings */}
      <RoomOverviewCard room={room} onUpdate={onUpdateRoom} />

      {/* Section 1.5: Quick Actions */}
      <div>
        <h3 className="font-bold text-text-primary mb-3">เมนูจัดการ</h3>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            icon="📋"
            label="บันทึกค่าใช้จ่าย"
            onClick={() => {
              const url = new URL(window.location.origin + "/expense");
              url.searchParams.set("roomId", roomId);
              window.location.href = url.toString();
            }}
          />
          <ActionCard
            icon="📊"
            label="ประวัติรับ-จ่าย"
            onClick={() => {
              const url = new URL(window.location.origin + "/history");
              url.searchParams.set("roomId", roomId);
              window.location.href = url.toString();
            }}
          />
        </div>
      </div>

      {/* Section 2: Members Table */}
      <MembersTable roomId={roomId} />

      {/* Section 3: Danger Zone */}
      <DangerZone roomId={roomId} onDeleted={onDeletedRoom} />
    </div>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-100 rounded-2xl p-5 border border-primary/10 shadow-sm text-center hover:shadow-md transition-all group"
    >
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-sm font-bold text-primary group-hover:text-primary-dark transition-colors">
        {label}
      </p>
    </button>
  );
}
