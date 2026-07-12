import Link from "next/link";
import Button from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-6">
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          ไม่พบหน้าที่คุณต้องการ
        </h2>
        <p className="text-text-secondary mb-10 text-lg leading-relaxed">
          ขออภัย หน้าที่คุณพยายามเข้าถึงอาจถูกลบไปแล้ว เปลี่ยนชื่อ หรือไม่มีอยู่จริงในระบบ 
          กรุณาตรวจสอบ URL อีกครั้ง หรือกลับไปเริ่มต้นที่หน้าแรก
        </p>
        
        <div className="w-[200px]">
          <Link href="/">
            <Button type="primary" borderRadius={20} padding={12}>
              กลับสู่หน้าหลัก
            </Button>
          </Link>
        </div>
      </div>
  );
}
