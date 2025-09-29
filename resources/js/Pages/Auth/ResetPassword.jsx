import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Lock, CheckCircle, Eye, EyeOff, Shield, Mail } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    // Analizar fortaleza de la contraseña
    useEffect(() => {
        const analyzePassword = () => {
            const criteria = {
                length: data.password.length >= 8,
                uppercase: /[A-Z]/.test(data.password),
                lowercase: /[a-z]/.test(data.password),
                number: /[0-9]/.test(data.password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
            };

            setPasswordCriteria(criteria);
            
            // Calcular fuerza (0-100)
            const strength = Object.values(criteria).filter(Boolean).length * 20;
            setPasswordStrength(strength);
        };

        if (data.password) {
            analyzePassword();
        } else {
            setPasswordStrength(0);
            setPasswordCriteria({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
            });
        }
    }, [data.password]);

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('password.store'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const getStrengthColor = () => {
        if (passwordStrength >= 80) return 'bg-green-500';
        if (passwordStrength >= 60) return 'bg-yellow-500';
        if (passwordStrength >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getStrengthText = () => {
        if (passwordStrength >= 80) return 'Fuerte';
        if (passwordStrength >= 60) return 'Buena';
        if (passwordStrength >= 40) return 'Regular';
        return 'Débil';
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña" />

            <div className="animate-scale-in mx-auto mt-8 min-h-screen px-4 sm:mt-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md transform transition-all duration-500">
                    {/* Card Principal */}
                    <div className="rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl p-8 relative overflow-hidden">
                        
                        {/* Efecto de acento verde (seguridad) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"></div>
                        
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
                                <Shield className="h-8 w-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                                Nueva Contraseña
                            </h1>
                            <p className="mt-2 text-text-secondary text-sm">
                                Crea una nueva contraseña segura para tu cuenta
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email (solo lectura) */}
                            <div className="animate-fade-in">
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Correo Electrónico" 
                                    className="text-text-primary font-medium mb-2"
                                />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-text-secondary" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary opacity-80 cursor-not-allowed"
                                        autoComplete="username"
                                        readOnly
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Nueva Contraseña */}
                            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Nueva Contraseña" 
                                    className="text-text-primary font-medium mb-2"
                                />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-secondary group-focus-within:text-green-500 transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className={`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${errors.password ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                                        autoComplete="new-password"
                                        isFocused={true}
                                        placeholder="Ingresa tu nueva contraseña"
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

                                {/* Indicador de fortaleza de contraseña */}
                                {data.password && (
                                    <div className="mt-3 space-y-2 animate-slide-up">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-text-secondary">Seguridad de la contraseña:</span>
                                            <span className={`font-medium ${
                                                passwordStrength >= 80 ? 'text-green-400' :
                                                passwordStrength >= 60 ? 'text-yellow-400' :
                                                passwordStrength >= 40 ? 'text-orange-400' : 'text-red-400'
                                            }`}>
                                                {getStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Criterios de contraseña */}
                                {data.password && (
                                    <div className="mt-3 space-y-1 animate-slide-up">
                                        <div className="text-xs text-text-secondary mb-2">La contraseña debe contener:</div>
                                        {[
                                            { key: 'length', text: 'Mínimo 8 caracteres' },
                                            { key: 'uppercase', text: 'Una letra mayúscula' },
                                            { key: 'lowercase', text: 'Una letra minúscula' },
                                            { key: 'number', text: 'Un número' },
                                            { key: 'special', text: 'Un carácter especial' },
                                        ].map((criterion) => (
                                            <div key={criterion.key} className="flex items-center gap-2 text-xs">
                                                <CheckCircle 
                                                    size={12} 
                                                    className={passwordCriteria[criterion.key] ? 'text-green-500' : 'text-text-secondary/50'} 
                                                />
                                                <span className={passwordCriteria[criterion.key] ? 'text-green-400' : 'text-text-secondary/70'}>
                                                    {criterion.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <InputLabel 
                                    htmlFor="password_confirmation"
                                    value="Confirmar Nueva Contraseña" 
                                    className="text-text-primary font-medium mb-2"
                                />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-secondary group-focus-within:text-green-500 transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${errors.password_confirmation ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                                        autoComplete="new-password"
                                        placeholder="Confirma tu nueva contraseña"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-soft 
                                            text-text-secondary hover:text-text-primary hover:bg-white/10 
                                            transition-all duration-200 transform hover:scale-110"
                                    >
                                        {showConfirmPassword ? 
                                            <EyeOff size={18} className="transition-transform duration-200" /> : 
                                            <Eye size={18} className="transition-transform duration-200" />
                                        }
                                    </button>
                                </div>

                                {/* Indicador de coincidencia */}
                                {data.password_confirmation && (
                                    <div className="mt-2 animate-slide-up">
                                        <div className={`flex items-center gap-2 text-xs ${
                                            data.password === data.password_confirmation && data.password 
                                                ? 'text-green-400' 
                                                : 'text-red-400'
                                        }`}>
                                            <CheckCircle size={12} />
                                            {data.password === data.password_confirmation && data.password 
                                                ? 'Las contraseñas coinciden' 
                                                : 'Las contraseñas no coinciden'
                                            }
                                        </div>
                                    </div>
                                )}

                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Botón de Restablecer */}
                            <div className="animate-fade-in pt-4" style={{ animationDelay: '0.3s' }}>
                                <PrimaryButton
                                    className="w-full justify-center rounded-soft py-4 font-semibold text-black
                                        bg-gradient-to-r from-green-500 to-green-600
                                        shadow-lg shadow-green-500/25
                                        transition-all duration-300
                                        hover:from-green-400 hover:to-green-500
                                        hover:shadow-xl hover:shadow-green-500/40
                                        hover:scale-[1.02]
                                        active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                        relative overflow-hidden group"
                                    disabled={processing || isLoading || data.password !== data.password_confirmation || passwordStrength < 40}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                                Restableciendo...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="h-4 w-4" />
                                                Restablecer Contraseña
                                            </>
                                        )}
                                    </span>
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="animate-fade-in mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-text-secondary/70">
                                © 2024 AB InBev • Sistema de seguridad certificado
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
                    opacity: 0;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
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