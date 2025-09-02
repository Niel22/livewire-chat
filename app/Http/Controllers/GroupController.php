<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(){
        return inertia('Group/List', [
            'groups' => Group::with('admin')->withCount('members')->latest()->get()
        ]);
    }

    public function create(){
        return inertia('Group/Create', [
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function store(StoreGroupRequest $request){
        $validated = $request->validated();

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
        $validated = $request->validated();

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
}
