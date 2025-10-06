<?php

namespace App\Action\User;

use App\Models\User;

class FetchAllUser{

    public function execute(){

        $query = User::whereNot('role', 'admin')->latest();

        if(request()->search){
            $query->where('name', 'like', '%' . request()->search . '%')->orWhere('role', 'like', '%' . request()->search . '%');
        }

        $user = $query->paginate(10);

        if(!empty($user)){
            return $user;
        }

        return false;
    }
}