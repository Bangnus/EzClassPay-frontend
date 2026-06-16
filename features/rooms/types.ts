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
  };
  room: {
    name: string;
    lineGroupId: string;
  };
}
