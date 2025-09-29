<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response; 
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $rol)
    {
        if (! $request->user() || $request->user()->rol !== $rol) {
            abort(Response::HTTP_FORBIDDEN);

        }

        return $next($request);
    }
}
