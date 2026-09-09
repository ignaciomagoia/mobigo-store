import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { WhatsAppButton } from './ContactProvider';

export default function WhatsAppCTA() {
  return <section className="whatsapp-cta container"><div className="cta-icon"><MessageCircle size={31} strokeWidth={1.4} /><span /></div><div><span className="eyebrow">ENCONTREMOS TU PRÓXIMO UPGRADE</span><h2>¿No encontrás lo que buscás?</h2><p>Contanos qué tenés en mente. Nosotros te ayudamos.</p></div><WhatsAppButton className="button button-dark" icon={false}>Hablanos por WhatsApp <ArrowUpRight size={19} /></WhatsAppButton></section>;
}
