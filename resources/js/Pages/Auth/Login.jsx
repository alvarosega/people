import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { User, Lock, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

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
        post('/login', {
            onFinish: () => {
                reset('password');
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    useEffect(() => {
        document.body.classList.add('loaded');
    }, []);

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* Background transparente para absorber el layout global */}
            <div className="absolute inset-0 -z-10 bg-transparent"></div>

            <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-500 hover:transform-gpu animate-scale-in">

                {/* Card Principal adaptada al Theme Claro/Oscuro */}
                <div className="relative overflow-hidden rounded-3xl border border-text-secondary/10 bg-primary-secondary shadow-float dark:shadow-dark-float p-6 sm:p-8 lg:p-10">
                    
                    {/* Efecto de acento superior */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
                    
                    {/* Logo Header */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-gray-200 shadow-md mb-4 transition-transform duration-300 hover:scale-105">
                            <img 
                                src="/logo.jpg" 
                                alt="AB InBev" 
                                className="h-10 sm:h-12 md:h-14 w-auto"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span className="text-xs font-black text-text-secondary tracking-[0.2em] uppercase">
                                People
                            </span>
                        </div>
                    </div>

                    {/* Estado o mensajes */}
                    {status && (
                        <div className="animate-slide-up mb-6 rounded-xl bg-functional-green/10 border border-functional-green/20 p-4 text-center flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} className="text-functional-green" />
                            <span className="text-sm font-bold text-functional-green">
                                {status}
                            </span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Campo Legajo */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <InputLabel 
                                htmlFor="legajo" 
                                value="Legajo" 
                                className="text-text-primary font-bold tracking-wide mb-2 block"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200" />
                                </div>
                                <TextInput
                                    id="legajo"
                                    type="text"
                                    name="legajo"
                                    value={data.legajo}
                                    className={`pl-11 pr-4 py-3.5 w-full rounded-xl border bg-primary text-text-primary placeholder:text-text-secondary/40 transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent shadow-inner
                                        ${errors.legajo ? 'border-functional-red/50 focus:border-functional-red focus:ring-functional-red/20' : 'border-text-secondary/20 hover:border-text-secondary/40'}`}
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="Ingresa tu legajo"
                                    onChange={(e) => setData('legajo', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.legajo} className="mt-2 animate-fade-in text-functional-red" />
                        </div>

                        {/* Campo Password */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <InputLabel 
                                htmlFor="password" 
                                value="Contraseña" 
                                className="text-text-primary font-bold tracking-wide mb-2 block"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200" />
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className={`pl-11 pr-12 py-3.5 w-full rounded-xl border bg-primary text-text-primary placeholder:text-text-secondary/40 transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent shadow-inner
                                        ${errors.password ? 'border-functional-red/50 focus:border-functional-red focus:ring-functional-red/20' : 'border-text-secondary/20 hover:border-text-secondary/40'}`}
                                    autoComplete="current-password"
                                    placeholder="Ingresa tu contraseña"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-secondary/10 transition-all duration-200"
                                >
                                    {showPassword ? 
                                        <EyeOff size={18} /> : 
                                        <Eye size={18} />
                                    }
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2 animate-fade-in text-functional-red" />
                        </div>

                        {/* Controles extra */}
                        <div className="animate-fade-in flex items-center justify-between pt-1" style={{ animationDelay: '0.3s' }}>
                            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-text-secondary/30 text-accent focus:ring-accent bg-primary"
                                />
                                <span className="group-hover:text-text-primary transition-colors">Recordarme</span>
                            </label>

                            {canResetPassword && (
                                <Link 
                                    href={route('password.request')}
                                    className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        {/* Botón Submit */}
                        <div className="animate-fade-in pt-4" style={{ animationDelay: '0.4s' }}>
                            <PrimaryButton
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-abinbev-dark font-black uppercase tracking-widest shadow-glow hover-lift disabled:opacity-50 disabled:hover-lift-none transition-all"
                                disabled={processing || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-abinbev-dark border-t-transparent" />
                                        Validando...
                                    </>
                                ) : (
                                    <>
                                        <User size={18} strokeWidth={2.5} />
                                        Ingresar al Sistema
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="animate-fade-in mt-8 pt-6 border-t border-text-secondary/10 text-center" style={{ animationDelay: '0.5s' }}>
                        <p className="text-xs font-medium text-text-secondary/70">
                            © {new Date().getFullYear()} Todos los derechos reservados 
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}