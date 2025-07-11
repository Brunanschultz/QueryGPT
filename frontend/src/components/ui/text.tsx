import { cn } from '../../lib/utils'
import React from 'react'

type TextVariant =
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'subtitle-lg'
  | 'subtitle-md'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs'
  | 'button'
  | 'caption'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'em'
  variant?: TextVariant
  children: React.ReactNode
}

const variantClasses: Record<TextVariant, string> = {
  'heading-xl': 'text-5xl',
  'heading-lg': 'text-4xl',
  'heading-md': 'text-3xl',
  'heading-sm': 'text-2xl',
  'subtitle-lg': 'text-xl',
  'subtitle-md': 'text-lg',
  'body-lg': 'text-base',
  'body-md': 'text-sm',
  'body-sm': 'text-xs',
  'body-xs': 'text-xxs',
  button: 'text-sm',
  caption: 'text-[11px]'
}

export default function Text({
  as: Tag = 'p',
  variant = 'body-sm',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        'text-[var(--text-color-primary)]',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
