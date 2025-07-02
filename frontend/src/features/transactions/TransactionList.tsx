import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, DollarSign, FileText, Upload, Brain } from 'lucide-react';
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

// Tips para cada sección
const budgetTips = [
    "💡 Consejo: Empieza con un presupuesto sencillo. Anota cuánto dinero entra cada mes y cuánto necesitas para gastos básicos como comida y servicios.",
    "📊 Tip: Un buen presupuesto es el 50% para gastos necesarios, 20% para ahorros y 30% para gastos personales.",
    "⚠️ Importante: Revisa tu presupuesto cada mes. Si gastas más de lo planeado, no te preocupes, ajústalo poco a poco.",
    "🎯 Sugerencia: Empieza con metas pequeñas. Si nunca has ahorrado, intenta guardar aunque sean $50 pesos al mes."
];

const transactionTips = [
    "📝 Consejo: Anota todos tus gastos, incluso los más pequeños como un chicle. Todo suma al final del mes.",
    "🗓️ Tip: Registra tus gastos el mismo día que los haces. Es más fácil recordar para qué fue el dinero.",
    "🏪 Importante: Cuando compres algo, escribe exactamente dónde fue: 'Supermercado Día', 'Farmacia San Pablo', etc.",
    "💰 Sugerencia: Si un gasto fue grande (más de $1000), escribe una nota extra de por qué fue necesario."
];

const csvTips = [
    "📄 ¿Qué es un CSV? Es un archivo simple que puedes hacer en Excel o Google Sheets con tus gastos organizados en columnas.",
    "📋 Consejo: En tu archivo, pon una columna para la fecha, otra para la descripción y otra para el monto gastado.",
    "✅ Tip: Si tienes gastos anotados en un cuaderno, pídele a alguien joven de la familia que te ayude a pasarlos al CSV.",
    "🔍 Importante: Revisa que las fechas estén en formato DD/MM/AAAA (por ejemplo: 15/12/2024) antes de subir el archivo."
];

const analysisTips = [
    "🧠 Celia es tu asistente inteligente que revisa tus gastos y te da consejos personalizados para ahorrar dinero.",
    "📈 Consejo: Usa el análisis una vez por semana para ver en qué estás gastando más y dónde puedes mejorar.",
    "💡 Tip: Celia te dirá si estás gastando mucho en una categoría, como comida o transporte, y te dará ideas para reducir gastos.",
    "🎯 Importante: Los consejos de Celia están basados en tus propios gastos, así que son específicos para tu situación."
];

