import VerifySlipForm from "../components/verify-slip-form";

export default function VerifySlipView() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-10">
      <div className="w-full max-w-lg mx-auto">
        <VerifySlipForm />
        <footer className="mt-10 text-center text-xs text-neutral-400">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
