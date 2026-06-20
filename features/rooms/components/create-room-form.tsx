"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { createRoom } from "../services";
import { syncUserWithBackend } from "@/services/auth";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

export default function CreateRoomForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lineGroupId, setLineGroupId] = useState<string | null>(null);
  const [groupDetected, setGroupDetected] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    collection_type: "MONTHLY",
    amount: "",
    promptpay_no: "",
  });

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID_CREATE_ROOM as string,
        });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          // 🚀 ซิงค์ข้อมูลผู้ใช้กับ Backend (Auto-Register + จัดการ Rich Menu)
          await syncUserWithBackend({
            line_uid: userProfile.userId,
            name: userProfile.displayName,
            profile_url: userProfile.pictureUrl,
            action: "create_room",
          });

          // 🟢 ดึงข้อมูลว่าเปิดจากกลุ่มไหน
          const context = liff.getContext();
          const urlParams = new URLSearchParams(window.location.search);
          const groupId = urlParams.get("groupId") || context?.groupId || null;

          console.log("🔍 LIFF Debug:", {
            url: window.location.href,
            search: window.location.search,
            contextType: context?.type,
            groupIdFromUrl: urlParams.get("groupId"),
            groupIdFromContext: context?.groupId,
            finalGroupId: groupId,
          });

          if (groupId) {
            setLineGroupId(groupId);
          } else {
            setGroupDetected(false);
          }
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      }
    };
    initLiff();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const payload = {
        line_uid: profile.userId,
        name: formData.name,
        collection_type: formData.collection_type,
        total_target_amount:
          formData.collection_type === "TARGET"
            ? Number(formData.amount)
            : null,
        periodic_amount:
          formData.collection_type === "MONTHLY"
            ? Number(formData.amount)
            : null,
        promptpay_no: formData.promptpay_no,
        ...(lineGroupId ? { line_group_id: lineGroupId } : {}),
      };

      await createRoom(payload);

      liff.closeWindow();
    } catch (err) {
      console.error(err);

      const errorObj = err as Error & {
        response?: { status?: number; data?: { message?: string } };
      };

      if (errorObj?.response?.status === 400) {
        alert("กลุ่มนี้มีการตั้งห้องกองกลางไว้แล้ว ไม่สามารถสร้างซ้ำได้ครับ");
      } else if (errorObj?.message) {
        alert(errorObj.message);
      } else {
        alert("เกิดข้อผิดพลาด ระบบไม่สามารถสร้างห้องได้ในขณะนี้");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          สร้างห้องใหม่
        </h1>
        <p className="mt-2 text-text-secondary text-lg">
          กรอกรายละเอียดเพื่อเริ่มต้นเก็บเงินกองกลาง
        </p>
      </header>

      {!groupDetected && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 space-y-2 my-4">
          <p className="font-bold">⚠️ ไม่พบข้อมูลกลุ่ม LINE</p>
          <p>
            ห้องนี้จะถูกสร้างโดยไม่เชื่อมกับกลุ่ม LINE
            คุณสามารถเชื่อมกลุ่มทีหลังได้จากเมนูจัดการห้อง
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="ชื่อห้องเก็บเงิน"
          type="text"
          name="name"
          required
          onChange={handleChange}
          maxLength={50}
          placeholder="เช่น กองกลางห้อง 6/1, ค่าเสื้อรุ่น"
        />

        <Select
          label="ประเภทการเก็บเงิน"
          value={formData.collection_type}
          onChange={(value) =>
            handleSelectChange(value as string, "collection_type")
          }
          options={[
            { value: "MONTHLY", label: "ยอดคงที่ (เก็บเรื่อยๆ เช่น รายเดือน)" },
            {
              value: "TARGET",
              label: "มีเป้าหมายรวม (เก็บทีเดียว เช่น ค่าเที่ยว)",
            },
          ]}
        />

        <Input
          label={
            formData.collection_type === "TARGET"
              ? "ยอดเป้าหมายรวม (บาท)"
              : "ยอดเก็บต่อรอบ (บาท)"
          }
          type="number"
          name="amount"
          required
          onChange={handleChange}
          placeholder="0.00"
        />

        <Input
          label="เบอร์พร้อมเพย์ที่รับเงิน"
          type="text"
          name="promptpay_no"
          required
          onChange={handleChange}
          maxLength={13}
          placeholder="08X-XXX-XXXX หรือ เลขบัตรฯ"
        />

        <div className="pt-6">
          <Button type="primary" borderRadius={10} padding={15}>
            ยืนยันการสร้างห้อง
          </Button>
        </div>
      </form>
    </>
  );
}
