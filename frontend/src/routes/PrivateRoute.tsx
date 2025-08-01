import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
