import Image from "next/image";
import Logo from "@/public/images/icons/logo.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-10 max-md:mt-6">
      <div className="mx-[80px] max-md:mx-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 py-12 max-md:py-8">
          <div className="w-full md:w-1/3 space-y-4 max-md:space-y-3">
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
            <p className="text-sm text-text-secondary leading-relaxed">
              ระบบจัดการเงินกลุ่มที่มีความโปร่งใส ตรวจสอบได้ทุกยอดโอน ใช้งานง่าย สะดวก 
              และปลอดภัยสำหรับทุกคน เริ่มต้นใช้งานผ่าน LINE ได้ทันที ไม่ต้องโหลดแอปพลิเคชัน
            </p>
          </div>

          <div className="flex gap-20 max-md:gap-10 max-md:flex-col w-full md:w-auto">
            <div className="space-y-4 max-md:space-y-2">
              <h3 className="font-semibold text-text-primary">เกี่ยวกับเรา</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li>
                  <Link href="/#how-it-works" className="hover:text-primary transition-colors">
                    วิธีการใช้งาน
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-primary transition-colors">
                    ฟีเจอร์เด่น
                  </Link>
                </li>
                <li>
                  <Link href="/#security" className="hover:text-primary transition-colors">
                    ความปลอดภัย
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4 max-md:space-y-2">
              <h3 className="font-semibold text-text-primary">ติดต่อเรา / สนับสนุน</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li>
                  <Link href="https://line.me/R/ti/p/@640skksf" target="_blank" className="hover:text-[#00B900] transition-colors">
                    LINE Official: @640skksf
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-primary transition-colors">
                    ศูนย์ช่วยเหลือ (Help Center)
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    ข้อตกลงการใช้งาน (Terms)
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    นโยบายความเป็นส่วนตัว (Privacy)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pb-4 pt-6 border-t border-gray-200 flex justify-center items-center">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} ClassPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
