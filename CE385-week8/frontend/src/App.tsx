import { useEffect, useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import { createStudent, deleteStudent, getErrorMessage, listStudents, updateStudent } from "./api/student";
import type { Student, StudentInput } from "./types/student";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // R — โหลดรายชื่อจาก backend ครั้งเดียวตอนหน้าเปิดขึ้นมา ([] = ไม่ต้องทำซ้ำ)
  useEffect(() => {
    listStudents()
      .then((data) => setStudents(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

    // C / U — ฟอร์มเรียกฟังก์ชันนี้ · ถ้า backend ตอบ error จะโยนกลับไปให้ฟอร์มแสดง
  async function handleSubmit(input: StudentInput) {
    if (editing) {
      await updateStudent(editing.id, input);
      setEditing(null);
    } else {
      await createStudent(input);
    }
    setStudents(await listStudents()); // โหลดใหม่ให้ตารางตรงกับฐานข้อมูล
  }

  // D — ถามก่อนลบเสมอ
  async function handleDelete(student: Student) {
    if (!confirm(`ลบ ${student.name} ใช่ไหม?`)) return;
    try {
      await deleteStudent(student.id);
      setStudents(await listStudents());
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

    return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">ระบบจัดการนักศึกษา</h1>
        <p className="text-slate-500">CE385 สัปดาห์ที่ 13 — React + TypeScript + Tailwind + Axios</p>
      </header>

      {error && <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}

      {/* key เปลี่ยน = React สร้างฟอร์มใหม่ ค่าในช่องกรอกจึงเปลี่ยนตามคนที่กดแก้ไข */}
      <StudentForm
        key={editing ? editing.id : "new"}
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />

      <section className="overflow-hidden rounded-xl bg-white shadow">
        {loading ? (
          <p className="p-8 text-center text-slate-500">กำลังโหลด...</p>
        ) : (
          <StudentTable students={students} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </section>
    </main>
  );
}