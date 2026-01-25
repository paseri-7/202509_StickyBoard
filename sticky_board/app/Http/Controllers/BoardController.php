<?php

namespace App\Http\Controllers;

use App\Services\BoardService;

class BoardController extends Controller
{
    public function __construct(private BoardService $boardService) {}

    public function index()
    {
        return response()->json($this->boardService->fetchBoards());
    }
}
