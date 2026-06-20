import React from "react";
import Button from "@/components/ui/button";

interface PayBillNotFoundProps {
  onGoBack: () => void;
}

export default function PayBillNotFound({ onGoBack }: PayBillNotFoundProps) {
  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ชำระเงิน
        </h1>
      </header>
      <div className="text-center py-10 text-neutral-500">
        ไม่พบข้อมูลห้อง กรุณากลับไปที่แชท
      </div>
      <Button
        onClick={onGoBack}
        type="primary"
        padding={16}
        fontSize={18}
        borderRadius={16}
      >
        กลับไปที่แชท
      </Button>
    </>
  );
}
