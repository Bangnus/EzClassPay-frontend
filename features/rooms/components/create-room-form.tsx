"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { createRoom } from "../services";
import { syncUserWithBackend } from "@/services/auth";

export default function CreateRoomForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lineGroupId, setLineGroupId] = useState<string | null>(null);
  const [groupDetected, setGroupDetected] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    collection_type: "MONTHLY",
    amount: "",
    promptpay_no: "",
  });

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
            action: "create_room",
          });

          // 🟢 ดึงข้อมูลว่าเปิดจากกลุ่มไหน
          const context = liff.getContext();
          const urlParams = new URLSearchParams(window.location.search);
          const groupId = urlParams.get("groupId") || context?.groupId || null;

          console.log("🔍 LIFF Debug:", {
            url: window.location.href,
            search: window.location.search,
            contextType: context?.type,
            groupIdFromUrl: urlParams.get("groupId"),
            groupIdFromContext: context?.groupId,
            finalGroupId: groupId,
          });

          if (groupId) {
            setLineGroupId(groupId);
          } else {
            setGroupDetected(false);
          }
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      }
    };
    initLiff();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const payload = {
        line_uid: profile.userId,
        name: formData.name,
        collection_type: formData.collection_type,
        total_target_amount:
          formData.collection_type === "TARGET" ? Number(formData.amount) : null,
        periodic_amount:
          formData.collection_type === "MONTHLY" ? Number(formData.amount) : null,
        promptpay_no: formData.promptpay_no,
        ...(lineGroupId ? { line_group_id: lineGroupId } : {}),
      };

      await createRoom(payload);

      liff.closeWindow();
    } catch (err) {
      console.error(err);

      const errorObj = err as Error & { response?: { status?: number; data?: { message?: string } } };

      if (errorObj?.response?.status === 400) {
        alert("กลุ่มนี้มีการตั้งห้องกองกลางไว้แล้ว ไม่สามารถสร้างซ้ำได้ครับ");
      } else if (errorObj?.message) {
        alert(errorObj.message);
      } else {
        alert("เกิดข้อผิดพลาด ระบบไม่สามารถสร้างห้องได้ในขณะนี้");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
          สร้างห้องใหม่
        </h1>
        <p className="mt-2 text-neutral-500 text-lg">
          กรอกรายละเอียดเพื่อเริ่มต้นเก็บเงินกองกลาง
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
              ผู้สร้าง
            </p>
            <p className="text-xl font-bold text-neutral-900">
              {profile.displayName}
            </p>
          </div>
        </div>
      )}

      {!groupDetected && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 space-y-2">
          <p className="font-bold">⚠️ ไม่พบข้อมูลกลุ่ม LINE</p>
          <p>ห้องนี้จะถูกสร้างโดยไม่เชื่อมกับกลุ่ม LINE คุณสามารถเชื่อมกลุ่มทีหลังได้จากเมนูจัดการห้อง</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="text-sm font-semibold text-neutral-600">
            ชื่อห้องเก็บเงิน
          </label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            maxLength={50}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
            placeholder="เช่น กองกลางห้อง 6/1, ค่าเสื้อรุ่น"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">
            ประเภทการเก็บเงิน
          </label>
          <select
            name="collection_type"
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
          >
            <option value="MONTHLY">ยอดคงที่ (เก็บเรื่อยๆ เช่น รายเดือน)</option>
            <option value="TARGET">
              มีเป้าหมายรวม (เก็บทีเดียว เช่น ค่าเที่ยว)
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">
            {formData.collection_type === "TARGET"
              ? "ยอดเป้าหมายรวม (บาท)"
              : "ยอดเก็บต่อรอบ (บาท)"}
          </label>
          <input
            type="number"
            name="amount"
            required
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">
            เบอร์พร้อมเพย์ที่รับเงิน
          </label>
          <input
            type="text"
            name="promptpay_no"
            required
            onChange={handleChange}
            maxLength={13}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 px-5 py-3.5 shadow-sm text-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
            placeholder="08X-XXX-XXXX หรือ เลขบัตรฯ"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || !profile}
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                กำลังสร้าง...
              </>
            ) : (
              "ยืนยันการสร้างห้อง"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
