import { cn } from '../../lib/utils'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'transparent'
type Size = 'default' | 'small'

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon: any
  type?: 'submit' | 'reset' | 'button'
  rounded?: boolean
}

export default function IconButton({
  variant = 'primary',
  size = 'default',
  icon: Icon,
  type = 'button',
  rounded = false,
  className,
  ...props
}: IconButtonProps) {
  const variantStyles: Record<Variant, string> = {
    primary:
      'bg-gradient-to-r from-[var(--gradient-primary-start)] to-[var(--gradient-primary-end)] hover:from-[var(--gradient-primary-start)] hover:to-[var(--gradient-primary-start)] disabled:from-[var(--bg-color-muted)] disabled:to-[var(--bg-color-muted)] text-white disabled:text-[var(--text-color-muted)]',
    secondary:
      'border border-[var(--border-color)] bg-transparent text-[var(--text-color-primary)] hover:bg-[var(--bg-color-subtle)] disabled:text-[var(--text-color-muted)]',
    transparent:
      'bg-transparent text-[var(--text-color-primary)] hover:bg-[var(--bg-color-subtle)] disabled:text-[var(--text-color-muted)]'
  }

  const sizeStyles: Record<Size, string> = {
    default: 'size-[38px]',
    small: 'size-[32px]'
  }

  return (
    <button
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 text-sm font-normal transition-colors duration-300 focus:outline-none disabled:cursor-not-allowed',
        rounded && 'rounded-full',
        !rounded && 'rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      type={type}
      {...props}
    >
      {Icon && <Icon className={cn(size === 'small' ? 'size-4' : 'size-5')} />}
    </button>
  )
}
