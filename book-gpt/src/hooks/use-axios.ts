import axios from 'axios'

export default function useAxios() {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json'
    }
  })

  return api
}
