<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;


class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'legajo' => 'required|string',
        ]);
    
        $user = \App\Models\User::where('legajo', $request->legajo)->first();
    
        if (!$user) {
            return back()->withErrors(['legajo' => 'Legajo no encontrado']);
        }
    
        // Generar un código de 6 dígitos
        $code = rand(100000, 999999);
    
        // Guardar en la tabla de tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $code,
                'created_at' => now(),
            ]
        );
    
        // Enviar correo con el código
        Mail::send('emails.reset-code', ['code' => $code], function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Código de verificación para restablecer contraseña');
        });
    
        return back()->with('status', 'Se ha enviado un código de verificación a tu correo.');
    }
}