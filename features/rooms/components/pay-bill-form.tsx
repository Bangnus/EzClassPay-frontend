"use client";

import { useState } from "react";
import liff from "@line/liff";
import PayBillSuccess from "./pay-bill-success";
import PayBillNotFound from "./pay-bill-not-found";
import PayBillQR from "./pay-bill-qr";
import Spinner from "@/components/ui/spinner";
import { usePayBill } from "../hooks/use-pay-bill";

export default function PayBillForm() {
  const { profile, room, bill, loading, roomId, periodId, apiFetch } = usePayBill();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const amount = bill?.amount || room?.periodicAmount || 0;

  const handleConfirm = async () => {
    if (!profile || !roomId) return;
    setSubmitting(true);
    try {
      await apiFetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUid: profile.userId, roomId, periodId: periodId || undefined }),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => liff.isInClient() && liff.closeWindow();

  if (loading) return <Spinner text="กำลังโหลดข้อมูลการชำระเงิน..." />;
  if (!room) return <PayBillNotFound onGoBack={goBack} />;
  if (done) return <PayBillSuccess onGoBack={goBack} />;

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out]">
      {/* Header with gradient accent */}
      <header className="mb-8 text-center relative">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark shadow-button mb-4">
          <span className="text-3xl">💳</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          ชำระเงิน
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary font-medium">
          {room.name}
        </p>
      </header>

      <PayBillQR
        room={room}
        amount={amount}
        submitting={submitting}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
