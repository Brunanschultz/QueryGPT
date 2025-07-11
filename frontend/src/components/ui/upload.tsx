import { cn } from '../../lib/utils'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { LuCircleX, LuCloudUpload, LuFileText } from 'react-icons/lu'

import IconButton from './icon-button'
import Text from './text'

interface UploadProps {
  title: string
  subtitle: string
  multiple?: boolean
  showUploadArea?: boolean
  onChange: (files: File[] | null) => void
  maxSize?: number
  accept: any
}

export default function Upload({
  title,
  subtitle,
  multiple = false,
  showUploadArea = true,
  onChange,
  maxSize,
  accept
}: UploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles)
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      multiple,
      accept,
      onDrop,
      maxSize
    })

  function handleRemove(indexToRemove: number) {
    const filesFiltered = files.filter((_, index) => index !== indexToRemove)

    setFiles(filesFiltered)
    onChange(filesFiltered)
  }

  return (
    <div className="flex flex-col gap-4">
      {showUploadArea && (
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center rounded-md border-2 border-dashed p-8 transition',
            isFocused
              ? 'border-[var(--border-color-focus)]'
              : 'border-[var(--border-color)]',
            isDragAccept && 'border-[var(--color-green-500)]',
            isDragReject && 'border-[var(--color-red-500)]'
          )}
        >
          <input {...getInputProps()} />

          <LuCloudUpload size={32} className="mb-4 text-[var(--icon-color)]" />

          <Text
            as="p"
            variant="subtitle-md"
            className="text-[var(--text-color-brand)]"
          >
            {title}
          </Text>
          <Text
            as="p"
            variant="body-md"
            className="text-[var(--text-color-secondary)]"
          >
            {subtitle}
          </Text>
        </div>
      )}

      {files && (
        <div className="scroll-container flex max-h-[160px] flex-col gap-2 overflow-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between rounded-md border border-[var(--border-color)] px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <LuFileText
                  size={24}
                  className="text-[var(--text-color-brand)]"
                />

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
                onClick={() => handleRemove(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
