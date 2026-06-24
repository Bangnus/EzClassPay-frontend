import VerifySlipForm from "../components/verify-slip-form";

export default function VerifySlipView() {
  return (
    <main className="min-h-screen bg-bg text-foreground p-4 md:p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-card p-8 md:p-12 border border-border/50">
        <VerifySlipForm />
        <footer className="mt-10 text-center text-xs text-text-secondary opacity-50">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
