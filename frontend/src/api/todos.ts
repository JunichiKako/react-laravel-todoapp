import { apiUrl, handle, jsonHeaders } from './client'

export type Todo = {
  id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export const listTodos = () =>
  fetch(apiUrl('/todos'), { headers: jsonHeaders }).then(handle<Todo[]>)

export const createTodo = (title: string) =>
  fetch(apiUrl('/todos'), {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ title }),
  }).then(handle<Todo>)

export const updateTodo = (id: number, title: string) =>
  fetch(apiUrl(`/todos/${id}`), {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ title }),
  }).then(handle<Todo>)

export const toggleTodo = (id: number) =>
  fetch(apiUrl(`/todos/${id}/toggle`), {
    method: 'PATCH',
    headers: jsonHeaders,
  }).then(handle<Todo>)

export const removeTodo = (id: number) =>
  fetch(apiUrl(`/todos/${id}`), {
    method: 'DELETE',
    headers: jsonHeaders,
  }).then(handle<void>)
