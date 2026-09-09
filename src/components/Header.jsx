import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { ArrowUpRight, Menu, Truck, X } from 'lucide-react';
import Brand from './Brand';
import { WhatsAppButton } from './ContactProvider';

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
    <div className="announcement"><div className="container announcement-inner"><span>Tu próximo upgrade empieza acá <span className="announcement-spark">✦</span></span><span className="announcement-shipping"><Truck size={14} /> Enviamos a todo el país</span></div></div>
    <header className="header"><div className="container header-inner">
      <Brand />
      <nav id="main-navigation" aria-label="Navegación principal" className={`navigation ${isOpen ? 'is-open' : ''}`}>
        {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
        <WhatsAppButton className="button button-dark mobile-nav-contact">Hablemos <ArrowUpRight size={16} /></WhatsAppButton>
      </nav>
      <WhatsAppButton className="header-contact" icon={false}>Hablemos <ArrowUpRight size={17} /></WhatsAppButton>
      <button ref={menuButton} className="icon-button menu-toggle" aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen} aria-controls="main-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
    </div></header>
  </>;
}
