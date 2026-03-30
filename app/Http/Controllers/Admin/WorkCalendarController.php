<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkCalendar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class WorkCalendarController extends Controller
{
    /**
     * Vista principal del calendario
     */
    public function index(Request $request)
    {
        // Forzamos el casteo a int para evitar problemas de tipos en el frontend
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);

        // Optimizamos la consulta: solo las columnas necesarias
        $events = WorkCalendar::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get(['date', 'type', 'description'])
            ->keyBy(fn($item) => $item->date->format('Y-m-d'));

        return Inertia::render('Admin/Calendar/WorkCalendar', [
            'events' => $events,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    /**
     * Actualizar o eliminar el estado de un día
     */
    public function updateDay(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            // Validación estricta contra el ENUM de la base de datos
            'type' => [
                'required', 
                Rule::in(['holiday', 'non_worked', 'sunday', 'worked'])
            ],
            'description' => 'nullable|string|max:100',
        ]);

        $date = Carbon::parse($data['date'])->format('Y-m-d');

        // Lógica de Gestión por Excepción:
        // Si es 'worked', se elimina de la tabla para que el sistema lo asuma laboral.
        if ($data['type'] === 'worked') {
            WorkCalendar::where('date', $date)->delete();
            return back()->with('success', 'Día restablecido como laboral.');
        }

        // De lo contrario, registramos la interrupción
        WorkCalendar::updateOrCreate(
            ['date' => $date],
            [
                'type' => $data['type'],
                'description' => $data['description'],
                'last_updated_by' => Auth::user()->legajo,
            ]
        );

        return back()->with('success', 'Calendario actualizado correctamente.');
    }
}