import axios from "axios";
import { api } from "./client";
import type { Student, StudentInput } from "../types/student";

// R — GET /students  (ยังไม่ทำแบ่งหน้า ขอมาทีเดียว 100 คน)
export async function listStudents(): Promise<Student[]> {
  const res = await api.get<{ data: Student[] }>("/students", {
    params: { limit: 100 },
  });
  return res.data.data;
}

// C — POST /students → 201
export async function createStudent(input: StudentInput): Promise<Student> {
  const res = await api.post<{ data: Student }>("/students", input);
  return res.data.data;
}

// U — PATCH /students/:id → 200
export async function updateStudent(id: string, input: StudentInput): Promise<Student> {
  const res = await api.patch<{ data: Student }>(`/students/${id}`, input);
  return res.data.data;
}

// D — DELETE /students/:id → 204 (ไม่มี body กลับมา)
export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
// รูปร่าง error ที่ backend ส่งมาทุกครั้ง (error-handler ของสัปดาห์ 8)
type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

// แปลง error อะไรก็ตาม ให้เป็นข้อความที่ขึ้นบนหน้าจอได้
export function getErrorMessage(err: unknown): string {
  if (!axios.isAxiosError<ApiErrorBody>(err)) return "เกิดข้อผิดพลาดที่ไม่คาดคิด";

  // ไม่มี response เลย = ติดต่อ backend ไม่ได้ (ปิดอยู่ หรือโดน CORS บล็อก)
  if (!err.response) return "ติดต่อ backend ไม่ได้ — เซิร์ฟเวอร์ปิดอยู่ หรือโดน CORS บล็อก (ดูที่ Console)";

  const { message, details } = err.response.data.error;
  // 422: details เป็นรายการ { field, message } — รวมข้อความทุกช่องที่ผิด
  if (Array.isArray(details)) {
    return details.map((d: { message: string }) => d.message).join(" · ");
  }
  return message; // 404, 409 ฯลฯ
}