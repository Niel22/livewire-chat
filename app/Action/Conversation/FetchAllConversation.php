<?php

namespace App\Action\Conversation;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class FetchAllConversation{

    public function execute(){

        $user = User::find(Auth::id());

        if($user){

            // $conversation = $user->conversations()
            //     ->with(['last_message'])
            //     ->latest('updated_at')
            //     ->paginate(10);
            
            // if($conversation){
            //     return $conversation;
            // }

                $conversation = $user->conversations()
                    ->with(['last_message'])
                    ->latest('updated_at')
                    ->paginate(20);
                
                $group = $user->visibleGroups()
                    ->with(['last_message', 'admin'])
                    ->latest('updated_at')
                    ->paginate(20);
                
                $mergedData = collect($conversation->items())
                    ->merge($group->items())
                    ->sortByDesc('updated_at')
                    ->values();
                
                $mergedPaginator = new LengthAwarePaginator(
                    $mergedData,
                    $conversation->total() + $group->total(),
                    $conversation->perPage(),
                    request()->get('page', 1),
                    [
                        'path' => request()->url(),
                        'query' => request()->query(),
                    ]
                );
                
                return $mergedPaginator;
        }

        return false;
    }
}

// if($user){

//     $conversation = $user->conversations()
//         ->with(['last_message'])
//         ->latest('updated_at')
//         ->paginate(20);
    
//     $group = $user->visibleGroups()
//         ->with(['last_message', 'admin'])
//         ->latest('updated_at')
//         ->paginate(20);
    
//     $mergedData = collect($conversation->items())
//         ->merge($group->items())
//         ->sortByDesc('updated_at')
//         ->values();
    
//     $mergedPaginator = new LengthAwarePaginator(
//         $mergedData,
//         $conversation->total() + $group->total(),
//         $conversation->perPage(),
//         request()->get('page', 1),
//         [
//             'path' => request()->url(),
//             'query' => request()->query(),
//         ]
//     );
    
//     return $mergedPaginator;
// }