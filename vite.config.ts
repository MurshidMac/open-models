import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'open-models'
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const basePath = process.env.VITE_BASE_PATH || (isGithubPages ? `/${repoName}/` : './')

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
})
