<?php

namespace App\Http\Controllers;

use App\Action\Group\CreateGroup;
use App\Action\Group\DeleteGroup;
use App\Action\Group\FetchAllGroup;
use App\Action\Group\UpdateGroup;
use App\Action\Member\MuteMember;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ScheduleMessage;
use App\Events\SocketGroupLocked;
use App\Events\SocketMemberMuted;
use App\Http\Requests\AddGroupMemberRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Requests\ScheduleMessageRequest;
use App\Http\Resources\GroupCollection;
use App\Http\Resources\GroupResource;
use App\Jobs\SendScheduledMessage;
use App\Models\GroupMember;
use App\Models\MessageAttachment;
use App\Models\ScheduleMessageAttachment;
use App\Services\CloudinaryUploadService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

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
        return inertia('Group/List');
    }

    public function create(){
        return inertia('Group/Create', [
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function edit(Group $group){
        return inertia('Group/Edit', [
            'group' => $group,
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function store(StoreGroupRequest $request, CreateGroup $action){
        
        if($action->execute($request)){
            return $this->success([], "Group Created");
        }

        return $this->error("Problem Creating Group");
    }


    public function update($id, UpdateGroupRequest $request, UpdateGroup $action){

        if($action->execute($id, $request)){
            return $this->success([], "Group Updated");
        }

        return $this->error("Problem Updating Group");
    }

    public function destroy($id, DeleteGroup $action){

        if($action->execute($id)){
            return $this->success([], "Group Deleted");
        }

        return $this->error("Problem Deleting Group");
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
            'scheduled_messages' => ScheduleMessage::with('attachments')->where('group_id', $group->id)->where('sender_id', Auth::id())->latest()->get()
        ]);
    }

    public function schedule(Group $group, ScheduleMessageRequest $request, CloudinaryUploadService $cloudinary){

        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $data['group_id'] = $group->id;

        $timezone = $request->input('timezone', 'UTC');

        $userTime = Carbon::parse($data['scheduled_at'], $timezone);

        $now = Carbon::now($timezone);

        if ($userTime->lessThanOrEqualTo($now)) {
            throw ValidationException::withMessages([
                'scheduled_at' => ['Scheduled time cannot be in the past.'],
            ]);
        }

        // $data['scheduled_at'] = $userTime->clone()->setTimezone('UTC');

        $files = $data['attachments'] ?? null;

        $message = ScheduleMessage::create($data);
        $attachments = [];

        if ($files) {
            $uploads = $cloudinary->uploadFiles($files, $message->id);
            foreach ($uploads as $upload) {
                $attachment = ScheduleMessageAttachment::create([
                    'schedule_message_id' => $message->id,
                    'name' => $upload['name'],
                    'mime' => $upload['mime'],
                    'size' => $upload['size'],
                    'path' => $upload['path'],
                    'public_id' => $upload['public_id'],
                ]);

                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        

        SendScheduledMessage::dispatch($message)->delay(
            Carbon::parse($userTime->clone()->setTimezone('UTC'))
        );

        if($message){
            return back()->with('success', 'Message Scheduled Successfully!');
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

    public function muteMember($groupId, $memberId, MuteMember $action){
        
        if($member = $action->execute($groupId, $memberId)){

            SocketMemberMuted::dispatch($member);

            return $this->success([], "Member Mute Status Updated");
        }

        return $this->error("Problem Updating member mute status");
    }

}
