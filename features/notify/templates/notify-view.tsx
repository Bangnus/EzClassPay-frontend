"use client";

import NotifyForm from "../components/notify-form";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Spinner from "@/components/ui/spinner";

export default function NotifyView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_DASHBOARD as string,
        });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-foreground p-4 flex justify-center items-center">
        <Spinner text="กำลังโหลด..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-foreground p-4 md:p-10 flex justify-center items-start pt-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-card p-8 md:p-12 border border-border/50">
        <NotifyForm />
        <footer className="mt-10 text-center text-xs text-text-secondary opacity-50">
          EzClassPay - ระบบจัดการเงินกองกลางอัตโนมัติ
        </footer>
      </div>
    </main>
  );
}
