import React, { useState } from "react";
import { Room } from "@/features/rooms/types";
import { updateRoom } from "@/features/rooms/services";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

interface RoomSettingsFormProps {
  room: Room;
  onSave: () => void;
  onCancel: () => void;
}

export default function RoomSettingsForm({
  room,
  onSave,
  onCancel,
}: RoomSettingsFormProps) {
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
  const [promptpayNo, setPromptpayNo] = useState(room.promptpayNo || "");

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: Partial<Room> = {
        autoBillingEnabled: autoBilling === "AUTO",
        billingDayOfMonth: autoBilling === "AUTO" ? Number(billingDay) : null,
        promptpayNo,
      };

      if (room.collectionType === "TARGET") {
        payload.totalTargetAmount = Number(amount);
      } else {
        payload.periodicAmount = Number(amount);
      }

      await updateRoom(room.id, payload);
      onSave();
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
    <div className="space-y-4 pt-2 border-t border-border mt-2">
      <Input
        label="เลขบัญชีพร้อมเพย์"
        type="text"
        value={promptpayNo}
        onChange={(e) => setPromptpayNo(e.target.value)}
        placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
      />

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
          type="default"
          onClick={onCancel}
          disabled={loading}
          padding={10}
          borderRadius={12}
          fontSize={15}
        >
          ยกเลิก
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          loading={loading}
          padding={10}
          borderRadius={12}
          fontSize={15}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
