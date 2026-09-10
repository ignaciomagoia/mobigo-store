import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { ArrowUpRight, Home, LogOut, Menu, Package, Store, X } from 'lucide-react';
import Brand from '../Brand';
import { signOutAdmin } from '../../services/adminAuth';

const links = [
  { to: '/admin', label: 'Inicio', icon: Home, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  async function handleSignOut() {
    await signOutAdmin();
    navigate('/admin/login', { replace: true });
  }

  return <div className="admin-shell">
    <button className="admin-mobile-menu" type="button" onClick={() => setOpen(true)}><Menu size={20} />Menú admin</button>
    {open && <button className="admin-nav-backdrop" type="button" aria-label="Cerrar menú admin" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
      <div className="admin-sidebar-head">
        <Brand light />
        <span>ADMIN</span>
        <button className="icon-button admin-sidebar-close" type="button" aria-label="Cerrar menú admin" onClick={() => setOpen(false)}><X size={20} /></button>
      </div>
      <nav className="admin-nav" aria-label="Navegación admin">
        {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={18} />{label}</NavLink>)}
      </nav>
      <div className="admin-sidebar-actions">
        <NavLink to="/" target="_blank" rel="noreferrer"><Store size={18} />Ver tienda <ArrowUpRight size={15} /></NavLink>
        <button type="button" onClick={handleSignOut}><LogOut size={18} />Cerrar sesión</button>
      </div>
    </aside>
    <div className="admin-content"><Outlet /></div>
  </div>;
}
