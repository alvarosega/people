import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        legajo: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(route('login'), {
            onFinish: () => {
                reset('password');
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    // Efecto para el fade-in al cargar
    useEffect(() => {
        document.body.classList.add('loaded');
    }, []);

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* Background con efecto de partículas sutil */}
{/* Background transparente */}
<div className="absolute inset-0 -z-10 bg-transparent"></div>



            <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 
    transform transition-all duration-500 hover:transform-gpu hover:scale-[1.01]">

                    {/* Card Principal con diseño Apple */}
                    <div className="rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl 
    p-6 sm:p-8 lg:p-10 relative overflow-hidden">

                        
                        {/* Efecto de acento dorado */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
                        
                        {/* Logo con efecto de glow */}
                        <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-gray-200 shadow-md">
                            <img 
                                src="/logo.jpg" 
                                alt="AB InBev" 
                                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto transition-all duration-300 hover:scale-105"
                            />

                        </div>

                            <div className="mt-2 flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <span className="text-xs font-medium text-text-secondary tracking-widest uppercase">
                                    People
                                </span>
                            </div>
                        </div>

                        {/* Estado o mensajes */}
                        {status && (
                            <div className="animate-slide-up mb-6 rounded-soft bg-green-500/10 border border-green-500/20 p-3 text-center">
                                <div className="text-sm font-medium text-green-400">
                                    {status}
                                </div>
                            </div>
                        )}

                        {/* Título */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Legajo */}
                            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <InputLabel 
                                    htmlFor="legajo" 
                                    value="Legajo" 
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
                                <InputError message={errors.legajo} className="mt-2 animate-fade-in" />
                            </div>

                            {/* Campo Password */}
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Contraseña" 
                                    className="text-text-primary font-medium mb-2"
                                />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className={`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${errors.password ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                                        autoComplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-soft 
                                            text-text-secondary hover:text-text-primary hover:bg-white/10 
                                            transition-all duration-200 transform hover:scale-110"
                                    >
                                        {showPassword ? 
                                            <EyeOff size={18} className="transition-transform duration-200" /> : 
                                            <Eye size={18} className="transition-transform duration-200" />
                                        }
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 animate-fade-in" />
                            </div>

                            {/* Recordarme y Olvidé contraseña */}
                            <div className="animate-fade-in flex items-center justify-between" style={{ animationDelay: '0.3s' }}>
                                <label className="flex items-center text-sm text-text-secondary cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="accent-accent border-white/20 bg-white/5"
                                    />
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-text-secondary underline transition-all duration-200 
                                            hover:text-accent hover:no-underline hover:glow-text"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Botón de Login */}
                            <div className="animate-fade-in pt-4" style={{ animationDelay: '0.4s' }}>
                                <PrimaryButton
                                    className="w-full justify-center rounded-soft py-3 sm:py-4 font-semibold text-black
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
                                                Ingresando...
                                            </>
                                        ) : (
                                            <>
                                                <User className="h-4 w-4" />
                                                Ingresar
                                            </>
                                        )}
                                    </span>
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="animate-fade-in mt-8 pt-6 border-t border-white/10 text-center" style={{ animationDelay: '0.5s' }}>
                            <p className="text-xs text-text-secondary/70">
                                © 2025 Todos los derechos reservados 
                            </p>
                        </div>
                    </div>
                </div>
            

            <style jsx>{`

                
                body:not(.loaded) .animate-scale-in {
                    opacity: 0;
                    transform: scale(0.95);
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
                
                .hover-glow {
                    transition: all 0.3s ease;
                }
                
                .hover-glow:hover {
                    box-shadow: 0 0 30px rgba(245, 224, 3, 0.3);
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