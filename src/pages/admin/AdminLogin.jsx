import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import Brand from '../../components/Brand';
import { getAdminStatus, signInAdmin } from '../../services/adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || '/admin/productos';

  useEffect(() => {
    let active = true;
    getAdminStatus()
      .then((status) => { if (active) setIsAdmin(status.isAdmin); })
      .catch(() => {})
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(form.email, form.password);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  if (!checking && isAdmin) return <Navigate to="/admin/productos" replace />;

  return <section className="admin-login">
    <form className="admin-login-card" onSubmit={handleSubmit}>
      <Brand />
      <span className="admin-login-icon"><LockKeyhole size={24} /></span>
      <h1>Ingresar al panel</h1>
      <p>Acceso privado para gestionar productos de MobiGo.</p>
      {error && <div className="admin-alert" role="alert">{error}</div>}
      <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required /></label>
      <label>Contraseña<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required /></label>
      <button className="button button-dark" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}<ArrowRight size={18} /></button>
    </form>
  </section>;
}
