"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getRoomPayments, getRoom } from "@/features/rooms/services";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
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
      const [roomData, paymentsData] = await Promise.all([
        getRoom(roomId).catch(() => null),
        getRoomPayments(roomId),
      ]);
      if (roomData) setRoomName((roomData as { name: string }).name || "");

      const p = paymentsData as Payment[];
      p.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPayments(p);
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
          ) : payments.length === 0 ? (
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
                    className="bg-bg border border-border rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {payment.user.pictureUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={payment.user.pictureUrl}
                            alt="profile"
                            className="w-10 h-10 rounded-full border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {payment.user.displayName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-text-primary">
                            {payment.user.displayName}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {new Date(payment.createdAt).toLocaleString(
                              "th-TH"
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    {payment.amount > 0 && (
                      <div className="mt-2 flex justify-between items-center bg-bg/50 rounded-lg p-2 border border-border">
                        <p className="text-sm font-bold text-text-primary">
                          ยอดเงิน: ฿
                          {Number(payment.amount).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {payment.slipUrl && (
                      <details className="mt-2">
                        <summary className="text-sm text-primary font-bold cursor-pointer">
                          ดูสลิป
                        </summary>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={payment.slipUrl}
                          alt="สลิป"
                          className="mt-2 w-full rounded-xl border border-border"
                        />
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
