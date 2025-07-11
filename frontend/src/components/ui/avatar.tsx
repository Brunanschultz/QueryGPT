/* eslint-disable @next/next/no-img-element */
import { cn } from '../../lib/utils'
import React from 'react'
import { LuPencil } from 'react-icons/lu'

type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
type AvatarStatus = 'AVAILABLE' | 'OFF' | 'ABSENT' | 'BUSY'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  src?: string
  size?: AvatarSize
  title?: string
  unread?: boolean
  subtitle?: string
  showEditButton?: boolean
  status?: AvatarStatus
  onEdit?: () => void
}

const sizeMap: Record<AvatarSize, string> = {
  xl: 'size-20 text-2xl',
  lg: 'size-16 text-xl',
  md: 'size-12 text-lg',
  sm: 'size-10 text-base',
  xs: 'size-8 text-sm',
  xxs: 'size-6 text-xs'
}

const statusMap: Record<AvatarStatus, string> = {
  AVAILABLE: 'bg-emerald-400',
  OFF: 'bg-gray-300',
  ABSENT: 'bg-yellow-400',
  BUSY: 'bg-red-400'
}

const sizeStatusMap: Record<AvatarSize, string> = {
  xl: 'size-4.5 right-1.5',
  lg: 'size-4 right-1',
  md: 'size-3.5',
  sm: 'size-3',
  xs: 'size-2.5',
  xxs: 'size-2'
}

const positionEditButtonMap: Record<AvatarSize, string> = {
  xl: '',
  lg: '-right-1.5',
  md: '-right-2.5',
  sm: '-right-2.5',
  xs: '',
  xxs: ''
}

const titleMap: Record<AvatarSize, string> = {
  xl: 'text-2xl',
  lg: 'text-xl',
  md: 'text-lg',
  sm: 'text-base',
  xs: 'text-sm',
  xxs: 'text-sm'
}

const subtitleMap: Record<AvatarSize, string> = {
  xl: 'text-base',
  lg: 'text-md',
  md: 'text-sm',
  sm: 'text-sm',
  xs: '',
  xxs: ''
}

export default function Avatar({
  name,
  src,
  size = 'md',
  title,
  subtitle,
  unread = false,
  showEditButton = false,
  status,
  onEdit,
  className,
  ...props
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 whitespace-nowrap select-none',
        className
      )}
      {...props}
    >
      <div className="relative">
        {showEditButton && size !== 'xxs' && size !== 'xs' && (
          <button
            onClick={onEdit}
            className={cn(
              'absolute top-0 right-0 z-10 cursor-pointer rounded-full border-2 border-white bg-[var(--bg-color-muted)] p-1 transition-all hover:bg-[var(--bg-color-brand-subtle)]',
              positionEditButtonMap[size]
            )}
          >
            <LuPencil size={12} />
          </button>
        )}

        {status && (
          <div
            className={cn(
              'absolute right-0 bottom-0 z-10 rounded-full',
              statusMap[status],
              sizeStatusMap[size]
            )}
          />
        )}

        <div
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-600',
            sizeMap[size]
          )}
        >
          {src ? (
            <img
              src={src}
              alt={name}
              className={cn('rounded-pill object-cover')}
            />
          ) : (
            <span className="font-semibold">
              {size === 'xxs' || size === 'xs'
                ? initials.slice(0, 1)
                : initials}
            </span>
          )}
        </div>
      </div>

      {(title || subtitle) && (
        <div className="flex min-w-0 flex-col">
          {title && (
            <span
              className={cn(
                'overflow-hidden font-medium text-ellipsis whitespace-nowrap text-[var(--text-color-primary)]',
                unread && 'font-bold',
                titleMap[size]
              )}
            >
              {title}
            </span>
          )}

          {subtitle && size !== 'xxs' && size !== 'xs' && (
            <span
              className={cn(
                'overflow-hidden text-ellipsis whitespace-nowrap text-[var(--text-color-secondary)]',
                subtitleMap[size]
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
