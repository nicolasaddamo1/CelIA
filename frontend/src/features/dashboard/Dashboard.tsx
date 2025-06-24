import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import TransactionsList from '../transactions/Dashboard';

export default function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
            console.log('Token encontrado en localStorage:', token);

            try {
                const decoded: any = jwtDecode(token);
                const id = decoded?.sub;

                if (id) {
                    setUserId(id);
                } else {
                    console.error('No se pudo obtener el userId del token');
                }
            } catch (error) {
                console.error('Error al decodificar el token', error);
            }
        } else {
            console.error('No hay token en localStorage');
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primaryGradientStart via-primaryGradientMid to-primaryGradientEnd text-white">
            <h1 className="text-3xl font-bold">¡Bienvenido al Dashboard! 👋</h1>
            {userId ? (
                <TransactionsList userId={userId} />
            ) : (
                <p className="mt-4 text-lg">Cargando transacciones...</p>
            )}
        </div>
    );
}
