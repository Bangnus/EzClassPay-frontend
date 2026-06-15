export default function VerifySlipView() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">ตรวจสอบสลิป</h1>
        <div className="bg-white rounded-3xl shadow-xl shadow-neutral-100 p-8 md:p-12 border border-neutral-100">
          <p className="text-neutral-500 text-center py-12">ระบบจะแสดงรายการสลิปรอการตรวจสอบ</p>
        </div>
        <footer className="mt-10 text-center text-xs text-neutral-400">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
