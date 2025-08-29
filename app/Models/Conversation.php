<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Conversation extends Model
{
    protected $fillable = [
        'user_id1',
        'user_id2',
    ];

    public function getReceiver(){

        if((int)$this->user_id1 === (int)Auth::id()){
            return User::find($this->user_id2);
        }
        
        return User::find($this->user_id1);
    }


    public function messages(){
        return $this->hasMany(Message::class);
    }


    public function isLastMessageRead(){
        $userId = Auth::id();
        $lastMessage = $this->messages()->latest()->first();

        if($lastMessage){
            return (int)$lastMessage?->sender_id === (int)$userId && $lastMessage->body;
        }
    }

    public function last_message()
    {
        return $this->hasOne(Message::class, 'conversation_id')
        ->latestOfMany();
    }

    public static function getConversationForSidebar(){
        $user = Auth::user();

        $conversations = $user->conversations;
        $conversations->load('last_message');

        $groups = $user->groups;
        $groups->load('last_message');
        $groups->load('admin');

        return $conversations->map->toConversationArray()->merge($groups->map->toConversationArray());
    }

    public function toConversationArray(){
        return [
            'id' => $this->id,
            'name' => $this->getReceiver()->name,
            'receiver_id' => $this->getReceiver()->id,
            'avatar' => $this->getReceiver()->avatar,
            'is_group' => false,
            'last_message' => $this->last_message?->message,
            'last_message_date' => $this->last_message?->updated_at,
            'updated_at' => $this->updated_at
        ];
    }
}
