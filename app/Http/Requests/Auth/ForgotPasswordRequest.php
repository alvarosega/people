<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'correo' => ['required', 'email', 'exists:users,email'],
        ];
    }

    public function credentials(): array
    {
        return $this->only('email');
    }
}
