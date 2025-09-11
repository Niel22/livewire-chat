<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubAccountRequest;
use App\Http\Requests\StoreUserDetailsRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserDetails;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(){
        return inertia('User/List', [
            'users' => UserResource::collection(User::whereNot('role', 'admin')->latest()->get())
        ]);
    }

    public function create(){
        return inertia('User/Create');
    }

    public function store(StoreUserRequest $request){

        $validated = $request->validated();
        $validated['role'] = 'staff';

        $user = User::create($validated);

        if($user){
            return redirect()->route('user.list')->with('success', 'User created successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function createSubAccount(){
        return inertia('User/CreateSubAccount', [
            'staffs' => User::where('role', 'staff')->get()
        ]);
    }

    public function storeSubAccount(StoreSubAccountRequest $request){

        $validated = $request->validated();

        $faker = Faker::create();

        $validated['email'] = $faker->unique()->safeEmail();
        $validated['password'] = $faker->password(8);

        $user = User::create($validated);

        if($user){
            return redirect()->route('user.list')->with('success', 'Sub Account created successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function edit(User $user){

        if($user->role === 'member'){
            $user->load('details');
        }

        return inertia('User/Edit', [
            'user' => $user
        ]);
    }

    public function storeUserDetails(User $user, StoreUserDetailsRequest $request){
        $user = UserDetails::updateOrCreate(
            ['user_id' => $user->id],
            [                       
                'name'           => $request->input('name'),
                'date_joined'    => $request->input('date_joined'),
                'payment_method' => $request->input('payment_method'),
                'email'          => $request->input('email'),
            ]
        );

        if($user){
            return redirect()->route('user.list')->with('success', 'Account updated successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function update(User $user, UpdateUserRequest $request){

        if($user->update($request->validated())){
            return redirect()->route('user.list')->with('success', 'Account updated successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function destroy(User $user){
        if($user->role === "support") return;
        
        if($user->delete()){
            return redirect()->route('user.list')->with('success', 'Account Deleted successfully!');
        }

        return response()->json(['error' => 'Problem Occured'], 400);
    }

    public function show(User $user){
        if($user->role === 'member'){
            $user->load('details');
        }
        
        return inertia('User/View', [
            'user' => $user
        ]);
    }

    public function password(User $user, Request $request){
        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            'pdata' => $validated['password']
        ]);

        return back();
    }
}
