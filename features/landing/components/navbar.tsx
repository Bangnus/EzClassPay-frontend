"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "@/public/images/icons/logo.png";
import Image from "next/image";
import Button from "@/components/ui/button";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      // ถ้าเลื่อนน้อยกว่า 10px จะไม่กระดิก (ช่วยลดความกระตุกเวลาเลื่อนนิ้วนิดเดียว)
      if (Math.abs(diff) > 10) {
        if (diff > 0 && currentScrollY > 80) {
          setIsVisible(false);
        } else if (diff < 0) {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full bg-white shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-[80px] flex justify-between items-center py-5 ">
        <div className="flex items-end gap-1">
          <Image
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
          />
          <h1 className="text-[20px] font-extrabold translate-y-[8px] bg-linear-to-r from-[#333333] to-[#555555] bg-clip-text text-transparent">
            ClassPay
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[125px]">
            <Button type="text" borderRadius={20} padding={10}>
              เข้าสู่ระบบ
            </Button>
          </div>
          <div className="w-[155px]">
            <Button type="primary" borderRadius={20} padding={10}>
              สมัครสมาชิก
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
