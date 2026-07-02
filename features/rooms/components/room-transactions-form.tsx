"use client";

import { useEffect, useState } from "react";
import { getRoomTransactions } from "@/features/rooms/services";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionFilter from "@/features/rooms/components/transaction-filter";
import liff from "@line/liff";

export default function RoomTransactionsForm() {
  const [roomId, setRoomId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [error, setError] = useState("");

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID_DASHBOARD as string });
        const urlParams = new URLSearchParams(window.location.search);
        const rId = urlParams.get("roomId");
        if (rId) {
          setRoomId(rId);
        } else {
          setError("ไม่พบข้อมูลห้อง");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถเข้าสู่ระบบ LINE ได้");
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await getRoomTransactions(roomId, selectedMonth, selectedYear);
        setTransactions(res.transactions || []);
        setSummary(res.summary || { totalIncome: 0, totalExpense: 0, balance: 0 });
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [roomId, selectedMonth, selectedYear]);

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => liff.isInClient() && liff.closeWindow()}
          className="text-primary font-bold hover:underline"
        >
          กลับไปที่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <TransactionFilter
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="col-span-2 h-32 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-2xl p-5 shadow-sm col-span-2 border ${summary.balance >= 0 ? "bg-white border-primary/20" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                คงเหลือสุทธิ
              </p>
              <p className={`text-4xl font-black ${summary.balance >= 0 ? "text-primary" : "text-red-700"}`}>
                ฿{summary.balance.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
                รับเข้า (Income)
              </p>
              <p className="text-xl font-black text-green-700">
                ฿{summary.totalIncome.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100 shadow-sm">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                จ่ายออก (Expense)
              </p>
              <p className="text-xl font-black text-red-700">
                ฿{summary.totalExpense.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="bg-bg rounded-xl p-10 text-center border border-border mt-4">
                <p className="text-text-secondary">ไม่มีประวัติรับ-จ่ายในเดือนนี้</p>
              </div>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                return (
                  <div
                    key={tx.id}
                    className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        {new Date(tx.createdAt).toLocaleString("th-TH")}
                      </p>
                      <p className="font-bold text-text-primary text-sm truncate max-w-[160px]">
                        {tx.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-extrabold ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}฿{Number(tx.amount).toLocaleString()}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isIncome
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isIncome ? "INCOME" : "EXPENSE"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
