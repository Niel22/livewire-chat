<?php

namespace App\Action\Group;

use App\Models\Group;

class CreateGroup{

    public function execute(object $request): bool
    {

        $avatar = $request->file('avatar');
        
        $validated = $request->validated();

        if($avatar){
            $avatarName = uniqid('avatar_') . '.' . $avatar->getClientOriginalExtension();

            $validated['avatar'] = $avatar->storeAs('group_avatars', $avatarName, 'public');
        }

        if(empty($avatar)){
            unset($validated['avatar']);
        }
        
        $group = Group::create($validated);

        if($group){
            return true;
        }

        return false;
    }
}