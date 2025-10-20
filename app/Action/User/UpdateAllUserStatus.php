<?php

namespace App\Action\User;

use App\Models\User;

class UpdateAllUserStatus{

    public function execute(){
        
        $users = User::whereIn('role', ['admin', 'staff', 'support'])
            ->orWhereNotNull('staff_id')
            ->get();

        foreach ($users as $user) {
            $user->update([
                'active_status' => !$user->active_status
            ]);
        }

        return true;
    }
}