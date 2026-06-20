import React, { useState } from "react";
import { Room } from "@/features/rooms/types";
import { updateRoom } from "@/features/rooms/services";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

interface RoomOverviewCardProps {
  room: Room;
  onUpdate: () => void;
}

export default function RoomOverviewCard({
  room,
  onUpdate,
}: RoomOverviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState(
    room.collectionType === "TARGET"
      ? room.totalTargetAmount?.toString() || ""
      : room.periodicAmount.toString()
  );

  const [autoBilling, setAutoBilling] = useState(
    room.autoBillingEnabled ? "AUTO" : "MANUAL"
  );
  const [billingDay, setBillingDay] = useState(
    room.billingDayOfMonth?.toString() || "1"
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: Partial<Room> = {
        autoBillingEnabled: autoBilling === "AUTO",
        billingDayOfMonth: autoBilling === "AUTO" ? Number(billingDay) : null,
      };

      if (room.collectionType === "TARGET") {
        payload.totalTargetAmount = Number(amount);
      } else {
        payload.periodicAmount = Number(amount);
      }

      await updateRoom(room.id, payload);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const daysOptions = Array.from({ length: 28 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `วันที่ ${i + 1} ของเดือน`,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{room.name}</h2>
          <p className="text-sm text-text-secondary mt-1">
            PromptPay: {room.promptpayNo}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary text-sm font-bold bg-bg px-3 py-1.5 rounded-lg hover:bg-secondary-light transition-colors"
          >
            ตั้งค่า
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 pt-2 border-t border-border mt-2">
          <Input
            label={
              room.collectionType === "TARGET"
                ? "ยอดเป้าหมายรวม (บาท)"
                : "ยอดเก็บต่อรอบ (บาท)"
            }
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Select
            label="ระบบส่งบิลเรียกเก็บเงิน"
            value={autoBilling}
            onChange={(v) => setAutoBilling(v as string)}
            options={[
              { value: "AUTO", label: "อัตโนมัติ (ระบบส่งบิลให้ทุกเดือน)" },
              { value: "MANUAL", label: "กำหนดเอง (ผู้จัดการกดส่งเอง)" },
            ]}
          />

          {autoBilling === "AUTO" && (
            <Select
              label="กำหนดวันส่งบิล"
              value={billingDay}
              onChange={(v) => setBillingDay(v as string)}
              options={daysOptions}
            />
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="primary"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              บันทึก
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-[15px] pt-4 border-t border-border mt-2">
          <div className="flex justify-between">
            <span className="text-text-secondary">ประเภท:</span>
            <span className="font-medium text-text-primary">
              {room.collectionType === "TARGET"
                ? "เป้าหมายรวม"
                : "ยอดคงที่รายเดือน"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">ยอดเงิน:</span>
            <span className="font-bold text-primary">
              ฿
              {room.collectionType === "TARGET"
                ? Number(room.totalTargetAmount || 0).toLocaleString()
                : Number(room.periodicAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">การส่งบิล:</span>
            <span className="font-medium text-text-primary">
              {room.autoBillingEnabled
                ? `อัตโนมัติ (ทุกวันที่ ${room.billingDayOfMonth || 1})`
                : "กำหนดเอง"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
