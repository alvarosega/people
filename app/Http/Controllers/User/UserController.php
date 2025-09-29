<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\BaseLlegada;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // registros del usuario (ajusta si tu FK es distinta)
        $registros = BaseLlegada::where('legajo', $user->legajo)
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('User/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'region' => $user->region,
                    'rol' => $user->rol,
                    'puesto' => $user->puesto,
                    'legajo' => $user->legajo,
                ],
            ],
            'registros' => $registros,
        ]);
    }
}
