import { readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ICONS_DIR = resolve(__dirname, '../src/assets/icons')
const OUTPUT_FILE = resolve(__dirname, '../src/components/icon/iconNames.ts')

const names = readdirSync(ICONS_DIR)
  .filter((file) => file.endsWith('.svg'))
  .map((file) => file.slice(0, -'.svg'.length))
  .sort()

const header = '// 本檔案由 scripts/generate-icon-names.ts 自動產生，請勿手動修改。\n'
const body = `export const ICON_NAMES = [\n${names.map((n) => `  '${n}',`).join('\n')}\n] as const\n\nexport type IconName = (typeof ICON_NAMES)[number]\n`

writeFileSync(OUTPUT_FILE, header + '\n' + body)

console.log(
  `[generate-icon-names] wrote ${names.length} icons to ${join('src/components/icon/iconNames.ts')}`,
)
