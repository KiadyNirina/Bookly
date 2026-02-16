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
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\SaveController;

/* Authentication */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Redirection vers Google
Route::post('/google-login', [AuthController::class, 'googleLogin']);

Route::get('/user', [UserController::class, 'userInfo'])->middleware('auth:sanctum');
Route::get('/users', [UserController::class, 'showAllUsers']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/user-update', [UserController::class, 'updateCurrentUser'])->middleware('auth:sanctum');
Route::delete('/user-delete', [UserController::class, 'deleteCurrentUser'])->middleware('auth:sanctum');

Route::post('/createBook', [BookController::class, 'store'])->middleware('auth:sanctum');
Route::put('/updateBook/{id}', [BookController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/deleteBook/{id}', [BookController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/books/recent', [BookController::class, 'getRecentBooks']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/user/books', [BookController::class, 'getBooksByUser'])->middleware('auth:sanctum');
Route::get('/user/book/count', [BookController::class, 'bookCountUser'])->middleware('auth:sanctum');
Route::get('/user/{id}/books', [BookController::class, 'getBooksByUserSelected']);
Route::get('/books/{id}/file', [BookController::class, 'getFile']);
Route::get('/search', [BookController::class, 'search']);

Route::post('/saveBook', [SaveController::class, 'saveBook'])->middleware('auth:sanctum');
Route::get('/check-saved/{bookId}/{userId}', [SaveController::class, 'checkIfSaved'])->middleware('auth:sanctum');
Route::get('/user-saves/{userId}', [SaveController::class, 'getUserSaves'])->middleware('auth:sanctum');
Route::delete('/unsave/{bookId}', [SaveController::class, 'unsaveBook'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/users/{user}/follow', [FollowerController::class, 'follow']);
    Route::post('/users/{user}/unfollow', [FollowerController::class, 'unfollow']);
    Route::get('/users/{user}/is-following', [FollowerController::class, 'isFollowing']);
});

Route::get('/users/{user}/followers', [FollowerController::class, 'followers']);
Route::get('/users/{user}/following', [FollowerController::class, 'following']);
Route::get('/users/{user}/followers/count', [FollowerController::class, 'followersCount']);
Route::get('/users/{user}/following/count', [FollowerController::class, 'followingCount']);