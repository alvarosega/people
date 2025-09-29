<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vacation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;
class VacationController extends Controller
{
    /**
     * Listado de vacaciones
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = Vacation::with('user');
    
            if ($request->has('user') && $request->user != '') {
                $query->where('legajo', $request->user);
            }
    
            $vacations = $query->get()->map(function($v) {
                return [
                    'id' => $v->id,
                    'legajo' => $v->legajo,
                    'fecha_inicio' => $v->fecha_inicio,
                    'fecha_fin' => $v->fecha_fin,
                    'dias' => $v->dias,
                    'estado' => mb_convert_encoding($v->estado ?? '', 'UTF-8', 'UTF-8'),
                    'comentario' => mb_convert_encoding($v->comentario ?? '', 'UTF-8', 'UTF-8'),
                    'user' => $v->user ? [
                        'legajo' => $v->user->legajo,
                        'nombre' => mb_convert_encoding($v->user->nombre ?? '', 'UTF-8', 'UTF-8'),
                    ] : null,
                ];
            });
    
            return response()->json($vacations);
        }
    
        // Para la vista Inertia
        $vacations = Vacation::with('user')->get()->map(function($v) {
            return [
                'id' => $v->id,
                'legajo' => $v->legajo,
                'fecha_inicio' => $v->fecha_inicio,
                'fecha_fin' => $v->fecha_fin,
                'dias' => $v->dias,
                'estado' => mb_convert_encoding($v->estado ?? '', 'UTF-8', 'UTF-8'),
                'comentario' => mb_convert_encoding($v->comentario ?? '', 'UTF-8', 'UTF-8'),
                'user' => $v->user ? [
                    'legajo' => $v->user->legajo,
                    'nombre' => mb_convert_encoding($v->user->nombre ?? '', 'UTF-8', 'UTF-8'),
                ] : null,
            ];
        });
    
        return Inertia::render('Admin/Vacations/Index', [
            'vacations' => $vacations,
        ]);
    }
    

    public function create()
    {
        $usuarios = User::select('legajo', 'nombre')->get()
            ->map(function ($user) {
                return [
                    'legajo' => mb_convert_encoding($user->legajo, 'UTF-8', 'UTF-8'),
                    'nombre' => mb_convert_encoding($user->nombre, 'UTF-8', 'UTF-8'),
                ];
            });

        return Inertia::render('Admin/Vacations/Create', [
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'legajo' => 'required|exists:users,legajo',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'dias' => 'required|integer|min:1',
            'estado' => 'required|string',
            'comentario' => 'nullable|string',
        ]);

        $solapado = Vacation::where('legajo', $request->legajo)
            ->where(function ($q) use ($request) {
                $q->whereBetween('fecha_inicio', [$request->fecha_inicio, $request->fecha_fin])
                  ->orWhereBetween('fecha_fin', [$request->fecha_inicio, $request->fecha_fin])
                  ->orWhere(function ($q2) use ($request) {
                      $q2->where('fecha_inicio', '<=', $request->fecha_inicio)
                         ->where('fecha_fin', '>=', $request->fecha_fin);
                  });
            })->exists();

        if ($solapado) {
            return back()->withErrors(['error' => 'El usuario ya tiene vacaciones en ese rango de fechas.']);
        }

        Vacation::create($request->all());

        return redirect()->route('admin.vacations.index')->with('success', 'Vacaciones registradas correctamente.');
    }

    public function edit(Vacation $vacation)
    {
        $usuarios = User::select('legajo', 'nombre')->get()
            ->map(function ($user) {
                return [
                    'legajo' => mb_convert_encoding($user->legajo, 'UTF-8', 'UTF-8'),
                    'nombre' => mb_convert_encoding($user->nombre, 'UTF-8', 'UTF-8'),
                ];
            });

        return Inertia::render('Admin/Vacations/Edit', [
            'vacation' => $vacation,
            'usuarios' => $usuarios,
        ]);
    }

    public function update(Request $request, Vacation $vacation)
    {
        $request->validate([
            'legajo' => 'required|exists:users,legajo',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'dias' => 'required|integer|min:1',
            'estado' => 'required|string',
            'comentario' => 'nullable|string',
        ]);

        $vacation->update($request->all());

        return redirect()->route('admin.vacations.index')->with('success', 'Vacaciones actualizadas correctamente.');
    }

    public function destroy(Vacation $vacation)
    {
        $vacation->delete();

        return redirect()->route('admin.vacations.index')->with('success', 'Vacaciones eliminadas correctamente.');
    }

    public function getVacations(Request $request)
    {
        $query = Vacation::with('user')->latest();

        if ($request->has('user') && $request->user != '') {
            $query->where('legajo', $request->user);
        }

        return response()->json($query->get());
    }

    // ---------- CSV / Importación ----------

    public function showImport()
    {
        return Inertia::render('Admin/Vacations/Import');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        // Importación directamente desde el controlador
        $file = $request->file('file');
        $rows = array_map(function($line) {
            return str_getcsv(mb_convert_encoding($line, 'UTF-8', 'UTF-8'));
        }, file($file));
        
        $header = array_map('strtolower', array_shift($rows)); // primera fila como encabezado

        foreach ($rows as $row) {
            $data = array_combine($header, $row);
            
            $data = array_map(fn($v) => mb_convert_encoding($v, 'UTF-8', 'UTF-8'), $data);
        
            if (!User::where('legajo', $data['legajo'])->exists()) {
                continue;
            }
        
            Vacation::updateOrCreate(
                [
                    'legajo' => $data['legajo'],
                    'fecha_inicio' => $data['fecha_inicio'],
                    'fecha_fin' => $data['fecha_fin'],
                ],
                [
                    'dias' => $data['dias'] ?? 1,
                    'estado' => $data['estado'] ?? 'pendiente',
                    'comentario' => $data['comentario'] ?? '',
                ]
            );
        }
        

        return redirect()->route('admin.vacations.index')->with('success', 'Vacaciones importadas correctamente.');
    }

    public function export()
    {
        $vacations = Vacation::with('user')->get()->map(function($v) {
            return [
                'id' => $v->id,
                'legajo' => $v->legajo,
                'fecha_inicio' => $v->fecha_inicio,
                'fecha_fin' => $v->fecha_fin,
                'dias' => $v->dias,
                'estado' => $v->estado,
                'comentario' => mb_convert_encoding($v->comentario ?? '', 'UTF-8', 'UTF-8'),
                'user' => $v->user ? [
                    'legajo' => $v->user->legajo,
                    'nombre' => mb_convert_encoding($v->user->nombre, 'UTF-8', 'UTF-8'),
                ] : null,
            ];
        });
        
        return Inertia::render('Admin/Vacations/Index', [
            'vacations' => $vacations,
        ]);
        

        $columns = ['legajo', 'nombre', 'fecha_inicio', 'fecha_fin', 'dias', 'estado', 'comentario'];

        $callback = function () use ($vacations, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($vacations as $v) {
                fputcsv($file, [
                    $v->legajo,
                    $v->user?->nombre ?? '',
                    $v->fecha_inicio,
                    $v->fecha_fin,
                    $v->dias,
                    $v->estado,
                    $v->comentario,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    

    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'plantilla_vacaciones.csv';
    
        $columns = ['legajo', 'fecha_inicio', 'fecha_fin', 'dias', 'estado', 'comentario'];
    
        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            // Forzar UTF-8
            fputcsv($file, array_map(fn($c) => mb_convert_encoding($c, 'UTF-8'), $columns));
            fclose($file);
        };
    
        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
    
}
