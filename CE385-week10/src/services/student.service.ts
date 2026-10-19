// src/services/student.service.ts — ชั้นตรรกะทางธุรกิจ
// กฎของชั้นนี้:
//   • ห้ามรู้จัก express — ไม่มี req / res / status code
//   • ห้ามรู้จัก prisma — อยากได้ข้อมูลให้ขอผ่าน repository
//   • ห้าม console.log — ใครเรียกไปใช้ก็ต้องได้ผลเหมือนกันหมด
import * as studentRepository from "../repositories/student.repository.js";
import { notFound } from "../errors/app-error.js";
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from "../schemas/student.schema.js";

/* ---------- R: อ่านหลายรายการ + แบ่งหน้า + ค้นหา + เรียง ---------- */
export async function listStudents(query: ListStudentsQuery) {
  const { page, limit, q } = query;

  // ยิงสองคำถามพร้อมกัน — service ไม่ต้องรู้ว่าข้างในเป็น SQL หรืออาร์เรย์
  const [rows, total] = await Promise.all([
    studentRepository.findMany(query),
    studentRepository.count(q),
  ]);

  // การคำนวณจำนวนหน้าเป็นกฎของระบบ จึงอยู่ที่ service ไม่ใช่ repository
  return {
    data: rows,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/* ---------- R: อ่านรายการเดียว ---------- */
export async function getStudentById(id: string) {
  const student = await studentRepository.findById(id);

  // repository คืน null เมื่อหาไม่เจอ
  // การตัดสินว่า "ไม่เจอ = ข้อผิดพลาด" เป็นหน้าที่ของ service
  if (!student) throw notFound(`ไม่พบนักศึกษา id ${id}`);

  return student;
}

/* ---------- C: สร้างใหม่ ---------- */
export async function createStudent(input: CreateStudentInput) {
  return studentRepository.create(input);
}

/* ---------- U: แก้บางฟิลด์ ---------- */
export async function updateStudent(id: string, input: UpdateStudentInput) {
  return studentRepository.update(id, input);
}

/* ---------- D: ลบ ---------- */
export async function deleteStudent(id: string) {
  await studentRepository.remove(id);
}