import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router';
import { WhatsAppButton } from './ContactProvider';

export default function Hero() {
  return <section className="hero container" aria-labelledby="hero-title">
    <div className="hero-copy">
      <h1 id="hero-title">Tu próximo<br />iPhone está<br />en <span>MobiGo.</span></h1>
      <div className="hero-actions"><Link className="button button-dark" to="/iphones">Ver iPhones <ArrowRight size={18} /></Link><WhatsAppButton className="button button-glass">Consultar por WhatsApp</WhatsAppButton></div>
      <div className="hero-reassurance"><BadgeCheck size={18} /><span>Equipos seleccionados. Confianza garantizada.</span></div>
    </div>
    <div className="hero-visual">
      <span className="hero-orbit orbit-one" /><span className="hero-orbit orbit-two" />
      <span className="hero-watermark" aria-hidden="true">hello.</span>
      <img className="hero-product" src="/images/products/iphone-16-pro.jpg" alt="iPhone 16 Pro en titanio desierto, vista frontal y posterior" fetchPriority="high" />
      <span className="hero-note"><span className="little-star">✦</span> Un nuevo nivel.<br /><strong>Muy vos.</strong></span>
    </div>
  </section>;
}
