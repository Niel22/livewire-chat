<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogEndpointAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $user = Auth::check() ? Auth::user()->email : 'Guest';
        $method = $request->method();
        $path = $request->path();
        $ip = $request->ip();
        $timestamp = Carbon::now()->toDateTimeString();

        Log::channel('endpoint')->info('Endpoint Access', [
            'user' => $user,
            'method' => $method,
            'path' => $path,
            'ip' => $ip,
            'date' => $timestamp,
        ]);

        return $response;

    }
}
