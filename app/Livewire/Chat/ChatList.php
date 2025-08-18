<?php

namespace App\Livewire\Chat;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;
use Livewire\Component;

class ChatList extends Component
{
    public $selectedConvo, $query;

    public function deleteByUser($id){
        
        $userId = Auth::id();

        $convo = Conversation::find(decrypt($id));

        $convo->messages()->each(function($message) use ($userId){

            if($message->sender_id === $userId){

                $message->update(['sender_deleted_at' => now()]);
                
            }else{

                $message->update(['receiver_deleted_at' => now()]);

            }
        });
    }

    #[On('refresh')] 
    public function render()
    {
        $user = Auth::user();

        return view('livewire.chat.chat-list', [
            'conversations' =>  $user->conversations
        ]);
    }
}
