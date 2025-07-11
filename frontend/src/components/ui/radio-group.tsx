import React from 'react'

import Text from './text'

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  label?: string
  name: string
  error?: string
}

export default function RadioGroup({
  children,
  label,
  name,
  error,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <div className={className} {...props}>
      {label && (
        <label className="font-medium text-[var(--text-color-primary)]">
          <Text as="span" variant="body-md">
            {label}
          </Text>
        </label>
      )}

      <div className="flex flex-col gap-2">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              name
            })
          }

          return child
        })}
      </div>

      {error && (
        <Text as="span" variant="body-sm" className="mt-1 text-red-500">
          {error}
        </Text>
      )}
    </div>
  )
}
