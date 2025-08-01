<?php

namespace App\Livewire;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

class Users extends Component
{
    public function message($userId){
        $authId = Auth::id();

        $existingConvo = Conversation::where(function($query) use ($authId, $userId){
                $query->where('sender_id', $authId)
                    ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($authId, $userId){
            $query->where('sender_id', $userId)
                ->where('receiver_id', $authId);
        })->first();

        if($existingConvo){
            return redirect()->route('chat', $existingConvo->id);
        }

        $createdConvo = Conversation::create([
            'sender_id' => $authId,
            'receiver_id' => $userId
        ]);

        return redirect()->route('chat', $createdConvo->id);

    }

    #[Layout('layouts.app')]
    public function render()
    {

        return view('livewire.users', ['users' => User::whereNot('id', Auth::id())->get()]);
    }
}
