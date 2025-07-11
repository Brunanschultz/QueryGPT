import { cn } from '../../lib/utils'
import React from 'react'

import Text from './text'

type TagVariant = 'success' | 'neutral' | 'error' | 'warning' | 'primary'

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
  children: React.ReactNode
}

const variantClasses: Record<TagVariant, string> = {
  success: 'bg-green-50 text-green-600 border border-green-100',
  neutral: 'bg-gray-50 text-gray-600 border border-gray-100',
  error: 'bg-red-50 text-red-600 border border-red-100',
  warning: 'bg-orange-50 text-orange-600 border border-orange-100',
  primary: 'bg-primary-50 text-primary-600 border border-primary-100'
}

export default function Tag({
  variant = 'neutral',
  children,
  className,
  ...props
}: TagProps) {
  return (
    <Text
      as="span"
      variant="body-md"
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
}
