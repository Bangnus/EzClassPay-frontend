import NotifyView from "@/features/notify/templates/notify-view";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";

export const metadata = {
  title: "แจ้งเตือนกลุ่ม | EzClassPay",
  description: "ระบบส่งข้อความแจ้งเตือนเข้ากลุ่ม",
};

export default function NotifyPage() {
  return (
    <Suspense fallback={<Spinner text="กำลังโหลด..." />}>
      <NotifyView />
    </Suspense>
  );
}
