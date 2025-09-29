<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BaseLlegadaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->rol !== 'user') {
            if ($user->rol === 'admin') {
                return redirect()->route('admin');
            }
            abort(403, 'No tienes permisos para acceder a esta página');
        }

        $registros = BaseLlegada::where('legajo', $user->legajo)
            ->orderBy('fecha', 'desc')
            ->get();

        // Aplicar las mismas reglas que en IndexController (admin)
        $registros->transform(function ($r) {
            // --- Helpers de parseo ---
            $parseNumber = function ($v): float {
                if ($v === null) return 0.0;
                if (is_numeric($v)) return (float)$v;

                $s = trim((string)$v);
                $s = str_replace(['$', ' ', "\xc2\xa0"], '', $s);

                $hasComma = strpos($s, ',') !== false;
                $hasDot   = strpos($s, '.') !== false;

                if ($hasComma && $hasDot) {
                    if (strrpos($s, ',') > strrpos($s, '.')) {
                        $s = str_replace('.', '', $s);
                        $s = str_replace(',', '.', $s);
                    } else {
                        $s = str_replace(',', '', $s);
                    }
                } elseif ($hasComma) {
                    $s = str_replace(',', '.', $s);
                }

                return is_numeric($s) ? (float)$s : 0.0;
            };

            $parsePercent = function ($v): float {
                if ($v === null) return 0.0;
                $s = trim((string)$v);
                $s = str_replace(['%', '$', ' ', "\xc2\xa0"], '', $s);
                $s = str_replace(',', '.', $s);

                if (substr_count($s, '.') > 1) {
                    $last = strrpos($s, '.');
                    $s = str_replace('.', '', substr($s, 0, $last)) . substr($s, $last);
                }

                $n = is_numeric($s) ? (float)$s : 0.0;

                // Reglas
                if ($n <= 2.0) {
                    $factor = $n; // ej. 1.09 = 109%
                } else {
                    $factor = $n / 100.0; // ej. 109 => 1.09
                }

                if ($factor < 0) $factor = 0.0;
                if ($factor > 10) $factor = 10.0;

                return $factor;
            };

            // --- Normalizar ---
            $r->devol_movi   = $parseNumber($r->devol_movi);
            $r->devol_alimen = $parseNumber($r->devol_alimen);
            $r->variable_100 = $parseNumber($r->variable_100);

            $porcentaje = $parsePercent($r->pago_porcentaje);

            // --- Campos calculados ---
            $r->pago_porcentaje_decimal = $porcentaje;
            $r->pago_porcentaje_display = round($porcentaje * 100, 2);

            $r->pago_calculado = round(
                $r->devol_movi +
                $r->devol_alimen +
                ($r->variable_100 * $porcentaje),
                2
            );

            // Sanitizar strings
            foreach (['fecha','region','comentario'] as $campo) {
                if (isset($r->$campo) && is_string($r->$campo)) {
                    $r->$campo = mb_convert_encoding($r->$campo, 'UTF-8', 'UTF-8');
                }
            }

            return $r;
        });

        return Inertia::render('User/Index', [
            'registros' => $registros->toArray(),
        ]);
    }
}
