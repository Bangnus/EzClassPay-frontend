import React, { useState } from "react";
import { Room } from "@/features/rooms/types";
import RoomSettingsForm from "./room-settings-form";
import ManualBillGenerator from "./manual-bill-generator";

interface RoomOverviewCardProps {
  room: Room;
  onUpdate: () => void;
}

export default function RoomOverviewCard({
  room,
  onUpdate,
}: RoomOverviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);

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
            className="text-primary text-sm font-bold bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-secondary-light transition-colors"
          >
            ตั้งค่า
          </button>
        )}
      </div>

      {isEditing ? (
        <RoomSettingsForm
          room={room}
          onSave={() => {
            setIsEditing(false);
            onUpdate();
          }}
          onCancel={() => setIsEditing(false)}
        />
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

          {room.collectionType === "MONTHLY" && (
            <ManualBillGenerator roomId={room.id} />
          )}
        </div>
      )}
    </div>
  );
}
