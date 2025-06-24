import { useEffect, useState } from 'react';
import axios from 'axios';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category?: {
        name: string;
    };
}

export default function TransactionsList({ userId }: { userId: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/transactions/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Datos recibidos:', response.data); // 👈 Añade esto
                console.log('Tipo de amount:', typeof response.data[0]?.amount); // 👈 Y esto

                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Error al cargar las transacciones');
            }
        };
        fetchTransactions();
    }, [userId]);

    return (
        <div className="p-4 rounded-xl text-gray-800">
            <h2 className="text-2xl font-bold">Tus Transacciones recientes</h2>
            <p className="text-gray-600 text-sm mt-1">
                Aquí encuentras todas las compras que hiciste. Si quieres organizarte, puedes revisarlas una por una.
            </p>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mt-3">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white rounded-xl shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            <th className="py-3 px-4">Fecha</th>
                            <th className="py-3 px-4">Descripción</th>
                            <th className="py-3 px-4">Monto</th>
                            <th className="py-3 px-4">Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((t) => (
                                <tr key={t.id} className="border-t border-gray-200">
                                    <td className="py-3 px-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{t.description}</td>
                                    <td className="py-3 px-4">${Number(t.amount).toFixed(2)}</td>
                                    <td className="py-3 px-4">{t.category?.name || 'Sin categoría'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-3 px-4 text-gray-600 text-center">
                                    Aún no tienes transacciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
