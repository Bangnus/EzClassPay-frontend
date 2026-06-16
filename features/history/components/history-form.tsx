"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getRoomPayments, getRoom } from "@/features/rooms/services";
import type { Payment } from "@/features/rooms/types";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  AWAITING_SLIP: { label: "รอสลิป", color: "text-yellow-600 bg-yellow-50" },
  PENDING: { label: "รอตรวจสอบ", color: "text-orange-600 bg-orange-50" },
  APPROVED: { label: "อนุมัติแล้ว", color: "text-green-600 bg-green-50" },
  REJECTED: { label: "ปฏิเสธ", color: "text-red-600 bg-red-50" },
};

export default function HistoryForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomInput, setRoomInput] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const ridFromUrl = params.get("roomId");

        try {
          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_HISTORY as string });
          if (liff.isLoggedIn()) {
            const userProfile = await liff.getProfile();
            setProfile(userProfile);
            await syncUserWithBackend({
              line_uid: userProfile.userId,
              name: userProfile.displayName,
              profile_url: userProfile.pictureUrl,
              action: "pay_bill",
            });
          }
        } catch {
          // standalone mode
        }

        if (ridFromUrl) {
          setRoomId(ridFromUrl);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    loadData();
  }, [roomId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomData, paymentsData] = await Promise.all([
        getRoom(roomId),
        getRoomPayments(roomId),
      ]);
      if (roomData) setRoomName((roomData as { name: string }).name || "");
      setPayments(paymentsData as Payment[]);
    } catch {
      setRoomName("");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadByRoomId = () => {
    const rid = roomInput.trim();
    if (!rid) return;
    setRoomId(rid);
    const url = new URL(window.location.href);
    url.searchParams.set("roomId", rid);
    window.history.replaceState({}, "", url.toString());
  };

  if (loading) {
    return <div className="text-center py-20 text-neutral-400">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          ประวัติการชำระเงิน
        </h1>
        <p className="mt-2 text-neutral-500">ประวัติทั้งหมดของห้อง</p>
      </header>

      {profile && (
        <div className="flex items-center gap-4 p-4 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.pictureUrl} alt="profile" className="w-12 h-12 rounded-full ring-4 ring-white" />
          <div>
            <p className="text-xs text-neutral-500">ผู้ใช้งาน</p>
            <p className="text-lg font-bold text-neutral-900">{profile.displayName}</p>
          </div>
        </div>
      )}

      {!roomId && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
          <p className="font-bold text-neutral-800">เลือกรหัสห้อง</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") loadByRoomId(); }}
              placeholder="Room ID"
              className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-base"
            />
            <button onClick={loadByRoomId} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500">
              ยืนยัน
            </button>
          </div>
        </div>
      )}

      {roomId && roomName && (
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400">ห้อง</p>
            <p className="font-bold text-neutral-900">{roomName}</p>
          </div>
          <button
            onClick={() => { setRoomId(""); setRoomName(""); setPayments([]); }}
            className="text-sm text-blue-600 font-bold"
          >
            เปลี่ยนห้อง
          </button>
        </div>
      )}

      {roomId && (
        <>
          {loading ? (
            <div className="text-center py-10 text-neutral-400">กำลังโหลด...</div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200">
              <p className="text-neutral-400">ไม่มีประวัติการชำระเงิน</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-bold text-neutral-500">ทั้งหมด {payments.length} รายการ</p>
              {payments.map(payment => {
                const st = STATUS_LABEL[payment.status] || { label: payment.status, color: "text-neutral-600 bg-neutral-50" };
                return (
                  <div key={payment.id} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {payment.user.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{payment.user.displayName}</p>
                          <p className="text-xs text-neutral-400">
                            {new Date(payment.createdAt).toLocaleString("th-TH")}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    {payment.slipUrl && (
                      <details className="mt-2">
                        <summary className="text-sm text-blue-600 cursor-pointer">ดูสลิป</summary>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={payment.slipUrl} alt="สลิป" className="mt-2 w-full rounded-xl border" />
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
