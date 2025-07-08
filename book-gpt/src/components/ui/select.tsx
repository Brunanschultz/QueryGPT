import { cn } from '../../lib/utils'
import React from 'react'
import ReactSelect from 'react-select'

import Text from './text'

interface SelectProps {
  id?: string
  label: string
  className?: string
  error?: string
  options: {
    label: string
    value: string | number
  }[]
  placeholder: string
  isMulti?: boolean
}

const Select = React.forwardRef<any, SelectProps>(
  (
    {
      id,
      label,
      className,
      error,
      options,
      placeholder,
      isMulti = false,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${label.replace(/\s+/g, '-')}`

    return (
      <label
        htmlFor={selectId}
        className={cn('flex flex-col text-sm text-[var(--text-color-primary)]')}
      >
        <Text as="span" variant="body-md">
          {label}
        </Text>

        <ReactSelect
          ref={ref}
          inputId={selectId}
          classNamePrefix="react-select"
          className={cn(
            'react-select-container',
            error && 'react-select-container--error',
            className
          )}
          styles={{
            dropdownIndicator: (base) => ({
              ...base,
              paddingRight: '16px',
              color: 'var(--text-color-primary)',
              ':hover': {
                color: 'var(--text-color-primary)'
              }
            }),
            indicatorSeparator: (base) => ({
              ...base,
              display: 'none'
            })
          }}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
          noOptionsMessage={() => 'Nenhuma opção'}
          {...props}
        />

        {error && (
          <Text as="span" variant="body-sm" className="mt-1 text-red-500">
            {error}
          </Text>
        )}
      </label>
    )
  }
)

Select.displayName = 'Select'

export default Select
