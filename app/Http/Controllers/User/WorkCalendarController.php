<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WorkCalendar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class WorkCalendarController extends Controller
{
    /**
     * Vista informativa del calendario para empleados
     */
    public function index(Request $request)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);

        // Solo extraemos los datos necesarios para pintar el calendario
        $events = WorkCalendar::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get(['date', 'type', 'description'])
            ->keyBy(fn($item) => $item->date->format('Y-m-d'));

        return Inertia::render('User/Calendar/Index', [
            'events' => $events,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }
}