"use client";

import { useState } from "react";
import liff from "@line/liff";
import PayBillSuccess from "./pay-bill-success";
import PayBillNotFound from "./pay-bill-not-found";
import PayBillQR from "./pay-bill-qr";
import Spinner from "@/components/ui/spinner";
import { usePayBill } from "../hooks/use-pay-bill";

export default function PayBillForm() {
  const { profile, room, bill, loading, roomId, apiFetch } = usePayBill();
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
        body: JSON.stringify({ lineUid: profile.userId, roomId }),
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

  if (loading) return <Spinner />;
  if (!room) return <PayBillNotFound onGoBack={goBack} />;
  if (done) return <PayBillSuccess onGoBack={goBack} />;

  return (
    <>
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ชำระเงิน
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
            <p className="text-xs text-neutral-500">ผู้โอน</p>
            <p className="text-lg font-bold text-neutral-900">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      <PayBillQR
        room={room}
        amount={amount}
        submitting={submitting}
        onConfirm={handleConfirm}
      />
    </>
  );
}
