"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PayBillForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [roomId, setRoomId] = useState("");

  const apiFetch = (url: string, init?: RequestInit) =>
    fetch(`${API_URL}${url}`, { ...init, headers: { ...init?.headers, "ngrok-skip-browser-warning": "true" } });

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_PAY_BILL as string });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const liffQuery = (liff as any).getQuery?.() || {};
        const qRoomId = liffQuery.roomId;
        const urlRoomId = new URLSearchParams(window.location.search).get("roomId");
        const ssRoomId = sessionStorage.getItem("pay_bill_roomId");

        const rid = qRoomId || urlRoomId || ssRoomId;
        if (rid) {
          setRoomId(rid);
          sessionStorage.setItem("pay_bill_roomId", rid);
        }

        let userProfile: { userId: string; displayName: string; pictureUrl?: string } | null = null;

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
          sessionStorage.setItem("pay_bill_roomId", rid || "");
          liff.login();
          return;
        }

        if (rid && userProfile) {
          const res = await apiFetch(`/api/rooms/${rid}`);
          const roomData = await res.json();
          if (roomData.success) {
            setRoom(roomData.data);
          }

          const billRes = await apiFetch(
            `/api/bills/room/${rid}?limit=1&lineUid=${userProfile.userId}`
          );
          const billData = await billRes.json();
          if (billData.success && billData.data.length > 0) {
            const unpaid = billData.data.find(
              (b: { status: string }) => b.status === "UNPAID"
            );
            if (unpaid) setBill(unpaid);
          }
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  const amount = bill?.amount || room?.periodicAmount || 0;

  const handleConfirm = async () => {
    if (!profile || !roomId) return;
    setSubmitting(true);
    try {
      await apiFetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUid: profile.userId,
          roomId,
        }),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-neutral-400">กำลังโหลด...</div>
    );
  }

  if (!room) {
    return (
      <>
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
            ชำระเงิน
          </h1>
        </header>
        <div className="text-center py-10 text-neutral-500">
          ไม่พบข้อมูลห้อง กรุณากลับไปที่แชท
        </div>
        <button onClick={goBack} className="w-full py-4 px-6 rounded-2xl text-xl font-bold text-white bg-green-600">
          กลับไปที่แชท
        </button>
      </>
    );
  }

  if (done) {
    return (
      <>
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
            ชำระเงิน
          </h1>
        </header>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4">
          <div className="text-6xl">✅</div>
          <p className="text-xl font-bold text-green-700">
            ยืนยันการโอนเรียบร้อย!
          </p>
          <p className="text-neutral-500">
            กรุณาส่งรูปสลิปเข้ามาในแชทส่วนตัวของบอท เพื่อให้ผู้ดูแลตรวจสอบ 🙏
          </p>
          <button
            onClick={goBack}
            className="w-full py-4 px-6 rounded-2xl text-xl font-bold text-white bg-green-600"
          >
            ไปที่แชทเพื่อส่งสลิป
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
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

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-neutral-500 mb-2">ยอดที่ต้องชำระ</p>
          <p className="text-5xl font-extrabold text-amber-600">
            ฿{Number(amount).toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://promptpay.io/${room.promptpayNo}/${Number(amount)}.png`} alt="PromptPay QR" className="mx-auto w-64 h-64" />
          <p className="text-sm text-neutral-500">
            สแกน QR Code เพื่อชำระเงินผ่าน PromptPay
          </p>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.download = `promptpay-${room.promptpayNo}.png`;
              link.href = `https://promptpay.io/${room.promptpayNo}/${Number(amount)}.png`;
              link.click();
            }}
            className="inline-block w-full py-3 px-6 rounded-xl text-base font-semibold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-center"
          >
            💾 บันทึก QR Code
          </button>
        </div>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-lg shadow-green-200 text-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {submitting ? "กำลังดำเนินการ..." : "✅ ยืนยันการโอน"}
        </button>

        <p className="text-xs text-neutral-400 text-center">
          กดยืนยันหลังจากโอนเงินแล้ว จากนั้นส่งสลิปในแชทบอท
        </p>
      </div>
    </>
  );
}
