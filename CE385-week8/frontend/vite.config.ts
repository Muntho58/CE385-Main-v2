import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← เพิ่ม
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],            // ← เพิ่ม
})