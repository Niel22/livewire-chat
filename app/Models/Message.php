<?php

namespace App\Models;

use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MessageObserver::class])]
class Message extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'receiver_id',
        'conversation_id',
        'is_pinned',
        'reply_to_id',
        'is_forwarded',
        'read_at'
    ];

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function reads()
    {
        return $this->hasMany(MessageRead::class);
    }
    
    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function group(){
        return $this->belongsTo(User::class, 'group_id');
    }

    public function attachments(){
        return $this->hasMany(MessageAttachment::class, 'message_id');
    }

    public function replyTo(){
        return $this->belongsTo(Message::class, 'reply_to_id');
    }

    public function conversation(){
        return $this->belongsTo(Conversation::class);
    }
}
