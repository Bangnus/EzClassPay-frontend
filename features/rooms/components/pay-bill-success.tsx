import React from "react";
import Button from "@/components/ui/button";

interface PayBillSuccessProps {
  onGoBack: () => void;
}

export default function PayBillSuccess({ onGoBack }: PayBillSuccessProps) {
  return (
    <div className="animate-[fadeInUp_0.4s_ease-out]">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark shadow-button mb-4">
          <span className="text-3xl">💳</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          ชำระเงิน
        </h1>
      </header>

      {/* Success card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-secondary-light to-white border border-secondary/40 p-8 text-center space-y-4 shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,198,174,0.08),transparent_70%)]" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
            <span className="text-5xl">✅</span>
          </div>
          <p className="text-xl font-bold text-primary-dark">
            ยืนยันการโอนเรียบร้อย!
          </p>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            กรุณาส่งรูปสลิปเข้ามาในแชทส่วนตัวของบอท
            <br />
            เพื่อให้ผู้ดูแลตรวจสอบ 🙏
          </p>
        </div>

        <div className="relative pt-2">
          <Button
            onClick={onGoBack}
            type="primary"
            padding={16}
            fontSize={17}
            borderRadius={16}
            color="#00c6ae"
            className="shadow-button hover:shadow-floating transition-shadow duration-300"
          >
            ไปที่แชทเพื่อส่งสลิป
          </Button>
        </div>
      </div>
    </div>
  );
}
