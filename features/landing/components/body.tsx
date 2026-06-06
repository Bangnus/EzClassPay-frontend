import Image from "next/image";
import MobilePaymeent from "@/public/images/Mobile payments-pana.png";
import rafiki from "@/public/images/To the stars-rafiki.png";
import Button from "@/components/ui/button";
import { Plus } from 'lucide-react';

export default function Body() {
  return (
    <div className=" flex items-center gap-10 bg-linear-to-b from-[#FFFFFF] to-[#A7E9E5]/50 px-[80px]">
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
          สะดวก และปลอดภัยสำหรับทุกคน ไม่ว่าจะทริปเที่ยว งานเลี้ยง
          หรือเงินกองกลาง
        </p>

        <div className="flex items-center gap-4 w-[380px]">
          <Button type="primary" borderRadius={20} padding={10} icon={<Plus size={18} strokeWidth={3} />} >สร้างห้องเก็บเงิน</Button>
          <Button type="default" borderRadius={20} padding={10} >ลองดูตัวอย่าง</Button>
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
