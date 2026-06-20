import React, { useState } from "react";
import { generateBills } from "@/features/rooms/services";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

interface ManualBillGeneratorProps {
  roomId: string;
}

export default function ManualBillGenerator({ roomId }: ManualBillGeneratorProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [billMonth, setBillMonth] = useState(currentMonth.toString());
  const [billYear, setBillYear] = useState(currentYear.toString());
  const [generating, setGenerating] = useState(false);

  const handleGenerateBills = async () => {
    if (!confirm(`ยืนยันการสร้างบิลสำหรับเดือน ${billMonth}/${billYear} หรือไม่?`)) return;
    setGenerating(true);
    try {
      const result = await generateBills(roomId, Number(billMonth), Number(billYear));
      if (result?.success) {
        alert("สร้างบิลสำเร็จ");
      } else {
        alert(result?.message || "เกิดข้อผิดพลาดในการสร้างบิล");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสร้างบิล");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="pt-4 border-t border-border mt-4">
      <h3 className="font-bold text-text-primary mb-2 text-sm">สั่งสร้างบิลรอบเดือน</h3>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Select
            value={billMonth}
            onChange={(v) => setBillMonth(v as string)}
            options={Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: `เดือน ${i + 1}` }))}
          />
        </div>
        <div className="flex-1">
          <Select
            value={billYear}
            onChange={(v) => setBillYear(v as string)}
            options={[
              { value: currentYear.toString(), label: `ปี ${currentYear}` },
              { value: (currentYear + 1).toString(), label: `ปี ${currentYear + 1}` }
            ]}
          />
        </div>
        <div>
          <Button type="primary" onClick={handleGenerateBills} loading={generating} padding={10} borderRadius={12} fontSize={15}>
            สร้างบิล
          </Button>
        </div>
      </div>
    </div>
  );
}
