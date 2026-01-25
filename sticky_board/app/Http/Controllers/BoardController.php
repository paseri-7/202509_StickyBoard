<?php

namespace App\Http\Controllers;

use App\Services\BoardService;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function __construct(private BoardService $boardService) {}

    public function index()
    {
        return response()->json($this->boardService->fetchBoards());
    }

    public function detail(int $id)
    {
        return response()->json($this->boardService->getBoardDetail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json($this->boardService->createBoard($data));
    }

    public function update(int $id, Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json($this->boardService->updateBoard($id, $data));
    }

    public function destroy(int $id)
    {
        $this->boardService->deleteBoard($id);

        return response()->json(['status' => 'ok']);
    }
}
