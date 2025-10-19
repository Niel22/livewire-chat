<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');

    Route::prefix('api')->group(function(){
        Route::apiResource('conversations', ConversationController::class);

        // Group Management
        Route::apiResource('groups', GroupController::class);

        // User Management
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{user}/change-password', [UserController::class, 'password']);
        Route::patch('/users/{user}/user-details', [UserController::class, 'storeUserDetails']);
        Route::post('/users/create-sub', [UserController::class, 'storeSubAccount']);

        Route::patch('users/{id}/active-status', [UserController::class, 'toggleUserStatus']);
        Route::patch('users-active-status', [UserController::class, 'toggleAllUserStatus']);
    });
    
    Route::get('/switch-account/{account}', [HomeController::class, 'switch'])->name('switch');
    
    Route::get('/groups', [GroupController::class, 'seeAll'])->name('group.list');
    Route::get('/groups/create', [GroupController::class, 'create'])->name('group.create');
    Route::get('/groups/{group}', [MessageController::class, 'byGroup'])->name('chat.group');
    Route::get('/groups/{group}/edit', [GroupController::class, 'edit'])->name('group.edit');
    Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->name('group.destroy');
    Route::patch('/groups/{group}/lock', [GroupController::class, 'lockGroup'])->name('group.lock');
    Route::get('/groups/{group}/schedule-message', [GroupController::class, 'scheduleMessage'])->name('group.message.schedule');
    Route::post('/groups/{group}/schedule-message', [GroupController::class, 'schedule'])->name('group.schedule');
    Route::delete('/groups/{group}/schedule-message/{schedule_message}', [GroupController::class, 'deleteSchedule'])->name('group.schedule.delete');
    Route::get('/groups/{group}/add-members', [GroupController::class, 'member'])->name('group.member.add');
    Route::post('/groups/{group}/add-members', [GroupController::class, 'addMember'])->name('group.member.store');
    Route::patch('/groups/{group}/remove/{user}', [GroupController::class, 'removeMember'])->name('group.member.remove');
    Route::patch('/groups/{group}/exit', [GroupController::class, 'exitGroup'])->name('group.member.exit');

    Route::get('/conversation/{conversation}', [MessageController::class, 'byUser'])->name('chat.user');

    Route::post('/conversation/{user}', [MessageController::class, 'startConversation'])->name('chat.create');
    Route::post('/messages', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/messages/{message}', [MessageController::class, 'show'])->name('message.show');
    Route::patch('/messages/{message}/pin', [MessageController::class, 'pin'])->name('message.pin');
    Route::patch('/messages/{message}/unpin', [MessageController::class, 'unpin'])->name('message.unpin');
    Route::patch('/messages/{message}/update', [MessageController::class, 'update'])->name('message.update');
    Route::get('/messages/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');
    Route::get('/messsages/search', [MessageController::class, 'search'])->name('message.search');

    Route::get('/users', [UserController::class, 'seeAll'])->name('user.list');
    Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/users', [UserController::class, 'store'])->name('user.store');
    Route::get('/users/create-sub', [UserController::class, 'createSubAccount'])->name('user.create-sub');
    
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('user.show');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('user.update');
    
    
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

