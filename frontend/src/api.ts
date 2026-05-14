export type Todo = {
  id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/api'

const json = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const todoApi = {
  list: () => fetch(`${BASE}/todos`, { headers: json }).then(handle<Todo[]>),

  create: (title: string) =>
    fetch(`${BASE}/todos`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ title }),
    }).then(handle<Todo>),

  update: (id: number, title: string) =>
    fetch(`${BASE}/todos/${id}`, {
      method: 'PATCH',
      headers: json,
      body: JSON.stringify({ title }),
    }).then(handle<Todo>),

  toggle: (id: number) =>
    fetch(`${BASE}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: json,
    }).then(handle<Todo>),

  remove: (id: number) =>
    fetch(`${BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: json,
    }).then(handle<void>),
}
