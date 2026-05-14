import { useEffect, useState } from 'react'
import { todoApi, type Todo } from './api'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    todoApi
      .list()
      .then(setTodos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const completedCount = todos.filter((t) => t.completed).length

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const created = await todoApi.create(newTitle.trim())
      setTodos([created, ...todos])
      setNewTitle('')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleToggle(id: number) {
    try {
      const updated = await todoApi.toggle(id)
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleDelete(id: number) {
    try {
      await todoApi.remove(id)
      setTodos(todos.filter((t) => t.id !== id))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId === null || !editingTitle.trim()) return
    try {
      const updated = await todoApi.update(editingId, editingTitle.trim())
      setTodos(todos.map((t) => (t.id === editingId ? updated : t)))
      cancelEdit()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-800 antialiased">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Todo</h1>
          <p className="mt-2 text-sm text-slate-500">
            {todos.length} 件のタスク
            {completedCount > 0 && (
              <span className="text-slate-400"> / 完了 {completedCount}</span>
            )}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            autoFocus
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            追加
          </button>
        </form>

        {loading ? (
          <p className="text-center text-sm text-slate-400">読み込み中...</p>
        ) : (
          <ul className="space-y-2">
            {todos.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-300 bg-white/50 px-4 py-12 text-center text-sm text-slate-500">
                タスクはまだありません。最初のひとつを追加してみよう。
              </li>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id)}
                    aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      todo.completed
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    {todo.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  {editingId === todo.id ? (
                    <form onSubmit={saveEdit} className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                        autoFocus
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                      >
                        キャンセル
                      </button>
                    </form>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-sm ${
                          todo.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {todo.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(todo)}
                        aria-label="編集"
                        className="shrink-0 text-slate-400 transition hover:text-indigo-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(todo.id)}
                        aria-label="削除"
                        className="shrink-0 text-slate-400 transition hover:text-rose-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
