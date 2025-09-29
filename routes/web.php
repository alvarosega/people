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
use App\Http\Controllers\ProfileController; 
use Inertia\Inertia;

use App\Http\Controllers\Admin\OrganigramaController as AdminOrganigramaController;


use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));
// POST para validar el código
Route::post('/verify-reset-code', [VerifyResetCodeController::class, 'verify'])
    ->name('password.verify');

// GET para mostrar el formulario con Inertia
Route::get('/reset-password-code/{email}/{token}', [VerifyResetCodeController::class, 'showResetForm'])
    ->name('password.reset.code');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // 👉 ADMIN
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/', [AdminIndexController::class, 'index'])->name('admin');
       
        // Base de llegada
        Route::prefix('base-llegada')->group(function () {
            Route::get('/', [BaseLlegadaController::class, 'index'])->name('admin.base-llegada.index');
            Route::get('/import', [BaseLlegadaController::class, 'showImport'])->name('admin.base-llegada.import');
            Route::post('/import/preview', [BaseLlegadaController::class, 'uploadPreview'])->name('admin.base-llegada.import.preview');
            Route::post('/import/store', [BaseLlegadaController::class, 'storeImported'])->name('admin.base-llegada.import.store');
            Route::get('/export', [BaseLlegadaController::class, 'export'])->name('admin.base-llegada.export');
            Route::get('/template', [BaseLlegadaController::class, 'downloadTemplate'])->name('admin.base-llegada.template');
            Route::get('/{id}/edit', [BaseLlegadaController::class, 'edit'])->name('admin.base-llegada.edit');
            Route::put('/{id}', [BaseLlegadaController::class, 'update'])->name('admin.base-llegada.update');
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
            // Dashboard de usuario
            Route::get('/', [UserController::class, 'index'])->name('index');

            // Base de llegada
            Route::get('/base-llegada', [UserBaseLlegadaController::class, 'index'])->name('base_llegada');

           // Organigrama -> separo vista (Inertia) de API (data)
            Route::prefix('organigrama')->group(function () {
                // Página principal con Inertia (React)
                Route::get('/', fn () => Inertia::render('User/Organigrama'))
                    ->name('organigrama.index');

                // API JSON para el frontend
                Route::get('/data', [UserOrganigramaController::class, 'data'])
                    ->name('organigrama.data');
            });

            // Calendario
            Route::get('/calendar', fn () => Inertia::render('User/Calendar'))->name('calendar');

            // Eventos (solo lectura)
            Route::get('/events', [EventController::class, 'index'])->name('events');
        });

});

require __DIR__ . '/auth.php';
