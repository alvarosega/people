<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada; // Importar el modelo
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        $user = Auth::user();

        // Buscamos el último pago para obtener el territorio
        $ultimoPago = BaseLlegada::where('legajo', $user->legajo)
            ->orderBy('fecha_pago', 'desc')
            ->first();

        return Inertia::render('User/Profile/Edit', [
            'userData' => [
                'nombre'     => $user->nombre,
                'legajo'     => $user->legajo,
                'email'      => $user->email,
                'puesto'     => $user->puesto,
                'region'     => $user->region,
                // Si existe el pago, enviamos el territorio, sino un fallback
                'territorio' => $user->ultimoPago ? $user->ultimoPago->territorio : 'Sin territorio asignado',
            ]
        ]);
    }
}