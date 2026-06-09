import Image from "next/image";
import Undrawsetup from "@/public/svg/undraw_setup_fzje.svg";
import Shield from "@/public/images/icons/shield.png";
import Loupe from "@/public/images/icons/loupe.png";
import DataProtection from "@/public/images/icons/data-protection.png";
import Accordion from "@/components/ui/accordion";

const SECURITY_DATA = [
  {
    title: "โปร่งใส ตรวจสอบประวัติได้ 100% (Full Transparency)",
    description:
      'ระบบบันทึกทุกการเคลื่อนไหว สมาชิกสามารถตรวจสอบประวัติการส่งสลิป และยอดค้างชำระของตัวเองได้แบบเรียลไทม์ตลอด 24 ชั่วโมง หมดปัญหาความขัดแย้งและคำถามที่ว่า "เงินหายไปไหน"',
    icon: <Image src={Loupe} alt="loupe" width={25} height={25} />,
    defaultOpen: true,
  },
  {
    title: "ระบบยืนยันยอดที่แม่นยำ (Secure Verification)",
    description:
      "มีระบบตรวจสอบสลิปและการอนุมัติยอดที่รัดกุม ป้องกันการสวมรอยหรือการแจ้งยอดซ้ำ ให้คุณมั่นใจได้ว่าทุกยอดเงินตรงปก",
    icon: <Image src={Shield} alt="shield" width={25} height={25} />,
  },
  {
    title: "ปกป้องข้อมูลด้วยมาตรฐานระดับสูง (Data Privacy)",
    description:
      "ข้อมูลส่วนบุคคลและข้อมูลการทำธุรกรรมของคุณจะถูกจัดเก็บและเข้ารหัสอย่างปลอดภัยตามมาตรฐานสูงสุด เพื่อป้องกันการเข้าถึงจากบุคคลที่สาม",
    icon: (
      <Image
        src={DataProtection}
        alt="data-protection"
        width={25}
        height={25}
      />
    ),
  },
];

export default function Security() {
  return (
    <div className="w-full flex items-center justify-between px-[80px] py-16">
      <div className="w-1/2 pr-10">
        <Image
          src={Undrawsetup}
          alt="Undrawsetup"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <div className="w-1/2 ">
        <div className="flex items-center gap-2 mb-2">
          <Image src={Shield} alt="shield" width={25} height={25} />
          <p className="text-primary-dark font-semibold text-base">
            Trust & Security
          </p>
        </div>
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-semibold">
            ปลอดภัย โปร่งใส มั่นใจทุกยอดเงิน
          </h1>
          <p className="text-base font-normal text-text-secondary leading-relaxed">
            เราออกแบบ EzClassPay โดยยึดความปลอดภัยของข้อมูล
            และความถูกต้องของยอดเงินเป็นอันดับแรก
            เพื่อให้ทุกคนในห้องใช้งานได้อย่างสบายใจ
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {SECURITY_DATA.map((item, index) => (
            <Accordion
              key={index}
              title={item.title}
              icon={item.icon}
              defaultOpen={item.defaultOpen}
            >
              {item.description}
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
