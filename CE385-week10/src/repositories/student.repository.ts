// src/repositories/student.repository.ts — ชั้นเข้าถึงข้อมูล
// กฎของชั้นนี้:
//   • เป็นชั้นเดียวที่รู้ว่าข้อมูลเก็บอยู่ที่ไหน และเรียก prisma ได้
//   • ไม่รู้จัก express และไม่โยน AppError — หาไม่เจอก็คืน null เฉย ๆ
import { prisma } from "../lib/prisma.js";
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from "../schemas/student.schema.js";

// where ว่าง = ไม่กรองอะไร · mode: "insensitive" = ไม่สนตัวพิมพ์เล็กใหญ่
function buildWhere(q?: string) {
  return q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { code: { contains: q } },
        ],
      }
    : {};
}

/* ---------- อ่านหลายแถว ตามหน้า คำค้น และการเรียง ---------- */
export function findMany(query: ListStudentsQuery) {
  const { page, limit, q, sort, order } = query;

  return prisma.student.findMany({
    where: buildWhere(q),
    orderBy: { [sort]: order },
    skip: (page - 1) * limit, // ข้ามของหน้าก่อน ๆ
    take: limit, // เอามาแค่เท่าที่ขอ
  });
}

/* ---------- นับจำนวนแถวที่ตรงกับคำค้น ---------- */
export function count(q?: string) {
  return prisma.student.count({ where: buildWhere(q) });
}

/* ---------- อ่านแถวเดียว — หาไม่เจอคืน null ---------- */
export function findById(id: string) {
  return prisma.student.findUnique({ where: { id } });
}

/* ---------- เพิ่มแถวใหม่ ---------- */
export function create(data: CreateStudentInput) {
  return prisma.student.create({ data });
}

/* ---------- แก้บางฟิลด์ของแถวเดิม ---------- */
export function update(id: string, data: UpdateStudentInput) {
  return prisma.student.update({ where: { id }, data });
}

/* ---------- ลบแถว ---------- */
export function remove(id: string) {
  return prisma.student.delete({ where: { id } });
}