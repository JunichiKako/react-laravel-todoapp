<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo | {{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-800 antialiased">
    <main class="mx-auto max-w-2xl px-6 py-16">
        <header class="mb-8">
            <h1 class="text-4xl font-bold tracking-tight text-slate-900">Todo</h1>
            <p class="mt-2 text-sm text-slate-500">
                {{ $todos->count() }} 件のタスク
                @if ($todos->where('completed', true)->count() > 0)
                    <span class="text-slate-400">/ 完了 {{ $todos->where('completed', true)->count() }}</span>
                @endif
            </p>
        </header>

        <form action="{{ route('todos.store') }}" method="POST" class="mb-2 flex gap-2">
            @csrf
            <input
                type="text"
                name="title"
                value="{{ old('title') }}"
                placeholder="新しいタスクを入力..."
                required
                autofocus
                class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
            <button type="submit" class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                追加
            </button>
        </form>

        @error('title')
            <p class="mb-4 text-sm text-rose-600">{{ $message }}</p>
        @enderror

        <ul class="mt-6 space-y-2">
            @forelse ($todos as $todo)
                <li data-todo class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <form action="{{ route('todos.toggle', $todo) }}" method="POST" class="shrink-0">
                        @csrf
                        @method('PATCH')
                        <button
                            type="submit"
                            aria-label="{{ $todo->completed ? '未完了に戻す' : '完了にする' }}"
                            class="flex h-6 w-6 items-center justify-center rounded-full border-2 transition {{ $todo->completed ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 hover:border-indigo-500' }}"
                        >
                            @if ($todo->completed)
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clip-rule="evenodd" />
                                </svg>
                            @endif
                        </button>
                    </form>

                    {{-- 表示モード --}}
                    <div data-mode="view" class="flex flex-1 items-center gap-3">
                        <span class="flex-1 text-sm {{ $todo->completed ? 'text-slate-400 line-through' : 'text-slate-800' }}">
                            {{ $todo->title }}
                        </span>
                        <button
                            type="button"
                            data-action="edit"
                            aria-label="編集"
                            class="shrink-0 text-slate-400 transition hover:text-indigo-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <form action="{{ route('todos.destroy', $todo) }}" method="POST" class="shrink-0">
                            @csrf
                            @method('DELETE')
                            <button type="submit" aria-label="削除" class="text-slate-400 transition hover:text-rose-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {{-- 編集モード（hidden で非表示。JS で切り替え） --}}
                    <form
                        data-mode="edit"
                        action="{{ route('todos.update', $todo) }}"
                        method="POST"
                        class="hidden flex flex-1 items-center gap-2"
                    >
                        @csrf
                        @method('PATCH')
                        <input
                            type="text"
                            name="title"
                            value="{{ $todo->title }}"
                            required
                            class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        >
                        <button type="submit" class="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                            保存
                        </button>
                        <button type="button" data-action="cancel" class="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                            キャンセル
                        </button>
                    </form>
                </li>
            @empty
                <li class="rounded-lg border border-dashed border-slate-300 bg-white/50 px-4 py-12 text-center text-sm text-slate-500">
                    タスクはまだありません。最初のひとつを追加してみよう。
                </li>
            @endforelse
        </ul>
    </main>
</body>
</html>
