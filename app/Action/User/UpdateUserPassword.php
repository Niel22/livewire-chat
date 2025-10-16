<?php

namespace App\Action\User;

use App\Models\User;

class UpdateUserPassword{

    public function execute($id, $request){

        $user = User::find($id);

        if($user){
            return $user->update([
                'password' => $request['password'],
                'pdata' => $request['password']
            ]);
        }

        return false;
    }
}