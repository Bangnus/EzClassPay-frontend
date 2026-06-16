import HistoryForm from "../components/history-form";

export default function HistoryView() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-10">
      <div className="w-full max-w-lg mx-auto">
        <HistoryForm />
        <footer className="mt-10 text-center text-xs text-neutral-400">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
