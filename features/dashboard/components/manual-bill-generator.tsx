import React, { useState } from "react";
import { generateBills } from "@/features/rooms/services";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { message } from "antd";

interface ManualBillGeneratorProps {
  roomId: string;
}

export default function ManualBillGenerator({ roomId }: ManualBillGeneratorProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [billMonth, setBillMonth] = useState(currentMonth.toString());
  const [billYear, setBillYear] = useState(currentYear.toString());
  const [generating, setGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateBills = async () => {
    setGenerating(true);
    try {
      const result = await generateBills(roomId, Number(billMonth), Number(billYear));
      if (result?.success) {
        message.success("สร้างบิลสำเร็จ");
        setIsModalOpen(false);
      } else {
        message.error(result?.message || "เกิดข้อผิดพลาดในการสร้างบิล");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสร้างบิล");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="pt-4 border-t border-border mt-4">
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)} 
        padding={20}
        borderRadius={12} 
        fontSize={15}
      >
        สั่งสร้างบิลรอบเดือน
      </Button>

      <Modal
        title={<div className="text-center font-bold text-lg mb-4">สั่งสร้างบิลรอบเดือน</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            เลือกเดือนและปีที่ต้องการสร้างบิล ระบบจะสร้างบิลให้กับสมาชิกทุกคนในห้อง
          </p>
          <div className="flex gap-2">
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
          </div>
          <div className="flex gap-2 mt-4">
            <div className="flex-1">
              <Button 
                type="default" 
                onClick={() => setIsModalOpen(false)} 
                className="!h-[46px] w-full" 
                borderRadius={12} 
                fontSize={15}
              >
                ยกเลิก
              </Button>
            </div>
            <div className="flex-1">
              <Button 
                type="primary" 
                onClick={handleGenerateBills} 
                loading={generating} 
                className="!h-[46px] w-full" 
                borderRadius={12} 
                fontSize={15}
              >
                ยืนยันสร้างบิล
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
