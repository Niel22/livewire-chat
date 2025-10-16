<?php

namespace App\Action\Group;

use App\Models\Group;

class DeleteGroup{

    public function execute($id){

        $group = Group::find($id);

        if($group){
            return $group->delete();
        }

        return false;
    }
}