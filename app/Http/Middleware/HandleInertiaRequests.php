<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? new UserResource($request->user()) : null,
            ],
            'sub_account' => $user
                ? User::query()
                    ->when($user->role === 'staff', function ($query) use ($user) {
                        $query->where('staff_id', $user->id)
                            ->orWhere('id', $user->id);
                    })
                    ->when($user->role === 'member' && $user->staff_id, function ($query) use ($user) {
                        $query->where(function ($q) use ($user) {
                            $q->where('staff_id', $user->staff_id)
                            ->orWhere('id', $user->staff_id);
                        });
                    })
                    ->get()
                    ->unique('id')
                    ->values()
                : [],
            'conversations' => Auth::check() ? Conversation::getConversationForSidebar(Auth::user()) : []
        ];
    }
}
