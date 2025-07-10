'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

import { Button, Text } from '../../../components/ui'


export default function Regras() {
  const [regras, setRegras] = useState([{ descricao: '', query: '' }])

  const { mutate, status } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('http://localhost:8001/api/regras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regras: data }),
      })
      if (!res.ok) throw new Error('Erro ao salvar regras')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Regras salvas com sucesso!')
      setRegras([{ descricao: '', query: '' }])
    },
    onError: () => toast.error('Erro ao salvar regras')
  })

  function handleChange(index, field, value) {
    setRegras((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(regras)
  }

  return (
    <div className="flex w-full flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-4xl flex-col gap-2 bg-white p-8"
        style={{ marginTop: 32 }}
      >
        <Text as="p" variant="heading-sm" className="mb-2 text-center">
          Cadastro de Regras de Negócio
        </Text>

        <label className="mb-1 font-medium" htmlFor="regra">
          Regra de Negócio
        </label>
        <TextareaAutosize
          id="regra"
          minRows={2}
          maxRows={10}
          placeholder="Digite a regra de negócio"
          value={regras[0].descricao}
          onChange={(e) => handleChange(0, 'descricao', e.target.value)}
          disabled={status === 'pending'}
          className="w-full resize-none rounded-md border p-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <label className="mb-1 font-medium" htmlFor="query">
          Query SQL
        </label>
        <TextareaAutosize
          id="query"
          minRows={2}
          maxRows={8}
          placeholder="Digite a query (SQL) relacionada à regra"
          value={regras[0].query}
          onChange={(e) => handleChange(0, 'query', e.target.value)}
          disabled={status === 'pending'}
          className="w-full resize-none rounded-md border p-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
      <div className="mt-10 w-full max-w-4xl">{/* Tabela de regras */}</div>
    </div>
  )
}
