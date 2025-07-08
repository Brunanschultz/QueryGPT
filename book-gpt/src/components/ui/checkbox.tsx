import { cn } from '../../lib/utils'
import React from 'react'
import { LuCheck } from 'react-icons/lu'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label = '', disabled, className, ...props }, ref) => {
    const inputId = id || `checkbox-${label.replace(/\s+/g, '-')}`

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 text-sm whitespace-break-spaces select-none',
          disabled && 'cursor-not-allowed text-[var(--text-color-muted)]',
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="peer hidden"
          disabled={disabled}
          {...props}
        />

        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border-color)] bg-white transition-all',
            'peer-checked:border-[var(--border-color-focus)] peer-checked:bg-[var(--border-color-focus)]',
            disabled && 'peer-checked:opacity-50'
          )}
        >
          <LuCheck
            className={cn('h-3 w-3 text-white transition-opacity duration-150')}
            strokeWidth={3}
          />
        </div>

        {label}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
