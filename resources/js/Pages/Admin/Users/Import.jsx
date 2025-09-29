// resources/js/Pages/Admin/Users/Import.jsx
import React, { useState } from "react";
import { Head, router, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Upload,
    Download,
    ArrowLeft,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader,
    Users,
    FileCheck
} from 'lucide-react';

export default function Import() {
    const { flash = {} } = usePage().props;
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
            } else {
                alert("Por favor, selecciona un archivo CSV válido");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Selecciona un archivo CSV antes de continuar");
            return;
        }

        const formData = new FormData();
        formData.append("csv_file", file);

        setLoading(true);

        router.post(route("admin.users.import"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setFile(null);
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    // Plantilla de CSV para descargar
    const downloadTemplate = () => {
        const csvContent = "legajo,nombre,email,region,territorio,puesto,rol\n1001,Juan Pérez,juan@empresa.com,Norte,Territorio A,Representante,user\n1002,María García,maria@empresa.com,Sur,Territorio B,Supervisor,manager";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla-usuarios.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-gold">
                        <Upload className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary">Importar Usuarios</h2>
                        <p className="text-text-secondary text-sm">Carga masiva de usuarios desde archivo CSV</p>
                    </div>
                </div>
            }
        >
            <Head title="Importar Usuarios" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Card Principal */}
                    <div className="bg-primary/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent/20 to-accent-gold/20 border-b border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                                        <FileCheck className="h-8 w-8 text-accent" />
                                        Importación Masiva
                                    </h1>
                                    <p className="text-text-secondary mt-1">
                                        Carga múltiples usuarios mediante un archivo CSV
                                    </p>
                                </div>
                                <Link
                                    href={route("admin.users.index")}
                                    className="flex items-center gap-2 bg-white/10 text-text-primary px-4 py-2 rounded-2xl 
                                        hover:bg-white/20 transition-all duration-200"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Mensajes Flash */}
                            {flash.success && (
                                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <div>
                                        <p className="text-green-400 font-medium">¡Importación exitosa!</p>
                                        <p className="text-green-400/80 text-sm">{flash.success}</p>
                                    </div>
                                </div>
                            )}

                            {flash.error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    <div>
                                        <p className="text-red-400 font-medium">Error en la importación</p>
                                        <p className="text-red-400/80 text-sm">{flash.error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Área de Subida */}
                            <div className="space-y-4">
                                <div
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                                        ${dragActive 
                                            ? 'border-accent bg-accent/10' 
                                            : 'border-white/20 bg-white/5 hover:border-white/30'
                                        }
                                        ${file ? 'border-green-500/50 bg-green-500/5' : ''}
                                    `}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-center">
                                            {file ? (
                                                <CheckCircle className="h-12 w-12 text-green-500" />
                                            ) : (
                                                <Upload className="h-12 w-12 text-text-secondary" />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <p className="text-text-primary font-medium">
                                                {file ? file.name : "Arrastra tu archivo CSV aquí"}
                                            </p>
                                            <p className="text-text-secondary text-sm mt-1">
                                                {file 
                                                    ? "Archivo listo para importar" 
                                                    : "o haz click para seleccionar"
                                                }
                                            </p>
                                        </div>

                                        {!file && (
                                            <p className="text-text-secondary/70 text-xs">
                                                Formatos soportados: .csv
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Información del Archivo Seleccionado */}
                                {file && (
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                                        <FileText className="h-5 w-5 text-accent" />
                                        <div className="flex-1">
                                            <p className="text-text-primary text-sm font-medium">{file.name}</p>
                                            <p className="text-text-secondary text-xs">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Plantilla y Formato */}
                            <div className="bg-white/5 rounded-2xl p-4">
                                <h3 className="text-text-primary font-medium mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-accent" />
                                    Formato Requerido
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-text-secondary text-sm">
                                        El archivo CSV debe contener las siguientes columnas:
                                    </p>
                                    <div className="bg-black/20 rounded-xl p-3">
                                        <code className="text-text-secondary text-xs font-mono">
                                            legajo,nombre,email,region,territorio,puesto,rol
                                        </code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-text-secondary/70 text-xs">
                                            Valores de rol: user, manager, admin
                                        </p>
                                        <button
                                            type="button"
                                            onClick={downloadTemplate}
                                            className="flex items-center gap-2 text-accent hover:text-accent-yellow text-sm transition-colors"
                                        >
                                            <Download className="h-3 w-3" />
                                            Descargar Plantilla
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-white/10">
                                <div className="text-text-secondary text-sm">
                                    <p>✅ Se crearán usuarios nuevos</p>
                                    <p>⚠️ Los usuarios existentes se actualizarán</p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Link
                                        href={route("admin.users.index")}
                                        className="flex items-center gap-2 bg-white/10 text-text-primary px-6 py-3 rounded-2xl 
                                            hover:bg-white/20 transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={loading || !file}
                                        className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-black 
                                            font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-yellow-500/25 
                                            transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/40 
                                            hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                                            disabled:transform-none"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin" />
                                                Importando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Iniciar Importación
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                            <Users className="h-8 w-8 text-accent mb-2" />
                            <h4 className="text-text-primary font-medium text-sm">Usuarios Masivos</h4>
                            <p className="text-text-secondary text-xs mt-1">
                                Importa hasta 1000 usuarios en una sola operación
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                            <FileCheck className="h-8 w-8 text-accent mb-2" />
                            <h4 className="text-text-primary font-medium text-sm">Validación Automática</h4>
                            <p className="text-text-secondary text-xs mt-1">
                                El sistema valida el formato y datos antes de importar
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                            <CheckCircle className="h-8 w-8 text-accent mb-2" />
                            <h4 className="text-text-primary font-medium text-sm">Resultados Detallados</h4>
                            <p className="text-text-secondary text-xs mt-1">
                                Reporte completo de usuarios creados y actualizados
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}