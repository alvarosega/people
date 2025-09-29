import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User, Mail, Shield, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        legajo: '',
        code: '',
        email: '',
    });

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown para reenvío de código
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const submitLegajo = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('password.email'), {
            onSuccess: (page) => {
                setStep(2);
                setCountdown(60); // 60 segundos para reenvío
                if (page.props.flash?.email) {
                    setData('email', page.props.flash.email);
                }
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const submitCode = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post('/verify-reset-code', {
            onSuccess: () => {
                setStep(3);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const resendCode = () => {
        if (countdown > 0) return;

        post(route('password.email'), {
            data: { legajo: data.legajo },
            onSuccess: () => {
                setCountdown(60);
            },
        });
    };

    const goBack = () => {
        setStep(1);
        reset('code', 'email');
        setCountdown(0);
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <div className="animate-scale-in mx-auto mt-6 sm:mt-12 lg:mt-16 min-h-screen 
    px-3 sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 
    transform transition-all duration-500">

                    {/* Card Principal */}
                    <div className="rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl 
    p-6 sm:p-8 lg:p-10 relative overflow-hidden">

                        
                        {/* Efecto de acento dorado */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
                        
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                                <Shield className="h-8 w-8 text-yellow-500" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                                {step === 1 && 'Recuperar Contraseña'}
                                {step === 2 && 'Verificar Identidad'}
                                {step === 3 && 'Código Verificado'}
                            </h1>
                            <p className="mt-2 text-text-secondary text-sm">
                                {step === 1 && 'Ingresa tu legajo para comenzar el proceso'}
                                {step === 2 && 'Hemos enviado un código a tu correo'}
                                {step === 3 && '¡Código verificado correctamente!'}
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center">
                                {/* Step 1 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    step >= 1 ? 'bg-accent border-accent text-black' : 'border-text-secondary text-text-secondary'
                                } transition-all duration-300`}>
                                    {step > 1 ? <CheckCircle size={16} /> : '1'}
                                </div>
                                
                                {/* Line */}
                                <div className={`w-16 h-0.5 mx-2 ${
                                    step >= 2 ? 'bg-accent' : 'bg-text-secondary/30'
                                } transition-all duration-300`}></div>
                                
                                {/* Step 2 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    step >= 2 ? 'bg-accent border-accent text-black' : 'border-text-secondary text-text-secondary'
                                } transition-all duration-300`}>
                                    {step > 2 ? <CheckCircle size={16} /> : '2'}
                                </div>
                                
                                {/* Line */}
                                <div className={`w-16 h-0.5 mx-2 ${
                                    step >= 3 ? 'bg-accent' : 'bg-text-secondary/30'
                                } transition-all duration-300`}></div>
                                
                                {/* Step 3 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    step >= 3 ? 'bg-accent border-accent text-black' : 'border-text-secondary text-text-secondary'
                                } transition-all duration-300`}>
                                    3
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {status && (
                            <div className="animate-slide-up mb-6 rounded-soft bg-green-500/10 border border-green-500/20 p-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                                    <CheckCircle size={16} />
                                    {status}
                                </div>
                            </div>
                        )}

                        {/* Step 1: Ingresar Legajo */}
                        {step === 1 && (
                            <form onSubmit={submitLegajo} className="animate-fade-in space-y-6">
                                <div>
                                    <InputLabel 
                                        htmlFor="legajo" 
                                        value="Número de Legajo" 
                                        className="text-text-primary font-medium mb-2"
                                    />
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200" />
                                        </div>
                                        <TextInput
                                            id="legajo"
                                            type="text"
                                            name="legajo"
                                            value={data.legajo}
                                            className={`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                                text-text-primary placeholder-text-secondary/60
                                                transition-all duration-200
                                                focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                                group-hover:border-white/30
                                                ${errors.legajo ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                                            autoComplete="username"
                                            isFocused={true}
                                            placeholder="Ingresa tu legajo"
                                            onChange={(e) => setData('legajo', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.legajo} className="mt-2" />
                                </div>

                                <PrimaryButton
                                    className="w-full justify-center rounded-soft py-4 font-semibold text-black
                                        bg-gradient-to-r from-accent to-accent-gold
                                        shadow-lg shadow-yellow-500/25
                                        transition-all duration-300
                                        hover:from-accent-yellow hover:to-accent
                                        hover:shadow-xl hover:shadow-yellow-500/40
                                        hover:scale-[1.02]
                                        active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                        relative overflow-hidden group"
                                    disabled={processing || isLoading}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                                Verificando...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="h-4 w-4" />
                                                Continuar
                                            </>
                                        )}
                                    </span>
                                </PrimaryButton>
                            </form>
                        )}

                        {/* Step 2: Ingresar Código */}
                        {step === 2 && (
                            <form onSubmit={submitCode} className="animate-fade-in space-y-6">
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-soft p-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-blue-300">
                                        <Mail size={16} />
                                        Código enviado a: <strong className="text-white">{data.email || 'tu correo corporativo'}</strong>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="code" 
                                        value="Código de Verificación" 
                                        className="text-text-primary font-medium mb-2"
                                    />
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200" />
                                        </div>
                                        <TextInput
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            className={`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                                text-text-primary placeholder-text-secondary/60
                                                transition-all duration-200
                                                focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                                group-hover:border-white/30
                                                ${errors.code ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                                            autoComplete="one-time-code"
                                            isFocused={true}
                                            placeholder="Ingresa el código de 6 dígitos"
                                            onChange={(e) => setData('code', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                {/* Reenviar código */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={resendCode}
                                        disabled={countdown > 0}
                                        className={`text-sm transition-all duration-200 ${
                                            countdown > 0 
                                                ? 'text-text-secondary/50 cursor-not-allowed' 
                                                : 'text-accent hover:text-accent-yellow hover:glow-text'
                                        }`}
                                    >
                                        {countdown > 0 ? (
                                            <span className="flex items-center justify-center gap-1">
                                                <Clock size={14} />
                                                Reenviar código en {countdown}s
                                            </span>
                                        ) : (
                                            '¿No recibiste el código? Reenviar'
                                        )}
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="flex-1 py-3 px-4 rounded-soft border border-white/20 text-text-primary 
                                            transition-all duration-200 hover:bg-white/10 hover:border-white/30
                                            flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Atrás
                                    </button>
                                    
                                    <PrimaryButton
                                        className="flex-1 justify-center rounded-soft py-3 font-semibold text-black
                                            bg-gradient-to-r from-accent to-accent-gold
                                            shadow-lg shadow-yellow-500/25
                                            transition-all duration-300
                                            hover:from-accent-yellow hover:to-accent
                                            hover:shadow-xl hover:shadow-yellow-500/40
                                            hover:scale-[1.02]
                                            active:scale-95
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                            relative overflow-hidden group"
                                        disabled={processing || isLoading}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                                    Verificando...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-4 w-4" />
                                                    Verificar
                                                </>
                                            )}
                                        </span>
                                    </PrimaryButton>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Éxito */}
                        {step === 3 && (
                            <div className="animate-fade-in text-center space-y-6">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                                        ¡Código Verificado!
                                    </h3>
                                    <p className="text-text-secondary text-sm">
                                        Tu identidad ha sido verificada correctamente. Ahora puedes restablecer tu contraseña.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="flex-1 py-3 px-4 rounded-soft border border-white/20 text-text-primary 
                                            transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                                    >
                                        Volver al inicio
                                    </button>
                                    
                                    <PrimaryButton
                                        className="flex-1 justify-center rounded-soft py-3 font-semibold text-black
                                            bg-gradient-to-r from-accent to-accent-gold
                                            shadow-lg shadow-yellow-500/25
                                            transition-all duration-300
                                            hover:from-accent-yellow hover:to-accent
                                            hover:shadow-xl hover:shadow-yellow-500/40"
                                        onClick={() => window.location.href = '/reset-password'}
                                    >
                                        Restablecer Contraseña
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="animate-fade-in mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-text-secondary/70">
                                © 2025 • Sistema de recuperación
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-background {
                    background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
                }
                
                .glow-text {
                    text-shadow: 0 0 10px rgba(245, 224, 3, 0.5);
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </GuestLayout>
    );
}