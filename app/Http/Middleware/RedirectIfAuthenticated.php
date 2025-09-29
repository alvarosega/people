<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Redirigir según rol
            if ($user->rol === 'admin') {
                return redirect()->route('admin');
            }

            if ($user->rol === 'user') {
                return redirect()->route('user.index');
            }

            // fallback por si el usuario no tiene rol
            return redirect('/');
        }

        return $next($request);
    }
}
