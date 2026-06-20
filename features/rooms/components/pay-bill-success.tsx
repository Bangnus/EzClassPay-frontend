import React from "react";
import Button from "@/components/ui/button";

interface PayBillSuccessProps {
  onGoBack: () => void;
}

export default function PayBillSuccess({ onGoBack }: PayBillSuccessProps) {
  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ชำระเงิน
        </h1>
      </header>
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center space-y-4">
        <div className="text-6xl">✅</div>
        <p className="text-xl font-bold text-primary">
          ยืนยันการโอนเรียบร้อย!
        </p>
        <p className="text-neutral-500">
          กรุณาส่งรูปสลิปเข้ามาในแชทส่วนตัวของบอท เพื่อให้ผู้ดูแลตรวจสอบ 🙏
        </p>
        <Button
          onClick={onGoBack}
          type="primary"
          padding={16}
          fontSize={18}
          borderRadius={16}
        >
          ไปที่แชทเพื่อส่งสลิป
        </Button>
      </div>
    </>
  );
}
