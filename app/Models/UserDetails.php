<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetails extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'date_joined',
        'payment_method',
        'email'
    ];

    protected function casts(): array
    {
        return [
            'date_joined' => 'datetime'
        ];
    }
}
