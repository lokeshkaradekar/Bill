import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

function inlineRequestRE() {
  return /[?&]inline\b/
}

// Forces `import url from './x.png?inline'` to be embedded as a
// `data:image/...;base64,...` URI directly inside the bundle at build time.
// This keeps the export pipeline (html-to-image / canvas) 100% offline: it
// never needs to fetch() a file:// asset inside the Android WebView.
function forceInlineAssets() {
  return {
    name: 'rkk-force-inline-assets',
    enforce: 'pre',
    async load(id) {
      if (!inlineRequestRE().test(id)) return null
      const file = id.split(/[?&]/)[0]
      const ext = path.extname(file).toLowerCase()
      const mime = MIME_BY_EXT[ext] || 'application/octet-stream'
      const content = await readFile(file)
      const dataUrl = `data:${mime};base64,${content.toString('base64')}`
      return `export default ${JSON.stringify(dataUrl)}`
    },
  }
}

export default defineConfig({
  plugins: [forceInlineAssets(), react()],
  base: './',
  build: {
    // Insurance: any other imported asset stays embedded as a data URI so the
    // built app never depends on fetching file:// resources at runtime.
    assetsInlineLimit: 100000000,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
