<?php

namespace App\Http\Controllers;

use App\Services\BoardAreaService;
use Illuminate\Http\Request;

class BoardAreaController extends Controller
{
    public function __construct(private BoardAreaService $boardAreaService) {}

    public function store(int $boardId, Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'x' => ['required', 'integer'],
            'y' => ['required', 'integer'],
            'width' => ['required', 'integer'],
            'height' => ['required', 'integer'],
        ]);

        $data['board_id'] = $boardId;

        return response()->json(
            $this->boardAreaService->createForUser($request->user()->id, $data),
        );
    }

    public function update(int $id, Request $request)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'x' => ['sometimes', 'integer'],
            'y' => ['sometimes', 'integer'],
            'width' => ['sometimes', 'integer'],
            'height' => ['sometimes', 'integer'],
        ]);

        return response()->json(
            $this->boardAreaService->updateForUser(
                $request->user()->id,
                $id,
                $data,
            ),
        );
    }

    public function destroy(int $id, Request $request)
    {
        $this->boardAreaService->deleteForUser($request->user()->id, $id);

        return response()->json(['status' => 'ok']);
    }
}
