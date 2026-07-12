import { Check } from "lucide-react";
import Button from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="w-full px-[80px] py-24 bg-white">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl font-semibold mb-4">
          เลือกแพ็กเกจที่เหมาะกับคุณ
        </h2>
        <p className="text-lg font-normal text-text-secondary">
          เริ่มต้นใช้งานฟรีสำหรับสมาชิกทุกคน และฟีเจอร์จัดเต็มสำหรับผู้จัดการห้อง
        </p>
      </div>

      <div className="flex justify-center gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="w-1/2 rounded-3xl border-2 border-gray-200 p-10 shadow-md bg-white hover:border-gray-300 transition-colors">
          <h3 className="text-2xl font-semibold text-text-primary mb-2">Member (สมาชิก)</h3>
          <p className="text-text-secondary mb-6">สำหรับผู้ที่ต้องการเข้าร่วมห้องและโอนเงิน</p>
          <div className="mb-8">
            <span className="text-5xl font-bold">ฟรี</span>
            <span className="text-text-secondary ml-2">ตลอดการใช้งาน</span>
          </div>
          <ul className="divide-y divide-gray-100 mb-10">
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>เข้าร่วมห้องเก็บเงินได้ไม่จำกัด</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>ตรวจสอบยอดค้างชำระของตัวเองได้ตลอด</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>ส่งสลิปผ่าน LINE อัตโนมัติ</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>รับการแจ้งเตือนเมื่อมีการอัปเดต</span>
            </li>
          </ul>
          <Button type="default" padding={12} href="https://line.me/R/ti/p/@ClassPay" target="_blank">
            เริ่มใช้งานฟรี
          </Button>
        </div>

        {/* Manager Plan */}
        <div className="w-1/2 rounded-3xl border-2 border-primary p-10 shadow-lg bg-primary/5 relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            แนะนำ
          </div>
          <h3 className="text-2xl font-semibold text-text-primary mb-2">Manager (หัวหน้าห้อง)</h3>
          <p className="text-text-secondary mb-6">ฟีเจอร์ครบครันเพื่อการจัดการเงินกลุ่มที่ง่ายที่สุด</p>
          <div className="mb-8">
            <span className="text-5xl font-bold">฿69</span>
            <span className="text-text-secondary ml-2">/ เดือน</span>
          </div>
          <ul className="divide-y divide-gray-200/60 mb-10">
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="font-medium text-text-primary">ทดลองใช้ฟรี 30 วันแรก!</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>สิทธิ์ในการสร้างห้องเก็บเงิน 2 ห้อง</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>สร้างห้องเพิ่ม จ่ายเพิ่มเพียงห้องละ 99 บาท</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>สรุปรายงานรายรับ-รายจ่าย รายเดือน/ปี</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>ระบบตรวจสอบสลิปอัตโนมัติ</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary py-4">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>จัดการสมาชิกและยอดเงินแบบเรียลไทม์</span>
            </li>
          </ul>
          <Button type="primary" padding={12} href="https://line.me/R/ti/p/@ClassPay" target="_blank">
            ทดลองใช้ฟรี 30 วัน
          </Button>
        </div>
      </div>
    </div>
  );
}
