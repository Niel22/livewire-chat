<?php

namespace App\Action\Member;

use App\Models\GroupMember;

class MuteMember{

    public function execute(int $groupId, int $memberId){

        $member = GroupMember::where('group_id', $groupId)
                                ->where('member_id', $memberId)
                                ->first();
        
        if(!empty($member)){
            $result = $member->update([
                'is_muted' => !$member->is_muted
            ]);

            if($result){
                return $member;
            }
        }

        return false;
    }
}