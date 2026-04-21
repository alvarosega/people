<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class BaseLlegadaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->rol !== 'admin') {
            return redirect()->route('user');
        }

        $search = $request->input('search');
        $query = BaseLlegada::with('usuario');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('legajo', 'like', "%{$search}%")
                  ->orWhereHas('usuario', function ($userQuery) use ($search) {
                      $userQuery->where('nombre', 'like', "%{$search}%");
                  });
            });
        }

        $registros = $query->orderBy('fecha_pago', 'desc')
                           ->orderBy('legajo', 'asc')
                           ->paginate(15)
                           ->withQueryString();

        $registros->getCollection()->transform(function ($r) {
            $r->periodo_variable_display = $r->periodo_variable 
                ? Carbon::parse($r->periodo_variable)->translatedFormat('M Y') 
                : '-';
            
            $r->periodo_salario_display = $r->periodo_salario 
                ? Carbon::parse($r->periodo_salario)->translatedFormat('M Y') 
                : '-';
            
            $r->fecha_pago_display = $r->fecha_pago 
                ? Carbon::parse($r->fecha_pago)->format('d/m/Y') 
                : '-';
            
            // Single Source of Truth para el pago
            $pLogro = (float) $r->pago_porcentaje;
            $r->pago_calculado = round(
                (float)$r->devol_alimen +
                (float)$r->dev_territorio +
                (float)$r->dev_casa +
                ((float)$r->variable_100 * $pLogro), 2
            );

            return $r;
        });

        return Inertia::render('Admin/BaseLlegada/Index', [
            'registros' => $registros,
            'filters'   => ['search' => $search]
        ]);
    }

    public function create()
    {
        $usuarios = User::orderBy('nombre')->get(['legajo', 'nombre']);

        return Inertia::render('Admin/BaseLlegada/Create', [
            'usuarios' => $usuarios
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'legajo'           => 'required|exists:users,legajo',
            'periodo_variable' => 'required|date_format:Y-m',
            'periodo_salario'  => 'required|date_format:Y-m',
            'fecha_pago'       => 'required|date',
            'territorio'       => 'nullable|string|max:255',
            'variable_100'     => 'nullable|numeric|min:0',
            'pago_porcentaje'  => 'nullable|numeric|min:0',
            'devol_alimen'     => 'nullable|numeric|min:0',
            'dias_alim'        => 'nullable|numeric|min:0',
            'dev_territorio'   => 'nullable|numeric|min:0',
            'dias_terr'        => 'nullable|numeric|min:0',
            'dev_casa'         => 'nullable|numeric|min:0',
            'dias_casa'        => 'nullable|numeric|min:0',
            'comentario'       => 'nullable|string'
        ]);

        $data['periodo_variable'] = Carbon::createFromFormat('Y-m', $data['periodo_variable'])->startOfMonth()->format('Y-m-d');
        $data['periodo_salario']  = Carbon::createFromFormat('Y-m', $data['periodo_salario'])->startOfMonth()->format('Y-m-d');
        $data['fecha_pago']       = Carbon::parse($data['fecha_pago'])->format('Y-m-d');

        if (BaseLlegada::where('legajo', $data['legajo'])->where('periodo_salario', $data['periodo_salario'])->exists()) {
            return back()->withErrors(['periodo_salario' => 'Ya existe un registro de sueldo para este usuario en ese periodo.']);
        }

        BaseLlegada::create($data);

        return redirect()->route('admin.base-llegada.index')->with('success', 'Registro creado correctamente.');
    }

    public function edit($id)
    {
        $registro = BaseLlegada::with('usuario')->findOrFail($id);
        $usuarios = User::withTrashed()->orderBy('nombre')->get(['legajo', 'nombre']); 

        $registro->periodo_variable_input = Carbon::parse($registro->periodo_variable)->format('Y-m');
        $registro->periodo_salario_input  = Carbon::parse($registro->periodo_salario)->format('Y-m');
        $registro->fecha_pago_input       = Carbon::parse($registro->fecha_pago)->format('Y-m-d');

        return Inertia::render('Admin/BaseLlegada/Edit', [
            'registro' => $registro,
            'usuarios' => $usuarios
        ]);
    }

    public function update(Request $request, $id)
    {
        $registro = BaseLlegada::findOrFail($id);

        $data = $request->validate([
            'legajo'           => 'required|exists:users,legajo',
            'periodo_variable' => 'required|date_format:Y-m',
            'periodo_salario'  => 'required|date_format:Y-m',
            'fecha_pago'       => 'required|date',
            'territorio'       => 'nullable|string|max:255',
            'variable_100'     => 'nullable|numeric|min:0',
            'pago_porcentaje'  => 'nullable|numeric|min:0',
            'devol_alimen'     => 'nullable|numeric|min:0',
            'dev_territorio'   => 'nullable|numeric|min:0',
            'dev_casa'         => 'nullable|numeric|min:0',
            'comentario'       => 'nullable|string'
        ]);

        $data['periodo_variable'] = Carbon::createFromFormat('Y-m', $data['periodo_variable'])->startOfMonth()->format('Y-m-d');
        $data['periodo_salario']  = Carbon::createFromFormat('Y-m', $data['periodo_salario'])->startOfMonth()->format('Y-m-d');
        $data['fecha_pago']       = Carbon::parse($data['fecha_pago'])->format('Y-m-d');

        if (BaseLlegada::where('legajo', $data['legajo'])
                       ->where('periodo_salario', $data['periodo_salario'])
                       ->where('id', '!=', $id)
                       ->exists()) {
            return back()->withErrors(['periodo_salario' => 'Conflicto: Ya existe otro registro de sueldo para este usuario en ese periodo.']);
        }

        $registro->update($data);

        return redirect()->route('admin.base-llegada.index')->with('success', 'Registro actualizado correctamente.');
    }

    public function destroy($id)
    {
        BaseLlegada::findOrFail($id)->delete();
        return redirect()->route('admin.base-llegada.index')->with('success', 'Registro eliminado.');
    }

    public function export(Request $request)
    {
        $filename = "base_llegada_" . now()->format("Ymd_His") . ".csv";
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];
        
        $callback = function () {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            
            fputcsv($handle, [
                'periodo_variable', 'periodo_salario', 'fecha_pago', 'legajo', 'territorio', 'variable_100', 
                'pago_porcentaje', 'devol_alimen', 'dev_territorio', 'dev_casa', 'comentario'
            ], ';');
            
            BaseLlegada::orderBy('fecha_pago', 'desc')->chunk(500, function ($registros) use ($handle) {
                foreach ($registros as $item) {
                    fputcsv($handle, [
                        Carbon::parse($item->periodo_variable)->format('Ym'),
                        Carbon::parse($item->periodo_salario)->format('Ym'),
                        Carbon::parse($item->fecha_pago)->format('Y-m-d'),
                        $item->legajo,
                        $item->territorio,
                        $item->variable_100,
                        $item->pago_porcentaje,
                        $item->devol_alimen,
                        $item->dev_territorio,
                        $item->dev_casa,
                        $item->comentario,
                    ], ';');
                }
            });
            fclose($handle);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}