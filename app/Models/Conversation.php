<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public function toConversationArray(){
        return [
            'id' => $this->id,
            'name' => $this->getReceiver()->name,
            'receiver_id' => $this->getReceiver()->id,
            'avatar' => $this->getReceiver()->avatar ? Storage::url($this->getReceiver()->avatar) : null,
            'is_group' => false,
            'last_message' => $this->last_message?->message,
            'last_message_date' => $this->last_message?->updated_at,
            'updated_at' => $this->updated_at
        ];
    }
}
