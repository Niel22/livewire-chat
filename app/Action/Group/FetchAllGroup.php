<?php

namespace App\Action\Group;

use App\Models\Group;

class FetchAllGroup{

    public function execute(){
        $query = Group::with('admin')->withCount('members')->latest();

        if(request()->search){
            $query->where('name', 'like', '%' . request()->search . '%');
        }

        $group = $query->paginate(10);

        if(!empty($group)){
            return $group;
        }

        return false;
    }
}