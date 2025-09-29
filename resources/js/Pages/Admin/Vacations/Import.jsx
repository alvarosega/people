import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function Import({ auth }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            setError('Por favor, selecciona un archivo CSV.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        router.post(route('admin.vacations.import'), formData, {
            forceFormData: true,
            onError: (errors) => setError(errors.file || 'Error al subir el archivo.'),
            onSuccess: () => setFile(null),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Importar Vacaciones</h2>}
        >
            <Head title="Importar Vacaciones" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Subir archivo CSV</h3>

                        {error && <div className="mb-4 text-red-600">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    setError('');
                                }}
                                className="border p-2 rounded w-full"
                            />

                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Importar
                            </button>
                        </form>

                        <p className="mt-4 text-gray-500 text-sm">
                            El archivo CSV debe contener las columnas: <strong>legajo, fecha_inicio, fecha_fin, dias, estado, comentario</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

