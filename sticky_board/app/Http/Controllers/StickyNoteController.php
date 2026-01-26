<?php

namespace App\Http\Controllers;

use App\Services\StickyNoteService;
use Illuminate\Http\Request;

class StickyNoteController extends Controller
{
    public function __construct(private StickyNoteService $stickyNoteService) {}

    public function store(int $boardId, Request $request)
    {
        $data = $request->validate([
            'content' => ['required', 'string'],
            'color' => ['required', 'string', 'max:32'],
            'due_at' => ['nullable', 'date'],
            'x' => ['required', 'integer'],
            'y' => ['required', 'integer'],
            'width' => ['required', 'integer'],
            'height' => ['required', 'integer'],
        ]);

        $data['board_id'] = $boardId;

        return response()->json(
            $this->stickyNoteService->createForUser($request->user()->id, $data),
        );
    }

    public function update(int $id, Request $request)
    {
        $data = $request->validate([
            'content' => ['sometimes', 'string'],
            'color' => ['sometimes', 'string', 'max:32'],
            'due_at' => ['nullable', 'date'],
            'x' => ['sometimes', 'integer'],
            'y' => ['sometimes', 'integer'],
            'width' => ['sometimes', 'integer'],
            'height' => ['sometimes', 'integer'],
        ]);

        return response()->json(
            $this->stickyNoteService->updateForUser(
                $request->user()->id,
                $id,
                $data,
            ),
        );
    }

    public function destroy(int $id, Request $request)
    {
        $this->stickyNoteService->deleteForUser($request->user()->id, $id);

        return response()->json(['status' => 'ok']);
    }
}
