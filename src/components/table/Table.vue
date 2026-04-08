<template>
  <div class="table-wrapper overflow-auto" :style="wrapperStyle">
    <table
      class="w-full border-collapse text-sm text-(--rui-color-text-primary)"
      :aria-busy="loading || undefined"
    >
      <caption v-if="caption" class="sr-only">
        {{
          caption
        }}
      </caption>
      <thead
        :class="[
          'bg-(--rui-color-table-header-bg)',
          stickyHeader ? 'sticky top-0 z-[--rui-z-table-sticky-header]' : '',
        ]"
      >
        <tr>
          <!-- 選取 checkbox header -->
          <th v-if="selectable" scope="col" class="table-th w-10 text-center">
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              :aria-label="allSelected ? '取消全選' : '全選'"
              class="table-checkbox"
              @change="onToggleAll"
            />
          </th>

          <TableColumnHeader
            v-for="(col, colIndex) in columns"
            :key="col.key"
            :label="col.label"
            :sortable="col.sortable ?? false"
            :sorted="sortKey === col.key ? (sortOrder ?? null) : null"
            :align="col.align ?? 'left'"
            :frozen="col.frozen ?? false"
            :last-frozen="lastFrozenIndex === colIndex"
            :col-left="frozenLeftMap[colIndex] ?? '0px'"
            :width="col.width"
            :class="[stickyHeader && col.frozen ? 'z-[--rui-z-table-sticky-header-col]' : '']"
            @click="onSortClick(col)"
          >
            <template v-if="$slots[`header-${col.key}`]">
              <slot :name="`header-${col.key}`" />
            </template>
          </TableColumnHeader>
        </tr>
      </thead>

      <tbody>
        <template v-for="(item, itemIndex) in rows" :key="itemIndex">
          <!-- 分組 -->
          <template v-if="isTableRowGroup(item)">
            <!-- 分組 header 列 -->
            <tr class="bg-(--rui-color-table-header-bg)">
              <td
                :colspan="selectable ? columns.length + 1 : columns.length"
                class="table-td font-semibold text-(--rui-color-text-secondary)"
              >
                <slot name="group-header" :group="item.group">
                  {{ item.group }}
                </slot>
              </td>
            </tr>

            <!-- 分組內的資料列 -->
            <tr
              v-for="row in item.rows"
              :key="getRowKey(row)"
              :class="[
                'border-t border-(--rui-color-table-border) transition-colors',
                'hover:bg-(--rui-color-table-row-hover)',
                selectable && isSelected(getRowKey(row))
                  ? 'bg-(--rui-color-table-row-selected)'
                  : '',
              ]"
              @click="emit('rowClick', row)"
            >
              <!-- 選取 checkbox cell -->
              <td v-if="selectable" class="table-td w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isSelected(getRowKey(row))"
                  :aria-label="`選取列 ${getRowKey(row)}`"
                  class="table-checkbox"
                  @change="onToggleRow(row)"
                  @click.stop
                />
              </td>

              <!-- 資料 cell -->
              <td
                v-for="(col, colIndex) in columns"
                :key="col.key"
                :style="tdStyle(col, colIndex)"
                :class="[
                  'table-td',
                  alignClass(col.align ?? 'left'),
                  col.frozen ? 'sticky left-[--col-left] bg-(--rui-color-surface)' : '',
                  lastFrozenIndex === colIndex ? 'frozen-last' : '',
                  selectable && isSelected(getRowKey(row))
                    ? 'bg-(--rui-color-table-row-selected)'
                    : '',
                ]"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </template>

          <!-- 普通資料列 -->
          <tr
            v-else
            :class="[
              'border-t border-(--rui-color-table-border) transition-colors',
              'hover:bg-(--rui-color-table-row-hover)',
              selectable && isSelected(getRowKey(item))
                ? 'bg-(--rui-color-table-row-selected)'
                : '',
            ]"
            @click="emit('rowClick', item)"
          >
            <!-- 選取 checkbox cell -->
            <td v-if="selectable" class="table-td w-10 text-center">
              <input
                type="checkbox"
                :checked="isSelected(getRowKey(item))"
                :aria-label="`選取列 ${getRowKey(item)}`"
                class="table-checkbox"
                @change="onToggleRow(item)"
                @click.stop
              />
            </td>

            <!-- 資料 cell -->
            <td
              v-for="(col, colIndex) in columns"
              :key="col.key"
              :style="tdStyle(col, colIndex)"
              :class="[
                'table-td',
                alignClass(col.align ?? 'left'),
                col.frozen ? 'sticky left-[--col-left] bg-(--rui-color-surface)' : '',
                lastFrozenIndex === colIndex ? 'frozen-last' : '',
                selectable && isSelected(getRowKey(item))
                  ? 'bg-(--rui-color-table-row-selected)'
                  : '',
              ]"
            >
              <slot :name="`cell-${col.key}`" :row="item" :value="item[col.key]">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- loading 狀態 -->
    <div v-if="loading" class="flex items-center justify-center p-8 text-(--rui-color-text-muted)">
      <slot name="loading">載入中…</slot>
    </div>

    <!-- 空資料狀態 -->
    <div
      v-else-if="isEmpty"
      class="flex items-center justify-center p-8 text-(--rui-color-text-muted)"
    >
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue'
import TableColumnHeader from './TableColumnHeader.vue'
import {
  isTableRowGroup,
  type TableColumnDef,
  type TableColumnAlign,
  type TableProps,
  type TableEmits,
  type TableRowKey,
} from './types'

