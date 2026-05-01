// 純函式日期工具，皆以本地時區運算。
// 不引入 dayjs / date-fns，避免擴大 runtime 依賴。

export function startOfDay(d: Date): Date {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  return r
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** 僅比較 Y/M/D。 */
export function compareDate(a: Date, b: Date): -1 | 0 | 1 {
  const ay = a.getFullYear()
  const by = b.getFullYear()
  if (ay !== by) return ay < by ? -1 : 1
  const am = a.getMonth()
  const bm = b.getMonth()
  if (am !== bm) return am < bm ? -1 : 1
  const ad = a.getDate()
  const bd = b.getDate()
  if (ad !== bd) return ad < bd ? -1 : 1
  return 0
}

/** d 是否落在 [start, end] 區間內（含端點，僅比 Y/M/D）。任一端為 null 視為無界。 */
export function isInRange(d: Date, start: Date | null, end: Date | null): boolean {
  if (start && compareDate(d, start) < 0) return false
  if (end && compareDate(d, end) > 0) return false
  return true
}

export function isDisabled(
  d: Date,
  min?: Date,
  max?: Date,
  predicate?: (d: Date) => boolean,
): boolean {
  if (min && compareDate(d, min) < 0) return true
  if (max && compareDate(d, max) > 0) return true
  if (predicate?.(d)) return true
  return false
}

export function clamp(d: Date, min?: Date, max?: Date): Date {
  if (min && compareDate(d, min) < 0) return new Date(min)
  if (max && compareDate(d, max) > 0) return new Date(max)
  return new Date(d)
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  const targetMonth = r.getMonth() + n
  const targetYear = r.getFullYear() + Math.floor(targetMonth / 12)
  const normalizedMonth = ((targetMonth % 12) + 12) % 12
  // 處理月底跨月：例如 1/31 + 1 month 應為 2 月底，不是 3/3
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
  r.setFullYear(targetYear, normalizedMonth, Math.min(r.getDate(), lastDay))
  return r
}

export function addYears(d: Date, n: number): Date {
  return addMonths(d, n * 12)
}

/**
 * 產生月曆矩陣（6 週 × 7 日，含前後月補齊）。
 * year / month 為西元年與 0-base 月份；firstDayOfWeek 0=週日 1=週一。
 */
export function getCalendarMatrix(year: number, month: number, firstDayOfWeek: 0 | 1): Date[][] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - firstDayOfWeek + 7) % 7
  const start = addDays(first, -offset)
  const matrix: Date[][] = []
  for (let w = 0; w < 6; w++) {
    const row: Date[] = []
    for (let d = 0; d < 7; d++) {
      row.push(addDays(start, w * 7 + d))
    }
    matrix.push(row)
  }
  return matrix
}

// ── format / parse ───────────────────────────────────────────────────────────
// 採 token 切片掃描，避免 `MM`（月）與 `mm`（分）互相誤替換。

const TOKENS = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss'] as const
type Token = (typeof TOKENS)[number]

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function getTokenValue(d: Date, tk: Token): string {
  switch (tk) {
    case 'YYYY':
      return String(d.getFullYear()).padStart(4, '0')
    case 'MM':
      return pad2(d.getMonth() + 1)
    case 'DD':
      return pad2(d.getDate())
    case 'HH':
      return pad2(d.getHours())
    case 'mm':
      return pad2(d.getMinutes())
    case 'ss':
      return pad2(d.getSeconds())
  }
}

/** 將 fmt 字串切成 token 與 literal 片段。 */
function tokenize(
  fmt: string,
): Array<{ type: 'token'; value: Token } | { type: 'literal'; value: string }> {
  const out: Array<{ type: 'token'; value: Token } | { type: 'literal'; value: string }> = []
  let i = 0
  while (i < fmt.length) {
    let matched: Token | null = null
    for (const tk of TOKENS) {
      if (fmt.startsWith(tk, i)) {
        matched = tk
        break
      }
    }
    if (matched) {
      out.push({ type: 'token', value: matched })
      i += matched.length
    } else {
      const last = out[out.length - 1]
      if (last && last.type === 'literal') {
        last.value += fmt[i]
      } else {
        out.push({ type: 'literal', value: fmt[i]! })
      }
      i += 1
    }
  }
  return out
}

export function formatDate(d: Date, fmt: string): string {
  return tokenize(fmt)
    .map((part) => (part.type === 'token' ? getTokenValue(d, part.value) : part.value))
    .join('')
}

const TOKEN_LENGTHS: Record<Token, number> = {
  YYYY: 4,
  MM: 2,
  DD: 2,
  HH: 2,
  mm: 2,
  ss: 2,
}

/**
 * 嚴格依 fmt 解析字串為 Date；解析失敗或日期非法回傳 null。
 * 未提供時間 token 時，HH/mm/ss 視為 0。
 */
export function parseDate(s: string, fmt: string): Date | null {
  const parts = tokenize(fmt)
  let cursor = 0
  const values: Partial<Record<Token, number>> = {}

  for (const part of parts) {
    if (part.type === 'literal') {
      if (s.slice(cursor, cursor + part.value.length) !== part.value) return null
      cursor += part.value.length
    } else {
      const len = TOKEN_LENGTHS[part.value]
      const slice = s.slice(cursor, cursor + len)
      if (slice.length !== len || !/^\d+$/.test(slice)) return null
      values[part.value] = Number(slice)
      cursor += len
    }
  }
  if (cursor !== s.length) return null

  const year = values.YYYY
  const month = values.MM
  const day = values.DD
  if (year === undefined || month === undefined || day === undefined) return null
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null

  const hour = values.HH ?? 0
  const minute = values.mm ?? 0
  const second = values.ss ?? 0
  if (hour > 23 || minute > 59 || second > 59) return null

  const d = new Date(year, month - 1, day, hour, minute, second, 0)
  // 驗證合法性（避免 2026-02-30 被 normalize 為 03-02）
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day ||
    d.getHours() !== hour ||
    d.getMinutes() !== minute ||
    d.getSeconds() !== second
  ) {
    return null
  }
  return d
}

/** 預設格式：依 mode 推導。 */
export function defaultFormat(mode: 'single' | 'range' | 'multiple' | 'datetime'): string {
  return mode === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
}
