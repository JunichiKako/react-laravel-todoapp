<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController
{
    public function index()
    {
        $todos = Todo::latest()->get();

        return view('todos.index', compact('todos'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        Todo::create($validated);

        return redirect()->route('todos.index');
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $todo->update($validated);

        return redirect()->route('todos.index');
    }

    public function toggle(Todo $todo)
    {
        $todo->update(['completed' => ! $todo->completed]);

        return redirect()->route('todos.index');
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();

        return redirect()->route('todos.index');
    }
}
