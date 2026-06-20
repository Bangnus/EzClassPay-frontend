import React from "react";
import Button from "@/components/ui/button";

interface PayBillQRProps {
  room: {
    promptpayNo: string;
  };
  amount: number;
  submitting: boolean;
  onConfirm: () => void;
}

export default function PayBillQR({
  room,
  amount,
  submitting,
  onConfirm,
}: PayBillQRProps) {
  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.download = `promptpay-${room.promptpayNo}.png`;
    link.href = `https://promptpay.io/${room.promptpayNo}/${Number(amount)}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="text-neutral-500 mb-2">ยอดที่ต้องชำระ</p>
        <p className="text-5xl font-extrabold text-amber-600">
          ฿{Number(amount).toLocaleString()}
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://promptpay.io/${room.promptpayNo}/${Number(amount)}.png`}
          alt="PromptPay QR"
          className="mx-auto w-64 h-64"
        />
        <p className="text-sm text-neutral-500">
          สแกน QR Code เพื่อชำระเงินผ่าน PromptPay
        </p>
        <Button
          onClick={handleDownloadQR}
          type="default"
          padding={12}
          className="border-orange-200 text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100"
        >
          💾 บันทึก QR Code
        </Button>
      </div>

      <Button
        onClick={onConfirm}
        disabled={submitting}
        loading={submitting}
        type="primary"
        padding={16}
        fontSize={18}
        borderRadius={16}
      >
        ✅ ยืนยันการโอน
      </Button>

      <p className="text-xs text-neutral-400 text-center">
        กดยืนยันหลังจากโอนเงินแล้ว จากนั้นส่งสลิปในแชทบอท
      </p>
    </div>
  );
}
