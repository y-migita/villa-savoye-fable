/**
 * 各カメラプリセットのスクリーンショットを docs/shots/ に書き出す。
 *   node scripts/shots.mjs [baseURL]
 * 事前に dev サーバー(または preview)を立てておくこと。
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = new URL('../docs/shots/', import.meta.url).pathname

// [ファイル名, 押すボタンのラベル(null=そのまま), 追加トグル]
const SHOTS = [
  ['01-northwest', null, []],
  ['02-approach', '正面アプローチ', []],
  ['03-garden-southeast', '南東(庭側)', []],
  ['04-hanging-garden', '空中庭園', []],
  ['05-solarium', '屋上ソラリウム', []],
  ['06-entrance-hall', '玄関ホール', []],
  ['07-aerial-dimensions', '俯瞰', ['寸法']],
  ['08-section', '北西外観', ['断面']],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=2'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
})
const page = await browser.newPage()
await page.goto(BASE, { waitUntil: 'networkidle0' })
await sleep(2500)

async function click(label) {
  await page.evaluate((l) => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent?.trim().startsWith(l),
    )
    btn?.click()
  }, label)
}

for (const [name, view, toggles] of SHOTS) {
  if (view) await click(view)
  for (const t of toggles) await click(t)
  await sleep(2800)
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 88 })
  // トグルは戻しておく
  for (const t of toggles) await click(t)
  console.log('saved', name)
}

await browser.close()
