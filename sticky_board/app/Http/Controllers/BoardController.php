<?php

namespace App\Http\Controllers;

use App\Services\BoardService;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function __construct(private BoardService $boardService) {}

    public function index(Request $request)
    {
        return response()->json(
            $this->boardService->fetchBoards($request->user()->id),
        );
    }

    public function detail(int $id, Request $request)
    {
        return response()->json(
            $this->boardService->getBoardDetail($request->user()->id, $id),
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $data['user_id'] = $request->user()->id;

        return response()->json($this->boardService->createBoard($data));
    }

    public function update(int $id, Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json(
            $this->boardService->updateBoard($request->user()->id, $id, $data),
        );
    }

    public function destroy(int $id, Request $request)
    {
        $this->boardService->deleteBoard($request->user()->id, $id);

        return response()->json(['status' => 'ok']);
    }
}
