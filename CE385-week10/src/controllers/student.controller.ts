// src/controllers/student.controller.ts — ชั้นแปลภาษา HTTP
// หน้าที่มีแค่ 3 อย่าง:
//   1. หยิบข้อมูลที่ผ่านการตรวจแล้วออกจาก res.locals.valid
//   2. เรียก service หนึ่งครั้ง
//   3. ห่อผลเป็น response พร้อม status code ที่ถูกต้อง
// ไม่มี if ที่เป็นกฎของระบบ และไม่รู้ว่าข้อมูลเก็บอยู่ที่ไหน
import type { Request, Response } from "express";
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from "../schemas/student.schema.js";
import * as studentService from "../services/student.service.js";

/* ---------- GET / → อ่านหลายรายการ ---------- */
export async function list(_req: Request, res: Response) {
  const query: ListStudentsQuery = res.locals.valid.query;
  const result = await studentService.listStudents(query);
  res.status(200).json(result); // 200 OK + { data, meta }
}

/* ---------- GET /:id → อ่านรายการเดียว ---------- */
export async function getById(_req: Request, res: Response) {
  const { id } = res.locals.valid.params as { id: string };
  const student = await studentService.getStudentById(id);
  res.status(200).json({ data: student });
}

/* ---------- POST / → สร้างใหม่ ---------- */
export async function create(_req: Request, res: Response) {
  const input: CreateStudentInput = res.locals.valid.body;
  const created = await studentService.createStudent(input);

  // 201 Created + header Location ชี้ไปที่ของใหม่ที่เพิ่งสร้าง
  res.status(201).location(`/api/v1/students/${created.id}`).json({ data: created });
}

/* ---------- PATCH /:id → แก้บางฟิลด์ ---------- */
export async function update(_req: Request, res: Response) {
  const { id } = res.locals.valid.params as { id: string };
  const input: UpdateStudentInput = res.locals.valid.body;
  const updated = await studentService.updateStudent(id, input);
  res.status(200).json({ data: updated });
}

/* ---------- DELETE /:id → ลบ ---------- */
export async function remove(_req: Request, res: Response) {
  const { id } = res.locals.valid.params as { id: string };
  await studentService.deleteStudent(id);

  // 204 No Content — ห้ามใส่ body จึงใช้ .end() ไม่ใช่ .json()
  res.status(204).end();
}