const props = withDefaults(defineProps<TableProps<T>>(), {
  caption: undefined,
  sortKey: undefined,
  sortOrder: undefined,
  selectable: false,
  selectedKeys: () => [],
  stickyHeader: false,
  maxHeight: undefined,
  loading: false,
  emptyText: '沒有資料',
})

const emit = defineEmits<TableEmits<T>>()

// ── 容器樣式 ────────────────────────────────────────────────────
const wrapperStyle = computed(() =>
  props.stickyHeader && props.maxHeight ? { maxHeight: props.maxHeight } : {},
)

// ── 空資料判斷 ──────────────────────────────────────────────────
const isEmpty = computed(() => {
  if (props.loading) return false
  return props.rows.length === 0
})

// ── Frozen column offset 計算 ───────────────────────────────────
const frozenLeftMap = computed((): Record<number, string> => {
  const map: Record<number, string> = {}
  let accumulated = 0
  for (let i = 0; i < props.columns.length; i++) {
    const col = props.columns[i]
    if (!col) continue
    if (col.frozen) {
      if (import.meta.env.DEV && !col.width) {
        console.warn(
          `[Table] column "${col.key}" is frozen but has no "width" defined. Sticky layout may break.`,
        )
      }
      map[i] = `${accumulated}px`
      const px = col.width ? parseFloat(col.width) : 0
      accumulated += isNaN(px) ? 0 : px
    }
  }
  return map
})

const lastFrozenIndex = computed((): number => {
  let last = -1
  for (let i = 0; i < props.columns.length; i++) {
    const col = props.columns[i]
    if (col?.frozen) last = i
  }
  return last
})

// ── 對齊 class ─────────────────────────────────────────────────
function alignClass(align: TableColumnAlign): string {
  return { left: 'text-left', center: 'text-center', right: 'text-right' }[align]
}

// ── td 樣式 ────────────────────────────────────────────────────
function tdStyle(col: TableColumnDef<T>, colIndex: number): Record<string, string | undefined> {
  return {
    width: col.width ?? undefined,
    minWidth: col.width ?? undefined,
    '--col-left': frozenLeftMap.value[colIndex] ?? '0px',
  }
}

// ── Row key ─────────────────────────────────────────────────────
function getRowKey(row: T): TableRowKey {
  const val = row[props.rowKey]
  if (typeof val === 'string' || typeof val === 'number') return val
  return String(val)
}

// ── Row selection ───────────────────────────────────────────────
const flatRows = computed((): T[] => {
  const result: T[] = []
  for (const item of props.rows) {
    if (isTableRowGroup(item)) {
      result.push(...item.rows)
    } else {
      result.push(item as T)
    }
  }
  return result
})

function isSelected(key: TableRowKey): boolean {
  return props.selectedKeys.includes(key)
}

const allSelected = computed(
  () => flatRows.value.length > 0 && flatRows.value.every((r) => isSelected(getRowKey(r))),
)

const someSelected = computed(
  () => !allSelected.value && flatRows.value.some((r) => isSelected(getRowKey(r))),
)

function onToggleAll(): void {
  if (allSelected.value) {
    emit('update:selectedKeys', [])
  } else {
    emit(
      'update:selectedKeys',
      flatRows.value.map((r) => getRowKey(r)),
    )
  }
}

function onToggleRow(row: T): void {
  const key = getRowKey(row)
  const next = isSelected(key)
    ? props.selectedKeys.filter((k) => k !== key)
    : [...props.selectedKeys, key]
  emit('update:selectedKeys', next)
}

// ── Sorting ─────────────────────────────────────────────────────
function onSortClick(col: TableColumnDef<T>): void {
  if (!col.sortable) return
  const key = col.key
  if (props.sortKey !== key) {
    emit('sort', key, 'asc')
  } else if (props.sortOrder === 'asc') {
    emit('sort', key, 'desc')
  } else {
    emit('sort', key, null)
  }
}
</script>

<style scoped>
.table-th {
  padding: 0.625rem 0.75rem;
  font-weight: 600;
  font-size: 0.8125rem;
  white-space: nowrap;
  border-bottom: 1px solid var(--rui-color-table-border);
}

.table-td {
  padding: 0.625rem 0.75rem;
}

.frozen-last {
  box-shadow: inset -4px 0 4px var(--rui-color-table-sticky-shadow);
}

/* 與 Checkbox 元件視覺對齊的 table 內部 checkbox 樣式 */
.table-checkbox {
  appearance: none;
  display: block;
  margin: 0 auto;
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem; /* rounded-sm */
  border: 1px solid var(--rui-color-border);
  background-color: var(--rui-color-surface);
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.table-checkbox:hover:not(:disabled) {
  border-color: var(--rui-color-default);
}

/* checked 狀態：填色 + 白色 checkmark */
.table-checkbox:checked {
  background-color: var(--rui-color-default);
  border-color: var(--rui-color-default);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3 8l3.5 3.5L13 4'/%3E%3C/svg%3E");
}

/* indeterminate 狀態（全選 header）：填色 + 白色 minus */
.table-checkbox:indeterminate {
  background-color: var(--rui-color-default);
  border-color: var(--rui-color-default);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' d='M4 8h8'/%3E%3C/svg%3E");
}

/* focus-visible：與 Checkbox 元件的 ring 樣式一致 */
.table-checkbox:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--rui-color-surface),
    0 0 0 4px var(--rui-color-default);
}
</style>
