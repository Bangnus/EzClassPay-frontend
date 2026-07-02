"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getUserPayments, getUserBills } from "@/features/rooms/services";
import Spinner from "@/components/ui/spinner";
import SlipImage from "@/components/ui/slip-image";
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("[LIFF_OPEN] History URL:", window.location.href);

        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_HISTORY as string,
        });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          const syncResult = await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "bill_list",
          });

          if (syncResult && syncResult.data && syncResult.data.id) {
            await loadData(syncResult.data.id, userProfile.userId);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadData = async (dbUserId: string, lineUid: string) => {
    try {
      const [paymentsData, billsData] = await Promise.all([
        getUserPayments(lineUid).catch(() => []),
        getUserBills(dbUserId).catch(() => []),
      ]);

      const p = paymentsData as Payment[];
      p.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPayments(p);
      setBills(billsData as any[]);
    } catch {
      setPayments([]);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = (() => {
    let totalBilled = 0;
    let totalPaid = 0;

    bills.forEach((b) => (totalBilled += b.amount || 0));
    payments.forEach((p) => {
      if (p.status === "APPROVED") totalPaid += p.amount || 0;
    });

    const totalMissing = totalBilled > totalPaid ? totalBilled - totalPaid : 0;

    // Group by room
    const roomStats: Record<
      string,
      { roomName: string; billed: number; paid: number; missing: number }
    > = {};

    bills.forEach((b) => {
      if (!roomStats[b.roomId]) {
        roomStats[b.roomId] = {
          roomName: b.room.name,
          billed: 0,
          paid: 0,
          missing: 0,
        };
      }
      roomStats[b.roomId].billed += b.amount || 0;
    });

    payments.forEach((p) => {
      if (p.status === "APPROVED" && p.roomId) {
        if (!roomStats[p.roomId]) {
          roomStats[p.roomId] = {
            roomName: p.room?.name || "ห้อง",
            billed: 0,
            paid: 0,
            missing: 0,
          };
        }
        roomStats[p.roomId].paid += p.amount || 0;
      }
    });

    Object.values(roomStats).forEach((stat) => {
      stat.missing = stat.billed > stat.paid ? stat.billed - stat.paid : 0;
    });

    return {
      totalBilled,
      totalPaid,
      totalMissing,
      roomStats: Object.values(roomStats).sort((a, b) => b.missing - a.missing),
    };
  })();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          สรุปยอดค่าใช้จ่ายส่วนตัว
        </h1>
        <p className="mt-2 text-text-secondary">รวมจากทุกห้องทั้งหมด</p>
      </header>

      {profile && (
        <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl border border-border shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-12 h-12 rounded-full border border-border"
          />
          <div>
            <p className="text-xs text-text-secondary">ผู้ใช้งาน</p>
            <p className="text-lg font-bold text-text-primary">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm col-span-2">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
            ยอดที่ถูกเรียกเก็บรวมทั้งหมด
          </p>
          <p className="text-3xl font-black text-text-primary">
            ฿{summary.totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-3xl p-4 border border-green-100 shadow-sm">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
            จ่ายไปแล้ว
          </p>
          <p className="text-xl font-black text-green-700">
            ฿{summary.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-3xl p-4 border border-red-100 shadow-sm">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
            ยอดค้างจ่าย
          </p>
          <p className="text-xl font-black text-red-700">
            ฿{summary.totalMissing.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Room Summary List */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-text-secondary">
          สรุปแยกตามห้อง ({summary.roomStats.length} ห้อง)
        </p>

        {summary.roomStats.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-sm">
            <p className="text-text-secondary">ยังไม่มีข้อมูลจากห้องใดๆ</p>
          </div>
        ) : (
          summary.roomStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-text-primary text-md">
                  {stat.roomName}
                </p>
                {stat.missing === 0 ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-50">
                    ครบแล้ว
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50">
                    ค้าง ฿{stat.missing.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-bg/50 rounded-lg p-3 border border-border">
                <div>
                  <p className="text-xs text-text-secondary">เรียกเก็บ</p>
                  <p className="text-sm font-bold text-text-primary">
                    ฿{stat.billed.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">จ่ายแล้ว</p>
                  <p className="text-sm font-bold text-green-600">
                    ฿{stat.paid.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Payments List */}
      {payments.length > 0 && (
        <div className="space-y-3 mt-6">
          <p className="text-sm font-bold text-text-secondary">
            ประวัติการจ่ายเงินล่าสุด ({payments.length} รายการ)
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-text-primary text-sm">
                      {payment.room?.name || "ห้อง"}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {new Date(payment.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
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
