import { useEffect, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import IconButton from './icon-button'
import Text from './text'

export default function Pagination({
  total,
  title,
  totalPages,
  initialPage = 1,
  value,
  onPageChange
}: {
  total: number
  title?: string
  totalPages: number
  initialPage?: number
  value?: number
  onPageChange: (page: number) => void
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1

      setCurrentPage(newPage)
      onPageChange(newPage)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1

      setCurrentPage(newPage)
      onPageChange(newPage)
    }
  }

  useEffect(() => {
    if (value !== undefined) {
      setCurrentPage(value)
    }
  }, [value])

  return (
    <div className="flex flex-row items-center justify-between">
      {title && (
        <div>
          <Text as="span" variant="body-md" className="uppercase">
            {`${total} ${title}`}
          </Text>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Text
          as="span"
          variant="body-md"
          className="text-[var(--text-color-secondary)]"
        >{`Página ${currentPage} de ${totalPages}`}</Text>

        <div className="flex gap-2">
          <IconButton
            size="small"
            onClick={handlePreviousPage}
            icon={LuChevronLeft}
            variant="secondary"
          />

          <IconButton
            size="small"
            icon={LuChevronRight}
            onClick={handleNextPage}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}
