<?php

namespace App\Http\Controllers;

use App\Action\User\CreateStaff;
use App\Action\User\CreateSubAccount;
use App\Action\User\DeleteUser;
use App\Action\User\FetchAllUser;
use App\Action\User\StoreUserDetails;
use App\Action\User\UpdateAllUserStatus;
use App\Action\User\UpdateSingleUserActiveStatus;
use App\Action\User\UpdateUser;
use App\Action\User\UpdateUserPassword;
use App\Http\Requests\StoreSubAccountRequest;
use App\Http\Requests\StoreUserDetailsRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserDetails;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use ApiResponse;

    public function seeAll(){
        return inertia('User/List');
    }

    public function create(){
        return inertia('User/Create');
    }
    
    public function createSubAccount(){
        return inertia('User/CreateSubAccount', [
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function index(FetchAllUser $action){
        if($user = $action->execute()){
            return $this->success(new UserCollection($user), "All Users");
        }

        return $this->success([], "No User Found");
    }
    
    public function show(User $user){
        if($user->role === 'member'){
            $user->load('details');
        }
        
        return inertia('User/View', [
            'user' => new UserResource($user)
        ]);
    }

    public function edit(User $user){

        if($user->role === 'member'){
            $user->load('details');
        }

        return inertia('User/Edit', [
            'user' => $user
        ]);
    }

    public function store(StoreUserRequest $request, CreateStaff $action): JsonResponse
    {

        if($action->execute($request->all())){
            return $this->success([], 'User Created');
        }

        return $this->error('Error Creating User');
    }

    public function storeSubAccount(StoreSubAccountRequest $request, CreateSubAccount $action){

        if($action->execute($request->all())){
            return $this->success([], 'Sub Account Created Successfully');
        }

        return $this->error('Error Creating Sub Account');
    }

    public function storeUserDetails($id, StoreUserDetailsRequest $request, StoreUserDetails $action){
    
        if($action->execute($id, $request->all())){
            return $this->success([], "User Details Updated");
        }

        return $this->error("Problem Updating user Details");
    }

    public function update($id, UpdateUserRequest $request, UpdateUser $action){

        if($action->execute($id, $request->all())){
            return $this->success([], "User Updated");
        }

        return $this->error("Problem Updating user");
    }

    public function destroy($id, DeleteUser $action){
        if($action->execute($id)){
            return $this->success([], "User Deleted");
        }

        return $this->error('Error deleting user');
    }

    public function password($id, UpdateUserPasswordRequest $request, UpdateUserPassword $action){

        if($action->execute($id, $request->all())){
            return $this->success([], "User Password Updated");
        }

        return $this->error('Problem Updating Password');
    }

    public function toggleUserStatus($id, UpdateSingleUserActiveStatus $action){
        
        if($action->execute($id)){
            return $this->success([], 'Active Status Updated');
        }

        return $this->error('Error Updating Active Status');
    }
    
    public function toggleAllUserStatus(UpdateAllUserStatus $action){

        if($action->execute()){
            return $this->success([], 'All Users Active Status Updated');
        }

        return $this->error('Error Updating Active Status');
    }
}
