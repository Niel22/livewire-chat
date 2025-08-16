<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Conversation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'receiver_id',
        'sender_id'
    ];

    public function messages(){
        return $this->hasMany(Message::class);
    }

    public function getReceiver(){

        if($this->sender_id === Auth::id()){
            return User::find($this->receiver_id);
        }
        
        return User::find($this->sender_id);
    }

    public function unreadMessagesCount(): int {
        return  Message::where('conversation_id', $this->id)->where('receiver_id', Auth::id())->whereNull('read_at')->count();
    }

    public function isLastMessageRead(){
        $userId = Auth::id();
        $lastMessage = $this->messages()->latest()->first();

        if($lastMessage){
            return $lastMessage?->sender_id === $userId && $lastMessage->body;
        }
    }

    
}
