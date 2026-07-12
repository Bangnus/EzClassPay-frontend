import Image from "next/image";
import MobilePaymeent from "@/public/images/Mobile payments-pana.png";
import rafiki from "@/public/images/stars-rafiki.png";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import AvatarGroup from "./avatar-group";

export default function Header() {
  return (
    <div className="flex items-center gap-10 py-5 bg-linear-to-b from-[#FFFFFF] to-[#A7E9E5]/60 px-[80px]">
      <div className="w-1/2 flex flex-col gap-8 ">
        <div className="flex">
          <div className="text-6xl font-semibold space-y-2">
            <p>เก็บเงินง่าย</p>
            <p className="text-primary">จัดการได้ครบ</p>
            <p>จบในที่เดี่ยว</p>
          </div>
          <Image
            src={rafiki}
            alt="rafiki"
            className="object-cover w-[100px] h-[100px] -translate-y-6"
          />
        </div>
        <p className="text-lg text-text-secondary font-normal">
          ระบบจัดการเงินกลุ่มที่มีความโปร่งใส ตรวจสอบได้ทุกยอดโอน ใช้งานง่าย
          สะดวก และปลอดภัยสำหรับทุกคน ใช้งานผ่าน LINE ได้ทันที ไม่ต้องโหลดแอปเพิ่ม
        </p>

        <div className="flex items-center gap-4 w-[380px]">
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

        <div className="flex items-center gap-2">
          <AvatarGroup />
          <p className="text-text-secondary text-sm font-normal">
            ผู้ใช้มากกว่า 2000+ ที่ไว้วางใจ
          </p>
        </div>
      </div>

      <div className="w-1/2 flex justify-end ">
        <Image
          src={MobilePaymeent}
          alt="MobilePaymeent"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
