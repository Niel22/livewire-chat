<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $this->load('sub_account');
        return [
            'id' => $this->id,
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'details' => $this->details ?? null,
            'staff_id' => $this->staff_id,
            'active_status' => $this->active_status,
            'sub_account' => $this->sub_account ? $this->sub_account : null
        ];
    }
}
