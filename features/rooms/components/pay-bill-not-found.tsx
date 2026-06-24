import React from "react";
import Button from "@/components/ui/button";

interface PayBillNotFoundProps {
  onGoBack: () => void;
}

export default function PayBillNotFound({ onGoBack }: PayBillNotFoundProps) {
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

      {/* Not found card */}
      <div className="rounded-2xl bg-white border border-border p-8 text-center space-y-3 shadow-soft">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-1">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-base font-semibold text-text-primary">
          ไม่พบข้อมูลห้อง
        </p>
        <p className="text-sm text-text-secondary">
          กรุณากลับไปที่แชทแล้วลองอีกครั้ง
        </p>
      </div>

      <div className="mt-6">
        <Button
          onClick={onGoBack}
          type="primary"
          padding={16}
          fontSize={17}
          borderRadius={16}
          color="#00c6ae"
          className="shadow-button hover:shadow-floating transition-shadow duration-300"
        >
          กลับไปที่แชท
        </Button>
      </div>
    </div>
  );
}
