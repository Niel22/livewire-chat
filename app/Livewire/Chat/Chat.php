<?php

namespace App\Livewire\Chat;

use App\Models\Conversation;
use App\Models\Message;
use App\Notifications\MessageRead;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

class Chat extends Component
{
    public $query, $selectedConvo;

    public function mount(){
        $this->selectedConvo = Conversation::findOrFail($this->query);

        Message::where('conversation_id', $this->selectedConvo->id)
                ->where('receiver_id', Auth::id())
                ->whereNull('read_at')
                ->update([
                    'read_at' => now()
                ]);
        
        $this->selectedConvo->getReceiver()
                    ->notify(new MessageRead($this->selectedConvo->id));
                    

    }

    #[Layout('layouts.app')]
    public function render()
    {
        return view('livewire.chat.chat');
    }
}
