import RecommendCard from "./recommend-card";
import { UserPlus, Target, Search, BadgeCheck } from "lucide-react";

const RECOMMEND_DATA = [
  {
    title: "สร้างห้อง & ชวนเพื่อน",
    description:
      "สร้างห้องเก็บเงินในไม่กี่คลิก แล้วชวนเพื่อนเข้าร่วมผ่านลิงก์หรือสแกน QR Code ได้ทันที",
    icon: <UserPlus className="text-[#d48806] w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-[#fffbe6]",
  },
  {
    title: "ตั้งโหมดเก็บเงินได้อิสระ",
    description:
      "ยืดหยุ่นกว่า จะกำหนดยอดรวมเป้าหมายทีเดียว หรือตั้งเป้าเก็บเงินรายเดือนก็ทำได้ตามใจ",
    icon: <Target className="text-blue-600 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-blue-100",
  },
  {
    title: "ติดตามยอดค้างชำระ",
    description:
      "เช็คประวัติการจ่ายได้เรียลไทม์ ระบบแสดงยอดที่ขาดจ่ายชัดเจน หมดปัญหาลืมโอนเงิน",
    icon: <Search className="text-green-500 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-green-100",
  },
  {
    title: "จ่ายสะดวก ตรวจสลิปไว",
    description:
      "รองรับการโอนผ่าน QR Code เมื่ออัปโหลดสลิปผู้ดูแลสามารถตรวจสอบและอนุมัติยอดได้เลย",
    icon: <BadgeCheck className="text-purple-500 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-purple-100",
  },
];

export default function Recomment() {
  return (
    <div className="relative w-full">
      {/* Background Container */}
      <div className="bg-primary h-[400px] w-full flex justify-center">
        <div className="flex flex-col items-center mt-20">
          <p className="text-[36px] font-semibold text-white mb-4">
            ตัวช่วยที่ทำให้การเก็บเงินเป็นเรื่องง่าย
          </p>
          <p className="text-lg text-white/90 font-normal">
            จัดการเงินในแก๊งเพื่อน ห้องเรียน หรือทีมของคุณได้อย่างเป็นระบบ
          </p>
          <p className="text-lg text-white/90 font-normal">
            ด้วยเครื่องมือที่ใช้งานง่ายและสะดวกที่สุด
          </p>
        </div>
      </div>

      {/* Cards Overlapping */}
      <div className="w-full flex justify-center gap-6 px-20 -mt-[120px] relative z-10 mb-24">
        {RECOMMEND_DATA.map((data, index) => (
          <RecommendCard key={index} {...data} />
        ))}
      </div>
    </div>
  );
}
