<?php

namespace App\Action\User;

use App\Models\User;

class UpdateSingleUserActiveStatus{

    public function execute($id){

        $user = User::find($id);

        if(!empty($user)){
            return $user->update([
                'active_status' => !$user->active_status
            ]);
        }

        return false;
    }
}