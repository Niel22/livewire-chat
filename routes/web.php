<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');
    
    Route::get('/groups', [GroupController::class, 'index'])->name('group.list');
    Route::get('/groups/create', [GroupController::class, 'create'])->name('group.create');
    Route::post('/groups', [GroupController::class, 'store'])->name('group.store');
    Route::get('/groups/{group}', [MessageController::class, 'byGroup'])->name('chat.group');
    Route::get('/groups/{group}/edit', [GroupController::class, 'edit'])->name('group.edit');
    Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->name('group.destroy');

    Route::get('/conversation/{conversation}', [MessageController::class, 'byUser'])->name('chat.user');

    Route::post('/conversation/{user}', [MessageController::class, 'startConversation'])->name('chat.create');
    Route::post('/messages', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/messages/{message}', [MessageController::class, 'show'])->name('message.show');
    Route::patch('/messages/{message}/pin', [MessageController::class, 'pin'])->name('message.pin');
    Route::get('/messages/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');

    Route::get('/users', [UserController::class, 'index'])->name('user.list');
    Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/users', [UserController::class, 'store'])->name('user.store');
    Route::get('/users/create-sub', [UserController::class, 'createSubAccount'])->name('user.create-sub');
    Route::post('/users/create-sub', [UserController::class, 'storeSubAccount'])->name('user.store-sub');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('user.show');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::patch('/users/{user}/user-details', [UserController::class, 'storeUserDetails'])->name('user.user-details');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
