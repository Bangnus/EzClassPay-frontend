"use client";

import Logo from "@/public/images/icons/logo.png";
import Image from "next/image";
import Button from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="w-full bg-white shadow-soft">
      <div className="mx-[80px] flex justify-between items-center p-5 ">
        <div className="flex items-end gap-1">
          <Image
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
          />
          <h1 className="text-[20px] font-extrabold translate-y-[8px] bg-gradient-to-r from-[#333333] to-[#555555] bg-clip-text text-transparent">
            ClassPay
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[125px]">
          <Button type="text" borderRadius={20} padding={8}>เข้าสู่ระบบ</Button>
          </div>
          <div className="w-[155px]">
          <Button type="primary" borderRadius={20} padding={8} >สมัครสมาชิก</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
