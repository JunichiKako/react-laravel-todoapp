<?php

namespace App\Http\Controllers\Api;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController
{
    public function index()
    {
        return Todo::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        return Todo::create($validated);
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $todo->update($validated);

        return $todo;
    }

    public function toggle(Todo $todo)
    {
        $todo->update(['completed' => ! $todo->completed]);

        return $todo;
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();

        return response()->noContent();
    }
}
