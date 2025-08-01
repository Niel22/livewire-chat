<?php

namespace App\Livewire\Chat;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ChatList extends Component
{
    public $selectedConvo;

    public function render()
    {
        $user = Auth::user();


        return view('livewire.chat.chat-list', [
            'conversations' =>  $user->conversations
        ]);
    }
}
