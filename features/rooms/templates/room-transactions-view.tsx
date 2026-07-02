import RoomTransactionsForm from "@/features/rooms/components/room-transactions-form";

export default function RoomTransactionsView() {
  return (
    <main className="min-h-screen bg-bg p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] shadow-xl rounded-3xl p-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        
        <RoomTransactionsForm />
      </div>
    </main>
  );
}
