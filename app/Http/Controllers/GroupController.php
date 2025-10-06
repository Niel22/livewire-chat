<?php

namespace App\Http\Controllers;

use App\Action\Group\FetchAllGroup;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ScheduleMessage;
use App\Events\SocketGroupLocked;
use App\Http\Requests\AddGroupMemberRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Requests\ScheduleMessageRequest;
use App\Http\Resources\GroupCollection;
use App\Http\Resources\GroupResource;
use App\Jobs\SendScheduledMessage;
use App\Models\GroupMember;
use App\Models\ScheduleMessageAttachment;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class GroupController extends Controller
{
    use ApiResponse;

    public function index(FetchAllGroup $action){

        if($group = $action->execute()){
            
            return $this->success(new GroupCollection($group), "All Groups");
        }

        return $this->success([], "No Group Found");
    }

    public function seeAll(){
        return inertia('Group/List', [
            'groups' => []
        ]);
    }

    public function create(){
        return inertia('Group/Create', [
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function store(StoreGroupRequest $request){
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
            return redirect()->route('group.list')->with('success', 'Group created successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function edit(Group $group){
        return inertia('Group/Edit', [
            'group' => $group,
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function update(Group $group, UpdateGroupRequest $request){
        
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

        if($group->update($validated)){
            return redirect()->route('group.list')->with('success', 'Group Updated successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function destroy(Group $group){

        $group->messages()->delete();
        if($group->delete()){
            return redirect()->route('group.list')->with('success', 'Group Deleted successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function lockGroup(Group $group){

        if(Auth::user()->role === 'member') return;
        
        if(
            $group->update([
                'is_locked' => !$group->is_locked
            ])
        ){
            SocketGroupLocked::dispatch($group);
            return response()->json(['success' => 'Group updated', 'data' => $group], 200);
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function scheduleMessage(Group $group){

        return inertia('Group/ScheduleMessage', [
            'group' => $group,
            'scheduled_messages' => ScheduleMessage::with('attachments')->where('group_id', $group->id)->latest()->get()
        ]);
    }

    public function schedule(Group $group, ScheduleMessageRequest $request){

        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $data['group_id'] = $group->id;

        

        $files = $data['attachments'] ?? null;

        $message = ScheduleMessage::create($data);
        $attachments = [];

        if($files){
            foreach($files as $file){
                $directory = 'attachments/'. Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'schedule_message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public')
                ];
                
                $attachment = ScheduleMessageAttachment::create($model);
                $attachments[] = $attachment;
            }

            $message->attachments = $attachments;
        }

        

        SendScheduledMessage::dispatch($message)->delay(
            Carbon::parse($data['scheduled_at'])
        );

        if($message){
            return redirect()->route('group.message.schedule', $group->id)->with('success', 'Message Scheduled Successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function deleteSchedule(Group $group, ScheduleMessage $schedule_message){
        if($schedule_message->delete()){
            return redirect()->route('group.message.schedule', $group->id)->with('success', 'Scheduled Message Deleted successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function member(Group $group){
        $members = User::where('role', 'member')
            ->whereNull('staff_id')
            ->whereDoesntHave('groups', function ($q) use ($group) {
                $q->where('group_id', $group->id);
            })
            ->get();
        return inertia("Group/AddMember", [
            'group' => $group,
            'members' => $members
        ]);
    }

    public function addMember(Group $group, AddGroupMemberRequest $request){
        
        $memberIds = $request->input('members');

        $group->members()->syncWithoutDetaching($memberIds);

        return redirect()
            ->route('chat.group', $group->id)
            ->with('success', 'Members added successfully!');

    }

    public function removeMember(Group $group, User $user){
        if(Auth::user()->role !== 'admin' && $group->admin_id !== Auth::id()){
            return;
        }

        $member = GroupMember::where('group_id', $group->id)
            ->where('member_id', $user->id)
            ->first();
        

        if ($member && $member->delete()) {
            return redirect()->back();
        }

        return response()->json(['error' => 'Problem Occurred'], 400);
    }

    public function exitGroup(Group $group){
        $user = Auth::user();
        if($user->staff_id !== null || $user->role !== "member"){
            return;
        }

        $member = GroupMember::where('group_id', $group->id)->where('member_id', $user->id);

        if($member?->delete()){
            return redirect()->route('dashboard');
        }

        return response()->json(['error' => 'Problem Occured'], 400);

    }

}
