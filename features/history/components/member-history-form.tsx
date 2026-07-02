"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getRoomPayments, getRoom, getRoomByGroup } from "@/features/rooms/services";
import type { Payment } from "@/features/rooms/types";
import Spinner from "@/components/ui/spinner";
import SlipImage from "@/components/ui/slip-image";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_MEMBER_HISTORY as string,
        });

        console.log(
          "[LIFF_OPEN] MemberHistory URL:",
          window.location.href,
          "context:",
          JSON.stringify(liff.getContext())
        );

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

        const params = new URLSearchParams(window.location.search);
        const rid = params.get("roomId");
        const uid = params.get("userId");
        const context = liff.getContext();
        const groupId = params.get("groupId") || context?.groupId || null;

        if (uid) {
          setTargetUserId(uid);
        }

        let finalRoomId = rid;
        if (!finalRoomId && syncResult?.data?.activeRoomId) {
          finalRoomId = syncResult.data.activeRoomId;
        }

        if (!finalRoomId && groupId) {
          const roomByGroup = await getRoomByGroup(groupId) as { id: string } | null;
          if (roomByGroup && roomByGroup.id) {
            finalRoomId = roomByGroup.id;
          }
        }

        if (finalRoomId) {
          setRoomId(finalRoomId);
        } else {
          setError("ไม่พบรหัสห้อง กรุณาเปิดจากเมนูของห้องที่ต้องการดูประวัติ");
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
      const filter: { userId?: string; lineUid?: string } = {};
      if (targetUserId) {
        filter.userId = targetUserId;
      } else if (profile?.userId) {
        filter.lineUid = profile.userId;
      }

      const [roomData, paymentsData] = await Promise.all([
        getRoom(roomId).catch(() => null),
        getRoomPayments(roomId, filter),
      ]);
      if (roomData) setRoomName((roomData as { name: string }).name || "");

      setPayments(paymentsData as Payment[]);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
        </header>
        <div className="space-y-4 mt-6">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ประวัติการจ่ายเงิน
        </h1>
        {roomName && <p className="mt-2 text-text-secondary">{roomName}</p>}
      </header>

      {payments.length === 0 ? (
        <div className="bg-bg rounded-2xl p-10 text-center border border-border">
          <p className="text-text-secondary">ไม่มีประวัติการชำระเงิน</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-bold text-text-secondary">
            ทั้งหมด {payments.length} รายการ
          </p>
          {payments.map((payment) => {
            const st = STATUS_LABEL[payment.status] || {
              label: payment.status,
              color: "text-text-secondary bg-border",
            };
            return (
              <div
                key={payment.id}
                className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    {new Date(payment.createdAt).toLocaleString("th-TH")}
                  </p>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${st.color}`}
                  >
                    {st.label}
                  </span>
                </div>
                {payment.amount > 0 && (
                  <div className="mt-4 flex justify-between items-center bg-bg/50 rounded-lg p-3 border border-border">
                    <p className="text-sm font-bold text-text-primary">
                      ยอดเงิน: ฿{Number(payment.amount).toLocaleString()}
                    </p>
                  </div>
                )}

                {payment.slipUrl && (
                  <details className="mt-4 group">
                    <summary className="text-sm text-primary font-bold cursor-pointer list-none flex items-center justify-between bg-primary/5 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                      ดูสลิปโอนเงิน
                      <span className="text-primary group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="pt-3">
                      <SlipImage
                        url={payment.slipUrl}
                        className="w-full rounded-2xl border-2 border-neutral-100 shadow-sm"
                      />
                    </div>
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
