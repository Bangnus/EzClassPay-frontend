"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { approvePayment, rejectPayment } from "@/features/rooms/services";
import Spinner from "@/components/ui/spinner";
import Button from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentSlip {
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

export default function VerifySlipForm() {
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

        // Try LIFF init (might be in LINE)
        try {
          await liff.init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID_VERIFY_SLIP as string,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const liffQuery = (liff as any).getQuery?.() || {};
          const qRoomId = liffQuery.roomId;
          const ssRoomId = sessionStorage.getItem("verify_slip_roomId");

          const rid = qRoomId || urlRoomId || ssRoomId;
          if (rid) {
            setRoomId(rid);
            sessionStorage.setItem("verify_slip_roomId", rid);
          }

          if (!liff.isLoggedIn()) {
            sessionStorage.setItem("verify_slip_roomId", rid || "");
            liff.login();
            return;
          }

          const userProfile = await liff.getProfile();
          await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "verify_slip",
          });
        } catch (e) {
          console.error("LIFF error:", e);
          // Not in LINE or LIFF unavailable — standalone mode
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
      const [roomRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/api/rooms/${roomId}`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        }).then((r) => r.json()),
        fetch(`${API_URL}/api/payments/room/${roomId}/pending`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        }).then((r) => r.json()),
      ]);

      if (roomRes.success) {
        setRoomName(roomRes.data.name || "");
      }
      if (paymentsRes.success) {
        setPayments(paymentsRes.data || []);
      }
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

  if (!initialized) {
    return <Spinner text="กำลังเตรียมข้อมูลการตรวจสอบ..." />;
  }

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out] space-y-6">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark shadow-button mb-4">
          <span className="text-3xl">🔎</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          ตรวจสอบสลิป
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary font-medium">
          ตรวจสอบและยืนยันสลิปการโอนเงิน
        </p>
      </header>

      {!roomId && (
        <div className="rounded-2xl bg-white border border-border p-8 text-center space-y-3 shadow-soft">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-1">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-base font-semibold text-text-primary">
            ไม่พบข้อมูลห้อง
          </p>
          <p className="text-sm text-text-secondary">
            กรุณาเข้าใช้งานผ่านลิงก์ห้องที่ถูกต้อง
          </p>
        </div>
      )}

      {roomId && roomName && (
        <div className="relative overflow-hidden bg-linear-to-br from-secondary-light to-white rounded-2xl p-5 border border-secondary/40 flex items-center justify-between shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,198,174,0.06),transparent_70%)]" />
          <div className="relative">
            <p className="text-xs text-text-secondary font-medium mb-1">ห้องปัจจุบัน</p>
            <p className="font-bold text-primary-dark text-lg">{roomName}</p>
          </div>
        </div>
      )}

      {roomId && (
        <>
          {loading ? (
            <Spinner text="กำลังโหลดข้อมูล..." />
          ) : payments.length === 0 ? (
            <div className="rounded-2xl bg-white border border-border p-10 text-center space-y-4 shadow-soft mt-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
                <span className="text-5xl">✅</span>
              </div>
              <div>
                <p className="text-lg font-bold text-primary-dark">
                  ไม่มีสลิปรอตรวจสอบ
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  ทุกคนชำระเงินเรียบร้อยแล้ว
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-sm font-bold text-text-secondary">
                  รอตรวจสอบทั้งหมด
                </p>
                <span className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-xs font-bold">
                  {payments.length} รายการ
                </span>
              </div>

              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow duration-300"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                      <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center text-primary-dark font-bold text-xl border border-secondary/30">
                        {payment.user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary text-lg">
                          {payment.user.displayName}
                        </p>
                        <p className="text-xs text-text-secondary font-medium">
                          {new Date(payment.createdAt).toLocaleString("th-TH")}
                        </p>
                      </div>
                    </div>

                    {payment.slipUrl && (
                      <div className="rounded-xl bg-neutral-50 p-3 border border-border/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={payment.slipUrl}
                          alt="สลิป"
                          className="w-full rounded-lg object-contain max-h-[60vh]"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <div className="flex-1">
                        <Button
                          onClick={() => handleApprove(payment.id)}
                          type="primary"
                          padding={12}
                          color="#00c6ae"
                          className="w-full shadow-button hover:shadow-floating transition-shadow duration-300"
                        >
                          ✅ อนุมัติ
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Button
                          onClick={() => handleReject(payment.id)}
                          type="default"
                          padding={12}
                          className="w-full border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                        >
                          ❌ ปฏิเสธ
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
