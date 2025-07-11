'use client'

import { cn } from '../../lib/utils'
import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from 'react-icons/lu'

import IconButton from './icon-button'
import Text from './text'

interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  id: string
  error?: string
  type?: string
  as?: 'input' | 'textarea'
  iconLeft?: any
  iconRight?: any
}

export default function TextField({
  label,
  id,
  error,
  type = 'text',
  as = 'input',
  iconLeft: IconLeft,
  iconRight: IconRight,
  className,
  ...props
}: TextFieldProps) {
  const InputComponent = as === 'textarea' ? 'textarea' : 'input'

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor={id}
        className="font-medium text-[var(--text-color-primary)]"
      >
        <Text as="span" variant="body-md">
          {label}
        </Text>
      </label>

      <div
        className={cn(
          'group relative flex items-center',
          as === 'textarea' && 'items-start'
        )}
      >
        {IconLeft && (
          <IconLeft
            className={cn(
              'pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2',
              {
                'text-[var(--icon-color)] group-focus-within:text-[var(--icon-color-focus)]':
                  !error,
                'text-red-500': error
              }
            )}
          />
        )}

        <InputComponent
          id={id}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm text-[var(--text-color-primary)] transition placeholder:text-[var(--text-color-muted)] focus:outline-none disabled:bg-[var(--bg-color-muted)] disabled:text-[var(--text-color-muted)]',
            {
              'pl-10': IconLeft,
              'pr-10': IconRight,
              'border-red-500': error,
              'border-[var(--border-color)] focus:border-[var(--border-color-focus)]':
                !error,
              'resize-none': as === 'textarea'
            },
            className
          )}
          type={showPassword ? 'text' : type}
          autoComplete={as === 'input' ? 'off' : undefined}
          spellCheck={true}
          lang="pt-BR"
          {...props}
        />

        {IconRight && (
          <IconRight
            className={cn(
              'pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2',
              {
                'text-[var(--icon-color)] group-focus-within:text-[var(--icon-color-focus)]':
                  !error,
                'text-red-500': error
              }
            )}
          />
        )}

        {type === 'password' && (
          <IconButton
            icon={showPassword ? LuEye : LuEyeClosed}
            className="absolute right-3"
            variant="transparent"
            size="small"
            rounded
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>

      {error && (
        <Text as="span" variant="body-sm" className="mt-1 text-red-500">
          {error}
        </Text>
      )}
    </div>
  )
}
