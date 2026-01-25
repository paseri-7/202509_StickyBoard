<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\LoginController;

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
