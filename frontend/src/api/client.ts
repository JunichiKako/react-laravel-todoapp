const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/api'

export const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const apiUrl = (path: string) => `${BASE}${path}`
