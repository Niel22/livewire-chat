<?php

namespace App\Jobs;

use App\Events\SocketMessage;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\ScheduleMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendScheduledMessage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ScheduleMessage $scheduledMessage)
    {
        
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $scheduledMessage = ScheduleMessage::with('attachments')
            ->find($this->scheduledMessage->id);


        if (!$scheduledMessage) {
            return;
        }
        
        $message = Message::create([
            'sender_id' => $scheduledMessage->sender_id,
            'group_id'  => $scheduledMessage->group_id,
            'message'   => $scheduledMessage->message,
        ]);
        $attachments = [];

        if ($scheduledMessage->attachments && $scheduledMessage->attachments->count() > 0) {
            foreach ($scheduledMessage->attachments as $attachment) {
                $attachment = MessageAttachment::create([
                    'message_id' => $message->id,
                    'name'       => $attachment->name,
                    'mime'       => $attachment->mime,
                    'size'       => $attachment->size,
                    'path'       => $attachment->path,
                ]);

                $attachments[] = $attachment;
            }

            $message->attachments = $attachments;

        }

        SocketMessage::dispatch($message);

        $this->scheduledMessage->delete();

    }
}
