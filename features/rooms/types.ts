export interface Room {
  id: string;
  managerId: string;
  name: string;
  collectionType: string;
  totalTargetAmount: number | null;
  periodicAmount: number;
  promptpayNo: string;
  isPremium: boolean;
  lineGroupId: string | null;
  createdAt: string;
  autoBillingEnabled?: boolean;
  billingDayOfMonth?: number | null;
  members: {
    userId: string;
    joinedAt: string;
    user: { displayName: string; pictureUrl?: string };
  }[];
  manager: { displayName: string; pictureUrl?: string; lineUid: string };
  periods: unknown[];
  payments?: { period?: { amount: number } }[];
  expenses?: { amount: number }[];
}

export interface CreateRoomPayload {
  line_uid: string;
  name: string;
  collection_type: string;
  total_target_amount: number | null;
  periodic_amount: number | null;
  promptpay_no: string;
  line_group_id?: string | null;
}

export interface Payment {
  id: string;
  roomId: string;
  lineUid: string;
  slipUrl: string | null;
  status: "AWAITING_SLIP" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    lineUid: string;
    pictureUrl?: string;
  };
  room: {
    name: string;
    lineGroupId: string;
  };
  period?: {
    name: string;
    amount: number;
  };
}
