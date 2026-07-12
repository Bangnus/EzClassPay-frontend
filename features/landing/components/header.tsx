import Image from "next/image";
import MobilePaymeent from "@/public/images/Mobile payments-pana.png";
import rafiki from "@/public/images/stars-rafiki.png";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import AvatarGroup from "./avatar-group";

export default function Header() {
  return (
    <div className="flex items-center max-md:flex-col-reverse gap-10 max-md:gap-8 py-5 max-md:py-10 bg-linear-to-b from-[#FFFFFF] to-[#A7E9E5]/60 px-[80px] max-md:px-6">
      <div className="w-1/2 max-md:w-full flex flex-col max-md:items-center max-md:text-center gap-8 max-md:gap-6">
        <div className="flex max-md:justify-center relative">
          <div className="text-6xl max-md:text-4xl font-semibold space-y-2">
            <p>เก็บเงินง่าย</p>
            <p className="text-primary">จัดการได้ครบ</p>
            <p>จบในที่เดี่ยว</p>
          </div>
          <Image
            src={rafiki}
            alt="rafiki"
            className="object-cover w-[100px] h-[100px] max-md:w-[60px] max-md:h-[60px] -translate-y-6 max-md:-translate-y-4 max-md:-ml-4"
          />
        </div>
        <p className="text-lg max-md:text-base text-text-secondary font-normal">
          ระบบจัดการเงินกลุ่มที่มีความโปร่งใส ตรวจสอบได้ทุกยอดโอน ใช้งานง่าย
          สะดวก และปลอดภัยสำหรับทุกคน ใช้งานผ่าน LINE ได้ทันที ไม่ต้องโหลดแอปเพิ่ม
        </p>

        <div className="flex max-md:flex-col items-center gap-4 w-[380px] max-md:w-full [&>*]:max-md:w-full">
          <Button
            type="primary"
            borderRadius={15}
            padding={13}
            icon={<Plus size={17} strokeWidth={3} />}
            href="https://line.me/R/ti/p/@ClassPay"
            target="_blank"
          >
            เพิ่มเพื่อนใน LINE
          </Button>
          <Button type="default" borderRadius={15} padding={13}>
            ดูตัวอย่างการใช้งาน
          </Button>
        </div>

        <div className="flex max-md:flex-col items-center gap-2 max-md:gap-1 max-md:mt-2">
          <AvatarGroup />
          <p className="text-text-secondary text-sm font-normal">
            ผู้ใช้มากกว่า 2000+ ที่ไว้วางใจ
          </p>
        </div>
      </div>

      <div className="w-1/2 max-md:w-full flex justify-end max-md:justify-center">
        <Image
          src={MobilePaymeent}
          alt="MobilePaymeent"
          width={500}
          height={500}
          className="max-md:w-[280px] max-md:h-auto object-contain"
        />
      </div>
    </div>
  );
}
