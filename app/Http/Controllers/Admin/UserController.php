<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        
        $query = User::query();
        
        // Búsqueda
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('legajo', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('region', 'like', "%{$search}%")
                  ->orWhere('rol', 'like', "%{$search}%")
                  ->orWhere('territorio', 'like', "%{$search}%")
                  ->orWhere('puesto', 'like', "%{$search}%");
            });
        }
        
        // Filtrar por rol si se especifica
        if ($request->has('rol') && !empty($request->rol)) {
            $query->where('rol', $request->rol);
        }
        
        // Filtrar por región si se especifica
        if ($request->has('region') && !empty($request->region)) {
            $query->where('region', $request->region);
        }
        
        $users = $query->orderBy('nombre')->paginate(10)->appends($request->all());
        
        $users->getCollection()->transform(function ($user) {
            foreach ($user->getAttributes() as $key => $value) {
                if (is_string($value)) {
                    // Forzar a UTF-8 válido
                    $user->$key = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                }
            }
            return $user;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'rol', 'region']),
            'roles' => ['admin', 'user'],
            'regions' => User::distinct()->pluck('region')->filter()->values()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => ['admin', 'user'],
            'regions' => User::distinct()->pluck('region')->filter()->values()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'region' => 'required|string|max:255',
            'legajo' => 'required|string|max:255|unique:users',
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'rol' => 'required|in:admin,user',
            'territorio' => 'nullable|string|max:255',
            'puesto' => 'nullable|string|max:255',
        ]);

        $validated['password'] = Hash::make('contraseña');
        $validated['last_updated_by'] = Auth::id();

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $user)
    {
        // Prevenir que admin edite otros admins (excepto sí mismo)
        if ($user->rol === 'admin' && $user->id !== Auth::id()) {
            abort(403, 'No puedes editar otros administradores.');
        }

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => ['admin', 'user'],
            'regions' => User::distinct()->pluck('region')->filter()->values()
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Prevenir que admin edite otros admins (excepto sí mismo)
        if ($user->rol === 'admin' && $user->id !== Auth::id()) {
            abort(403, 'No puedes editar otros administradores.');
        }

        $validated = $request->validate([
            'region' => 'required|string|max:255',
            'legajo' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'nombre' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'rol' => 'required|in:admin,user',
            'territorio' => 'nullable|string|max:255',
            'puesto' => 'nullable|string|max:255',
        ]);

        $validated['last_updated_by'] = Auth::id();

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $user)
    {
        // Prevenir que admin elimine otros admins
        if ($user->rol === 'admin') {
            abort(403, 'No puedes eliminar administradores.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    public function export()
    {
        $users = User::all();
        $csvFileName = 'usuarios_' . date('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $csvFileName . '"',
        ];

        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Region', 'Legajo', 'Nombre','email', 'Rol', 'Territorio', 'Puesto']);
            
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->region,
                    $user->legajo,
                    $user->nombre,
                    $user->email, 
                    $user->rol,
                    $user->territorio,
                    $user->puesto
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);
    
        $file = $request->file('csv_file');
        
        // DEBUG: Ver información del archivo
        \Log::info('Archivo importado:', [
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime' => $file->getMimeType()
        ]);
    
        try {
            $csvData = array_map('str_getcsv', file($file->getRealPath()));
            
            // DEBUG: Ver contenido del CSV
            \Log::info('Datos CSV crudos:', $csvData);
    
            // Eliminar encabezados
            $headers = array_shift($csvData);
            \Log::info('Encabezados:', $headers);
    
            $imported = 0;
            $errors = [];
    
            foreach ($csvData as $index => $row) {
                $rowNumber = $index + 2; // +2 porque headers es fila 1 y index empieza en 0
                
                \Log::info("Procesando fila {$rowNumber}:", $row);
    
                if (count($row) < 7) {
                    $errorMsg = "Fila {$rowNumber}: Número incorrecto de columnas. Esperadas: 7, Encontradas: " . count($row);
                    $errors[] = $errorMsg;
                    \Log::warning($errorMsg);
                    continue;
                }
    
                // Limpiar los datos de espacios en blanco
                $row = array_map('trim', $row);
    
                $validator = Validator::make([
                    'region' => $row[0],
                    'legajo' => $row[1],
                    'nombre' => $row[2],
                    'email' => $row[3],
                    'rol' => $row[4],
                    'territorio' => $row[5],
                    'puesto' => $row[6]
                ], [
                    'region' => 'required|string|max:255',
                    'legajo' => 'required|string|max:255|unique:users',
                    'nombre' => 'required|string|max:255',
                    'email' => 'required|email|unique:users',
                    'rol' => 'required|in:admin,user',
                    'territorio' => 'nullable|string|max:255',
                    'puesto' => 'nullable|string|max:255',
                ]);
    
                if ($validator->fails()) {
                    $errorMsg = "Fila {$rowNumber}: " . implode(', ', $validator->errors()->all());
                    $errors[] = $errorMsg;
                    \Log::warning($errorMsg);
                    continue;
                }
    
                try {
                    User::create([
                        'region' => $row[0],
                        'legajo' => $row[1],
                        'nombre' => $row[2],
                        'email' => $row[3],
                        'rol' => $row[4],
                        'territorio' => $row[5],
                        'puesto' => $row[6],
                        'password' => Hash::make('contraseña'),
                        'last_updated_by' => Auth::id()
                    ]);
    
                    $imported++;
                    \Log::info("Fila {$rowNumber}: Usuario creado exitosamente");
    
                } catch (\Exception $e) {
                    $errorMsg = "Fila {$rowNumber}: Error al crear usuario - " . $e->getMessage();
                    $errors[] = $errorMsg;
                    \Log::error($errorMsg);
                }
            }
    
            $message = "Importación completada. {$imported} usuarios importados.";
            if (!empty($errors)) {
                $message .= " Errores: " . implode('; ', array_slice($errors, 0, 5)); // Mostrar solo primeros 5 errores
                if (count($errors) > 5) {
                    $message .= " ... y " . (count($errors) - 5) . " errores más";
                }
            }
    
            \Log::info('Resultado importación:', ['importados' => $imported, 'errores' => count($errors)]);
    
            return redirect()->route('admin.users.index')
                ->with('success', $message);
    
        } catch (\Exception $e) {
            \Log::error('Error general en importación: ' . $e->getMessage());
            
            return redirect()->route('admin.users.index')
                ->with('error', 'Error al procesar el archivo: ' . $e->getMessage());
        }
    }

    public function showImport()
    {
        return Inertia::render('Admin/Users/Import');
    }
}