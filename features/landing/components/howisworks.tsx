import Image from "next/image";
import Undraw from "@/public/svg/undraw_post-online_cjn9.svg";
const STEPS_DATA = [
  {
    step: 1,
    title: "เพิ่มเพื่อน LINE OA",
    description:
      "แอดไลน์ @ClassPay เพื่อเริ่มต้นการใช้งาน และสร้างห้องเก็บเงินได้ทันทีในแชท",
  },
  {
    step: 2,
    title: "ชวนเพื่อนเข้าร่วมกลุ่ม",
    description:
      "เชิญเพื่อนเข้ากลุ่ม LINE หรือแชร์ลิงก์ให้เพื่อนกดเข้าร่วมห้องเก็บเงินเพื่อจัดการค่าใช้จ่ายร่วมกัน",
  },
  {
    step: 3,
    title: "โอนเงินและส่งสลิป",
    description:
      "สมาชิกตรวจสอบยอดค้างชำระ สแกนโอนเงินเข้าบัญชีกองกลาง และอัปโหลดสลิปเข้าสู่ระบบใน LINE",
  },
  {
    step: 4,
    title: "ตรวจสอบและแจ้งเตือน",
    description:
      "ผู้ดูแลตรวจสอบและยืนยันยอด ระบบจะแจ้งเตือนและอัปเดตยอดเงินให้ทุกคนทราบแบบเรียลไทม์",
  },
];

export default function HowIsWorks() {
  return (
    <div id="how-it-works" className="w-full px-[80px] max-md:px-6 py-16 max-md:py-10">
      <div className="flex justify-center flex-col items-center mb-16 max-md:mb-10 text-center">
        <h1 className="text-4xl max-md:text-2xl font-semibold mb-4 max-md:mb-2">
          <span className="text-primary">วิธีการใช้งาน</span>{" "}
          <span className="text-text-primary">How it Works</span>
        </h1>
        <p className="text-lg max-md:text-base font-normal text-text-secondary">
          เริ่มต้นจัดการเงินกองกลางได้ง่ายๆ พร้อมใช้งานจริงใน 4 ขั้นตอน
        </p>
      </div>

      <div className="flex max-md:flex-col-reverse items-center justify-between max-md:gap-8">
        {/* Left Side: Steps */}
        <div className="flex flex-col gap-4">
          {STEPS_DATA.map((item, index) => (
            <div
              key={index}
              className="flex gap-6 max-md:gap-4 p-5 max-md:p-4 bg-white border border-gray-100 rounded-2xl shadow-soft hover:translate-x-4 max-md:hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <div className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-full bg-primary text-white flex items-center justify-center text-xl max-md:text-lg font-normal shrink-0 border border-secondary">
                {item.step}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl max-md:text-lg font-medium text-text-primary">
                  {item.title}
                </h3>
                <p className="text-base max-md:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Image Placeholder */}
        <div className="flex justify-center max-md:hidden">
          <Image src={Undraw} alt="undraw" className="w-[300px] h-auto" />
        </div>
      </div>
    </div>
  );
}
