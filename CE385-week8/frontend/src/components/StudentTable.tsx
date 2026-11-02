import type { Student } from "../types/student";

type Props = {
  students: Student[];
  onEdit: (student: Student) => void;    // กดแก้ไข → แจ้งพ่อว่าคนไหน
  onDelete: (student: Student) => void;  // กดลบ → แจ้งพ่อว่าคนไหน
};

export default function StudentTable({ students, onEdit, onDelete }: Props) {
  if (students.length === 0) {
    return <p className="p-8 text-center text-slate-500">ยังไม่มีข้อมูลนักศึกษา</p>;
  }

  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-sm text-slate-500">
        <tr>
          <th className="p-3">รหัส</th>
          <th className="p-3">ชื่อ–นามสกุล</th>
          <th className="p-3">อีเมล</th>
          <th className="p-3 text-right">คะแนน</th>
          <th className="p-3">สถานะ</th>
          <th className="p-3"></th>
        </tr>
      </thead>

      <tbody>
        {students.map((s) => (
          <tr key={s.id} className="border-t border-slate-100">
            <td className="p-3 font-mono">{s.code}</td>
            <td className="p-3">{s.name}</td>
            <td className="p-3 text-slate-500">{s.email}</td>
            <td className="p-3 text-right">{s.score}</td>
            <td className="p-3">
              {s.active ? (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">กำลังศึกษา</span>
              ) : (
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">พ้นสภาพ</span>
              )}
            </td>
            <td className="space-x-2 p-3 text-right">
              <button onClick={() => onEdit(s)} className="text-blue-600 hover:underline">
                แก้ไข
              </button>
              <button onClick={() => onDelete(s)} className="text-red-600 hover:underline">
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}