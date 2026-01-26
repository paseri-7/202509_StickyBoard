<?php

namespace App\Http\Controllers;

use App\Models\BoardNotification;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();
        $unreadCount = 0;

        if ($user) {
            $unreadCount = BoardNotification::query()
                ->where('user_id', $user->id)
                ->whereNull('read_at')
                ->count();
        }

        return response()->json([
            'name' => $user?->name,
            'avatar' => $user?->avatar,
            'unread_count' => $unreadCount,
        ]);
    }
}
