<?php

namespace App\Observers;

use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message){

        $message->attachments->each(function ($attachment){
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });

        $message->attachments()->delete();

    }
}
