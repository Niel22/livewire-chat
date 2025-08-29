<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');

    Route::get('/conversation/{conversation}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('/groups/{group}', [MessageController::class, 'byGroup'])->name('chat.group');

    Route::post('/messages', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/messages/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
