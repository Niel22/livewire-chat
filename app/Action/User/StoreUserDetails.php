<?php

namespace App\Action\User;

use App\Models\User;
use App\Models\UserDetails;

class StoreUserDetails{

    public function execute(int $id, array $request): bool
    {
        $user = User::find($id);

        if($user){
            $userDetails = UserDetails::updateOrCreate(
                ['user_id' => $user->id],
                [                       
                    'name'           => $request['name'],
                    'date_joined'    => $request['date_joined'],
                    'payment_method' => $request['payment_method'],
                    'email'          => $request['email'],
                ]
            );

            if($userDetails){
                return true;
            }
        }

        return false;
    }
}