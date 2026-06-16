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

export default function MemberHistoryForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_MEMBER_HISTORY as string });

        console.log('[LIFF_OPEN] MemberHistory URL:', window.location.href, 'context:', JSON.stringify(liff.getContext()));

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

        const params = new URLSearchParams(window.location.search);
        const rid = params.get("roomId");
        const context = liff.getContext();
        const groupId = params.get("groupId") || context?.groupId || null;

        if (rid) {
          setRoomId(rid);
        } else if (groupId) {
          // Try to find room by groupId via API
          setRoomId(groupId);
          setError("ไม่พบรหัสห้อง กรุณาเปิดจากเมนูของห้อง");
        } else {
          setError("กรุณาเปิดจากเมนูของห้องที่ต้องการดูประวัติ");
        }
      } catch {
        setError("กรุณาเปิดผ่าน LINE");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!roomId || !profile) return;
    loadHistory();
  }, [roomId, profile]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [roomData, paymentsData] = await Promise.all([
        getRoom(roomId).catch(() => null),
        getRoomPayments(roomId, profile?.userId),
      ]);
      if (roomData) setRoomName((roomData as { name: string }).name || "");
      setPayments((paymentsData as Payment[]).filter(p => p.lineUid === profile?.userId));
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-neutral-400">กำลังโหลด...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-neutral-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-purple-600 tracking-tight">
          ประวัติของฉัน
        </h1>
        {roomName && <p className="mt-2 text-neutral-500">{roomName}</p>}
      </header>

      {profile && (
        <div className="flex items-center gap-4 p-4 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.pictureUrl} alt="profile" className="w-12 h-12 rounded-full ring-4 ring-white" />
          <div>
            <p className="text-xs text-neutral-500">สมาชิก</p>
            <p className="text-lg font-bold text-neutral-900">{profile.displayName}</p>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-400">
                    {new Date(payment.createdAt).toLocaleString("th-TH")}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                {payment.slipUrl && (
                  <details className="mt-2">
                    <summary className="text-sm text-purple-600 cursor-pointer">ดูสลิป</summary>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={payment.slipUrl} alt="สลิป" className="mt-2 w-full rounded-xl border" />
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
