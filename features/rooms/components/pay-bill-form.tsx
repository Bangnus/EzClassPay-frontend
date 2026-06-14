"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";

export default function PayBillForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          // 🚀 ซิงค์ข้อมูลผู้ใช้กับ Backend (Auto-Register + จัดการ Rich Menu)
          await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "pay_bill",
          });
        } else {
          if (liff.isInClient()) {
            liff.login();
          } else {
            console.log("รันบน Browser ปกติ - ข้ามการ Login");
            setProfile({
              displayName: "ผู้ทดสอบ (บนคอม)",
              pictureUrl: "https://via.placeholder.com/150",
              userId: "test_user_on_pc",
            });
          }
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      }
    };
    initLiff();
  }, []);

  const closeAndGoToChat = () => {
    if (liff.isInClient()) {
      liff.closeWindow();
    }
    window.location.href = `https://line.me/R/ti/p/${process.env.NEXT_PUBLIC_LINE_BOT_ID}`;
  };

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
          ชำระเงิน
        </h1>
        <p className="mt-2 text-neutral-500 text-lg">
          ตรวจสอบยอดและชำระเงินกองกลาง
        </p>
      </header>

      {profile && (
        <div className="mb-10 flex items-center gap-4 p-5 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-16 h-16 rounded-full ring-4 ring-white"
          />
          <div>
            <p className="text-xs text-neutral-500 font-medium tracking-wide">
              ผู้ใช้
            </p>
            <p className="text-xl font-bold text-neutral-900">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-neutral-500 mb-2">ยอดที่ต้องชำระ</p>
          <p className="text-4xl font-extrabold text-amber-600">—</p>
          <p className="text-sm text-neutral-400 mt-2">
            กรุณากลับไปที่แชทเพื่อเลือกรายการที่ต้องการชำระ
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={closeAndGoToChat}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg shadow-green-200 text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition duration-150 disabled:bg-gray-400 disabled:shadow-none"
          >
            กลับไปที่แชท
          </button>
        </div>
      </div>
    </>
  );
}
