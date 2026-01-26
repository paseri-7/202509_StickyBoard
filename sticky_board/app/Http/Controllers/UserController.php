<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'name' => $user?->name,
            'avatar' => $user?->avatar,
            'unread_count' => 0,
        ]);
    }
}
