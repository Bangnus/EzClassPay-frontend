"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { notifyRoom } from "@/features/rooms/services";
import Spinner from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";

export default function NotifyForm() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      setErrorMsg("ไม่พบรหัสห้อง");
      return;
    }
    if (!title || !message) {
      setErrorMsg("กรุณากรอกหัวข้อและรายละเอียดให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await notifyRoom(roomId, { title, message, type });
      setSuccessMsg("ส่งข้อความแจ้งเตือนเข้ากลุ่มสำเร็จ!");
      setTitle("");
      setMessage("");
      setType("info");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "เกิดข้อผิดพลาดในการส่งแจ้งเตือน");
    } finally {
      setLoading(false);
    }
  };

  if (!roomId) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-xl font-bold text-red-600">เกิดข้อผิดพลาด</h2>
        <p className="text-text-secondary">ไม่พบรหัสห้อง (roomId) ใน URL</p>
      </div>
    );
  }

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out] space-y-6">
      <header className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark shadow-button mb-4">
          <span className="text-3xl">📢</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary">
          แจ้งเตือนกลุ่ม
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          ส่งข้อความประกาศตรงเข้าแชท LINE กลุ่ม
        </p>
      </header>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 text-center text-sm font-medium">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-center text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">
            ประเภทประกาศ
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType("info")}
              className={`py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${
                type === "info"
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-border text-text-secondary hover:border-primary/50"
              }`}
            >
              ทั่วไป
            </button>
            <button
              type="button"
              onClick={() => setType("warning")}
              className={`py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${
                type === "warning"
                  ? "bg-yellow-500 border-yellow-500 text-white"
                  : "bg-white border-border text-text-secondary hover:border-yellow-500/50"
              }`}
            >
              สำคัญ
            </button>
            <button
              type="button"
              onClick={() => setType("urgent")}
              className={`py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${
                type === "urgent"
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-white border-border text-text-secondary hover:border-red-600/50"
              }`}
            >
              ด่วนมาก
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">
            หัวข้อประกาศ
          </label>
          <Input
            type="text"
            placeholder="เช่น: งดเก็บเงินกองกลางชั่วคราว"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">
            รายละเอียด
          </label>
          <textarea
            placeholder="พิมพ์รายละเอียดที่ต้องการแจ้งลูกบ้านที่นี่..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-bg rounded-2xl px-5 py-4 text-text-primary placeholder:text-text-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none h-32"
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          className="w-full mt-4"
          padding={16}
        >
          {loading ? "กำลังส่ง..." : "ส่งเข้ากลุ่ม LINE"}
        </Button>
      </form>
      
      <div className="text-center">
        <button 
          onClick={() => window.history.back()}
          className="text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          type="button"
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}
