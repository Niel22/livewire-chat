<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'body',
        'sender_id',
        'receiver_id',
        'conversation_id',
        'read_at',
        'reciever_deleted_at',
        'sender_deleted_at'
    ];

    protected $dates=['read_at', 'reciever_deleted_at', 'sender_deleted_at'];

    public function conversation(){
        return $this->belongsTo(Conversation::class);
    }

    public function isRead(){
        return $this->read_at != null;
    }
}
