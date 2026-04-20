<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class InformationController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Information/Index', [
            'user_data' => [
                'nombre' => auth()->user()->nombre,
                'puesto' => auth()->user()->puesto,
            ]
        ]);
    }
    public function seniorityBonus()
    {
        return Inertia::render('User/Information/SeniorityBonus');
    }

    /**
     * Vista 2: Formulario para el PDF de Quinquenio
     */
    public function quinquenioRequest()
    {
        return Inertia::render('User/Information/QuinquenioRequest', [
            'user_data' => [
                'nombre' => auth()->user()->nombre,
                'puesto' => auth()->user()->puesto,
            ]
        ]);
    }
    public function generatePdf(Request $request)
    {
        // Solo validamos lo que el usuario realmente debe ingresar
        $request->validate([
            'ci' => 'required|string|max:50',
            'fecha' => 'required|date',
            'quinquenio' => 'required|string',
        ]);

        $user = Auth::user();

        // Formatear la fecha para que se lea natural
        $fecha_formateada = Carbon::parse($request->fecha)
                                ->locale('es')
                                ->translatedFormat('d \d\e F \d\e Y');

        $data = [
            // Extraídos directamente de la tabla 'users' y convertidos a MAYÚSCULAS
            'nombre' => mb_strtoupper($user->nombre, 'UTF-8'),
            'cargo'  => mb_strtoupper($user->puesto, 'UTF-8'),
            
            // Datos del formulario
            'ci'         => mb_strtoupper($request->ci, 'UTF-8'),
            'fecha'      => $fecha_formateada,
            'quinquenio' => mb_strtoupper($request->quinquenio, 'UTF-8'),
        ];

        $pdf = Pdf::loadView('pdfs.quinquenio', $data);

        // Nombre del archivo también en mayúsculas y limpio
        $fileName = 'Solicitud_Quinquenio_' . str_replace(' ', '_', $data['nombre']) . '.pdf';

        return $pdf->download($fileName);
    }
}