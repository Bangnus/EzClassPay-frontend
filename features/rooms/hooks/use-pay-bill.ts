import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiFetch = (url: string, init?: RequestInit) =>
  fetch(`${API_URL}${url}`, {
    ...init,
    headers: { ...init?.headers, "ngrok-skip-browser-warning": "true" },
  });

export function usePayBill() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bill, setBill] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<"target" | "bill" | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_PAY_BILL as string,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const liffQuery = (liff as any).getQuery?.() || {};
        const urlParams = new URLSearchParams(window.location.search);

        const qRoomId = liffQuery.roomId;
        const qType = liffQuery.type || urlParams.get("type");
        const qBillId = liffQuery.billId || urlParams.get("billId");

        const urlRoomId = urlParams.get("roomId");
        const ssRoomId = sessionStorage.getItem("pay_bill_roomId");

        const rid = qRoomId || urlRoomId || ssRoomId;

        if (rid) {
          setRoomId(rid);
          sessionStorage.setItem("pay_bill_roomId", rid);
        }

        if (!liff.isLoggedIn()) {
          sessionStorage.setItem("pay_bill_roomId", rid || "");
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        await syncUserWithBackend({
          line_uid: userProfile.userId,
          name: userProfile.displayName,
          profile_url: userProfile.pictureUrl,
          action: "pay_bill",
        });

        if (rid) {
          const res = await apiFetch(`/api/rooms/${rid}`);
          const roomData = await res.json();
          if (roomData.success) setRoom(roomData.data);

          if (qType === "target") {
            setPaymentType("target");
            setBill(null);
          } else {
            setPaymentType("bill");
            const billRes = await apiFetch(
              `/api/bills/room/${rid}?limit=10&lineUid=${userProfile.userId}`
            );
            const billData = await billRes.json();
            if (billData.success && billData.data.length > 0) {
              let targetBill;
              if (qBillId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                targetBill = billData.data.find((b: any) => b.id === qBillId);
              }
              if (!targetBill) {
                targetBill = billData.data.find(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (b: any) => b.status === "UNPAID"
                );
              }
              if (targetBill) setBill(targetBill);
            }
          }
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  return { profile, room, bill, paymentType, loading, roomId, apiFetch };
}
