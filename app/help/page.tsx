import Navbar from "@/features/landing/components/navbar";
import Footer from "@/features/landing/components/footer";
import Button from "@/components/ui/button";

export default function HelpCenter() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-[60vh] bg-gray-50/50 py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-soft">
          <h1 className="text-4xl font-bold text-text-primary mb-6">ศูนย์ช่วยเหลือ (Help Center)</h1>
          <div className="prose prose-lg text-text-secondary">
            <p>
              ยินดีต้อนรับสู่ศูนย์ช่วยเหลือของ EzClassPay หากคุณพบปัญหาในการใช้งาน 
              หรือมีคำถามเพิ่มเติมเกี่ยวกับการจัดการเงินกลุ่ม คุณสามารถติดต่อทีมงานของเราได้ตลอดเวลา
            </p>
            <h3 className="text-xl font-semibold mt-8 mb-4 text-text-primary">ช่องทางการติดต่อ</h3>
            <p>
              คุณสามารถติดต่อทีมงานสนับสนุนของเราได้โดยตรงผ่าน LINE Official Account 
              เจ้าหน้าที่จะคอยตอบคำถามและช่วยเหลือคุณในวันจันทร์ - ศุกร์ เวลา 09.00 - 18.00 น.
            </p>
            <div className="mt-8 w-[250px]">
              <Button type="primary" href="https://line.me/R/ti/p/@ClassPay" target="_blank" padding={12} borderRadius={20}>
                ติดต่อเราผ่าน LINE
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
