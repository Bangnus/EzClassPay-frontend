"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { approvePayment, rejectPayment } from "@/features/rooms/services";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentSlip {
  id: string;
  slipUrl: string | null;
  status: string;
  amount?: number;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    lineUid: string;
    pictureUrl?: string;
  };
  room?: {
    name: string;
  };
}

export default function VerifySlipForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomInput, setRoomInput] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('[LIFF_OPEN] VerifySlip URL:', window.location.href);

        const params = new URLSearchParams(window.location.search);
        const ridFromUrl = params.get("roomId");

        // Try LIFF init (might be in LINE)
        try {
          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_VERIFY_SLIP as string });
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
          // Not in LINE or LIFF unavailable — standalone mode
        }

        if (ridFromUrl) {
          setRoomId(ridFromUrl);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    loadRoomAndPayments();
  }, [roomId]);

  const loadRoomAndPayments = async () => {
    setLoading(true);
    try {
      const [roomRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/api/rooms/${roomId}`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        }).then(r => r.json()),
        fetch(`${API_URL}/api/payments/room/${roomId}/pending`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        }).then(r => r.json()),
      ]);

      if (roomRes.success) {
        setRoomName(roomRes.data.name || "");
      }
      if (paymentsRes.success) {
        setPayments(paymentsRes.data || []);
      }
    } catch {
      setRoomName("");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      await approvePayment(paymentId);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("ปฏิเสธสลิปนี้ ใช่หรือไม่?")) return;
    try {
      await rejectPayment(paymentId);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const loadRoomById = () => {
    const rid = roomInput.trim();
    if (!rid) return;
    setRoomId(rid);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set("roomId", rid);
    window.history.replaceState({}, "", url.toString());
  };

  if (!initialized) {
    return <div className="text-center py-20 text-neutral-400">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">
          ตรวจสอบสลิป
        </h1>
        <p className="mt-2 text-neutral-500">ตรวจสอบและยืนยันสลิปการโอนเงิน</p>
      </header>

      {profile && (
        <div className="flex items-center gap-4 p-4 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-12 h-12 rounded-full ring-4 ring-white"
          />
          <div>
            <p className="text-xs text-neutral-500">ผู้ตรวจสอบ</p>
            <p className="text-lg font-bold text-neutral-900">{profile.displayName}</p>
          </div>
        </div>
      )}

      {/* Room selector */}
      {!roomId && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
          <p className="font-bold text-neutral-800">เลือกรหัสห้อง</p>
          <p className="text-sm text-neutral-400">ใส่รหัสห้องที่ต้องการตรวจสอบสลิป</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") loadRoomById(); }}
              placeholder="Room ID"
              className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-base"
            />
            <button
              onClick={loadRoomById}
              className="px-6 py-3 rounded-xl font-bold text-white bg-orange-500"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}

      {/* Room info */}
      {roomId && roomName && (
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400">ห้อง</p>
            <p className="font-bold text-neutral-900">{roomName}</p>
          </div>
          <button
            onClick={() => {
              setRoomId("");
              setRoomName("");
              setPayments([]);
              const url = new URL(window.location.href);
              url.searchParams.delete("roomId");
              window.history.replaceState({}, "", url.toString());
            }}
            className="text-sm text-orange-600 font-bold"
          >
            เปลี่ยนห้อง
          </button>
        </div>
      )}

      {/* Pending payments */}
      {roomId && (
        <>
          {loading ? (
            <div className="text-center py-10 text-neutral-400">กำลังโหลด...</div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 space-y-3">
              <div className="text-5xl">✅</div>
              <p className="text-lg font-medium text-neutral-700">ไม่มีสลิปรอตรวจสอบ</p>
              <p className="text-sm text-neutral-400">ทุกคนชำระเงินเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-bold text-neutral-500">
                รอตรวจสอบ {payments.length} รายการ
              </p>
              {payments.map(payment => (
                <div
                  key={payment.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                        {payment.user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">
                          {payment.user.displayName}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {new Date(payment.createdAt).toLocaleString("th-TH")}
                        </p>
                      </div>
                    </div>

                    {payment.slipUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={payment.slipUrl}
                        alt="สลิป"
                        className="w-full rounded-xl border border-neutral-100"
                      />
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(payment.id)}
                        className="flex-1 py-3 rounded-xl text-base font-bold text-white bg-green-600 hover:bg-green-700"
                      >
                        ✅ อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(payment.id)}
                        className="flex-1 py-3 rounded-xl text-base font-bold text-white bg-red-500 hover:bg-red-600"
                      >
                        ❌ ปฏิเสธ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
