import ExpenseForm from "../components/expense-form";

export default function ExpenseView() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-neutral-100 p-8 md:p-12 border border-neutral-100">
        <ExpenseForm />
        <footer className="mt-10 text-center text-xs text-neutral-400">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
