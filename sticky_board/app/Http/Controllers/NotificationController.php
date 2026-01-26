<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    public function index(Request $request)
    {
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('per_page', 10);
        if ($perPage < 1) {
            $perPage = 10;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        return response()->json(
            $this->notificationService->fetchNotifications(
                $request->user()->id,
                $page,
                $perPage,
            ),
        );
    }

    public function markRead(int $id, Request $request)
    {
        return response()->json(
            $this->notificationService->markRead($request->user()->id, $id),
        );
    }
}
