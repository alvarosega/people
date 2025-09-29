<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->rol !== 'admin') {
            return redirect()->route('user');
        }

        $search = (string) $request->input('search', '');

        $query = BaseLlegada::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('legajo', 'like', "%{$search}%")
                  ->orWhereHas('usuario', function ($userQuery) use ($search) {
                      $userQuery->where('nombre', 'like', "%{$search}%");
                  });
            });
        }

        $registros = $query->with('usuario')
            ->orderBy('fecha', 'desc')
            ->orderBy('legajo', 'asc')
            ->paginate(10);

        // Trabajamos sobre la colección del paginador
        $collection = $registros->getCollection();

        $collection->transform(function ($r) {
            // --- Helpers de parseo seguros ---
            $parseNumber = function ($v): float {
                if ($v === null) return 0.0;
                if (is_numeric($v)) return (float)$v;
                $s = trim((string)$v);
                $s = str_replace(['$', ' ', "\xc2\xa0"], '', $s);
                $s = str_replace(',', '.', $s);
                return is_numeric($s) ? (float)$s : 0.0;

                // string: limpiar símbolos y espacios
                $s = trim((string)$v);
                $s = str_replace(['$', ' ', "\xc2\xa0"], '', $s); // quita $, espacios y NBSP

                // Detectar formato 1.234,56 (es-AR) vs 1,234.56 (en-US)
                $hasComma = strpos($s, ',') !== false;
                $hasDot   = strpos($s, '.') !== false;

                if ($hasComma && $hasDot) {
                    // Decidir por el último separador como decimal
                    if (strrpos($s, ',') > strrpos($s, '.')) {
                        // 1.234,56  => quitar puntos de mil y cambiar coma por punto
                        $s = str_replace('.', '', $s);
                        $s = str_replace(',', '.', $s);
                    } else {
                        // 1,234.56  => quitar comas de mil
                        $s = str_replace(',', '', $s);
                    }
                } elseif ($hasComma) {
                    // Usar coma como decimal
                    $s = str_replace(',', '.', $s);
                } // si solo hay punto, ya está bien

                return is_numeric($s) ? (float)$s : 0.0;
            };

            $parsePercent = function ($v): float {
                if ($v === null) return 0.0;

                // limpiar %, $, espacios y normalizar comas
                $s = trim((string)$v);
                $s = str_replace(['%', '$', ' ', "\xc2\xa0"], '', $s);
                // Convertir 1,09 -> 1.09
                $s = str_replace(',', '.', $s);

                // Quitar separadores de miles si vinieran tipo 1.234,56% (ya convertida la coma)
                // Nota: en porcentajes casi nunca se usan miles, pero por las dudas
                if (substr_count($s, '.') > 1) {
                    // dejar solo el último punto como decimal
                    $last = strrpos($s, '.');
                    $s = str_replace('.', '', substr($s, 0, $last)) . substr($s, $last);
                }

                $n = is_numeric($s) ? (float)$s : 0.0;

                /**
                 * Regla de negocio:
                 * - [0 .. 2]  => factor directo (0.25=25%, 1.09=109%)
                 * -  > 2       => porcentaje (25=25%, 109=109%) => dividir por 100
                 */
                if ($n <= 2.0) {
                    $factor = $n;
                } else {
                    $factor = $n / 100.0;
                }

                // Clamp por seguridad (0%..1000%)
                if ($factor < 0)   $factor = 0.0;
                if ($factor > 10)  $factor = 10.0;

                return $factor;
            };

            // --- Normalizar campos numéricos de dinero ---
            $r->devol_alimen   = $parseNumber($r->devol_alimen);
            $r->dev_territorio = $parseNumber($r->dev_territorio);
            $r->dev_casa       = $parseNumber($r->dev_casa);
            $r->variable_100   = $parseNumber($r->variable_100);
            
            $r->dias_alim = (int) $parseNumber($r->dias_alim);
            $r->dias_terr = (int) $parseNumber($r->dias_terr);
            $r->dias_casa = (int) $parseNumber($r->dias_casa);

            // --- Normalizar porcentaje ---
            $porcentaje = $parsePercent($r->pago_porcentaje);

            // --- Campos calculados y display ---
            $r->pago_porcentaje_decimal = $porcentaje;               // p.ej. 1.09
            $r->pago_porcentaje_display = round($porcentaje * 100, 2); // p.ej. 109.00

            $r->pago_calculado = round(
                $r->devol_alimen +
                $r->dev_territorio +
                $r->dev_casa +
                ($r->variable_100 * $porcentaje),
                2
            );

                       // --- Sanitizar strings para evitar "Malformed UTF-8" ---
            foreach (['fecha','fecha_pago','comentario'] as $campo) {
                if (isset($r->$campo) && is_string($r->$campo)) {
                    $r->$campo = mb_convert_encoding($r->$campo, 'UTF-8', 'UTF-8');
                }
            }
            // --- Formatear fechas para display ---
            $r->fecha_display = $r->fecha 
                ? \Carbon\Carbon::createFromFormat('m-Y', $r->fecha)->translatedFormat('M Y')
                : '-';

            $r->fecha_pago_display = $r->fecha_pago
                ? \Carbon\Carbon::createFromFormat('d-m-Y', $r->fecha_pago)->translatedFormat('d M Y')
                : '-';


            return $r;
        });

        // Volver a poner la colección transformada en el paginador
        $registros->setCollection($collection);

        // Resumen usando la colección transformada
        $totalPagos     = round($collection->sum('pago_calculado'), 2);
        $usuariosUnicos = $collection->pluck('legajo')->unique()->count();
        $promedioPago   = $collection->count() ? round($totalPagos / $collection->count(), 2) : 0.0;

        // Serialización segura
        $registros_serialized = json_decode(
            json_encode($registros, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE),
            true
        );

        return Inertia::render('Admin/Index', [
            'registros'       => $registros_serialized,
            'totalPagos'      => $totalPagos,
            'usuariosUnicos'  => $usuariosUnicos,
            'promedioPago'    => $promedioPago,
            'search'          => $search,
        ]);
    }
}
