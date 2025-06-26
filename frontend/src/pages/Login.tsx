import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email.trim() || !password.trim()) {
                throw new Error('Por favor completa todos los campos');
            }

            const res = await axios.post('http://localhost:3001/auth/signin', {
                email: email.trim(),
                password
            });

            if (!res.data || !res.data.access_token) {
                throw new Error('Respuesta del servidor inválida');
            }

            const token = res.data.access_token;

            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('token', token);
            }

            alert('Inicio de sesión exitoso ✅');

            navigate('/dashboard', { replace: true });

        } catch (err) {
            console.error('Login error:', err);

            let errorMessage = 'Error desconocido';

            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<any>;

                if (axiosError.response) {
                    const status = axiosError.response.status;
                    const data = axiosError.response.data;

                    switch (status) {
                        case 400:
                            errorMessage = data?.message || 'Datos inválidos';
                            break;
                        case 401:
                            errorMessage = 'Credenciales inválidas';
                            break;
                        case 404:
                            errorMessage = 'Servicio no encontrado - Verifica la URL del servidor';
                            break;
                        case 422:
                            errorMessage = data?.message || 'Datos no válidos';
                            break;
                        case 429:
                            errorMessage = 'Demasiados intentos, intenta más tarde';
                            break;
                        case 500:
                            errorMessage = 'Error interno del servidor';
                            break;
                        case 503:
                            errorMessage = 'Servidor no disponible';
                            break;
                        default:
                            errorMessage = `Error del servidor (${status})`;
                    }
                } else if (axiosError.request) {
                    errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
                } else {
                    errorMessage = 'Error de configuración: ' + axiosError.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primaryGradientStart via-primaryGradientMid to-primaryGradientEnd px-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                    Iniciar Sesión
                </h1>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@correo.com"
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        ¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate aquí</a>
                    </p>
                </form>
            </div>
        </div>
    );
}