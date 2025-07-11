import { cn } from '../../lib/utils'
import React from 'react'

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ id, label, disabled, className, ...props }, ref) => {
    const inputId = id || `radio-${label.replace(/\s+/g, '-')}`

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer items-center gap-2 text-sm whitespace-break-spaces select-none',
          disabled && 'cursor-not-allowed text-[var(--text-color-muted)]',
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className="peer hidden"
          disabled={disabled}
          {...props}
        />

        <div
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-full border border-[var(--border-color)] transition',
            'peer-checked:border-5 peer-checked:border-[var(--border-color-focus)]',
            disabled && 'peer-checked:opacity-50'
          )}
        />

        {label}
      </label>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
