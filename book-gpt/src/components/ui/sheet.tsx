'use client'

import { cn } from '../../lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useEffect, useState } from 'react'
import { LuX } from 'react-icons/lu'

import Text from './text'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  showCloseButton?: boolean
}

export default function Sheet({
  open,
  onClose,
  title,
  children,
  showCloseButton = true
}: SheetProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              'absolute top-0 right-0 flex h-full w-[440px] flex-col gap-4 rounded-l-2xl bg-white',
              'after:absolute after:top-0 after:right-0 after:size-[160px] after:rounded-bl-full after:bg-[var(--bg-color-brand-subtle)] after:blur-xl'
            )}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                'z-10 flex items-center p-6 pb-0',
                title && 'justify-between',
                !title && 'justify-end'
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

            {title && <hr className="z-10 mx-6 border-[var(--border-color)]" />}

            <div className="scroll-container z-10 overflow-y-auto p-6 pt-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
