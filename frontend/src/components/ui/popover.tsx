import { cn } from '../../lib/utils'
import React, { useState, useRef, useEffect } from 'react'

type PopoverPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'

interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  position?: PopoverPosition
  className?: string
}

export default function Popover({
  trigger,
  content,
  position = 'bottom-left',
  className
}: PopoverProps) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const positionClasses: Record<PopoverPosition, string> = {
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'left-top': 'right-full top-0 mr-2',
    'left-bottom': 'right-full bottom-0 mr-2',
    'right-top': 'left-full top-0 ml-2',
    'right-bottom': 'left-full bottom-0 ml-2'
  }

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      <div
        className={cn(
          'absolute z-10 origin-top-left rounded-md bg-white shadow-[var(--box-shadow-level-2)] ring-1 ring-[var(--border-color)]',
          'transform transition duration-200 ease-out',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
          positionClasses[position],
          className
        )}
      >
        <div className="p-4">{content}</div>
      </div>
    </div>
  )
}
