<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'avatar',
        'name',
        'email',
        'password',
        'role',
        'staff_id',
        'pdata'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups(){
        return $this->belongsToMany(Group::class, 'group_members', 'member_id', 'group_id')->latest('updated_at');
    }

    public function visibleGroups()
    {
        if ($this->role === 'admin' || $this->role === 'staff' || $this->staff_id !== null) {
            return Group::latest('updated_at');
        }

        return $this->belongsToMany(Group::class, 'group_members', 'member_id', 'group_id')
                    ->latest('updated_at');
    }


    public function conversations(){
        return $this->hasMany(Conversation::class, 'user_id1')->orWhere('user_id2', $this->id)->latest('updated_at');
    }

    public function details(){
        return $this->hasOne(UserDetails::class);
    }

    public function sub_account(){
        return $this->hasMany(User::class, 'staff_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
