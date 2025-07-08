import { cn } from '../../lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { LuCircleX, LuPaperclip, LuSend, LuSmile } from 'react-icons/lu'

import IconButton from './icon-button'
import Popover from './popover'
import Text from './text'

interface TextFieldProps {
  id: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void
  onSubmit: (files: File[] | null, value: string) => void
  showUploadButton?: boolean
  showEmojiButton?: boolean
  showSendButton?: boolean // <--- adicione aqui
  disabled?: boolean
  placeholder?: string
}

export default function ChatTextField({
  id,
  value,
  onChange,
  onSubmit,
  showUploadButton = false,
  showEmojiButton = false,
  showSendButton = true, // <--- valor padrão true
  disabled = false,
  placeholder = ''
}: TextFieldProps) {
  const hiddenFileInput = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const emojiItems = [
    '😀',
    '😁',
    '😂',
    '🤣',
    '😅',
    '😊',
    '😍',
    '😘',
    '😎',
    '😢',
    '😭',
    '😡',
    '😱',
    '👍',
    '👎',
    '🙏',
    '👏',
    '💪',
    '🔥',
    '✨',
    '🎉',
    '💯',
    '❤️',
    '💔',
    '🥳',
    '😴',
    '🤔',
    '🙌',
    '🤷‍♂️',
    '🤷‍♀️',
    '💥',
    '🌟',
    '⚡',
    '☀️',
    '🌈',
    '🌸',
    '🎶',
    '🍕',
    '🍔',
    '🍻',
    '☕',
    '🚀',
    '🏆',
    '🎯'
  ]
  const [internalValue, setInternalValue] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  // Use o valor controlado se passado, senão use o interno
  const displayValue = value !== undefined ? value : internalValue

  function handleUploadClick() {
    hiddenFileInput.current.click()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()

      handleSubmit()
    }
  }

  function handleUploadChange(e: any) {
    const fileUploaded: File = e.target.files[0]

    if (fileUploaded) {
      setFiles([fileUploaded])
    }
  }

  function handleRemoveFile(indexToRemove: number) {
    if (!files) return

    const filesFiltered = files.filter((_, index) => index !== indexToRemove)

    setFiles(filesFiltered || [])

    if (filesFiltered.length === 0) {
      hiddenFileInput.current.value = ''
    }
  }

  function handleContainerClick() {
    if (inputRef.current) {
      setIsFocus(true)

      inputRef.current.focus()
    }
  }

  function handleSubmit() {
    onSubmit(files.length ? files : null, displayValue)

    setInternalValue('')
    setFiles([])

    hiddenFileInput.current.value = ''
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInternalValue(e.target.value)
    onChange?.(e, e.target.value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocus(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      className={cn(
        'flex w-full rounded-md border border-[var(--border-color)] px-4 py-2 transition',
        isFocus &&
          'border-[var(--border-color-focus)] shadow-[var(--box-shadow-level-2)]',
        disabled && 'bg-[var(--bg-color-muted)]'
      )}
      onClick={handleContainerClick}
    >
      <input
        type="file"
        onChange={handleUploadChange}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />

      {showEmojiButton && (
        <Popover
          trigger={
            <IconButton
              rounded
              variant="transparent"
              icon={LuSmile}
              className="mr-1"
              disabled={disabled}
            />
          }
          content={
            <div className="flex w-[248px] flex-wrap gap-1">
              {emojiItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center"
                  onClick={() => setInternalValue(internalValue + item)}
                >
                  {item}
                </button>
              ))}
            </div>
          }
          position="top-left"
        />
      )}

      <div className="flex flex-1 flex-col">
        <input
          id={id}
          name={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          ref={inputRef}
          className={cn(
            'text-md h-[38px] w-full text-[var(--text-color-primary)] placeholder:text-[var(--text-color-muted)] focus:outline-none',
            disabled && 'disabled:text-[var(--text-color-muted)]'
          )}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
        />

        <div className="flex flex-wrap gap-2">
          {files?.length
            ? files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-1 rounded-md border border-[var(--border-color)] px-3 py-1 pr-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <Text as="p" variant="body-lg">
                        {file.name}
                      </Text>
                      <Text
                        as="p"
                        variant="body-md"
                        className="text-[var(--text-color-secondary)]"
                      >
                        {`${file.size} bytes`}
                      </Text>
                    </div>
                  </div>

                  <IconButton
                    icon={LuCircleX}
                    variant="transparent"
                    rounded
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))
            : null}
        </div>
      </div>

      <div className="flex gap-2">
        {showUploadButton && (
          <IconButton
            rounded
            variant="transparent"
            icon={LuPaperclip}
            onClick={handleUploadClick}
            disabled={disabled}
          />
        )}

        {showSendButton && (
          <IconButton
            rounded
            icon={LuSend}
            onClick={handleSubmit}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  )
}
