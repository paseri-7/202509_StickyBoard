<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        if ($request->query('error')) {
            return redirect('/login')->withErrors([
                'login' => 'ログインがキャンセルされました。',
            ]);
        }

        if (!$request->has('code')) {
            return redirect('/login')->withErrors([
                'login' => '認証コードが取得できませんでした。',
            ]);
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidStateException $exception) {
            return redirect('/login')->withErrors([
                'login' => 'ログインに失敗しました。もう一度お試しください。',
            ]);
        }
        $email = $googleUser->getEmail();

        if (!$email) {
            return redirect('/login')->withErrors(['email' => 'Emailが取得できませんでした。']);
        }

        $user = User::query()
            ->where('google_id', $googleUser->getId())
            ->orWhere('email', $email)
            ->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName() ?: 'ユーザー',
                'email' => $email,
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => Str::random(32),
            ]);
        } else {
            if (!$user->google_id) {
                $user->google_id = $googleUser->getId();
                $user->save();
            }
        }

        Auth::login($user, true);

        return redirect('/boards');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => 'ok']);
    }
}
