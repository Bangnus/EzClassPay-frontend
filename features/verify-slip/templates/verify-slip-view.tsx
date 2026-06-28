"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import {
  approvePayment,
  rejectPayment,
  getRoom,
  getPendingPayments,
} from "@/features/rooms/services";
import VerifySlipForm from "../components/verify-slip-form";

export interface PaymentSlip {
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

export default function VerifySlipView() {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [payments, setPayments] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("[LIFF_OPEN] VerifySlip URL:", window.location.href);

        const params = new URLSearchParams(window.location.search);
        const urlRoomId = params.get("roomId");

        try {
          await liff.init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID_VERIFY_SLIP as string,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const liffQuery = (liff as any).getQuery?.() || {};
          const qRoomId = liffQuery.roomId;
          const ssRoomId = sessionStorage.getItem("verify_slip_roomId");

          const rid = qRoomId || urlRoomId || ssRoomId;

          if (!liff.isLoggedIn()) {
            sessionStorage.setItem("verify_slip_roomId", rid || "");
            liff.login();
            return;
          }

          const userProfile = await liff.getProfile();
          const syncResult = await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "verify_slip",
          });

          const finalRid = rid || syncResult?.data?.activeRoomId || "";
          if (finalRid) {
            setRoomId(finalRid);
            sessionStorage.setItem("verify_slip_roomId", finalRid);
          }
        } catch (e) {
          console.error("LIFF error:", e);
          if (urlRoomId) {
            setRoomId(urlRoomId);
          }
        }
      } catch (e) {
        console.error("Init error:", e);
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
      const [roomData, pendingData] = await Promise.all([
        getRoom(roomId),
        getPendingPayments(roomId),
      ]);

      if (roomData) {
        setRoomName((roomData as { name: string }).name || "");
      }
      setPayments((pendingData as PaymentSlip[]) || []);
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
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("ปฏิเสธสลิปนี้ ใช่หรือไม่?")) return;
    try {
      await rejectPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch {
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const handleClearRoom = () => {
    setRoomId("");
    setRoomName("");
    setPayments([]);
    const url = new URL(window.location.href);
    url.searchParams.delete("roomId");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <main className="min-h-screen bg-bg text-foreground p-4 md:p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-card p-8 md:p-12 border border-border/50">
        <VerifySlipForm
          roomId={roomId}
          roomName={roomName}
          payments={payments}
          loading={loading}
          initialized={initialized}
          onApprove={handleApprove}
          onReject={handleReject}
          onClearRoom={handleClearRoom}
        />
        <footer className="mt-10 text-center text-xs text-text-secondary opacity-50">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
