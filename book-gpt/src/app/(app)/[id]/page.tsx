'use client'

import { ChatTextField, MessageBubble } from '../../../components/ui'
import { useServices } from '../../../services'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const params = useParams<{ id: string }>()
  const { postSearch } = useServices()
  const [currentChat, setCurrentChat] = useState<any>(null)

  const { mutate, status } = useMutation({
    mutationFn: postSearch,
    onSuccess: (data) => {
      const messages = [
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

      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, ...messages]
      })

      const chats = sessionStorage.getItem('chats')

      if (chats) {
        sessionStorage.setItem(
          'chats',
          JSON.stringify(
            JSON.parse(chats).map((chat: any) => {
              if (chat.id === params.id) {
                return {
                  ...currentChat,
                  messages: [...currentChat.messages, ...messages]
                }
              } else {
                return chat
              }
            })
          )
        )
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
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

    const messages = [
      {
        message: value,
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
        file: null
      }
    ]

    setCurrentChat({
      ...currentChat,
      messages: [...currentChat.messages, ...messages]
    })

    const chats = sessionStorage.getItem('chats')

    if (chats) {
      sessionStorage.setItem(
        'chats',
        JSON.stringify(
          JSON.parse(chats).map((chat: any) => {
            if (chat.id === params.id) {
              return {
                ...currentChat,
                messages: [...currentChat.messages, ...messages]
              }
            } else {
              return chat
            }
          })
        )
      )
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 300)

    mutate({ text: value })
  }

  useEffect(() => {
    if (params.id) {
      const chats = sessionStorage.getItem('chats')

      if (chats) {
        setCurrentChat(
          JSON.parse(chats).find((item: any) => item.id === params.id)
        )
      }
    }
  }, [params])

  return (
    <div className="z-10 flex h-screen flex-1 flex-col">
      <div className="h-[calc(100vh-56px)] overflow-auto">
        <div className="m-auto flex max-w-3xl flex-col gap-4 px-6 py-8">
          {currentChat &&
            currentChat.messages.map((message: any, index: number) => (
              <MessageBubble
                key={index}
                message={message.message}
                formattedDate={message.formattedDate}
                isSender={message.isSender}
                user={message.user}
                file={message.file}
              />
            ))}

          {status === 'pending' && (
            <MessageBubble
              loading
              message="Pensando..."
              formattedDate=""
              isSender={false}
              user={{
                name: 'IA',
                avatarPath: '/assets/images/bot.png',
                status: 'AVAILABLE'
              }}
              file={null}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="m-auto flex w-full max-w-3xl flex-col px-6 py-8">
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
