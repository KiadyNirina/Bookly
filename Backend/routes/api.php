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
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/* Authentication */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Redirection vers Google
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);

// Callback depuis Google
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::get('/user', [UserController::class, 'userInfo'])->middleware('auth:sanctum');
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/user-update', [UserController::class, 'updateCurrentUser'])->middleware('auth:sanctum');
Route::delete('/user-delete', [UserController::class, 'deleteCurrentUser'])->middleware('auth:sanctum');

Route::post('/createBook', [BookController::class, 'store'])->middleware('auth:sanctum');
Route::put('/updateBook/{id}', [BookController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/deleteBook/{id}', [BookController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/books/recent', [BookController::class, 'getRecentBooks']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/user/books', [BookController::class, 'getBooksByUser'])->middleware('auth:sanctum');

