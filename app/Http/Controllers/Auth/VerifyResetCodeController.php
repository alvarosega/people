<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VerifyResetCodeController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('token', $request->code)
            ->first();

        if (!$record) {
            return back()->withErrors(['code' => 'El código ingresado no es válido.']);
        }

        // ✅ Importante: redirigir a una ruta GET
        return redirect()->route('password.reset.code', [
            'email' => $record->email,
            'token' => $request->code,
        ]);
    }

    public function showResetForm($email, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
        ]);
    }
}
