import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import React, { ReactNode, useState } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?:
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right'
    | 'left-top'
    | 'left'
    | 'left-bottom'
    | 'right-top'
    | 'right'
    | 'right-bottom'
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2'
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'top-right':
        return 'bottom-full right-0 mb-2'
      case 'bottom-left':
        return 'top-full left-0 mt-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'bottom-right':
        return 'top-full right-0 mt-2'
      case 'left-top':
        return 'right-full top-0 mr-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'left-bottom':
        return 'right-full bottom-0 mr-2'
      case 'right-top':
        return 'left-full top-0 ml-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      case 'right-bottom':
        return 'left-full bottom-0 ml-2'
      default:
        return ''
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -2 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 rounded-md bg-black px-2 py-1 text-xs whitespace-nowrap text-white shadow-md',
              getPositionClasses()
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
