<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleMessageAttachment extends Model
{
    protected $fillable = [
        'schedule_message_id',
        'name',
        'path',
        'mime',
        'size'
    ];
}
