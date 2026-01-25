<?php

namespace App\Http\Controllers;

class LoginController extends Controller
{
    public function redirectToBoards()
    {
        return redirect('/boards');
    }
}
