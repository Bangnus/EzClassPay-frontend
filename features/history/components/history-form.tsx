"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getUserPayments, getUserSummary } from "@/features/rooms/services";
import Spinner from "@/components/ui/spinner";
import SlipImage from "@/components/ui/slip-image";
import Accordion from "@/components/ui/accordion";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment } from "@/features/rooms/types";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  AWAITING_SLIP: { label: "รอสลิป", color: "text-yellow-600 bg-yellow-50" },
  PENDING: { label: "รอตรวจสอบ", color: "text-orange-600 bg-orange-50" },
  APPROVED: { label: "อนุมัติแล้ว", color: "text-green-600 bg-green-50" },
  REJECTED: { label: "ปฏิเสธ", color: "text-red-600 bg-red-50" },
};

export default function HistoryForm() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lineUid, setLineUid] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        console.log("[LIFF_OPEN] History URL:", window.location.href);

        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_HISTORY as string,
        });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          const syncResult = await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "bill_list",
          });

          if (syncResult && syncResult.data && syncResult.data.id) {
            setLineUid(userProfile.userId);
            await loadInitialData(userProfile.userId);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadInitialData = async (uid: string) => {
    try {
      const [paymentsRes, summaryData] = await Promise.all([
        getUserPayments(uid, 1, 10).catch(() => ({ data: [], page: 1, totalPages: 0 })),
        getUserSummary(uid).catch(() => null),
      ]);

      const p = (paymentsRes.data || []) as Payment[];
      setPayments(p);
      setHasMore(paymentsRes.page < paymentsRes.totalPages);
      
      if (summaryData) {
        setSummary(summaryData);
      } else {
        setSummary({ totalBilled: 0, totalPaid: 0, totalMissing: 0, roomStats: [] });
      }
    } catch {
      setPayments([]);
      setSummary({ totalBilled: 0, totalPaid: 0, totalMissing: 0, roomStats: [] });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lineUid || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const paymentsRes = await getUserPayments(lineUid, nextPage, 10);
      const newPayments = (paymentsRes.data || []) as Payment[];
      
      setPayments((prev) => [...prev, ...newPayments]);
      setPage(nextPage);
      setHasMore(paymentsRes.page < paymentsRes.totalPages);
    } catch {
      // Handle error gracefully
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="space-y-6 pb-10">
        <header className="text-center">
          <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-8 w-1/2 mx-auto rounded-full" />
        </header>

        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="col-span-2 h-32 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3 mb-4" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600 tracking-tight">
          สรุปยอดค่าใช้จ่ายส่วนตัว
        </h1>
        <p className="mt-2 text-sm font-medium text-text-secondary bg-primary/5 inline-block px-4 py-1.5 rounded-full">
          รวมจากทุกห้องทั้งหมด
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-linear-to-br from-primary to-blue-600 rounded-3xl p-6 shadow-md col-span-2 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
              ยอดที่ถูกเรียกเก็บรวมทั้งหมด
            </p>
            <p className="text-4xl font-black">
              ฿{summary.totalBilled.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-3xl p-5 border border-green-200/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
            จ่ายไปแล้ว
          </p>
          <p className="text-2xl font-black text-green-800">
            ฿{summary.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-3xl p-5 border border-red-200/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
            ยอดค้างจ่าย
          </p>
          <p className="text-2xl font-black text-red-800">
            ฿{summary.totalMissing.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Room Summary List */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-text-secondary">
          สรุปแยกตามห้อง ({summary.roomStats.length} ห้อง)
        </p>

        {summary.roomStats.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-sm">
            <p className="text-text-secondary">ยังไม่มีข้อมูลจากห้องใดๆ</p>
          </div>
        ) : (
          summary.roomStats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-text-primary text-md">
                  {stat.roomName}
                </p>
                {stat.missing === 0 ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-50">
                    ครบแล้ว
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50">
                    ค้าง ฿{stat.missing.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-bg/50 rounded-lg p-3 border border-border">
                <div>
                  <p className="text-xs text-text-secondary">เรียกเก็บ</p>
                  <p className="text-sm font-bold text-text-primary">
                    ฿{stat.billed.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">จ่ายแล้ว</p>
                  <p className="text-sm font-bold text-green-600">
                    ฿{stat.paid.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Payments List */}
      <div className="space-y-3 mt-6">
        <p className="text-sm font-bold text-text-secondary">
          ประวัติการจ่ายเงินล่าสุด
        </p>
        
        {payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-sm">
            <p className="text-text-secondary">ไม่มีประวัติการจ่ายเงิน</p>
          </div>
        ) : (
          <>
            {payments.map((payment) => {
              const st = STATUS_LABEL[payment.status] || {
                label: payment.status,
                color: "text-text-secondary bg-border",
              };
              return (
                <div
                  key={payment.id}
                  className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-text-primary text-sm">
                        {payment.room?.name || "ห้อง"}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {new Date(payment.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${st.color}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  {payment.amount > 0 && (
                    <div className="mt-4 flex justify-between items-center bg-bg/50 rounded-lg p-3 border border-border">
                      <p className="text-sm font-bold text-text-primary">
                        ยอดเงิน: ฿{Number(payment.amount).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {payment.slipUrl && (
                    <div className="mt-4">
                      <Accordion title="ดูสลิปโอนเงิน">
                        <div className="py-2">
                          <SlipImage
                            url={payment.slipUrl}
                            className="w-full rounded-2xl border-2 border-neutral-100 shadow-sm"
                          />
                        </div>
                      </Accordion>
                    </div>
                  )}
                </div>
              );
            })}
            
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button
                  type="default"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม (Load More)"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
