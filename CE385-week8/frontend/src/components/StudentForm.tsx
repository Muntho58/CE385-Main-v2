import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../api/student";
import type { Student, StudentInput } from "../types/student";

type Props = {
  editing: Student | null;
  onSubmit: (input: StudentInput) => Promise<void>;
  onCancel: () => void;
};

const empty: StudentInput = { code: "", name: "", email: "", score: 0, active: true };

// เลือกเฉพาะฟิลด์ที่ส่งได้ — backend ใช้ strictObject ถ้าส่ง id หรือ createdAt ไปด้วยจะโดน 422
function toInput(s: Student): StudentInput {
  return { code: s.code, name: s.name, email: s.email, score: s.score, active: s.active };
}

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

export default function StudentForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<StudentInput>(editing ? toInput(editing) : empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ไม่ให้เบราว์เซอร์โหลดหน้าใหม่
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
      if (!editing) setForm(empty); // เพิ่มสำเร็จ → ล้างฟอร์ม
    } catch (err) {
      setError(getErrorMessage(err)); // 422 / 409 จาก backend มาขึ้นตรงนี้
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-700">
        {editing ? `แก้ไข: ${editing.name}` : "เพิ่มนักศึกษา"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">รหัสนักศึกษา</span>
          <input
            className={inputClass}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">ชื่อ–นามสกุล</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-600">อีเมล</span>
          <input
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">คะแนน (0–100)</span>
          <input
            type="number"
            className={inputClass}
            value={form.score}
            onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        <span className="text-slate-700">กำลังศึกษา</span>
      </label>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : editing ? "บันทึกการแก้ไข" : "เพิ่ม"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}