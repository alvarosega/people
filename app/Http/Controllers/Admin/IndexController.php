<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        // Estadísticas globales para la bienvenida
        return Inertia::render('Admin/Index', [
            'stats' => [
                'total_usuarios' => User::count(),
                'total_registros' => BaseLlegada::count(),
                'pagos_mes_actual' => BaseLlegada::whereMonth('fecha', now()->month)->sum('variable_100'),
                'usuarios_activos' => User::whereNull('deleted_at')->count(),
            ]
        ]);
    }
}