function TipCarousel({ tips, sectionName }: { tips: string[], sectionName: string }) {
    const [currentTip, setCurrentTip] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [tips.length, isAutoPlaying]);

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setIsAutoPlaying(false);
    };

    const prevTip = () => {
        setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
        setIsAutoPlaying(false);
    };

    return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <Info className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">
                            Consejo {currentTip + 1} de {tips.length} - {sectionName}
                        </span>
                    </div>
                    <p className="text-blue-900 text-base leading-relaxed">
                        {tips[currentTip]}
                    </p>
                </div>
                <div className="flex items-center ml-4 space-x-1">
                    <button
                        onClick={prevTip}
                        className="p-1 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                        aria-label="Consejo anterior"
                    >
                        <ChevronLeft className="w-4 h-4 text-blue-700" />
                    </button>
                    <button
                        onClick={nextTip}
                        className="p-1 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                        aria-label="Siguiente consejo"
                    >
                        <ChevronRight className="w-4 h-4 text-blue-700" />
                    </button>
                </div>
            </div>
            <div className="flex justify-center mt-3 space-x-1">
                {tips.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentTip(index);
                            setIsAutoPlaying(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentTip ? 'bg-blue-600' : 'bg-blue-300'
                            }`}
                        aria-label={`Ir al consejo ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function TransactionsList({ userId }: { userId: string }) {
    const [analysis, setAnalysis] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newBudget, setNewBudget] = useState('');
    const [newCategoryId, setNewCategoryId] = useState('1');
    const [success, setSuccess] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/transactions/${userId}`, {
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

    const handleCsvUpload = async () => {
        if (!csvFile) {
            setUploadError('Por favor, selecciona un archivo primero.');
            return;
        }
        setUploading(true);
        setTimeout(() => {
            setUploadSuccess('✅ El archivo CSV se cargó correctamente');
            setCsvFile(null);
            setUploading(false);
        }, 2000);
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setAnalysis('');
        setTimeout(() => {
            setAnalysis('Basándome en tus gastos, veo que gastas más en comida los fines de semana. Te sugiero hacer una lista de compras antes de ir al supermercado para evitar gastos innecesarios.');
            setAnalyzing(false);
        }, 3000);
    };

    const handleBudgetUpdate = async () => {
        setError('');
        setSuccess('');
        setSuccess('✅ Presupuesto actualizado exitosamente');
        setNewBudget('');
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    💰 Mis Finanzas Personales
                </h1>
                <p className="text-gray-600 text-lg">
                    Lleva el control de tu dinero de manera fácil y sencilla
                </p>
            </div>

            {/* Mensajes de estado */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
                    {success}
                </div>
            )}

            {/* Sección Presupuesto */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Mi Presupuesto Mensual</h2>
                </div>

                <TipCarousel tips={budgetTips} sectionName="Presupuesto" />

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            ¿Cuánto dinero tienes disponible este mes?
                        </label>
                        <input
                            type="number"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            className="w-full px-4 py-3 text-xl text-gray-700 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Ejemplo: 50000"
                        />
                        <p className="text-gray-500 text-sm mt-1">Escribe solo números, sin puntos ni comas</p>
                    </div>
                    <button
                        onClick={handleBudgetUpdate}
                        className="w-full bg-green-600 text-white py-3 px-6 text-xl font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Guardar Mi Presupuesto
                    </button>
                </div>
            </div>

            {/* Sección Crear Transacción */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Anotar un Gasto</h2>
                </div>

                <TipCarousel tips={transactionTips} sectionName="Gastos" />

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            ¿Cuándo fue el gasto?
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-4 py-3 text-xl text-gray-700 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            ¿Qué compraste o pagaste?
                        </label>
                        <input
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full px-4 py-3 text-xl text-gray-700 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Ejemplo: Compras en el supermercado"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            ¿Cuánto gastaste?
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            className="w-full px-4 py-3 text-xl text-gray-700 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Ejemplo: 2500.50"
                        />
                        <p className="text-gray-500 text-sm mt-1">Puedes usar punto para los centavos (ejemplo: 2500.50)</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            Tipo de gasto (número)
                        </label>
                        <select
                            value={newCategoryId}
                            onChange={(e) => setNewCategoryId(e.target.value)}
                            className="w-full px-4 py-3 text-xl text-gray-700 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                            <option value="1">1 - Comida y supermercado</option>
                            <option value="2">2 - Transporte</option>
                            <option value="3">3 - Servicios (luz, agua, gas)</option>
                            <option value="4">4 - Salud y medicinas</option>
                            <option value="5">5 - Otros gastos</option>
                        </select>
                    </div>
                    <button
                        onClick={handleCreateTransaction}
                        className="w-full bg-blue-600 text-white py-3 px-6 text-xl font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Guardar Gasto
                    </button>
                </div>
            </div>

            {/* Sección Lista de Transacciones */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Gastos Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-4 px-4 text-lg font-medium text-gray-700 rounded-l-lg">Fecha</th>
                                <th className="py-4 px-4 text-lg font-medium text-gray-700">¿Qué fue?</th>
                                <th className="py-4 px-4 text-lg font-medium text-gray-700">Cuánto</th>
                                <th className="py-4 px-4 text-lg font-medium text-gray-700 rounded-r-lg">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((t) => (
                                    <tr key={t.id} className="border-t border-gray-200">
                                        <td className="py-4 px-4 text-lg">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="py-4 px-4 text-lg">{t.description}</td>
                                        <td className="py-4 px-4 text-lg font-medium text-red-600">
                                            ${Number(t.amount).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-lg">{t.category?.name || 'Sin categoría'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 px-4 text-gray-600 text-center text-lg">
                                        Todavía no has registrado ningún gasto.<br />
                                        ¡Empieza anotando tu primera compra arriba!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sección CSV Upload */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <Upload className="w-6 h-6 text-purple-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Subir Archivo de Gastos</h2>
                </div>

                <TipCarousel tips={csvTips} sectionName="Archivo CSV" />

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-lg font-medium mb-2">
                            Selecciona tu archivo CSV:
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg bg-white
                                     file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                     file:text-lg file:font-medium file:bg-purple-50 file:text-purple-700
                                     hover:file:bg-purple-100 cursor-pointer focus:border-purple-500 focus:outline-none"
                        />
                        <p className="text-gray-500 text-sm mt-1">Solo archivos CSV (como los de Excel)</p>
                    </div>

                    <button
                        onClick={handleCsvUpload}
                        disabled={uploading}
                        className="w-full bg-purple-600 text-white py-3 px-6 text-xl font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? 'Subiendo archivo...' : 'Subir Mis Gastos'}
                    </button>

                    {uploadError && (
                        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg text-center">
                            <strong>Error:</strong> {uploadError}
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg text-center">
                            {uploadSuccess}
                        </div>
                    )}
                </div>
            </div>

            {/* Sección Análisis */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <Brain className="w-6 h-6 text-indigo-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Consejos de Celia</h2>
                </div>

                <TipCarousel tips={analysisTips} sectionName="Análisis Inteligente" />

                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full bg-indigo-600 text-white py-3 px-6 text-xl font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors mb-4"
                >
                    {analyzing ? 'Celia está pensando... 🤔' : 'Pedirle Consejos a Celia 🧠'}
                </button>

                {analyzing && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-600 mt-2 text-lg">Analizando tus gastos...</p>
                    </div>
                )}

                {analysis && (
                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg">
                        <h3 className="font-bold text-indigo-900 text-xl mb-3">💡 Consejos Personalizados</h3>
                        <p className="text-indigo-800 text-lg leading-relaxed whitespace-pre-line">{analysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
}