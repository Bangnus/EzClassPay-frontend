import { GraduationCap, Plane, Building2 } from "lucide-react";

const USE_CASES = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "เหรัญญิกห้องเรียน / มหาลัย",
    description: "เก็บเงินห้อง เงินกีฬาสี เงินรุ่น หมดปัญหาเพื่อนลืมจ่าย เช็คยอดได้ตลอดเวลา",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Plane className="w-8 h-8 text-orange-500" />,
    title: "แก๊งเพื่อนเที่ยว",
    description: "รวมกองกลางทริปเที่ยว ใครจ่ายอะไรไปก่อนเคลียร์ง่าย ไม่ต้องมานั่งจำเอง",
    bgColor: "bg-orange-50",
  },
  {
    icon: <Building2 className="w-8 h-8 text-green-500" />,
    title: "ออฟฟิศ / ที่ทำงาน",
    description: "แชร์ค่าข้าว ค่าขนม หรือเก็บเงินซื้อของขวัญวันเกิดให้เพื่อนร่วมงาน",
    bgColor: "bg-green-50",
  },
];

export default function UseCases() {
  return (
    <div className="w-full px-[80px] py-20 bg-gray-50/50">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl font-semibold mb-4">
          ตอบโจทย์ทุก <span className="text-primary">กลุ่ม</span> ของคุณ
        </h2>
        <p className="text-lg font-normal text-text-secondary max-w-2xl">
          ไม่ว่าคุณจะรวมกลุ่มกันทำกิจกรรมอะไร EzClassPay ก็พร้อมช่วยให้การจัดการเงินเป็นเรื่องง่ายสำหรับทุกคน
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {USE_CASES.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft hover:-translate-y-2 transition-transform duration-300"
          >
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-4 ${item.bgColor}`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-medium text-text-primary mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
