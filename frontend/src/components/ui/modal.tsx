'use client'

import { cn } from '../../lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { LuX } from 'react-icons/lu'

import Text from './text'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  showCloseButton?: boolean
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) window.addEventListener('keydown', handleEsc)

    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              'm-6 flex w-full max-w-xl flex-col rounded-2xl bg-white p-6',
              title && 'gap-4',
              !title && 'gap-0'
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                'flex items-center',
                title ? 'justify-between' : 'justify-end'
              )}
            >
              {title && (
                <Text as="h2" variant="subtitle-md">
                  {title}
                </Text>
              )}

              {showCloseButton && (
                <button
                  className="cursor-pointer text-[var(--icon-color)] transition-all hover:text-[var(--icon-color-focus)]"
                  onClick={onClose}
                >
                  <LuX size={20} />
                </button>
              )}
            </div>

            {title && <hr className="border-[var(--border-color)]" />}

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
