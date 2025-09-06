<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function home(){
        return inertia('Home');
    }

    public function switch(User $account){
        Auth::logout();
        
        Auth::login($account);

        return redirect()->back();
    }
}
