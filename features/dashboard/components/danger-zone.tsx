import React, { useState } from "react";
import { deleteRoom } from "@/features/rooms/services";

interface DangerZoneProps {
  roomId: string;
  onDeleted: () => void;
}

export default function DangerZone({ roomId, onDeleted }: DangerZoneProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "คำเตือน: คุณต้องการลบห้องนี้ทิ้งถาวรใช่หรือไม่?\n\nข้อมูลการจ่ายเงินและสมาชิกทั้งหมดในห้องนี้จะถูกลบและไม่สามารถกู้คืนได้"
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteRoom(roomId);
      alert("ลบห้องสำเร็จ");
      onDeleted();
    } catch (error) {
      alert("ไม่สามารถลบห้องได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 rounded-2xl p-5 border border-red-200 mb-4">
      <h2 className="text-red-800 font-bold text-lg mb-1">พื้นที่อันตราย (Danger Zone)</h2>
      <p className="text-red-600 text-sm mb-4">
        การลบห้องจะลบข้อมูลประวัติการเงิน สลิปโอนเงิน และรายชื่อสมาชิกทั้งหมดออกจากระบบอย่างถาวร
      </p>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "กำลังลบ..." : "ลบห้องกองกลางนี้ทิ้ง"}
      </button>
    </div>
  );
}
