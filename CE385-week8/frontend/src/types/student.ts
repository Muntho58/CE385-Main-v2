// สิ่งที่ backend ส่งกลับมา
export type Student = {
  id: string;
  code: string;
  name: string;
  email: string;
  score: number;
  active: boolean;
  createdAt: string; // วันที่ใน JSON เป็นข้อความ ไม่ใช่ Date
  updatedAt: string;
};

// สิ่งที่ฟอร์มส่งไปตอนเพิ่มหรือแก้ไข — ไม่มี id และวันที่ เพราะ backend สร้างให้
export type StudentInput = {
  code: string;
  name: string;
  email: string;
  score: number;
  active: boolean;
};