import { cn } from '../../lib/utils'
import React, { useState, useRef, useEffect } from 'react'

import Text from './text'

interface DropdownProps {
  trigger: React.ReactNode
  items: { label: string; onClick: () => void }[]
  className?: string
}

export default function Dropdown({ trigger, items, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      <div
        className={cn(
          'absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-[var(--box-shadow-level-2)] ring-1 ring-[var(--border-color)]',
          'transform transition duration-200 ease-out',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
          className
        )}
      >
        <div className="py-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className="w-full px-4 py-1.5 text-left hover:bg-[var(--bg-color-subtle)]"
            >
              <Text as="span" variant="body-md">
                {item.label}
              </Text>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
