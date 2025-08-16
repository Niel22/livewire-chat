<?php

namespace App\Livewire\Chat;

use App\Models\Message;
use App\Notifications\MessageSent;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;
use Livewire\Component;

class ChatBox extends Component
{
    public $selectedConvo;
    public $body;
    public $loadedMessages;
    public $paginate_var = 10;

    public function loadMore(){

        $this->paginate_var += 10;

        $this->loadMessages();

        $this->dispatch('update-chat-height');
    }

    public function getListeners(){
        $auth_id = Auth::id();

        return [
            'loadMore',
            "echo-private:users.{$auth_id},.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated"=>'broadcastedNotifications'
        ];
    }

    public function broadcastedNotifications($event){
        
        if($event['type'] == MessageSent::class){

            if($event['conversation_id'] === $this->selectedConvo->id){

                $this->dispatch('scroll-bottom');

                $newMessage = Message::find($event['message_id']);

                $this->loadedMessages->push($newMessage);
            }

            $this->dispatch('refresh');
        }
    }

    public function loadMessages(){

        $count = $this->loadedMessages = Message::where('conversation_id', $this->selectedConvo->id)->count();

        $this->loadedMessages = Message::where('conversation_id', $this->selectedConvo->id)
            ->skip($count - $this->paginate_var)
            ->take($this->paginate_var)
            ->get();
    }

    public $rules = [
        'body' => 'required|string'
    ];

    public function sendMessage(){
        $validated = $this->validate();

        $createdMessage = Message::create([
            'conversation_id' => $this->selectedConvo->id,
            'sender_id' => Auth::id(),
            'receiver_id' =>  $this->selectedConvo->getReceiver()->id,
            'body' => $validated['body']
        ]);

        $this->reset('body');

        $this->dispatch('scroll-bottom');

        $this->loadedMessages->push($createdMessage);

        $this->selectedConvo->updated_at = now();
        $this->selectedConvo->save();

        $this->dispatch('refresh');

        // Broadcast
        $this->selectedConvo->getReceiver()
            ->notify(new MessageSent(Auth::user(), $createdMessage, $this->selectedConvo, $this->selectedConvo->getReceiver()->id));

    }

    public function mount(){
        $this->loadMessages();
    }

    public function render()
    {
        return view('livewire.chat.chat-box');
    }
}
