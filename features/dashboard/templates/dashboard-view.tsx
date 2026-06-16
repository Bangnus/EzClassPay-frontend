"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getManagerRooms, approvePayment, rejectPayment } from "@/features/rooms/services";
import type { Room } from "@/features/rooms/types";

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
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [pendingPayments, setPendingPayments] = useState<PaymentSummary[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
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

        const roomsData = await getManagerRooms(userProfile.userId);
        setRooms(roomsData as Room[]);
      } catch (error) {
        console.error("Dashboard Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const selectRoom = async (roomId: string) => {
    setSelectedRoom(roomId);
    setLoadingPayments(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/room/${roomId}/pending`);
      const data = await res.json();
      if (data.success) {
        setPendingPayments(data.data || []);
      }
    } catch {
      setPendingPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      await approvePayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      await rejectPayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const openInLiff = (path: string) => {
    const url = new URL(path, window.location.origin);
    window.location.href = url.toString();
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-green-700">แดชบอร์ด</h1>
        </div>

        {/* Profile Card */}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-2xl font-extrabold text-green-700">{rooms.length}</p>
            <p className="text-xs text-green-600">ห้องทั้งหมด</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-2xl font-extrabold text-orange-600">0</p>
            <p className="text-xs text-orange-600">รอตรวจสอบ</p>
          </div>
        </div>

        {/* Room List or Selected Room Detail */}
        {selectedRoom ? (
          <SelectedRoomDetail
            roomId={selectedRoom}
            rooms={rooms}
            pendingPayments={pendingPayments}
            loadingPayments={loadingPayments}
            onApprove={handleApprove}
            onReject={handleReject}
            onBack={() => { setSelectedRoom(null); setPendingPayments([]); }}
          />
        ) : (
          <>
            <div>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">ห้องของฉัน</h2>
              {rooms.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200">
                  <p className="text-neutral-400">ยังไม่มีห้อง</p>
                  <button
                    onClick={() => openInLiff("/create-room")}
                    className="mt-4 inline-block py-3 px-6 rounded-xl font-bold text-white bg-green-600"
                  >
                    + สร้างห้อง
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map(room => (
                    <RoomCard key={room.id} room={room} onSelect={selectRoom} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">เมนู</h2>
              <div className="grid grid-cols-2 gap-3">
                <ActionCard
                  icon="➕"
                  label="สร้างห้อง"
                  onClick={() => openInLiff("/create-room")}
                />
                <ActionCard
                  icon="📋"
                  label="บันทึกค่าใช้จ่าย"
                  onClick={() => openInLiff("/expense")}
                />
                <ActionCard
                  icon="📊"
                  label="ประวัติ"
                  onClick={() => openInLiff("/history")}
                />
                <ActionCard
                  icon="ℹ️"
                  label="ติดต่อสอบถาม"
                  onClick={() => {}}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
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

function SelectedRoomDetail({
  roomId,
  rooms,
  pendingPayments,
  loadingPayments,
  onApprove,
  onReject,
  onBack,
}: {
  roomId: string;
  rooms: Room[];
  pendingPayments: PaymentSummary[];
  loadingPayments: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBack: () => void;
}) {
  const room = rooms.find(r => r.id === roomId);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-green-600 font-bold">← กลับ</button>

      {room && (
        <div className="bg-white rounded-2xl p-4 border border-neutral-200">
          <p className="text-xl font-bold text-neutral-900">{room.name}</p>
          <p className="text-sm text-neutral-400">PromptPay: {room.promptpayNo}</p>
          <p className="text-sm text-neutral-400">ยอด: ฿{Number(room.periodicAmount).toLocaleString()}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => {
            const url = new URL(`${window.location.origin}/approve-payments`);
            url.searchParams.set("roomId", roomId);
            window.location.href = url.toString();
          }}
          className="flex-1 py-3 rounded-xl font-bold text-white bg-orange-500"
        >
          ตรวจสอบสลิป
        </button>
        <button
          onClick={() => {
            const url = new URL(`${window.location.origin}/history`);
            url.searchParams.set("roomId", roomId);
            window.location.href = url.toString();
          }}
          className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-500"
        >
          ประวัติ
        </button>
      </div>

      {/* Pending Payments Preview */}
      <div>
        <h3 className="font-bold text-neutral-800 mb-2">สลิปรอตรวจสอบ</h3>
        {loadingPayments ? (
          <p className="text-sm text-neutral-400">กำลังโหลด...</p>
        ) : pendingPayments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-neutral-200">
            <p className="text-3xl">✅</p>
            <p className="text-sm text-neutral-400 mt-2">ไม่มีสลิปรอตรวจสอบ</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map(payment => (
              <div key={payment.id} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {payment.user.displayName.charAt(0)}
                  </div>
                  <p className="font-bold text-neutral-900">{payment.user.displayName}</p>
                </div>
                {payment.slipUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={payment.slipUrl} alt="สลิป" className="w-full rounded-xl border" />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(payment.id)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-green-600"
                  >
                    ✅ อนุมัติ
                  </button>
                  <button
                    onClick={() => onReject(payment.id)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-500"
                  >
                    ❌ ปฏิเสธ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
