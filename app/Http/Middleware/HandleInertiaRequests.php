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

        $subAccounts = collect();

        if ($user) {
            if ($user->role === 'staff') {
                $subAccounts = User::where('staff_id', $user->id)
                    ->orWhere('id', $user->id)
                    ->get();
            } elseif ($user->role === 'member' && $user->staff_id) {
                $subAccounts = User::where('staff_id', $user->staff_id)
                    ->orWhere('id', $user->staff_id)
                    ->get();
            }
            $subAccounts = $subAccounts->unique('id')->values();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? new UserResource($request->user()) : null,
            ],
            'sub_account' => $subAccounts,
        ];
    }
}
