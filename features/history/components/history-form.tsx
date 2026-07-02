"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getRoomPayments, getRoom, getAllRoomBills, getRoomMembers } from "@/features/rooms/services";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
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
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomInput, setRoomInput] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        console.log("[LIFF_OPEN] History URL:", window.location.href);

        const params = new URLSearchParams(window.location.search);
        const ridFromUrl = params.get("roomId");

        try {
          await liff.init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID_HISTORY as string,
          });
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
      const [roomData, paymentsData, billsData, membersData] = await Promise.all([
        getRoom(roomId).catch(() => null),
        getRoomPayments(roomId).catch(() => []),
        getAllRoomBills(roomId).catch(() => []),
        getRoomMembers(roomId).catch(() => []),
      ]);
      if (roomData) setRoomName((roomData as { name: string }).name || "");

      const p = paymentsData as Payment[];
      p.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPayments(p);
      setBills(billsData as any[]);
      setMembers(membersData as any[]);
    } catch {
      setRoomName("");
      setPayments([]);
      setBills([]);
      setMembers([]);
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

    const memberStats: Record<
      string,
      { user: any; billed: number; paid: number; missing: number }
    > = {};

    members.forEach((m) => {
      memberStats[m.userId] = {
        user: m.user,
        billed: 0,
        paid: 0,
        missing: 0,
      };
    });

    bills.forEach((b) => {
      if (memberStats[b.userId]) {
        memberStats[b.userId].billed += b.amount || 0;
      }
    });

    payments.forEach((p) => {
      if (p.status === "APPROVED" && memberStats[p.user.id]) {
        memberStats[p.user.id].paid += p.amount || 0;
      }
    });

    Object.values(memberStats).forEach((stat) => {
      stat.missing = stat.billed > stat.paid ? stat.billed - stat.paid : 0;
    });

    return {
      totalBilled,
      totalPaid,
      totalMissing,
      memberStats: Object.values(memberStats).sort(
        (a, b) => b.missing - a.missing
      ),
    };
  })();

  const loadByRoomId = () => {
    const rid = roomInput.trim();
    if (!rid) return;
    setRoomId(rid);
    const url = new URL(window.location.href);
    url.searchParams.set("roomId", rid);
    window.history.replaceState({}, "", url.toString());
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ประวัติการชำระเงิน
        </h1>
        <p className="mt-2 text-text-secondary">ประวัติทั้งหมดของห้อง</p>
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
            <p className="text-xs text-text-secondary">ผู้จัดการ</p>
            <p className="text-lg font-bold text-text-primary">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      {!roomId && (
        <div className="bg-bg rounded-2xl p-6 border border-border space-y-3">
          <p className="font-bold text-text-primary">เลือกรหัสห้อง</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Room ID"
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadByRoomId();
                }}
                placeholder="กรอกรหัสห้อง"
              />
            </div>
            <div>
              <Button type="primary" onClick={loadByRoomId}>
                ยืนยัน
              </Button>
            </div>
          </div>
        </div>
      )}

      {roomId && roomName && (
        <div className="bg-bg rounded-2xl p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">ห้อง</p>
            <p className="font-bold text-text-primary">{roomName}</p>
          </div>
          <button
            onClick={() => {
              setRoomId("");
              setRoomName("");
              setPayments([]);
            }}
            className="text-sm text-primary font-bold"
          >
            เปลี่ยนห้อง
          </button>
        </div>
      )}

      {roomId && (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm col-span-2">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    ยอดเรียกเก็บทั้งหมด
                  </p>
                  <p className="text-3xl font-black text-text-primary">
                    ฿{summary.totalBilled.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-3xl p-4 border border-green-100 shadow-sm">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
                    รับชำระแล้ว
                  </p>
                  <p className="text-xl font-black text-green-700">
                    ฿{summary.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 rounded-3xl p-4 border border-red-100 shadow-sm">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                    ยอดค้างชำระ
                  </p>
                  <p className="text-xl font-black text-red-700">
                    ฿{summary.totalMissing.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Member Summary List */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-text-secondary">
                  สถานะการจ่ายเงินแยกตามบุคคล ({summary.memberStats.length} คน)
                </p>

                {summary.memberStats.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-sm">
                    <p className="text-text-secondary">ยังไม่มีลูกบ้านในห้องนี้</p>
                  </div>
                ) : (
                  summary.memberStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {stat.user.pictureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={stat.user.pictureUrl}
                              alt="profile"
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                              {stat.user.displayName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-text-primary text-sm">
                              {stat.user.displayName}
                            </p>
                          </div>
                        </div>

                        {stat.missing === 0 ? (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-50">
                            จ่ายครบแล้ว
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50">
                            ค้าง ฿{stat.missing.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center bg-bg/50 rounded-lg p-3 border border-border">
                        <div>
                          <p className="text-xs text-text-secondary">ยอดเรียกเก็บ</p>
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
