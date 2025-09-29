<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Organigrama;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class OrganigramaController extends Controller
{
    /**
     * Devuelve la "rama" del organigrama del usuario autenticado:
     * - cadena de ancestros (solo el camino hacia arriba)
     * - el usuario
     * - todos los descendientes del usuario (subárbol completo)
     */
    public function data()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado.',
                'data' => null,
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Cargamos todos los nodos con su relación user
        $nodes = Organigrama::with('user')->get();
        if ($nodes->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No hay nodos en el organigrama.',
                'data' => null,
            ]);
        }

        // Encontrar el nodo que corresponde al legajo del usuario
        $userNode = $nodes->firstWhere('legajo', $user->legajo);
        if (! $userNode) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró información en tu organigrama.',
                'data' => null,
            ]);
        }

        // Indexamos por id para acceso rápido
        $byId = $nodes->keyBy('id');

        // Construcción recursiva: subárbol completo (hacia abajo)
        $buildFullSubtree = function ($nodeId) use (&$buildFullSubtree, $nodes, $byId) {
            if (! $byId->has($nodeId)) {
                return null;
            }

            $node = $byId->get($nodeId);

            // obtener hijos directos
            $children = $nodes
                ->where('parent_id', $nodeId)
                ->map(function ($child) use (&$buildFullSubtree) {
                    return $buildFullSubtree($child->id);
                })
                ->filter() // eliminar posibles nulls
                ->values()
                ->toArray();

            return [
                'id' => $node->id,
                'legajo' => $node->legajo,
                'banda' => $node->banda,
                'nivel_jerarquico' => $node->nivel_jerarquico,
                'orden' => $node->orden,
                'vacante' => (bool) $node->vacante,
                'user' => $node->user ? [
                    'legajo' => $node->user->legajo,
                    'nombre' => $node->user->nombre,
                    'puesto' => $node->user->puesto,
                ] : null,
                'children' => $children,
            ];
        };

        // Construir la lista de ancestros (desde el root hacia abajo, sin incluir al usuario)
        $ancestors = [];
        $visitedParents = [];
        $cur = $userNode;
        while ($cur && $cur->parent_id) {
            $pid = $cur->parent_id;

            // protección contra bucles: si ya vimos este parent, rompemos
            if (in_array($pid, $visitedParents, true)) {
                break;
            }
            $visitedParents[] = $pid;

            if (! $byId->has($pid)) {
                // si no está el padre en la colección, detenemos
                break;
            }

            $parent = $byId->get($pid);
            // Prepend para que quede root ... parent ... (orden ascendente)
            array_unshift($ancestors, $parent);

            // Avanzamos hacia arriba
            $cur = $parent;
        }

        // Si no hay ancestros, devolvemos directamente el subárbol del usuario
        if (empty($ancestors)) {
            $result = $buildFullSubtree($userNode->id);
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        // Si hay ancestros, construimos una estructura anidada que incluye
        // solo el camino de ancestros (cada ancestro tendrá 1 child: el siguiente en la cadena),
        // y finalmente le pegamos el subárbol completo del usuario.
        // Empezamos por el primer (más alto) ancestro:
        $top = $ancestors[0];

        $nodeArray = function ($n) {
            return [
                'id' => $n->id,
                'legajo' => $n->legajo,
                'banda' => $n->banda,
                'nivel_jerarquico' => $n->nivel_jerarquico,
                'orden' => $n->orden,
                'vacante' => (bool) $n->vacante,
                'user' => $n->user ? [
                    'legajo' => $n->user->legajo,
                    'nombre' => $n->user->nombre,
                    'puesto' => $n->user->puesto,
                ] : null,
                'children' => [],
            ];
        };

        $rootArr = $nodeArray($top);
        $pointer =& $rootArr;

        // si hay más ancestros (segunda, tercera, ...) vamos encadenando
        $countAnc = count($ancestors);
        for ($i = 1; $i < $countAnc; $i++) {
            $anc = $ancestors[$i];
            $childArr = $nodeArray($anc);
            // asignar single child (evitamos paralelos)
            $pointer['children'] = [ $childArr ];
            // mover puntero a ese hijo
            $pointer =& $pointer['children'][0];
        }

        // finalmente pegamos al usuario: en lugar de un nodo simple, ponemos su subárbol completo
        $userSubtree = $buildFullSubtree($userNode->id);
        $pointer['children'] = [ $userSubtree ];

        return response()->json([
            'success' => true,
            'data' => $rootArr,
        ]);
    }
}
