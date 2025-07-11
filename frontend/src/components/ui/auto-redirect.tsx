'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import Text from './text'

interface AutoRedirectProps {
  time: number
  url: string
}

export default function AutoRedirect({ time, url }: AutoRedirectProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(time)

  function redirect() {
    router.push(url)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev: number) => {
        const prevCountdown = prev - 1

        if (prevCountdown === 0) {
          redirect()
        }

        return prevCountdown
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = url
    }
  }, [countdown, url])

  return (
    <div>
      {countdown > 0 && (
        <div className="flex items-center justify-center gap-3 rounded-md bg-[var(--bg-color-muted)] px-3 py-2">
          <Text
            as="span"
            variant="body-md"
          >{`Você será redirecionado em: ${countdown} segundos`}</Text>
        </div>
      )}
    </div>
  )
}
