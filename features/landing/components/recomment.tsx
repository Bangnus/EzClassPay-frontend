import RecommendCard from "./recommend-card";
import { UserPlus, Target, Search, BadgeCheck } from "lucide-react";

const RECOMMEND_DATA = [
  {
    title: "ใช้งานผ่าน LINE 100%",
    description:
      "ไม่ต้องโหลดแอปเพิ่ม จัดการทุกอย่างผ่านแชท LINE ที่คุณคุ้นเคยได้ทันที",
    icon: <UserPlus className="text-[#d48806] w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-[#fffbe6]",
  },
  {
    title: "สร้างห้อง & ชวนเพื่อน",
    description:
      "สร้างห้องเก็บเงินและเชิญเพื่อนผ่าน LINE หรือแชร์ลิงก์ให้กดเข้าร่วมได้ง่ายๆ",
    icon: <Target className="text-blue-600 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-blue-100",
  },
  {
    title: "ติดตามยอดและแจ้งเตือน",
    description:
      "เช็คประวัติการจ่ายและรับการแจ้งเตือนผ่าน LINE ทันที หมดปัญหาลืมโอนเงิน",
    icon: <Search className="text-green-500 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-green-100",
  },
  {
    title: "ส่งสลิปง่าย ตรวจไว",
    description:
      "โอนผ่าน QR Code และส่งสลิปเข้าระบบในแชท ผู้ดูแลตรวจสอบและอนุมัติยอดได้รวดเร็ว",
    icon: <BadgeCheck className="text-purple-500 w-8 h-8" strokeWidth={1.5} />,
    iconBg: "bg-purple-100",
  },
];

export default function Recomment() {
  return (
    <div id="features" className="relative w-full">
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
