<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class InformationController extends Controller
{
    /**
     * Muestra la vista de información y formulario
     */
    public function index()
    {
        return Inertia::render('User/Information/Index');
    }

    /**
     * Genera y descarga el PDF del quinquenio
     */
    public function generatePdf(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'ci' => 'required|string|max:50',
            'cargo' => 'required|string|max:100',
            'fecha' => 'required|date',
            'quinquenio' => 'required|string',
        ]);

        // Formatear la fecha para que se lea natural (Ej: 15 de Marzo de 2026)
        $fecha_formateada = Carbon::parse($request->fecha)
                                ->locale('es')
                                ->translatedFormat('d \d\e F \d\e Y');

        $data = [
            'nombre' => mb_strtoupper($request->nombre, 'UTF-8'),
            'ci' => mb_strtoupper($request->ci, 'UTF-8'),
            'cargo' => mb_strtoupper($request->cargo, 'UTF-8'),
            'fecha' => $fecha_formateada,
            'quinquenio' => mb_strtoupper($request->quinquenio, 'UTF-8'),
        ];

        $pdf = Pdf::loadView('pdfs.quinquenio', $data);

        return $pdf->download('Solicitud_Quinquenio_' . str_replace(' ', '_', $data['nombre']) . '.pdf');
    }
}