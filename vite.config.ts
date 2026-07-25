import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoName = 'open-models'
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGithubPages ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss()],
})
