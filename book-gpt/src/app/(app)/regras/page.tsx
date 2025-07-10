'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import TextareaAutosize from 'react-textarea-autosize'
import { Button, Text } from '../../../components/ui'
import toast from 'react-hot-toast'

export default function Regras() {
  const [regras, setRegras] = useState([{ regra: '', query: '' }])

  const { mutate, status } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('http://localhost:8000/api/regras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regras: data })
      })
      if (!res.ok) throw new Error('Erro ao salvar regras')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Regras salvas com sucesso!')
      setRegras([{ regra: '', query: '' }])
    },
    onError: () => toast.error('Erro ao salvar regras')
  })

  function handleChange(index, field, value) {
    setRegras(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(regras)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 flex flex-col gap-2"
        style={{ marginTop: 32 }}
      >
        <Text as="p" variant="heading-sm" className="text-center mb-2">
          Cadastro de Regras de Negócio
        </Text>

        <label className="font-medium mb-1" htmlFor="regra">
          Regra de Negócio
        </label>
        <TextareaAutosize
          id="regra"
          minRows={2}
          maxRows={10}
          placeholder="Digite a regra de negócio"
          value={regras[0].regra}
          onChange={e => handleChange(0, 'regra', e.target.value)}
          disabled={status === 'pending'}
          className="w-full border rounded-md p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="font-medium mb-1" htmlFor="query">
          Query SQL
        </label>
        <TextareaAutosize
          id="query"
          minRows={2}
          maxRows={8}
          placeholder="Digite a query (SQL) relacionada à regra"
          value={regras[0].query}
          onChange={e => handleChange(0, 'query', e.target.value)}
          disabled={status === 'pending'}
          className="w-full border rounded-md p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={status === 'pending'}
            className="mt-4 w-32"
          >
            {status === 'pending' ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>

      {/* Sua tabela pode vir aqui abaixo */}
      <div className="w-full max-w-4xl mt-10">
        {/* Tabela de regras */}
      </div>
    </div>
  )
}