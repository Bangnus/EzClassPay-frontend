import Navbar from "@/features/landing/components/navbar";
import Footer from "@/features/landing/components/footer";

export default function Privacy() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-[60vh] bg-gray-50/50 py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-soft">
          <h1 className="text-4xl font-bold text-text-primary mb-6">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
          <div className="prose prose-lg text-text-secondary space-y-4">
            <p>แก้ไขล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
            <p>ที่ EzClassPay เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายถึงวิธีที่เรารวบรวมและใช้ข้อมูลของคุณ</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">1. ข้อมูลที่เราเก็บรวบรวม</h3>
            <p>เราอาจเก็บรวบรวมข้อมูลพื้นฐานที่จำเป็นต่อการใช้งานระบบ เช่น ข้อมูลโปรไฟล์จาก LINE (ชื่อ, รูปภาพ), ประวัติการแนบสลิป, และยอดเงินที่ถูกบันทึกในห้อง</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">2. การใช้ข้อมูล</h3>
            <p>ข้อมูลของคุณจะถูกใช้เพื่อการทำงานของระบบเท่านั้น เพื่อให้คุณและเพื่อนๆ ในกลุ่มสามารถจัดการเงินได้อย่างถูกต้อง เราไม่มีนโยบายนำข้อมูลไปขายหรือแบ่งปันให้บุคคลที่สามเพื่อการโฆษณา</p>
            
            <h3 className="text-xl font-semibold text-text-primary mt-6">3. ความปลอดภัยของข้อมูล</h3>
            <p>เราใช้มาตรฐานการเข้ารหัสและมาตรการรักษาความปลอดภัยทางเทคนิคที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
