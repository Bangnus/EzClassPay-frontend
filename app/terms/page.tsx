import Navbar from "@/features/landing/components/navbar";
import Footer from "@/features/landing/components/footer";

export default function Terms() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-[60vh] bg-gray-50/50 py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-soft">
          <h1 className="text-4xl font-bold text-text-primary mb-6">ข้อตกลงการใช้งาน (Terms of Service)</h1>
          <div className="prose prose-lg text-text-secondary space-y-4">
            <p>แก้ไขล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
            <p>ยินดีต้อนรับสู่ระบบ EzClassPay การเข้าถึงและใช้บริการนี้ถือว่าคุณได้อ่านและยอมรับเงื่อนไขการใช้งานเหล่านี้ทั้งหมด</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">1. การใช้บริการ</h3>
            <p>แพลตฟอร์ม EzClassPay ให้บริการเป็นเพียงตัวกลางในการบันทึกและตรวจสอบยอดเงินระหว่างกลุ่มผู้ใช้ เราไม่ได้ทำหน้าที่เป็นสถาบันการเงิน หรือมีส่วนในการรับเงิน/โอนเงินโดยตรงแต่อย่างใด</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">2. ความรับผิดชอบของผู้ใช้</h3>
            <p>ผู้ใช้บริการจะต้องรับผิดชอบความถูกต้องของสลิปโอนเงินและการกดยืนยันยอดด้วยตนเอง ทางบริษัทไม่รับผิดชอบต่อความผิดพลาดอันเกิดจากการทำธุรกรรมหรือความขัดแย้งภายในกลุ่ม</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">3. การเปลี่ยนแปลงเงื่อนไข</h3>
            <p>เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อตกลงนี้ได้ตลอดเวลา การใช้งานหลังจากมีการเปลี่ยนแปลงถือว่าคุณยอมรับเงื่อนไขใหม่</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
