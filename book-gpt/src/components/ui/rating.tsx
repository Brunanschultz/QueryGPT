import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { LuStar } from 'react-icons/lu'

interface RatingProps {
  value?: number
  onChange?: (value: number) => void
  max?: number
  disabled?: boolean
  className?: string
}

const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
  className
}) => {
  const [hovered, setHovered] = useState<number | null>(null)

  const handleClick = (index: number) => {
    if (!disabled && onChange) {
      onChange(index)
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1
        const filled = hovered ? index <= hovered : index <= value

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="focus:outline-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{
                scale: filled ? 1.2 : 1,
                opacity: filled ? 1 : 0.6
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <LuStar
                size={20}
                className={cn(
                  'transition-colors',
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-[var(--text-color-secondary)]'
                )}
              />
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}

export default Rating
