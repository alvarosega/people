<?php

use App\Http\Controllers\Admin\IndexController as AdminIndexController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\Admin\OrganigramaController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\User\BaseLlegadaController as UserBaseLlegadaController;
use App\Http\Controllers\User\OrganigramaController as UserOrganigramaController;

use App\Http\Controllers\Admin\BaseLlegadaController; 
use App\Http\Controllers\Admin\VacationController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Auth\VerifyResetCodeController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\Admin\WorkCalendarController;
use Inertia\Inertia;
use App\Http\Controllers\User\WorkCalendarController as UserWorkCalendarController;
use App\Http\Controllers\Admin\OrganigramaController as AdminOrganigramaController;
use App\Http\Controllers\User\InformationController;

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));
// POST para validar el código
Route::post('/verify-reset-code', [VerifyResetCodeController::class, 'verify'])
    ->name('password.verify');

// GET para mostrar el formulario con Inertia
Route::get('/reset-password-code/{email}/{token}', [VerifyResetCodeController::class, 'showResetForm'])
    ->name('password.reset.code');

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/', [AdminIndexController::class, 'index'])->name('admin');
        Route::prefix('profile')->name('admin.profile.')->group(function () {
            Route::get('/', [ProfileController::class, 'edit'])->name('edit');
            Route::patch('/', [ProfileController::class, 'update'])->name('update');
            Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
        });
        // Base de llegada
        Route::prefix('base-llegada')->name('admin.base-llegada.')->group(function () {
            // CRUD Básico
            Route::get('/', [BaseLlegadaController::class, 'index'])->name('index');
            Route::get('/create', [BaseLlegadaController::class, 'create'])->name('create'); // Faltaba esta
            Route::post('/', [BaseLlegadaController::class, 'store'])->name('store'); // Faltaba esta
            Route::get('/{id}/edit', [BaseLlegadaController::class, 'edit'])->name('edit');
            Route::put('/{id}', [BaseLlegadaController::class, 'update'])->name('update');
            Route::delete('/{id}', [BaseLlegadaController::class, 'destroy'])->name('destroy'); // Faltaba esta
            
            // Import / Export
            Route::get('/export', [BaseLlegadaController::class, 'export'])->name('export');
            Route::get('/template', [BaseLlegadaController::class, 'downloadTemplate'])->name('template');
            Route::get('/import', [BaseLlegadaController::class, 'showImport'])->name('import.show'); // Cambiado a .show
            Route::post('/import/preview', [BaseLlegadaController::class, 'uploadPreview'])->name('import.preview');
            Route::post('/import/store', [BaseLlegadaController::class, 'storeImported'])->name('import.store');
        });
        // Organigrama -> separo vista (Inertia) de API (data)
        // routes/web.php
        Route::prefix('organigrama')->group(function () {
            // Página principal con Inertia (React)
            Route::get('/', fn () => Inertia::render('Admin/Organigrama'))
                ->name('admin.organigrama.index');

            // API JSON para el frontend
            Route::get('/data', [AdminOrganigramaController::class, 'data'])
                ->name('admin.organigrama.data');

            Route::post('/', [AdminOrganigramaController::class, 'store'])
                ->name('admin.organigrama.store');

            Route::put('/{id}', [AdminOrganigramaController::class, 'update'])
                ->name('admin.organigrama.update');

            Route::delete('/{id}', [AdminOrganigramaController::class, 'destroy'])
                ->name('admin.organigrama.destroy');

            Route::post('/generate-from-users', [AdminOrganigramaController::class, 'generateFromUsers'])
                ->name('admin.organigrama.generate');

            Route::get('/users-list', [AdminOrganigramaController::class, 'usersList'])
                ->name('admin.organigrama.users');
        });

        Route::prefix('work-calendar')->name('admin.work-calendar.')->group(function () {
            Route::get('/', [WorkCalendarController::class, 'index'])->name('index');
            Route::post('/update', [WorkCalendarController::class, 'updateDay'])->name('update');
        });
        // Calendario
        Route::get('/calendar', fn () => Inertia::render('Admin/Calendar'))->name('admin.calendar');

        // Eventos (CRUD)
        Route::get('/events', [EventController::class, 'index']);
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);

        // Gestión de usuarios
        Route::prefix('users')->name('admin.users.')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->name('index');
            Route::get('/create', [AdminUserController::class, 'create'])->name('create');
            Route::post('/', [AdminUserController::class, 'store'])->name('store');
            Route::get('/{user}/edit', [AdminUserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [AdminUserController::class, 'update'])->name('update');
            Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');

            // Import / Export
            Route::get('/export', [AdminUserController::class, 'export'])->name('export');
            Route::get('/import', [AdminUserController::class, 'showImport'])->name('import.show');
            Route::post('/import', [AdminUserController::class, 'import'])->name('import');
        });
        
        Route::prefix('vacaciones')->name('admin.vacations.')->group(function () {
            Route::get('/', [VacationController::class, 'index'])->name('index');
            Route::get('/create', [VacationController::class, 'create'])->name('create');
            Route::post('/', [VacationController::class, 'store'])->name('store');
            Route::get('/{vacation}/edit', [VacationController::class, 'edit'])->name('edit');
            Route::put('/{vacation}', [VacationController::class, 'update'])->name('update');
            Route::delete('/{vacation}', [VacationController::class, 'destroy'])->name('destroy');
        
            // CSV
            Route::get('/import', [VacationController::class, 'showImport'])->name('import.show');
            Route::post('/import', [VacationController::class, 'import'])->name('import');
            Route::get('/export', [VacationController::class, 'export'])->name('export');
            Route::get('/template', [VacationController::class, 'downloadTemplate'])->name('template');
        });
        
        
        Route::get('/users-json', function () {
            $users = \App\Models\User::select('legajo', 'nombre')->get();
        
            // 🔹 Normalizamos a UTF-8 para evitar errores de JSON
            $users = $users->map(function ($u) {
                return [
                    'legajo' => $u->legajo,
                    'nombre' => mb_convert_encoding($u->nombre, 'UTF-8', 'UTF-8'),
                ];
            });
        
            return response()->json($users);
        });
        

    });
    // 👉 USER
    Route::middleware(['auth', 'verified', 'role:user'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {
        
        // Esta es la ruta a la que redirige AuthenticatedSessionController
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::prefix('profile')->name('profile.')->group(function () {
            // Usamos el nuevo controlador exclusivo para usuarios
            Route::get('/', [\App\Http\Controllers\User\ProfileController::class, 'edit'])->name('edit');
            
            // No añadimos PATCH ni DELETE porque el usuario no tiene permisos de edición
        });
        // Mantenemos esta por compatibilidad con el Layout, pero apunta al mismo controlador
        Route::get('/base-llegada', [UserController::class, 'index'])->name('base_llegada');
        
        // Calendario Laboral (Solo lectura) - Se elimina la duplicidad
        Route::get('/calendar', [UserWorkCalendarController::class, 'index'])->name('calendar');

        // Organigrama
        Route::prefix('organigrama')->group(function () {
            Route::get('/', fn () => Inertia::render('User/Organigrama'))->name('organigrama.index');
            Route::get('/data', [UserOrganigramaController::class, 'data'])->name('organigrama.data');
        });

        Route::get('/events', [EventController::class, 'index'])->name('events');
        Route::get('/informacion', [InformationController::class, 'index'])->name('information.index');
        Route::get('/informacion/pdf', [InformationController::class, 'generatePdf'])->name('information.pdf');

    });

});

require __DIR__ . '/auth.php';
