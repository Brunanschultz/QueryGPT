import { cn } from '../../lib/utils'
import React from 'react'

export default function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex rounded-2xl border border-[var(--border-color)] bg-white p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
