<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organigrama;
use App\Models\User;
use Illuminate\Http\Request;

class OrganigramaController extends Controller
{
    /**
     * Devuelve el organigrama completo con usuarios relacionados
     */
    public function data()
    {
        $nodes = Organigrama::with('user')->get();

        // Construir el árbol recursivo
        $tree = $this->buildTree($nodes);

        return response()->json([
            'success' => true,
            'data' => $tree,
        ]);
    }

    private function buildTree($nodes, $parentId = null)
    {
        return $nodes->where('parent_id', $parentId)->map(function ($node) use ($nodes) {
            return [
                'id' => $node->id,
                'legajo' => $node->legajo,
                'banda' => $node->banda,
                'nivel_jerarquico' => $node->nivel_jerarquico,
                'orden' => $node->orden,
                'vacante' => (bool)$node->vacante,
                'user' => $node->user ? [
                    'legajo' => $node->user->legajo,
                    'nombre' => $node->user->nombre,
                    'puesto' => $node->user->puesto,
                    'territorio' => $node->user->territorio,
                    'region' => $node->user->region,
                ] : null,
                'children' => $this->buildTree($nodes, $node->id),
            ];
        })->values()->toArray();
    }

    /**
     * Crear un nodo en el organigrama
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'parent_id' => 'nullable|integer|exists:organigrama,id',
            'legajo' => 'nullable|string|exists:users,legajo',
            'banda' => 'nullable|string',
            'nivel_jerarquico' => 'required|integer',
            'orden' => 'nullable|integer',
            'vacante' => 'required|boolean',
        ]);

        // Si hay legajo, no es vacante
        if (!empty($data['legajo'])) {
            $data['vacante'] = false;
        }

        $node = Organigrama::create($data);

        return response()->json([
            'success' => true,
            'node' => $node->load('user'),
        ]);
    }

    /**
     * Actualizar un nodo
     */
    public function update(Request $request, $id)
    {
        $node = Organigrama::findOrFail($id);

        $data = $request->validate([
            'legajo' => 'nullable|string|exists:users,legajo',
            'banda' => 'nullable|string',
            'nivel_jerarquico' => 'required|integer',
            'orden' => 'nullable|integer',
            'vacante' => 'required|boolean',
        ]);

        // Si tiene legajo → no es vacante
        if (!empty($data['legajo'])) {
            $data['vacante'] = false;
        }

        $node->update($data);

        return response()->json([
            'success' => true,
            'node' => $node->load('user'),
        ]);
    }

    /**
     * Eliminar un nodo y sus hijos
     */
    public function destroy($id)
    {
        $node = Organigrama::findOrFail($id);

        // Eliminar recursivamente
        $this->deleteSubtree($node);

        return response()->json(['success' => true]);
    }

    private function deleteSubtree(Organigrama $node)
    {
        foreach ($node->children as $child) {
            $this->deleteSubtree($child);
        }
        $node->delete();
    }

    /**
     * Devuelve la lista de usuarios disponibles (para selects)
     */
    public function usersList()
    {
        try {
            $assigned = Organigrama::whereNotNull('legajo')->pluck('legajo')->toArray();
    
            $users = User::whereNotIn('legajo', $assigned)
                ->select('legajo', 'nombre', 'puesto')
                ->orderBy('nombre')
                ->get()
                ->map(function ($u) {
                    return [
                        'legajo' => $u->legajo,
                        'nombre' => mb_convert_encoding($u->nombre, 'UTF-8', 'UTF-8'),
                        'puesto' => mb_convert_encoding($u->puesto ?? '', 'UTF-8', 'UTF-8'),
                        'territorio' => mb_convert_encoding($u->territorio ?? '', 'UTF-8', 'UTF-8'),
                        'region' => mb_convert_encoding($u->region ?? '', 'UTF-8', 'UTF-8'),
                    ];
                });
    
            return response()->json([
                'success' => true,
                'data' => $users,
            ], 200, [], JSON_UNESCAPED_UNICODE);
    
        } catch (\Exception $e) {
            \Log::error('Error en usersList: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    

    /**
     * Generar nodos automáticamente a partir de usuarios que no están en el organigrama
     */
    public function generateFromUsers()
    {
        $assigned = Organigrama::pluck('legajo')->filter()->toArray();

        $users = User::whereNotIn('legajo', $assigned)->get();

        foreach ($users as $u) {
            Organigrama::create([
                'legajo' => $u->legajo,
                'parent_id' => null,
                'banda' => null,
                'nivel_jerarquico' => 0,
                'orden' => 0,
                'vacante' => false,
            ]);
        }

        return response()->json(['success' => true]);
    }
}
