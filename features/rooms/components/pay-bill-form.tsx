"use client";

import { useState } from "react";
import liff from "@line/liff";
import PayBillSuccess from "./pay-bill-success";
import PayBillNotFound from "./pay-bill-not-found";
import PayBillQR from "./pay-bill-qr";
import Spinner from "@/components/ui/spinner";
import { usePayBill } from "../hooks/use-pay-bill";
import { initiatePayment } from "../services";

import { Skeleton } from "@/components/ui/skeleton";

export default function PayBillForm() {
  const { profile, room, bill, loading, roomId } = usePayBill();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const amount = bill?.amount || room?.totalTargetAmount || 0;

  const handleConfirm = async () => {
    if (!profile || !roomId) return;
    setSubmitting(true);
    try {
      await initiatePayment({
        lineUid: profile.userId,
        roomId,
        amount,
        billId: bill?.id || null,
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <header className="mb-8 text-center relative flex flex-col items-center">
          <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </header>
        <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-6">
          <div className="flex justify-center">
            <Skeleton className="w-48 h-48 rounded-xl" />
          </div>
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    );
  }
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
