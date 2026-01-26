<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessUserAvatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'name' => $user?->name,
            'avatar' => $user?->avatar,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:5120'],
        ]);

        $user = $request->user();
        $user->name = $data['name'];
        $user->save();

        if ($request->hasFile('avatar')) {
            $tempPath = $request->file('avatar')->store('tmp');
            ProcessUserAvatar::dispatch($user->id, $tempPath);
            Log::info('profile avatar queued', [
                'userId' => $user->id,
                'tempPath' => $tempPath,
            ]);
        } else {
            Log::info('profile avatar skipped (no file)', [
                'userId' => $user->id,
            ]);
        }

        return response()->json([
            'name' => $user->name,
            'avatar' => $user->avatar,
        ]);
    }
}
