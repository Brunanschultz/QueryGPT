/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '../../lib/utils'
import React from 'react'
import { LuDownload, LuFile } from 'react-icons/lu'

import Avatar from './avatar'
import IconButton from './icon-button'
import Text from './text'

interface MessageBubbleProps {
  loading?: boolean
  message: string | null
  formattedDate: string
  isSender: boolean
  file: {
    type: string
    name: string
  } | null
  user: {
    name: string
    avatarPath: string
    status: 'AVAILABLE' | 'OFF' | 'ABSENT' | 'BUSY'
  }
  onDownload?: () => void
  allowHtml?: boolean
}

export default function MessageBubble({
  loading = false,
  message,
  formattedDate,
  isSender,
  file,
  user,
  onDownload,
  allowHtml = false
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex max-w-9/12 items-start gap-3',
        isSender && 'flex-row-reverse self-end'
      )}
    >
      <Avatar
        name={user.name}
        src={user.avatarPath}
        status={user.status}
        size="sm"
      />

      <div
        className={cn(
          'flex flex-col rounded-md p-2',
          isSender
            ? 'items-end bg-[var(--bg-color-brand-subtle)]'
            : 'bg-[var(--bg-color-muted)]'
        )}
      >
        {file && (
          <div className="flex items-center justify-between gap-1 rounded-md border border-[var(--border-color)] bg-white px-3 py-1">
            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <LuFile className="size-4 text-[var(--text-color-brand)]" />
                <Text as="p" variant="body-md" className="font-semibold">
                  {file.name}
                </Text>
                <IconButton
                  icon={LuDownload}
                  onClick={onDownload}
                  size="small"
                  variant="transparent"
                  rounded
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ Renderização única combinada */}
        {loading ? (
          <div className="flex">
            <Text as="span" variant="body-md">
              Pensando
            </Text>
            <img src="/assets/images/loading.gif" alt="Carregando" width={34} />
          </div>
        ) : allowHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: '1.5' }}
          />
        ) : (
          <div style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: '1.5' }}>
            {message}
          </div>
        )}

        <Text
          as="span"
          variant="body-sm"
          className="text-[var(--text-color-muted)]"
        >
          {formattedDate}
        </Text>
      </div>
    </div>
  )
}
