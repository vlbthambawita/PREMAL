#!/usr/bin/env node
// Interaction check for the hands-on deck (fhe-by-hand).
//
// check.mjs proves the slides fit. This proves the widgets on them still work:
// it serves the built deck, drives every control the way a student would, and
// asserts the arithmetic that appears on screen. If a component silently stops
// reacting, or the slides get reordered, this fails.
//
//   ./build.sh fhe-by-hand && node interact-check.mjs
//
// Slide numbers are hard-coded, so reordering fhe-by-hand.md means updating
// the go(n) calls below.

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { chromium } from 'playwright-chromium'

const DECKS = resolve('/Users/vlbthambawita/Documents/CODE/PREMAL/decks')
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf' }
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p.startsWith('/PREMAL/decks')) p = p.slice('/PREMAL/decks'.length)
  let file = join(DECKS, p)
  let isFile = false
  try { isFile = (await stat(file)).isFile() } catch {}
  if (!isFile) file = join(DECKS, p.split('/').filter(Boolean)[0] ?? '', 'index.html')
  if (!existsSync(file)) return res.writeHead(404).end()
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(await readFile(file))
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}/PREMAL/decks/fhe-by-hand`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const fails = []
const check = (name, cond, got) => {
  console.log(`${cond ? '✓' : '✗'} ${name}${cond ? '' : `  → got: ${got}`}`)
  if (!cond) fails.push(name)
}
async function go(n) {
  await page.goto(`${base}/${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
}
// Slidev keeps the neighbouring slides mounted at zero height, so `.first()`
// can return a stale copy. Pick the instance that actually occupies space.
async function widget(sel) {
  const all = page.locator(sel)
  for (let i = 0; i < (await all.count()); i++) {
    const box = await all.nth(i).boundingBox()
    if (box && box.height > 10) return all.nth(i)
  }
  throw new Error(`no visible ${sel}`)
}
const setSlider = async (loc, value) => {
  await loc.evaluate((el, v) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(el, String(v))
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
  await page.waitForTimeout(250)
}

// --- Slide 6: LWE encrypt / decrypt -----------------------------------------
await go(6)
const lwe = await widget('.lwe')
check('LweDemo renders', await lwe.isVisible())
const sliders = lwe.locator('input[type=range]')
await setSlider(sliders.nth(0), 2)          // m = 2
await setSlider(sliders.nth(1), 3)          // e = +3
let verdict = await lwe.locator('.verdict').innerText()
// q=64, delta=16, <a,s>=5*3+9*1=24 -> b = 24+32+3 = 59 ; (59-24)/16 = 2.1875 -> 2
check('m=2,e=3 decrypts to 2 and says correct', /recovered m = 2/.test(verdict) && /correct/.test(verdict), verdict.replace(/\n/g,' '))
const bLine = await lwe.locator('.out').innerText()
check('ciphertext b computed as 59', /b = 59/.test(bLine), bLine)
await setSlider(sliders.nth(1), 9)          // e = 9 > delta/2 = 8
verdict = await lwe.locator('.verdict').innerText()
check('e=9 breaks decryption', /✗/.test(verdict), verdict.replace(/\n/g,' '))

// --- Slide 7: noise budget with operation buttons ---------------------------
await go(7)
const lab = await widget('.lwe')
const noiseBefore = await lab.locator('.glabel').innerText()
await lab.getByRole('button', { name: '× ciphertext' }).click()
await page.waitForTimeout(250)
const noiseAfter = await lab.locator('.glabel').innerText()
check('"× ciphertext" squares the noise (2 → 4)', /\|e\| = 2 /.test(noiseBefore) && /\|e\| = 4 /.test(noiseAfter), `${noiseBefore} -> ${noiseAfter}`)
await lab.getByRole('button', { name: '× ciphertext' }).click()
await page.waitForTimeout(250)
check('second ct×ct breaks it (16 ≥ 8)', /✗/.test(await lab.locator('.verdict').innerText()), await lab.locator('.verdict').innerText())
await lab.getByRole('button', { name: 'bootstrap' }).click()
await page.waitForTimeout(250)
check('bootstrap restores correctness', /✓/.test(await lab.locator('.verdict').innerText()), await lab.locator('.verdict').innerText())

// --- Slide 11: rotate-and-sum ----------------------------------------------
await go(11)
const rs = await widget('.rs')
check('RotateSum renders', await rs.isVisible())
for (let i = 0; i < 3; i++) {
  await rs.locator('button').first().click()
  await page.waitForTimeout(200)
}
const cells = await rs.locator('.row .cell').allInnerTexts()
// 3+1+4+1+5+9+2+6 = 31 in every slot after 3 folds
check('3 folds put the total (31) in every slot', cells.length === 8 && cells.every((c) => c.trim() === '31'), cells.join(','))
check('reports 3 of log2(8) rotations', /rotations used:\s*3/.test(await rs.locator('.count').innerText()), await rs.locator('.count').innerText())

// --- Slide 14: encrypted forward pass --------------------------------------
await go(14)
const tn = await widget('.tn')
check('TinyNet renders', await tn.isVisible())
const tSliders = tn.locator('input[type=range]')
await setSlider(tSliders.nth(0), 3)   // x1
await setSlider(tSliders.nth(1), 1)   // x2
check('result hidden before decrypting', /the server never learns/.test(await tn.locator('.result').innerText()))
await tn.getByRole('button', { name: 'decrypt the result' }).click()
await page.waitForTimeout(400)
let res = await tn.locator('.result').innerText()
// h=(6,4) -> a=(36,16) -> y = 36-16+2 = 22
check('x=(3,1) decrypts to 22, correct', /22/.test(res) && /✓/.test(res), res.replace(/\n/g,' '))
await setSlider(tSliders.nth(2), 2)   // e0 = 2 -> noise 8 -> 64 -> 128 > 60
res = await tn.locator('.result').innerText()
check('e0=2 makes the answer fail', /✗/.test(res) && /plaintext answer was 22/.test(res), res.replace(/\n/g,' '))

// --- Slide 15: polynomial plot ---------------------------------------------
await go(15)
const pp = await widget('.pp')
check('PolyPlot renders', await pp.isVisible())
const errsNarrow = await pp.locator('.chk b').allInnerTexts()
await setSlider(pp.locator('input[type=range]').first(), 10)
const errsWide = await pp.locator('.chk b').allInnerTexts()
check('widening the range blows up both errors',
  parseFloat(errsWide[0]) > parseFloat(errsNarrow[0]) && parseFloat(errsWide[1]) > parseFloat(errsNarrow[1]),
  `${errsNarrow.join('/')} -> ${errsWide.join('/')}`)
// Worst case sits at x = −r, where ReLU is 0 and x² is r².
check('x² worst error over ±10 is 100', Math.abs(parseFloat(errsWide[0]) - 100) < 0.6, errsWide[0])

await browser.close(); server.close()
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall interactive checks passed')
process.exit(fails.length ? 1 : 0)
