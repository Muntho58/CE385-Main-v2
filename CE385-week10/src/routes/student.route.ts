// src/routes/students.route.ts — แผนที่ของเส้นทาง
// อ่านไฟล์นี้ไฟล์เดียวต้องตอบได้ว่า มี method + path อะไรบ้าง · ใช้ schema ไหนตรวจ · ส่งต่อให้ controller ตัวไหน
// ไม่มีโค้ดที่ "ทำงาน" อยู่ในไฟล์นี้อีกแล้ว
import { Router } from "express";
import * as studentController from "../controllers/student.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validate } from "../middlewares/validate.js";
import {
  createStudentSchema,
  listStudentsQuerySchema,
  studentIdParamSchema,
  updateStudentSchema,
} from "../schemas/student.schema.js";

export const studentsRouter = Router();

studentsRouter.get(
  "/",
  validate({ query: listStudentsQuerySchema }),
  asyncHandler(studentController.list),
);

studentsRouter.get(
  "/:id",
  validate({ params: studentIdParamSchema }),
  asyncHandler(studentController.getById),
);

studentsRouter.post(
  "/",
  validate({ body: createStudentSchema }),
  asyncHandler(studentController.create),
);

studentsRouter.patch(
  "/:id",
  validate({ params: studentIdParamSchema, body: updateStudentSchema }),
  asyncHandler(studentController.update),
);

studentsRouter.delete(
  "/:id",
  validate({ params: studentIdParamSchema }),
  asyncHandler(studentController.remove),
);