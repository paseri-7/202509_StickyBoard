<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\StickyNoteController;
use App\Http\Controllers\BoardAreaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::redirect('/', '/boards');
Route::get('/login', function () {
    return view('login');
});
Route::get('/login/redirect', [LoginController::class, 'redirectToBoards']);
Route::get('/boards', function () {
    return view('boards');
});
Route::get('/boards/data', [BoardController::class, 'index']);
Route::get('/boards/create', function () {
    return view('board_create');
});
Route::post('/boards', [BoardController::class, 'store']);
Route::get('/boards/{id}', function ($id) {
    return view('board_detail', ['id' => $id]);
});
Route::get('/boards/data/{id}', [BoardController::class, 'detail']);
Route::get('/boards/{id}/edit', function ($id) {
    return view('board_edit', ['id' => $id]);
});
Route::put('/boards/{id}', [BoardController::class, 'update']);
Route::delete('/boards/{id}', [BoardController::class, 'destroy']);
Route::post('/boards/{id}/sticky-notes', [StickyNoteController::class, 'store']);
Route::put('/sticky-notes/{id}', [StickyNoteController::class, 'update']);
Route::delete('/sticky-notes/{id}', [StickyNoteController::class, 'destroy']);
Route::post('/boards/{id}/areas', [BoardAreaController::class, 'store']);
Route::put('/areas/{id}', [BoardAreaController::class, 'update']);
Route::delete('/areas/{id}', [BoardAreaController::class, 'destroy']);
