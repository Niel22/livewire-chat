<?php

namespace App\Action\User;

use App\Models\User;

class UpdateUser{

    public function execute($id, $request): bool
    {

        $user = User::find($id);

        if($user){
            return $user->update($request);
        }

        return false;
    }
}