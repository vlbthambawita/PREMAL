#!/usr/bin/env node
// Overflow checker for built decks.
//
// ~900 slides is too many to eyeball. This opens every slide of every built
// deck at its true 980x552 size, with all click-steps revealed, and reports any
// slide whose content spills past the slide edge.
//
//   node check.mjs                 check every deck in ../decks
//   node check.mjs nexus-2024 ...  check only the named slugs
//
// Exits non-zero if anything overflows, so CI can gate on it.
//
// Notes on why it works this way:
//   * The /print route only materialises the current slide, so it cannot be
//     used to measure every slide in a single load.
//   * The production build exposes no nav API, so slides are reached by URL.
//     The SPA stays warm in the browser cache, so this is cheaper than it looks.
//   * .slidev-layout does not scroll — content simply spills outside it — so
//     scrollHeight reports nothing. Descendant bounding boxes are measured
//     instead.

import { createServer } from 'node:http'
import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { chromium } from 'playwright-chromium'

const DECKS = resolve(import.meta.dirname, '..', 'decks')
const BASE_PREFIX = '/PREMAL'
const SLIDE_W = 980
const SLIDE_H = 552
// Sub-pixel layout rounding is not an overflow.
const SLACK = 4
const MAX_SLIDES = 200

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf',
}

// Runs inside the page: how far past the slide box does anything reach?
function measure() {
  // Slidev keeps previous/next slides mounted for transitions; those have zero
  // height. The visible one is the tallest.
  let layout = null
  for (const el of document.querySelectorAll('.slidev-layout')) {
    const h = el.getBoundingClientRect().height
    if (h > 0 && (!layout || h > layout.getBoundingClientRect().height)) layout = el
  }
  if (!layout) return null
  const box = layout.getBoundingClientRect()
  let bottom = box.top
  let right = box.left
  for (const el of layout.querySelectorAll('*')) {
    // KaTeX keeps a hidden MathML copy of every formula whose reported box is
    // meaningless (thousands of px wide). The .katex root itself is measured.
    if (el.parentElement?.closest('.katex')) continue
    const s = getComputedStyle(el)
    // Slidev's own chrome sits outside the slide by design.
    if (s.display === 'none' || s.visibility === 'hidden' || s.position === 'fixed') continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (r.bottom > bottom) bottom = r.bottom
    if (r.right > right) right = r.right
  }
  return {
    height: Math.round(box.height),
    overY: Math.round(bottom - box.bottom),
    overX: Math.round(right - box.right),
    title: (layout.querySelector('h1, h2')?.textContent ?? '').trim().slice(0, 48),
    key: `${Math.round(box.height)}|${(layout.textContent ?? '').replace(/\s+/g, ' ').trim()}`,
  }
}

async function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      if (path.startsWith(`${BASE_PREFIX}/decks/`)) path = path.slice(`${BASE_PREFIX}/decks`.length)
      let file = join(DECKS, path)
      if (!file.startsWith(DECKS)) return res.writeHead(403).end()
      let isFile = false
      try { isFile = (await stat(file)).isFile() } catch { isFile = false }
      if (!isFile) {
        // SPA fallback: any unknown path under a deck serves that deck's shell.
        const slug = path.split('/').filter(Boolean)[0]
        file = join(DECKS, slug ?? '', 'index.html')
      }
      if (!existsSync(file)) return res.writeHead(404).end()
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
      res.end(await readFile(file))
    } catch {
      res.writeHead(500).end()
    }
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  return server
}

async function main() {
  if (!existsSync(DECKS)) {
    console.error(`no built decks at ${DECKS} — run ./build.sh first`)
    process.exit(1)
  }

  let slugs = process.argv.slice(2)
  if (slugs.length === 0) {
    const entries = await readdir(DECKS, { withFileTypes: true })
    slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  }
  if (slugs.length === 0) {
    console.error('no decks to check')
    process.exit(1)
  }

  const server = await startServer()
  const port = server.address().port
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: SLIDE_W, height: SLIDE_H } })

  let failed = 0
  for (const slug of slugs) {
    const deckUrl = `http://127.0.0.1:${port}${BASE_PREFIX}/decks/${slug}`
    const bad = []
    let n = 0
    try {
      // The build exposes no slide count and the URL does not clamp: an
      // out-of-range index re-renders a slide that has already been shown. So
      // the walk ends at the first repeated slide, and that repeat is NOT
      // counted — otherwise every deck reports one slide too many.
      const seen = new Set()
      for (let i = 1; i <= MAX_SLIDES; i++) {
        await page.goto(`${deckUrl}/${i}?clicks=999`, { waitUntil: 'networkidle', timeout: 60000 })
        // Mermaid and KaTeX settle after networkidle.
        await page.waitForTimeout(i === 1 ? 1200 : 450)
        const m = await page.evaluate(measure)
        if (!m || m.height === 0) break
        if (seen.has(m.key)) break
        seen.add(m.key)
        n = i
        if (m.overY > SLACK || m.overX > SLACK) bad.push({ slide: i, ...m })
      }
    } catch (err) {
      console.log(`! ${slug}: ${err.message ?? err}`)
      failed++
      continue
    }

    if (bad.length) {
      failed++
      console.log(`✗ ${slug} (${n} slides)`)
      for (const b of bad) {
        const parts = []
        if (b.overY > SLACK) parts.push(`${b.overY}px too tall`)
        if (b.overX > SLACK) parts.push(`${b.overX}px too wide`)
        console.log(`    slide ${b.slide} "${b.title}": ${parts.join(', ')}`)
      }
    } else {
      console.log(`✓ ${slug} (${n} slides)`)
    }
  }

  await browser.close()
  server.close()

  console.log(`\n${slugs.length - failed}/${slugs.length} decks clean`)
  process.exit(failed ? 1 : 0)
}

main()
