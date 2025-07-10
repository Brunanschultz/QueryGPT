import { Text } from '../../components/ui'
import { cn } from '../../lib/utils'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LuMessageSquareDiff, LuSettings } from 'react-icons/lu'

import { Button } from '../ui'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (params.id) {
      const chats = sessionStorage.getItem('chats')

      if (chats) {
        setChats(JSON.parse(chats).reverse())
      }
    }
  }, [params])

  return (
    <div className="flex min-h-screen">
      <nav className="z-10 flex h-screen w-[260px] flex-col border-b border-[var(--border-color)] bg-[var(--bg-color-brand-subtle)] p-6">
        <div className="flex flex-col justify-between h-full">
          <div className='flex flex-col gap-6'>
            <Image
              src="/assets/images/logo.svg"
              alt="Logo"
              width="140"
              height="21"
              className="cursor-pointer select-none"
              onClick={() => router.push('/')}
            />

            <div>
              <Button icon={LuMessageSquareDiff} onClick={() => router.push('/')}>
                Novo chat
              </Button>
            </div>

            <div className="flex flex-col">
              <Text
                as="span"
                variant="body-sm"
                className="mb-2 text-[var(--text-color-secondary)] select-none"
              >
                HISTÓRICO
              </Text>

              <nav className="flex flex-col gap-1 select-none">
                {chats.map((chat: any, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      'relative flex cursor-pointer items-center gap-2 rounded-md p-2 py-1 text-[var(--text-color-primary)] transition duration-300 hover:text-[var(--text-color-brand)]',
                      params.id == chat.id && 'bg-[var(--bg-color-brand-muted)]'
                    )}
                    onClick={() => router.push(`/${chat.id}`)}
                  >
                    <Text
                      as="span"
                      variant="body-lg"
                      className={cn(
                        'overflow-hidden text-ellipsis whitespace-nowrap text-current',
                        params.id == chat.id && 'text-[var(--text-color-brand)]'
                      )}
                    >
                      {chat.messages[0].message}
                    </Text>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <Button
            className="mt-2"
            onClick={() => router.push('/regras')}
            variant="secondary"
            icon={LuSettings}
          >
            Cadastro de Regras
          </Button>
        </div>
      </nav>

      <div className="flex flex-1">
        <main
          className={cn(
            'scroll-container relative h-screen flex-1 overflow-auto'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
