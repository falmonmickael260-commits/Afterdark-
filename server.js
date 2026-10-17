// Petit serveur statique sans dépendance, pour servir le build Vite (dossier
// dist/) en production — notamment sur Railway. Sert index.html pour toute
// route inconnue (SPA fallback), puisque le routage se fait côté client.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const DIST_DIR = join(import.meta.dirname, 'dist')
const PORT = process.env.PORT || 3000

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function resolveFile(urlPath) {
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  const candidate = join(DIST_DIR, safePath)
  if (!candidate.startsWith(DIST_DIR)) return join(DIST_DIR, 'index.html')
  try {
    const info = await stat(candidate)
    if (info.isFile()) return candidate
  } catch {
    // tombe sur le fallback SPA ci-dessous
  }
  return join(DIST_DIR, 'index.html')
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
    const filePath = await resolveFile(urlPath)
    const body = await readFile(filePath)
    const contentType = MIME_TYPES[extname(filePath)] ?? 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(body)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Erreur serveur')
    console.error(err)
  }
})

server.listen(PORT, () => {
  console.log(`After Dark sert dist/ sur le port ${PORT}`)
})
