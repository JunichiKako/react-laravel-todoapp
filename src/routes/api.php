<?php

use App\Http\Controllers\Api\TodoController;
use Illuminate\Support\Facades\Route;

Route::get('/todos', [TodoController::class, 'index']);
Route::post('/todos', [TodoController::class, 'store']);
Route::patch('/todos/{todo}', [TodoController::class, 'update']);
Route::patch('/todos/{todo}/toggle', [TodoController::class, 'toggle']);
Route::delete('/todos/{todo}', [TodoController::class, 'destroy']);
