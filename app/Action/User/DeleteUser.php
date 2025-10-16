<?php

namespace App\Action\User;

use App\Models\User;

class DeleteUser{

    public function execute($id){

        $user = User::find($id);

        if(!empty($user) && !in_array($user->role, ['admin', 'support'])){
            return $user->delete();
        }

        return false;
    }
}