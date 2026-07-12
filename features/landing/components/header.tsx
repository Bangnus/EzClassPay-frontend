"use client";

import Image from "next/image";
import MobilePaymeent from "@/public/images/Mobile payments-pana.png";
import rafiki from "@/public/images/stars-rafiki.png";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import AvatarGroup from "./avatar-group";
import useSWR from "swr";
import { getUserSummary } from "../services";

export default function Header() {
  const { data } = useSWR("/api/users/summary", getUserSummary);
  
  // Default fallback to 2000+ if loading or error
  const totalUsers = data?.data?.totalUsers;
  const displayCount = totalUsers ? (totalUsers > 2000 ? `${totalUsers}+` : totalUsers) : "2000+";

  return (
    <div className="flex items-center max-md:flex-col-reverse gap-10 max-md:gap-8 py-5 max-md:py-16 bg-linear-to-b from-[#FFFFFF] to-[#A7E9E5]/60 px-[80px] max-md:px-6">
      <div className="w-1/2 max-md:w-full flex flex-col max-md:items-center max-md:text-center gap-8 max-md:gap-6">
        <div className="flex max-md:justify-center relative">
          <div className="text-6xl max-md:text-4xl max-md:leading-tight font-semibold space-y-2 max-md:space-y-3">
            <p>เก็บเงินง่าย</p>
            <p className="text-primary">จัดการได้ครบ</p>
            <p>จบในที่เดี่ยว</p>  
          </div>
          <Image
            src={rafiki}
            alt="rafiki"
            className="object-cover w-[100px] h-[100px] max-md:hidden -translate-y-6"
          />
        </div>
        <p className="text-lg max-md:text-sm max-md:leading-relaxed max-md:px-2 text-text-secondary font-normal">
          ระบบจัดการเงินกลุ่มที่มีความโปร่งใส ตรวจสอบได้ทุกยอดโอน ใช้งานง่าย
          สะดวก และปลอดภัยสำหรับทุกคน ใช้งานผ่าน LINE ได้ทันที ไม่ต้องโหลดแอปเพิ่ม
        </p>

        <div className="flex max-md:flex-col items-center gap-4 w-[380px] max-md:w-full [&>*]:max-md:w-full max-md:mt-2">
          <Button
            type="primary"
            borderRadius={15}
            padding={13}
            icon={<Plus size={17} strokeWidth={3} />}
            href="https://line.me/R/ti/p/@EzClassPay"
            target="_blank"
          >
            เพิ่มเพื่อนใน LINE
          </Button>
          <Button type="default" borderRadius={15} padding={13}>
            ดูตัวอย่างการใช้งาน
          </Button>
        </div>

        <div className="flex max-md:flex-col items-center gap-2 max-md:gap-2 max-md:mt-4">
          <AvatarGroup />
          <p className="text-text-secondary text-sm max-md:text-xs font-normal">
            ผู้ใช้มากกว่า {displayCount} ที่ไว้วางใจ
          </p>
        </div>
      </div>

      <div className="w-1/2 max-md:hidden flex justify-end max-md:justify-center">
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
