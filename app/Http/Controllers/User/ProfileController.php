<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Muestra la información del perfil del usuario (Solo Lectura).
     */
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('User/Profile/Edit', [
            'userData' => [
                'nombre' => $user->nombre,
                'legajo' => $user->legajo,
                'email'  => $user->email,
                'puesto' => $user->puesto,
                'region' => $user->region,
            ]
        ]);
    }
}