import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import Brand from './Brand';

const links = [{ to: '/', label: 'Inicio' }, { to: '/iphones', label: 'iPhones' }, { to: '/accesorios', label: 'Accesorios' }, { to: '/apple-watch', label: 'Apple Watch' }, { to: '/contacto', label: 'Contacto' }];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && isOpen) { setIsOpen(false); menuButton.current.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);
  return <>
    <header className="header"><div className="container header-inner">
      <Brand />
      <nav id="main-navigation" aria-label="Navegación principal" className={`navigation ${isOpen ? 'is-open' : ''}`}>
        {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
      </nav>
      <button ref={menuButton} className="icon-button menu-toggle" aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen} aria-controls="main-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
    </div></header>
  </>;
}
