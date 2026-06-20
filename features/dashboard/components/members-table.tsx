import React, { useEffect, useState } from "react";
import { Room } from "@/features/rooms/types";
import { getRoomMembers, removeRoomMember } from "@/features/rooms/services";
import { History, Trash2 } from "lucide-react";
import Spinner from "@/components/ui/spinner";

interface MembersTableProps {
  roomId: string;
}

export default function MembersTable({ roomId }: MembersTableProps) {
  const [members, setMembers] = useState<Room["members"]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getRoomMembers(roomId);
      setMembers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [roomId]);

  const handleRemove = async (userId: string, name: string) => {
    if (!confirm(`คุณต้องการลบ ${name} ออกจากห้องใช่หรือไม่?`)) return;

    try {
      await removeRoomMember(roomId, userId);
      setMembers(members.filter((m) => m.userId !== userId));
    } catch (error) {
      alert("ไม่สามารถลบผู้ใช้ได้");
    }
  };

  const handleView = (userId: string) => {
    const url = new URL(`${window.location.origin}/member-history`);
    url.searchParams.set("roomId", roomId);
    url.searchParams.set("userId", userId);
    window.location.href = url.toString();
  };

  if (loading) {
    return <Spinner text="กำลังโหลดข้อมูลสมาชิก..." />;
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
      <div className="p-4 border-b border-border bg-white">
        <h2 className="font-bold text-text-primary text-lg">
          รายชื่อสมาชิก ({members.length})
        </h2>
      </div>

      {members.length === 0 ? (
        <div className="p-8 text-center text-text-secondary">
          ยังไม่มีสมาชิกในห้องนี้
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-text-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">ชื่อสมาชิก</th>
                <th className="px-4 py-3 font-semibold">วันที่เข้าร่วม</th>
                <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {members.map((member) => (
                <tr
                  key={member.userId}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {member.user.pictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.user.pictureUrl}
                          alt="profile"
                          className="w-8 h-8 rounded-full border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {member.user.displayName.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-text-primary">
                        {member.user.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(member.joinedAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(member.userId)}
                        className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <History size={14} />
                        ประวัติ
                      </button>
                      <button
                        onClick={() =>
                          handleRemove(member.userId, member.user.displayName)
                        }
                        className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
