<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
            'password' => 'password',
            'role' => 'admin'
        ]);
        
        User::factory()->create([
            'name' => 'Jane Doe',
            'email' => 'jane@gmail.com',
            'password' => 'password',
            'role' => 'staff'
        ]);
        
        User::factory()->create([
            'name' => 'Paul Doe',
            'email' => 'paul@gmail.com',
            'password' => 'password',
            'role' => 'member'
        ]);

        User::factory(10)->create();
        for($i = 0; $i < 5; $i++){
            $group = Group::factory()->create([
                'admin_id' => 2
            ]);
        }

        $users = User::inRandomOrder()->limit(rand(3, 5))->pluck('id');
        $group->members()->attach(array_unique([1, ...$users]));

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message){
            return collect([
                $message->sender_id, $message->receiver_id
            ])->sort()->implode('_');
        })->map(function ($groupMessages){
            return [
                'user_id1' => $groupMessages->first()->sender_id,
                'user_id2' => $groupMessages->first()->receiver_id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());

        foreach ($messages->groupBy(function ($m) {
            return collect([$m->sender_id, $m->receiver_id])->sort()->implode('_');
        }) as $pairKey => $groupMessages) {
            [$id1, $id2] = explode('_', $pairKey);

            $conversation = Conversation::where('user_id1', $id1)
                ->where('user_id2', $id2)
                ->first();

            if ($conversation) {
                Message::whereIn('id', $groupMessages->pluck('id'))
                    ->update(['conversation_id' => $conversation->id]);
            }
        }

    }
}
