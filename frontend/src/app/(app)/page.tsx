'use client'

import { Text, ChatTextField } from '../../components/ui'
import { useServices } from '../../services'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  const router = useRouter()
  const { postSearch } = useServices()

  const { mutate, status } = useMutation({
    mutationFn: postSearch,
    onSuccess: (data, variables) => {
      const chatId = uuidv4()
      const chats = sessionStorage.getItem('chats')

      const chat = {
        id: chatId,
        messages: [
          {
            message: variables.text,
            formattedDate: new Intl.DateTimeFormat('pt-BR', {
              hour: 'numeric',
              minute: 'numeric'
            }).format(new Date()),
            isSender: true,
            user: {
              name: 'Usuário',
              avatarPath: '/assets/images/avatar.png',
              status: 'AVAILABLE'
            },
            file: ''
          },
          {
            message: JSON.stringify(data),
            formattedDate: new Intl.DateTimeFormat('pt-BR', {
              hour: 'numeric',
              minute: 'numeric'
            }).format(new Date()),
            isSender: false,
            user: {
              name: 'IA',
              avatarPath: '/assets/images/bot.png',
              status: 'AVAILABLE'
            },
            file: ''
          }
        ]
      }

      sessionStorage.setItem(
        'chats',
        chats
          ? JSON.stringify([...JSON.parse(chats), chat])
          : JSON.stringify([chat])
      )

      router.push(`/${chatId}`)
    },
    onError: (error: any) => {
      if (error.response) {
        if (error.response.data) {
          toast.error(error.response.data.message)
        }
      }
    }
  })

  function onSubmit(value: string) {
    if (!value) return

    mutate({ text: value })
  }

  return (
    <div className="z-10 flex h-screen flex-1 flex-col items-center justify-center px-6 py-8">
      <div className="flex w-full max-w-3xl flex-col gap-12">
        <div className="flex flex-col items-center gap-3">
          <Text as="p" variant="heading-sm" className="text-center">
            Olá, eu sou o Book GPT!
          </Text>

          <Text
            as="p"
            variant="body-lg"
            className="w-full text-center text-[var(--text-color-secondary)] md:max-w-8/12"
          >
            Como posso te ajudar hoje?
          </Text>
        </div>

        <ChatTextField
          id="message-input"
          showEmojiButton
          placeholder="Digite sua mensagem aqui"
          onSubmit={(_, value) => onSubmit(value)}
          disabled={status === 'pending'}
        />
      </div>
    </div>
  )
}
