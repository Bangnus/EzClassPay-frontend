"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { createExpense } from "../services";
import { uploadImage } from "@/lib/upload";

export default function ExpenseForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_EXPENSE as string });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "create_room",
          });
        } else {
          if (liff.isInClient()) {
            liff.login();
          } else {
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

    const params = new URLSearchParams(window.location.search);
    const rid = params.get("roomId");
    if (rid) {
      setRoomId(rid);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !file || !roomId) return;

    setLoading(true);
    try {
      const receiptUrl = await uploadImage(file);

      await createExpense({
        roomId,
        title,
        amount: Number(amount),
        receipt_url: receiptUrl,
      });

      liff.closeWindow();
    } catch (err) {
      console.error(err);

      const errorObj = err as Error & { response?: { status?: number; data?: { message?: string } } };

      if (errorObj?.response?.status === 400) {
        alert("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      } else if (errorObj?.message) {
        alert(errorObj.message);
      } else {
        alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกรายจ่ายได้");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
          บันทึกรายจ่าย
        </h1>
        <p className="mt-2 text-neutral-500 text-lg">
          กรอกข้อมูลรายจ่ายของห้องกองกลาง
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
              ผู้บันทึก
            </p>
            <p className="text-xl font-bold text-neutral-900">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-neutral-600">
            ชื่อรายการ
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
            placeholder="เช่น ค่าอาหาร, ค่าของตกแต่งห้อง"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">
            จำนวนเงิน (บาท)
          </label>
          <input
            type="number"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">
            อัปโหลดรูปใบเสร็จ/หลักฐาน
          </label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-50 file:text-green-700 file:font-semibold hover:file:bg-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || !profile || !file || !roomId}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg shadow-green-200 text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition duration-150 disabled:bg-gray-400 disabled:shadow-none"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกรายจ่าย"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
