<?php

namespace App\Action\Auth;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;

class RegisterAction{

    public function execute($request): bool|Conversation
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'pdata' => $request->password,
            'role' => 'member'
        ]);

        if($user){

            event(new Registered($user));
    
            Auth::login($user);
    
            $conversation = $user->conversations()->first();

            return $conversation ?? [];
        }

        return false;

    }
}