<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        
        if (!$user) {
            abort(403, 'Usuario no autenticado');
        }

        // Verificar el rol del usuario
        if ($user->rol !== $role) {
            abort(403, 'No tienes permisos para acceder a esta página');
        }

        return $next($request);
    }
}