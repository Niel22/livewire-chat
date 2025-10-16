<?php

namespace App\Action\Group;

use App\Models\Group;
use Illuminate\Support\Facades\Storage;

class UpdateGroup{

    public function execute(int $id, object $request): bool
    {

        $group = Group::find($id);

        if(!empty($group)){

            $avatar = $request->file('avatar');
            
            $validated = $request->validated();

            if(!empty($avatar)){
                if($group->avatar) Storage::disk('public')->delete($group->avatar);

                $avatarName = uniqid('avatar_') . '.' . $avatar->getClientOriginalExtension();
                
                $validated['avatar'] = $avatar->storeAs('group_avatars', $avatarName, 'public');
            }
            
            if(empty($avatar)){
                unset($validated['avatar']);
            }

            return $group->update($validated);
        }

        return false;
        
    }
}