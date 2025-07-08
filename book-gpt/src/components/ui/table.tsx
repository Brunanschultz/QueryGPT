import { cn } from '../../lib/utils'
import React, { ReactNode } from 'react'

import Checkbox from './checkbox'
import Text from './text'

export interface TableColumn<T> {
  key: keyof T
  header: string
  className?: string
  align?: 'text-center' | 'text-left' | 'text-right'
  render?: (item: T) => ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  hasSelect?: boolean
  selectedRows?: Set<number>
  onRowSelect?: (index: number) => void
  onSelectAll?: (selectAll: boolean) => void
}

export default function Table<T extends object>({
  data,
  columns,
  hasSelect = false,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll
}: TableProps<T>) {
  const allSelected = data.length > 0 && selectedRows.size === data.length
  const someSelected = selectedRows.size > 0 && !allSelected

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-[var(--bg-muted)]">
        <tr>
          {hasSelect && (
            <th className="w-10 px-3 py-3 text-left">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onChange={(e) => onSelectAll?.(e.target.checked)}
                className="accent-[var(--primary-color)]"
              />
            </th>
          )}

          {columns.map((col) => (
            <th
              key={String(col.key)}
              className={cn(
                'px-3 py-2 text-left',
                col.className,
                col.align || 'text-left'
              )}
            >
              <Text
                as="span"
                variant="body-md"
                className="font-medium text-[var(--text-color-secondary)]"
              >
                {col.header}
              </Text>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => {
          const isSelected = selectedRows.has(index)

          return (
            <tr
              key={index}
              className={cn(
                'transition-colors',
                'hover:bg-[var(--bg-color-subtle)]',
                isSelected && 'bg-[var(--bg-selected)]'
              )}
            >
              {hasSelect && (
                <td className="px-3 py-1">
                  <Checkbox
                    id={`user-${index}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => onRowSelect?.(index)}
                    className="accent-[var(--primary-color)]"
                  />
                </td>
              )}

              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    'px-3 py-1',
                    col.className,
                    col.align || 'text-left'
                  )}
                >
                  {col.render ? (
                    col.render(item)
                  ) : (
                    <Text as="span" variant="body-md" className="break-all">
                      {String(item[col.key])}
                    </Text>
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
