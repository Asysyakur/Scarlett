<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if user is logged in and has an admin role
        if (Auth::check() && Auth::user()->role_id === 1) {
            return $next($request);
        }
        // Redirect non-admin users
        return redirect('/dashboard');
    }
}
