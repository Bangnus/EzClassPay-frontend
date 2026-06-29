"use client";

import { useBillList } from "../hooks/use-bill-list";
import Spinner from "@/components/ui/spinner";
import Button from "@/components/ui/button";

const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export default function BillListForm() {
  const { profile, room, bills, loading, roomId } = useBillList();

  if (loading) return <Spinner text="กำลังโหลดรายการบิล..." />;

  if (!room) {
    return (
      <div className="text-center py-10 space-y-4 animate-[fadeInUp_0.4s_ease-out]">
        <div className="text-4xl">❌</div>
        <h2 className="text-xl font-bold text-text-primary">ไม่พบข้อมูลห้อง</h2>
        <p className="text-text-secondary text-sm">
          กรุณาเปิดจากเมนูใน LINE หรือลองใหม่อีกครั้ง
        </p>
      </div>
    );
  }

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out] space-y-6">
      {/* Header */}
      <header className="text-center relative">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark shadow-button mb-4">
          <span className="text-3xl">🧾</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          งวดชำระทั้งหมด
        </h1>
        <p className="mt-1.5 text-md text-text-secondary font-medium">
          {room.name}
        </p>
      </header>


      {/* Bills List */}
      <div className="space-y-4">
        {bills.length === 0 ? (
          <div className="bg-bg rounded-2xl p-10 text-center border border-border">
            <p className="text-text-secondary">ยังไม่มีงวดชำระเงิน</p>
          </div>
        ) : (
          bills.map((bill) => {
            const isUnpaid = bill.status === "UNPAID";
            const monthStr =
              bill.month && bill.year
                ? `${THAI_MONTHS[bill.month - 1]} ${bill.year + 543}`
                : "-";

            return (
              <div
                key={bill.id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-text-primary">
                      รอบเดือน: {monthStr}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      บิลเลขที่: {bill.id.substring(0, 8)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isUnpaid
                        ? "text-red-600 bg-red-50"
                        : bill.status === "PAID"
                          ? "text-green-600 bg-green-50"
                          : "text-text-secondary bg-border"
                    }`}
                  >
                    {isUnpaid
                      ? "ค้างชำระ"
                      : bill.status === "PAID"
                        ? "ชำระแล้ว"
                        : bill.status}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-bg/50 rounded-lg p-2 border border-border">
                  <p className="text-sm font-bold text-text-primary">
                    ยอดเงิน: ฿{Number(bill.amount).toLocaleString()}
                  </p>
                </div>

                {isUnpaid && (
                  <Button
                    type="primary"
                    padding="20"
                    onClick={() => {
                      // Navigate to pay specific bill
                      const url = new URL(window.location.href);
                      url.searchParams.delete("view");
                      url.searchParams.set("billId", bill.id);
                      window.location.href = url.toString();
                    }}
                  >
                    ชำระเงินงวดนี้
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
