"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PayBillView from "@/features/rooms/templates/pay-bill-view";
import BillListView from "@/features/rooms/templates/bill-list-view";

function PayBillRouter() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "all") {
    return <BillListView />;
  }
  return <PayBillView />;
}

export default function PayBillPage() {
  return (
    <Suspense fallback={null}>
      <PayBillRouter />
    </Suspense>
  );
}
