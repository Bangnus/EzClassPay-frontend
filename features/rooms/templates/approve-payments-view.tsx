import ApprovePaymentsForm from "../components/approve-payments-form";

export default function ApprovePaymentsView() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-neutral-100 p-8 md:p-12 border border-neutral-100">
        <ApprovePaymentsForm />
        <footer className="mt-10 text-center text-xs text-neutral-400">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
