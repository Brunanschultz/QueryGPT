import { cn } from '../../lib/utils'
import Image from 'next/image'
import React from 'react'

import Text from './text'
import Tooltip from './tooltip'

interface PerformanceProps {
  averageAssessment: string
  averageWaitingTimeMinute: string
  requestQuantity: string
  showAverageAssessment?: boolean
  showAverageWaitingTimeMinute?: boolean
  showRequestQuantity?: boolean
}

export default function Performance({
  averageAssessment,
  averageWaitingTimeMinute,
  requestQuantity,
  showAverageAssessment,
  showAverageWaitingTimeMinute,
  showRequestQuantity
}: PerformanceProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-row justify-between rounded-md bg-[var(--bg-color-brand-subtle)] px-4 py-2',
        !showAverageAssessment && 'justify-center'
      )}
    >
      {showAverageAssessment && (
        <Tooltip content="Avaliação" position="top">
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/images/medal.png"
                width={32}
                height={32}
                alt="Avaliação"
              />
              <Text
                as="span"
                variant="body-sm"
                className="text-[var(--text-color-brand)]"
              >
                Avaliação
              </Text>
            </div>

            <Text
              as="span"
              variant="body-md"
              className="text-center font-bold text-[var(--text-color-brand)]"
            >
              {averageAssessment}
            </Text>
          </div>
        </Tooltip>
      )}

      {showRequestQuantity && (
        <Tooltip content="Total de solicitações" position="top">
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/images/chat.png"
                width={32}
                height={32}
                alt="Total de solicitações"
              />
              <Text
                as="span"
                variant="body-sm"
                className="text-[var(--text-color-brand)]"
              >
                Solicitações
              </Text>
            </div>

            <Text
              as="span"
              variant="body-md"
              className="text-center font-bold text-[var(--text-color-brand)]"
            >
              {requestQuantity}
            </Text>
          </div>
        </Tooltip>
      )}

      {showAverageWaitingTimeMinute && (
        <Tooltip content="Tempo médio de resposta" position="top">
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/images/fire.png"
                width={32}
                height={32}
                alt="Tempo médio de resposta"
              />
              <Text
                as="span"
                variant="body-sm"
                className="text-[var(--text-color-brand)]"
              >
                Tempo
              </Text>
            </div>

            <Text
              as="span"
              variant="body-md"
              className="text-center font-bold text-[var(--text-color-brand)]"
            >
              {averageWaitingTimeMinute}
            </Text>
          </div>
        </Tooltip>
      )}
    </div>
  )
}
