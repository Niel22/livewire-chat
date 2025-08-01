<?php

namespace App\Livewire\Chat;

use App\Models\Conversation;
use Livewire\Attributes\Layout;
use Livewire\Component;

class Chat extends Component
{
    public $query, $selectedConvo;

    public function mount(){
        $this->selectedConvo = Conversation::findOrFail($this->query);

        // dd($this->selectedConvo);
    }

    #[Layout('layouts.app')]
    public function render()
    {
        return view('livewire.chat.chat');
    }
}
