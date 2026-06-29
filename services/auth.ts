const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function syncUserWithBackend(params: {
  line_uid: string;
  name: string;
  profile_url?: string;
  action: "create_room" | "pay_bill" | "verify_slip" | "bill_list";
}) {
  try {
    const res = await fetch(`${API_URL}/api/auth/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      console.error("Sync API error:", await res.text());
    }
    return res.json();
  } catch (error) {
    console.error("Sync Error:", error);
  }
}
