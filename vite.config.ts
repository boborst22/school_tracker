import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://prosek.shop/boborst22/school_tracker/",
  plugins: [react()],
})
