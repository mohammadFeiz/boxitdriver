import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// import fs from 'fs'
// import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    // host: '0.0.0.0',
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    // },
    allowedHosts:[
      "myboxi",
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
