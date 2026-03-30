<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    // Cambiamos el dashboard genérico por la ruta de usuario
    public const HOME = '/user/base-llegada';

    public function boot(): void
    {
        $this->routes(function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Este método se usa en algunos controladores de autenticación 
     * para determinar la ruta dinámica.
     */
    public static function redirectTo(): string
    {
        $user = Auth::user();
        
        if (!$user) return '/login';

        return match($user->rol) {
            'admin' => route('admin.base-llegada.index'),
            'user'  => route('user.base_llegada'),
            default => '/',
        };
    }
}