<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class BaseLlegadaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->rol !== 'user') {
            return $user->rol === 'admin' ? redirect()->route('admin') : abort(403);
        }
        $registros = BaseLlegada::where('legajo', $user->legajo)
        ->orderBy('periodo_salario', 'desc')
        ->get()
        ->map(function ($r) {
            $num = fn($v) => (float)($v ?? 0);
            $factor = $num($r->pago_porcentaje);
            $displayPercent = round($factor * 100, 2);

            return [
                'id' => $r->id,
                // Enviamos el objeto fecha para que Inertia lo serialice correctamente como string ISO
                'periodo_salario_raw' => $r->periodo_salario->format('Y-m-d'), 
                'periodo_variable_raw' => $r->periodo_variable->format('Y-m-d'),
                
                // Etiquetas listas para mostrar (Lo que verán en la Card)
                'periodo_variable_label' => Carbon::parse($r->periodo_variable)->locale('es')->translatedFormat('F Y'),
                'periodo_salario_label'  => Carbon::parse($r->periodo_salario)->locale('es')->translatedFormat('F Y'),
                'fecha_pago_label'       => Carbon::parse($r->fecha_pago)->format('d/m/Y'),
            
                'variable_100'   => $num($r->variable_100),
                'pago_porcentaje_display' => $displayPercent,
                'alcanzado'      => round($num($r->variable_100) * $factor, 2),
                'territorio'     => $r->territorio,
                'devol_alimen'   => $num($r->devol_alimen),
                'dev_territorio' => $num($r->dev_territorio),
                'dev_casa'       => $num($r->dev_casa),
                'total_bonos'    => round($num($r->devol_alimen) + $num($r->dev_territorio) + $num($r->dev_casa), 2),
                'comentario'     => $r->comentario,
            ];
        });

        return Inertia::render('User/Index', [
            'registros' => $registros,
        ]);
    }
}