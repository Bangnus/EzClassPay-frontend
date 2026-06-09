import Image from "next/image";
import Undraw from '@/public/svg/undraw_post-online_cjn9.svg'
const STEPS_DATA = [
  {
    step: 1,
    title: "สร้างห้องเก็บเงิน",
    description: "กำหนดเป้าหมาย ตั้งชื่อห้อง และเลือกโหมดการเก็บเงิน (ยอดรวมก้อนเดียว หรือ เก็บรายเดือน) ได้ง่ายๆ ในไม่กี่คลิก"
  },
  {
    step: 2,
    title: "ชวนเพื่อนเข้าร่วม",
    description: "แชร์ลิงก์คำเชิญ หรือให้สมาชิกสแกน QR Code เพื่อกดเข้าร่วมห้องได้ทันที โดยไม่ต้องโหลดแอปพลิเคชันให้ยุ่งยาก"
  },
  {
    step: 3,
    title: "โอนเงินและส่งสลิป",
    description: "สมาชิกตรวจสอบยอดค้างชำระ สแกนโอนเงินเข้าบัญชีกองกลาง และอัปโหลดสลิปเข้าสู่ระบบเพื่อแจ้งชำระเงิน"
  },
  {
    step: 4,
    title: "ตรวจสอบและยืนยันยอด",
    description: "ผู้ดูแลตรวจสอบและกดยืนยันยอด ระบบจะอัปเดตยอดเงินให้ทุกคนทราบแบบเรียลไทม์"
  }
];

export default function HowIsWorks() {
  return (
    <div className="w-full px-[80px] py-16">
      <div className="flex justify-center flex-col items-center mb-16">
        <h1 className="text-4xl font-semibold mb-4">
          <span className="text-primary">วิธีการใช้งาน</span>{" "}
          <span className="text-text-primary">How it Works</span>
        </h1>
        <p className="text-lg font-normal text-text-secondary">
          เริ่มต้นจัดการเงินกองกลางได้ง่ายๆ พร้อมใช้งานจริงใน 4 ขั้นตอน
        </p>
      </div>

      <div className="flex items-center justify-between">
        {/* Left Side: Steps */}
        <div className="flex flex-col gap-4">
          {STEPS_DATA.map((item, index) => (
            <div key={index} className="flex gap-6 p-5 bg-white border border-gray-100 rounded-2xl shadow-soft hover:translate-x-4 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-normal shrink-0 border border-secondary">
                {item.step}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-medium text-text-primary">{item.title}</h3>
                <p className="text-base text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Image Placeholder */}
        <div className="flex justify-center">
        <Image src={Undraw} alt="undraw" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}