import { useAxios } from '../hooks'

export default function useServices() {
  const api = useAxios()

  const postSearch = async ({ text }: { text: string }) => {
    const response = await api.post('http://localhost:8001/api/search', { question: text })
    return response.data
  }

  return {
    postSearch
  }
}
