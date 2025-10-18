<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if($this->name){

            return [
                'id' => $this->id,
                'name' => $this->name,
                'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
                'members' => $this->members?->count(),
                'membersList' => $this->members,
                'is_group' => true,
                'is_locked' => $this->is_locked,
                'name' => $this->name,
                'description' => $this->description,
                'updated_at' => $this->updated_at,
                'admin' => $this->admin,
                'member' => $this->member,
                'last_message' => $this->last_message?->message,
                'last_message_date' => $this->last_message?->created_at,
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->getReceiver()->name,
            'receiver_id' => $this->getReceiver()->id,
            'avatar' => $this->getReceiver()->avatar ? Storage::url($this->getReceiver()->avatar) : null,
            'is_group' => false,
            'last_message' => $this->last_message?->message,
            'last_message_date' => $this->last_message?->updated_at,
            'updated_at' => $this->updated_at
        ];
    }
}
