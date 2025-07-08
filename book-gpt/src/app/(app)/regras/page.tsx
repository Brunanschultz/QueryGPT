'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ChatTextField, Button } from '../../../components/ui'
import toast from 'react-hot-toast'

export default function Regras() {
  const [regras, setRegras] = useState([{ regra: '', query: '' }])

  const { mutate, status } = useMutation({
    mutationFn: async (data: any) => {
      // Altere a URL para sua API real
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

  function handleChange(index: number, field: string, value: string) {
    setRegras((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  function addRow() {
    setRegras([...regras, { regra: '', query: '' }])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(regras)
  }

  return (
    <div className="z-10 flex h-screen flex-1 flex-col">
      <div className="h-[calc(100vh-56px)] overflow-auto">
        <div className="m-auto flex max-w-3xl flex-col gap-4 px-6 py-8">
          <h2 className="text-xl font-bold mb-4">Cadastro de Regras de Negócio</h2>
          <form onSubmit={handleSubmit}>
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Regra de Negócio</th>
                  <th className="border px-2 py-1">Query</th>
                </tr>
              </thead>
              <tbody>
                {regras.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">
                      <ChatTextField
                        id={`regra-${idx}`}
                        value={item.regra}
                        onChange={(e, v) => handleChange(idx, 'regra', v)}
                        onSubmit={() => {}}
                        placeholder="Descreva a regra"
                        showSendButton={false}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <ChatTextField
                        id={`query-${idx}`}
                        value={item.query}
                        onChange={(e, v) => handleChange(idx, 'query', v)}
                        onSubmit={() => {}}
                        placeholder="SQL da regra"
                        showSendButton={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2">
              <Button type="button" onClick={addRow} disabled={status === 'pending'}>
                Adicionar linha
              </Button>
              <Button type="submit" disabled={status === 'pending'}>
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}