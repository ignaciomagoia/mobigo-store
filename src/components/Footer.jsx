import { ArrowUpRight, Instagram } from 'lucide-react';
import { Link } from 'react-router';
import Brand from './Brand';
import { InstagramLink, WhatsAppButton } from './ContactProvider';

export default function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Brand light /><p>Tecnología que te conecta.<br />Confianza que te acompaña.</p><span className="footer-signoff">Tu próximo upgrade empieza acá. <span>✦</span></span></div><div className="footer-links"><h3>Explorá MobiGo</h3><Link to="/iphones">iPhones</Link><Link to="/apple-watch">Apple Watch</Link><Link to="/airpods">AirPods</Link><Link to="/accesorios">Accesorios</Link></div><div className="footer-links"><h3>Sigamos conectados</h3><InstagramLink><Instagram size={17} /> Instagram <ArrowUpRight size={14} /></InstagramLink><WhatsAppButton className="footer-contact">WhatsApp <ArrowUpRight size={14} /></WhatsAppButton><Link to="/contacto">Contacto <ArrowUpRight size={14} /></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MobiGo Store. Todos los derechos reservados.</span></div></div></footer>;
}
