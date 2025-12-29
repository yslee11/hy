import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages repository name. 
  // If your repository name is different from 'hy_urban', change this line.
  // e.g. base: '/my-repo-name/'
  base: '/hy_urban/', 
})