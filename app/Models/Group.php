<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'admin_id',
        'is_locked',
    ];

    public function members(){
        return $this->belongsToMany(User::class, 'group_members', 'group_id', 'member_id');
    }

    public function messages(){
        return $this->hasMany(Message::class, 'group_id');
    }

    public function admin(){
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function last_message()
    {
        return $this->hasOne(Message::class, 'group_id')
        ->latestOfMany();
    }

    public function toConversationArray(){
        return [
            'id' => $this->id,
            'name' => $this->name,
            'members' => $this->members->count(),
            'membersList' => $this->members,
            'is_group' => true,
            'name' => $this->name,
            'description' => $this->description,
            'updated_at' => $this->updated_at,
            'admin' => $this->admin,
            'last_message' => $this->last_message?->message,
            'last_message_date' => $this->updated_at,
        ];
    }
}
