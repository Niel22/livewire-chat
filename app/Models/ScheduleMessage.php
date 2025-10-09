<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleMessage extends Model
{
    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'scheduled_at'
    ];

    // protected $casts = [
    //     'scheduled_at' => 'datetime',
    // ];

    public function attachments(){
        return $this->hasMany(ScheduleMessageAttachment::class, 'schedule_message_id');
    }
}
