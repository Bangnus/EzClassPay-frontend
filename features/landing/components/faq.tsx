import Accordion from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    title: "EzClassPay ใช้งานฟรีไหม?",
    description: "สำหรับ 'สมาชิก' ที่เข้าร่วมห้องเพื่อจ่ายเงินและส่งสลิป สามารถใช้งานได้ฟรี 100% ตลอดไป ส่วนผู้สร้างห้อง (Manager) จะมีแพ็กเกจรายเดือนเพื่อเข้าถึงฟีเจอร์การจัดการเชิงลึก โดยมีให้ทดลองใช้ฟรี 30 วันแรก",
    defaultOpen: true,
  },
  {
    title: "ต้องโหลดแอปพลิเคชันเพิ่มไหม?",
    description: "ไม่ต้องโหลดแอปใดๆ ทั้งสิ้น! คุณสามารถใช้งาน EzClassPay ได้ทันทีผ่าน LINE เพียงแค่แอด LINE OA @640skksf ทุกขั้นตอนตั้งแต่เข้าห้อง ส่งสลิป ไปจนถึงแจ้งเตือนจบในแชทเดียว",
  },
  {
    title: "รองรับการจ่ายเงินผ่านธนาคารไหนบ้าง?",
    description: "รองรับการโอนเงินจากทุกธนาคารในประเทศไทย รวมถึงการจ่ายผ่านระบบพร้อมเพย์ (PromptPay) เมื่อคุณโอนเงินเสร็จ เพียงแค่อัปโหลดสลิปเข้าระบบในแชท LINE ระบบก็จะบันทึกข้อมูลให้ทันที",
  },
  {
    title: "ข้อมูลการเงินและสลิปปลอดภัยไหม?",
    description: "ปลอดภัยสูงสุด เราไม่มีการผูกบัญชีธนาคารโดยตรงกับระบบ (ใช้แค่การแนบสลิป) ข้อมูลการทำธุรกรรมของคุณจะถูกเข้ารหัสและปกปิดข้อมูลส่วนตัว และไม่มีการนำข้อมูลไปให้บุคคลที่สาม",
  },
  {
    title: "ถ้ามีสมาชิกเยอะๆ ระบบจะรวนไหม?",
    description: "ระบบของเรารองรับสมาชิกต่อห้องจำนวนมาก ข้อมูลถูกเก็บอยู่บน Cloud Database ที่เสถียรและสามารถอัปเดตสถานะการจ่ายเงินแบบเรียลไทม์ได้อย่างลื่นไหล ไม่ต้องกังวลเรื่องคนเยอะ",
  },
];

export default function FAQ() {
  return (
    <div className="w-full px-[80px] max-md:px-6 py-20 max-md:py-12 bg-gray-50/30">
      <div className="flex flex-col items-center mb-16 max-md:mb-10 text-center">
        <h2 className="text-4xl max-md:text-2xl font-semibold mb-4 max-md:mb-2">
          คำถามที่พบบ่อย (FAQ)
        </h2>
        <p className="text-lg max-md:text-base font-normal text-text-secondary">
          คลายทุกข้อสงสัยก่อนเริ่มใช้งาน
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {FAQ_DATA.map((item, index) => (
          <Accordion
            key={index}
            title={item.title}
            defaultOpen={item.defaultOpen}
            icon={<HelpCircle className="w-6 h-6 text-primary" />}
          >
            {item.description}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
