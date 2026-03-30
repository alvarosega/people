<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // <-- IMPORTANTE: Añadimos la fachada de Logs
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
                // --- INICIO DE LOGS ---
                Log::info("========================================");
                Log::info("Evaluando registro ID: " . $r->id);
                Log::info("Valor CRUDO de pago_porcentaje en BD: " . var_export($r->pago_porcentaje, true));

                // Parseo
                $num = fn($v) => (float)($v ?? 0);
                $factor = $num($r->pago_porcentaje);
                
                Log::info("Valor convertido a FLOAT (factor): " . $factor);

                $displayPercent = round($factor * 100, 2);
                
                Log::info("Valor final para React (pago_porcentaje_display): " . $displayPercent);
                // --- FIN DE LOGS ---

                $mapped = [
                    'id' => $r->id,
                    'periodo_salario' => clone $r->periodo_salario,

                    'periodo_variable_display' => Carbon::parse($r->periodo_variable)->locale('es')->translatedFormat('F Y'),
                    'periodo_salario_display'  => Carbon::parse($r->periodo_salario)->locale('es')->translatedFormat('F Y'),
                    'fecha_pago_display'       => Carbon::parse($r->fecha_pago)->format('d/m/Y'),

                    'variable_100'            => $num($r->variable_100),
                    'pago_porcentaje_display' => $displayPercent,
                    'alcanzado'               => round($num($r->variable_100) * $factor, 2),

                    'devol_alimen'   => $num($r->devol_alimen),
                    'dev_territorio' => $num($r->dev_territorio),
                    'dev_casa'       => $num($r->dev_casa),
                    'total_bonos'    => round($num($r->devol_alimen) + $num($r->dev_territorio) + $num($r->dev_casa), 2),

                    'anillo'     => $r->anillo,
                    'comentario' => $r->comentario ? mb_convert_encoding($r->comentario, 'UTF-8', 'UTF-8') : null,
                ];

                Log::info("Array Mapeado que se enviará a React:", $mapped);

                return $mapped;
            });

        return Inertia::render('User/Index', [
            'registros' => $registros,
        ]);
    }
}