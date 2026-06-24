import PayBillForm from "../components/pay-bill-form";

export default function PayBillView() {
  return (
    <main className="min-h-screen bg-bg text-foreground p-4 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-card p-8 md:p-12 border border-border/50">
        <PayBillForm />
        <footer className="mt-10 text-center text-xs text-text-secondary opacity-50">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
