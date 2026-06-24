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
    <div className="space-y-5">
      {/* Amount display */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-secondary-light to-white border border-secondary/40 p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,198,174,0.06),transparent_70%)]" />
        <p className="relative text-sm text-text-secondary font-medium mb-1.5">
          ยอดที่ต้องชำระ
        </p>
        <p className="relative text-4xl font-extrabold text-primary-dark tracking-tight">
          ฿{Number(amount).toLocaleString()}
        </p>
      </div>

      {/* QR Code card */}
      <div className="rounded-2xl bg-white border border-border p-6 text-center space-y-4 shadow-soft">
        <div className="rounded-xl bg-neutral-50 p-4 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://promptpay.io/${room.promptpayNo}/${Number(amount)}.png`}
            alt="PromptPay QR"
            className="mx-auto w-56 h-56"
          />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          สแกน QR Code เพื่อชำระเงินผ่าน{" "}
          <span className="font-semibold text-primary-dark">PromptPay</span>
        </p>
        <Button
          onClick={handleDownloadQR}
          type="default"
          padding={10}
          className="border-border text-text-secondary hover:text-primary-dark hover:border-primary transition-colors"
        >
          💾 บันทึก QR Code
        </Button>
      </div>

      {/* Confirm button */}
      <div className="pt-1">
        <Button
          onClick={onConfirm}
          disabled={submitting}
          loading={submitting}
          type="primary"
          padding={16}
          fontSize={17}
          borderRadius={16}
          color="#00c6ae"
          className="shadow-button hover:shadow-floating transition-shadow duration-300"
        >
          ✅ ยืนยันการโอน
        </Button>
      </div>

      <p className="text-xs text-text-secondary text-center leading-relaxed opacity-70">
        กดยืนยันหลังจากโอนเงินแล้ว จากนั้นส่งสลิปในแชทบอท
      </p>
    </div>
  );
}
