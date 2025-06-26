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
    const handleCsvUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile) {
            setUploadError('Por favor, selecciona un archivo primero.');
            return;
        }

        setUploadError('');
        setUploadSuccess('');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/import-files/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadSuccess('✅ El archivo CSV se cargó correctamente');
            setCsvFile(null);
            fetchTransactions();
        } catch (error) {
            console.error(error);
            setUploadError('Error al subir el archivo CSV');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 rounded-xl text-orange-500">
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
            {/* FORM PARA SUBIR CSV */}
            <form onSubmit={handleCsvUpload} className="bg-gray-100 rounded-lg p-6 mt-4 space-y-4">
                <h3 className="font-bold text-lg text-gray-800 text-center mb-4">
                    Subir transacciones desde CSV
                </h3>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Seleccionar archivo CSV:
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-800 bg-white
                       file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                       file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
                    />
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-green-600 text-white rounded-md px-6 py-3 font-medium
                       hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 min-w-[120px]"
                    >
                        {uploading ? 'Subiendo...' : 'Subir CSV'}
                    </button>
                </div>

                {uploadError && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mt-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Error:</span>
                            <span>{uploadError}</span>
                        </div>
                    </div>
                )}

                {uploadSuccess && (
                    <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-md mt-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Éxito:</span>
                            <span>{uploadSuccess}</span>
                        </div>
                    </div>
                )}
            </form>

        </div>
    );
}
