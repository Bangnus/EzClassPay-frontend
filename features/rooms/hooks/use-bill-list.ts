import { useEffect, useState } from "react";
import liff from "@line/liff";
import { syncUserWithBackend } from "@/services/auth";
import { getRoom, getAllRoomBills } from "../services";

export function useBillList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bills, setBills] = useState<any[]>([]);
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

        const qRoomId = liffQuery.roomId || urlParams.get("roomId");
        const ssRoomId = sessionStorage.getItem("pay_bill_roomId");

        const rid = qRoomId || ssRoomId;

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
          action: "bill_list",
        });

        if (rid) {
          const [roomData, billsData] = await Promise.all([
            getRoom(rid).catch(() => null),
            getAllRoomBills(rid, userProfile.userId).catch(() => []),
          ]);
          if (roomData) setRoom(roomData);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (billsData) setBills(billsData as any[]);
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  return { profile, room, bills, loading, roomId };
}
