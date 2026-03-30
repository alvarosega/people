<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        
        if ($request->filled('search')) {
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
        
        if ($request->filled('rol')) {
            $query->where('rol', $request->rol);
        }
        
        if ($request->filled('region')) {
            $query->where('region', $request->region);
        }
        
        $users = $query->orderBy('nombre')->paginate(10)->appends($request->all());

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
            'puesto' => 'required|string|max:255',
        ]);

        $validated['password'] = Hash::make('contraseña');
        $validated['last_updated_by'] = Auth::id();

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $user)
    {
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
            'puesto' => 'required|string|max:255',
        ]);

        $validated['last_updated_by'] = Auth::id();

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $user)
    {
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
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $csvFileName . '"',
        ];

        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            
            // BOM para que Excel reconozca UTF-8 automáticamente
            fputs($file, "\xEF\xBB\xBF");
            
            fputcsv($file, ['Region', 'Legajo', 'Nombre', 'Email', 'Rol', 'Territorio', 'Puesto']);
            
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
}