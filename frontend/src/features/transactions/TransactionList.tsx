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

    const [newDate, setNewDate] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategoryId, setNewCategoryId] = useState('1');
    const [success, setSuccess] = useState('');

    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');


    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/transactions/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Error al cargar las transacciones');
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                date: newDate,
                description: newDescription,
                amount: parseFloat(newAmount),
                category: {
                    id: newCategoryId,
                },
            };
            await axios.post('http://localhost:3001/transactions', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('✅ Transacción creada exitosamente');
            setNewDate('');
            setNewDescription('');
            setNewAmount('');
            setNewCategoryId('1');
            fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Error al crear la transacción');
        }
    };
    return (
        <div className="p-4 rounded-xl text-orange-200">
            <h2 className="text-2xl font-bold">Tus Transacciones recientes</h2>
            <p className="text-orange-200 text-sm mt-1">
                Aquí encuentras todas las compras que hiciste. Si quieres organizarte, puedes revisarlas una por una.
            </p>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mt-3">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-600 p-3 rounded mt-3">
                    {success}
                </div>
            )}

            {/* FORMULARIO PARA CREAR TRANSACCIÓN */}
            <form onSubmit={handleCreateTransaction} className="bg-gray-100 rounded p-3 mt-4 space-y-3">
                <h3 className="font-bold">Crear nueva transacción</h3>
                <div>
                    <label className="block text-gray-700">Fecha:</label>
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded text-gray-800"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Descripción:</label>
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded text-gray-800"
                        placeholder="Ej: Supermercado"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Monto:</label>
                    <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded text-gray-800"
                        placeholder="Ej: 125.50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Categoría (ID):</label>
                    <input
                        type="text"
                        value={newCategoryId}
                        onChange={(e) => setNewCategoryId(e.target.value)}
                        className="w-full px-3 py-2 rounded text-gray-800"
                        placeholder="Ej: 1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                >
                    Crear
                </button>
            </form>

            {/* LISTA DE TRANSACCIONES */}
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
