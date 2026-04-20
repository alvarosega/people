<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes; // Importación obligatoria
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable; 
use Illuminate\Support\Facades\Mail;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes; // Trait agregado

    protected $fillable = [
        'region',
        'legajo',
        'nombre',
        'email',
        'rol',
        'puesto',
        'password',
        'last_updated_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function vacaciones()
    {
        return $this->hasMany(Vacation::class, 'legajo', 'legajo');
    }

    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

    public function sendPasswordResetNotification($token)
    {
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $this->email,
        ], false));
    
        Mail::send('emails.reset-password', ['url' => $url], function ($message) {
            $message->to($this->email)
                    ->subject('Restablecer contraseña');
        });
    }

    public function getNameAttribute()
    {
        return $this->nombre;
    }

    public function getUsernameAttribute()
    {
        return $this->legajo;
    }
    // Dentro de la clase User
    public function pagos()
    {
        return $this->hasMany(BaseLlegada::class, 'legajo', 'legajo');
    }

    /**
     * Obtiene el último registro de pago de forma eficiente.
     */
    public function ultimoPago()
    {
        return $this->hasOne(BaseLlegada::class, 'legajo', 'legajo')->latestOfMany('fecha_pago');
    }
}