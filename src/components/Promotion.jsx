import { ArrowUpRight, CreditCard } from 'lucide-react';
import { WhatsAppButton } from './ContactProvider';

export default function Promotion() {
  return <section className="promotion container" aria-labelledby="promotion-title">
    <div className="promotion-content"><span className="eyebrow"><CreditCard size={17} /> ESE UPGRADE PUEDE SER HOY</span><h2 id="promotion-title">Hasta <span>6 cuotas</span><br />sin interés.</h2><p>Más fácil llegar a eso que tanto querés.</p><WhatsAppButton className="text-link" icon={false} message="¡Hola, MobiGo! Quiero consultar por la promoción de hasta 6 cuotas sin interés.">Consultá las opciones <ArrowUpRight size={19} /></WhatsAppButton><small>Promoción ilustrativa. Consultá condiciones y disponibilidad.</small></div>
    <div className="promotion-art" aria-hidden="true"><span className="promo-circle" /><span className="promo-six">6</span><div className="promo-card"><span>Mobi<span>Go</span><i>✦</i></span><CreditCard size={30} strokeWidth={1} /><div>Tu próximo upgrade.<br /><strong>A tu manera.</strong></div><span className="promo-card-bottom">STORE <span>•••• &nbsp; 0006</span></span></div><span className="promo-star">✦</span></div>
  </section>;
}
