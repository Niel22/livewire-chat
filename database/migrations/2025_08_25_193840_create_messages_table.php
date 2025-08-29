<?php

use App\Models\Conversation;
use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->longText('message')->nullable();
            $table->foreignIdFor(User::class, 'sender_id')->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'receiver_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Group::class, 'group_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Conversation::class, 'conversation_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
