import Button from "@/components/ui/button";

export default function CTA() {
  return (
    <div className="w-full px-[80px] max-md:px-6 py-6 max-md:py-4 mb-8">
      <div className="bg-primary rounded-[40px] px-10 max-md:px-6 py-12 max-md:py-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <h2 className="text-3xl md:text-4xl max-md:text-2xl font-bold text-white mb-4 relative z-10">
          พร้อมให้การเก็บเงินกลุ่ม เป็นเรื่องง่ายแล้วหรือยัง?
        </h2>
        <p className="text-lg max-md:text-sm text-white/90 mb-8 max-md:mb-6 max-w-2xl relative z-10">
          เริ่มต้นจัดการเรื่องเงินกองกลางกับเพื่อนๆ ได้ฟรี วันนี้ผ่านแอป LINE ที่คุณคุ้นเคย 
          บอกลาความปวดหัวและยอดค้างชำระที่ไม่รู้จบ
        </p>
        <div className="w-[350px] max-md:w-full relative z-10">
          <Button
            type="default"
            padding={14}
            borderRadius={30}
            href="https://line.me/R/ti/p/@ClassPay"
            target="_blank"
          >
            <span className="text-primary text-lg">เพิ่มเพื่อน @ClassPay ใน LINE เลย</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
