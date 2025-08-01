<?php

namespace App\Livewire\Chat;

use Livewire\Component;

class ChatBox extends Component
{
    public $selectedConvo;
    public function render()
    {
        return view('livewire.chat.chat-box');
    }
}
