<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\BaseLlegada;
use Illuminate\Support\Carbon;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Obtenemos los registros y aplicamos la transformación de 3 meses
        $registros = BaseLlegada::where('legajo', $user->legajo)
            ->orderBy('fecha_pago', 'desc')
            ->get();

        $registros->transform(function ($r) {
            $r->periodo_variable_display = Carbon::parse($r->periodo_variable)->translatedFormat('F Y');
            $r->periodo_salario_display  = Carbon::parse($r->periodo_salario)->translatedFormat('F Y');
            $r->fecha_pago_display       = Carbon::parse($r->fecha_pago)->format('d/m/Y');
            
            // Cálculos para la vista objetiva
            $pLogro = (float) $r->pago_porcentaje;
            $r->alcanzado = round((float)$r->variable_100 * $pLogro, 2);
            $r->total_bonos = round((float)$r->devol_alimen + (float)$r->dev_territorio + (float)$r->dev_casa, 2);

            return $r;
        });

        // CORRECCIÓN: Apuntar a la nueva ubicación de la vista
        return Inertia::render('User/BaseLlegada/Index', [
            'registros' => $registros
        ]);
    }
}