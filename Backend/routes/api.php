<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserController;

/* Authentication */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', [UserController::class, 'userInfo'])->middleware('auth:sanctum');
Route::get('/users/{id}', [UserController::class, 'show']);

Route::post('/createBook', [BookController::class, 'store'])->middleware('auth:sanctum');
Route::put('/updateBook/{id}', [BookController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/deleteBook/{id}', [BookController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/books/recent', [BookController::class, 'getRecentBooks']);
Route::get('/books/{id}', [BookController::class, 'show']);


