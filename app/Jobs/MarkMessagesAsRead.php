<?php

namespace App\Jobs;

use App\Models\Message;
use App\Models\MessageRead;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class MarkMessagesAsRead implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $groupId, public $userId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $unreadMessages = Message::where('group_id', $this->groupId)
            ->whereDoesntHave('reads', function ($query) {
                $query->where('user_id', $this->userId);
            })
            ->pluck('id');

        if ($unreadMessages->isNotEmpty()) {
            $records = $unreadMessages->map(fn($id) => [
                'message_id' => $id,
                'user_id' => $this->userId,
            ])->toArray();

            MessageRead::insert($records);
        }
    }
}
