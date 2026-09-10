import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import { getAdminStatus, signOutAdmin, subscribeToAuth } from '../../services/adminAuth';

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, user: null, isAdmin: false, error: null });

  useEffect(() => {
    let active = true;
    async function verify() {
      try {
        const status = await getAdminStatus();
        if (active) setState({ loading: false, user: status.user, isAdmin: status.isAdmin, error: null });
      } catch (error) {
        if (active) setState({ loading: false, user: null, isAdmin: false, error });
      }
    }
    verify();
    const { data } = subscribeToAuth(verify);
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (state.loading) return <div className="admin-status-screen" role="status">Verificando acceso...</div>;
  if (!state.user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (state.error) return <div className="admin-status-screen" role="alert"><ShieldAlert size={32} /><h1>No pudimos verificar el acceso.</h1><p>{state.error.message}</p></div>;
  if (!state.isAdmin) return <div className="admin-status-screen" role="alert"><ShieldAlert size={32} /><h1>Usuario sin permisos de administrador.</h1><p>Este email inició sesión, pero no figura en `admin_users`.</p><button className="button button-dark" onClick={signOutAdmin}>Cerrar sesión</button></div>;

  return <Outlet />;
}
