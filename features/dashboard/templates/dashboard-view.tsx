"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getManagerRooms, getRoomByGroup, getRoom } from "@/features/rooms/services";
import type { Room } from "@/features/rooms/types";
import RoomOverviewCard from "../components/room-overview-card";
import MembersTable from "../components/members-table";
import DangerZone from "../components/danger-zone";

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const fetchRooms = async (userId: string, groupId: string | null | undefined) => {
    let foundRooms: Room[] = [];
    if (groupId) {
      const roomData = await getRoomByGroup(groupId);
      if (roomData) foundRooms = [roomData as Room];
    }
    if (foundRooms.length === 0) {
      try {
        const roomsData = await getManagerRooms(userId);
        foundRooms = roomsData as Room[];
      } catch { /* silent */ }
    }
    setRooms(foundRooms);
  };

  useEffect(() => {
    console.log('[LIFF_OPEN] Dashboard URL:', window.location.href);
    const init = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_DASHBOARD as string });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        await syncUserWithBackend({
          line_uid: userProfile.userId,
          name: userProfile.displayName,
          profile_url: userProfile.pictureUrl,
          action: "pay_bill",
        });

        const urlParams = new URLSearchParams(window.location.search);
        const roomIdFromUrl = urlParams.get("roomId");

        if (roomIdFromUrl) {
          const roomData = await getRoom(roomIdFromUrl);
          if (roomData) setRooms([roomData as Room]);
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
    setSelectedRoom(roomId);
  };

  const handleUpdateRoom = async () => {
    if (!profile) return;
    const ctx = liff.getContext();
    await fetchRooms(profile.userId, ctx?.groupId);
  };

  const handleDeletedRoom = async () => {
    setSelectedRoom(null);
    if (!profile) return;
    const ctx = liff.getContext();
    await fetchRooms(profile.userId, ctx?.groupId);
  };

  const openInLiff = (path: string) => {
    window.location.href = new URL(path, window.location.origin).toString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="text-center py-20 text-neutral-400">กำลังโหลด...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-green-700">แดชบอร์ด</h1>
        </div>

        {profile && (
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.pictureUrl}
              alt="profile"
              className="w-14 h-14 rounded-full ring-4 ring-green-100"
            />
            <div>
              <p className="text-xl font-bold text-neutral-900">{profile.displayName}</p>
              <p className="text-sm text-neutral-400">ผู้จัดการห้อง</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg rounded-2xl p-4 border border-border">
            <p className="text-2xl font-extrabold text-primary">{rooms.length}</p>
            <p className="text-xs text-text-secondary">ห้องทั้งหมด</p>
          </div>
          <div className="bg-bg rounded-2xl p-4 border border-border">
            <p className="text-2xl font-extrabold text-primary">
              {profile ? profile.displayName : ""}
            </p>
            <p className="text-xs text-text-secondary">ชื่อผู้ใช้</p>
          </div>
        </div>

        {selectedRoom ? (
          <RoomManagementView
            roomId={selectedRoom}
            rooms={rooms}
            onUpdateRoom={handleUpdateRoom}
            onDeletedRoom={handleDeletedRoom}
            onBack={() => setSelectedRoom(null)}
          />
        ) : (
          <>
            <div>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">ห้องของฉัน</h2>
              {rooms.length === 0 ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200">
                    <p className="text-neutral-400">ยังไม่มีห้อง</p>
                    <button
                      onClick={() => openInLiff("/create-room")}
                      className="mt-4 inline-block py-3 px-6 rounded-xl font-bold text-white bg-green-600"
                    >
                      + สร้างห้อง
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-neutral-200">
                    <p className="text-sm text-neutral-500 mb-2">หรือมีห้องอยู่แล้ว? ใส่รหัสห้อง:</p>
                    <RoomIdInput onLoad={async (rid) => {
                      try {
                        const roomData = await getRoom(rid);
                        if (roomData) {
                          setRooms(prev => prev.some(r => r.id === rid) ? prev : [...prev, roomData as Room]);
                        }
                      } catch { /* silent */ }
                      selectRoom(rid);
                    }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map(room => (
                    <RoomCard key={room.id} room={room} onSelect={selectRoom} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">เมนู</h2>
              <div className="grid grid-cols-2 gap-3">
                <ActionCard icon="➕" label="สร้างห้อง" onClick={() => openInLiff("/create-room")} />
                <ActionCard icon="📋" label="บันทึกค่าใช้จ่าย" onClick={() => openInLiff("/expense")} />
                <ActionCard icon="📊" label="ประวัติ" onClick={() => openInLiff("/history")} />
                <ActionCard icon="ℹ️" label="ติดต่อสอบถาม" onClick={() => {}} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function RoomIdInput({ onLoad }: { onLoad: (id: string) => void }) {
  const [input, setInput] = useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Room ID"
        className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <button
        onClick={() => { if (input.trim()) onLoad(input.trim()); }}
        className="px-4 py-2.5 rounded-xl font-bold text-white bg-green-600 text-sm"
      >
        ยืนยัน
      </button>
    </div>
  );
}

function RoomCard({ room, onSelect }: { room: Room; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(room.id)}
      className="w-full text-left bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-neutral-900">{room.name}</p>
          <p className="text-sm text-neutral-400">
            {room.members?.length || 0} สมาชิก · ฿{Number(room.periodicAmount).toLocaleString()}
          </p>
        </div>
        <div className="text-neutral-300 text-xl">›</div>
      </div>
    </button>
  );
}

function RoomManagementView({
  roomId, rooms, onUpdateRoom, onDeletedRoom, onBack,
}: {
  roomId: string; rooms: Room[]; onUpdateRoom: () => void; onDeletedRoom: () => void; onBack: () => void;
}) {
  const room = rooms.find(r => r.id === roomId);

  if (!room) return null;

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-primary font-bold hover:underline mb-2">← กลับหน้ารวม</button>

      {/* Section 1: Room Card & Settings */}
      <RoomOverviewCard room={room} onUpdate={onUpdateRoom} />

      {/* Section 2: Members Table */}
      <MembersTable roomId={roomId} />

      {/* Section 3: Danger Zone */}
      <DangerZone roomId={roomId} onDeleted={onDeletedRoom} />
    </div>
  );
}

function ActionCard({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm text-center hover:shadow-md transition-shadow"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-bold text-neutral-700">{label}</p>
    </button>
  );
}
