<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    public function user(){
        return $this->belongsTo(User::class, 'receiver_id')->latest();
    }

    
}
