export interface CreateRoomPayload {
  line_uid: string;
  name: string;
  collection_type: string;
  total_target_amount: number | null;
  periodic_amount: number | null;
  promptpay_no: string;
  line_group_id?: string | null;
}