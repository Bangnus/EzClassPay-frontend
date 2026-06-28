"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import {
  getPendingPayments,
  approvePayment,
  rejectPayment,
  getRoom,
} from "../services";
import Spinner from "@/components/ui/spinner";
import SlipImage from "@/components/ui/slip-image";
import type { Payment } from "../types";

export default function ApprovePaymentsForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rid = params.get("roomId");
    if (rid) setRoomId(rid);

    const init = async () => {
      console.log("[LIFF_OPEN] ApprovePayments URL:", window.location.href);
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_APPROVE as string,
        });
        let userProfile: {
          userId: string;
          displayName: string;
          pictureUrl?: string;
        } | null = null;

        if (liff.isLoggedIn()) {
          userProfile = await liff.getProfile();
          setProfile(userProfile);
          await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "pay_bill",
          });
        } else {
          liff.login();
          return;
        }

        if (rid) {
          const [roomData, pendingData] = await Promise.all([
            getRoom(rid),
            getPendingPayments(rid),
          ]);
          if (roomData) setRoom(roomData);
          setPayments(pendingData);
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleApprove = async (paymentId: string) => {
    try {
      await approvePayment(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      await rejectPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!room) {
    return (
      <>
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">
            ตรวจสอบสลิป
          </h1>
        </header>
        <div className="text-center py-10 text-neutral-500">
          ไม่พบข้อมูลห้อง
        </div>
      </>
    );
  }

  return (
    <>
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">
          ตรวจสอบสลิป
        </h1>
        <p className="mt-2 text-neutral-500">{room.name}</p>
      </header>

      {profile && (
        <div className="mb-6 flex items-center gap-4 p-4 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-12 h-12 rounded-full ring-4 ring-white"
          />
          <div>
            <p className="text-xs text-neutral-500">ผู้ตรวจสอบ</p>
            <p className="text-lg font-bold text-neutral-900">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 space-y-2">
          <div className="text-5xl">✅</div>
          <p className="text-lg font-medium">ไม่มีสลิปรอตรวจสอบ</p>
          <p className="text-sm">ทุกคนชำระเงินเรียบร้อยแล้ว</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {payment.user.pictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={payment.user.pictureUrl}
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {payment.user.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-neutral-900">
                      {payment.user.displayName}
                    </p>
                    <p className="text-xs text-neutral-400">รอตรวจสอบ</p>
                  </div>
                </div>

                {payment.slipUrl && (
                  <SlipImage url={payment.slipUrl} className="w-full rounded-xl border border-neutral-100" />
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
  );
}
