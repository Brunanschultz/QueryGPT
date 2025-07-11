import { cn } from '../../lib/utils'
import React from 'react'

import Text from './text'

type Variant = 'primary' | 'secondary' | 'link' | 'danger'
type Size = 'default' | 'small'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: any
  iconPosition?: 'left' | 'right'
  type?: 'submit' | 'reset' | 'button'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantStyles: Record<Variant, string> = {
    primary:
      'bg-gradient-to-r from-[var(--gradient-primary-start)] to-[var(--gradient-primary-end)] hover:from-[var(--gradient-primary-start)] hover:to-[var(--gradient-primary-start)] disabled:from-[var(--bg-color-muted)] disabled:to-[var(--bg-color-muted)] text-white disabled:text-[var(--text-color-muted)]',
    secondary:
      'border border-[var(--border-color)] bg-transparent text-[var(--text-color-primary)] hover:bg-gray-50',
    link: 'text-[var(--text-color-brand)] bg-transparent hover:underline',
    danger:
      'bg-red-500 hover:bg-red-600 disabled:bg-[var(--bg-color-muted)] text-white disabled:text-[var(--text-color-muted)]'
  }

  const sizeStyles: Record<Size, string> = {
    default: 'px-6 py-2 h-[38px]',
    small: 'px-4 py-2 h-[32px]'
  }

  return (
    <button
      className={cn(
        'flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-normal transition-colors duration-300 focus:outline-none disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      type={type}
      {...props}
    >
      {loading && (
        <svg
          className="size-5 animate-spin text-[var(--text-color-brand)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={cn(size === 'small' ? 'size-4' : 'size-5')} />
      )}

      {!loading && (
        <Text as="span" variant="button" className="text-current">
          {children}
        </Text>
      )}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={cn(size === 'small' ? 'size-4' : 'size-5')} />
      )}
    </button>
  )
}
