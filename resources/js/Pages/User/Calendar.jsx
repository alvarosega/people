import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Calendar from '@/Components/Calendar';

export default function UserCalendar() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-bold text-2xl text-green-700 leading-tight">
                    Calendario
                </h2>
            }
        >
            <div className="py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                        <Calendar isAdmin={false} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
