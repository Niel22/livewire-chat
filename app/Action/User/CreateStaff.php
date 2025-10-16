<?php

namespace App\Action\User;

use App\Models\User;

class CreateStaff{

    public function execute($request): bool
    {

        $request['role'] = 'staff';

        $user = User::create($request);

        if($user){
            return true;
        }

        return false;
    }
}