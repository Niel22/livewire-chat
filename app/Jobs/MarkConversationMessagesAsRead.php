<?php

namespace App\Jobs;

use App\Models\Message;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class MarkConversationMessagesAsRead implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $conversationId, public $userId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Message::where('conversation_id', $this->conversationId)
            ->where('receiver_id', $this->userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
