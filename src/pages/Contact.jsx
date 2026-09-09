import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react';
import { InstagramLink, WhatsAppButton } from '../components/ContactProvider';
import Benefits from '../components/Benefits';

export default function Contact() {
  return <><section className="contact-page container"><span className="eyebrow">DEL OTRO LADO, ESTAMOS NOSOTROS</span><h1>Tu próximo upgrade<br />empieza con un <span>hola.</span></h1><p>¿Una pregunta, un modelo en mente o ganas de conocer más?<br />Te acompañamos a encontrar lo que va con vos.</p><div className="contact-cards"><article><MessageCircle size={32} strokeWidth={1.4} /><h2>Hablemos por WhatsApp</h2><p>Consultá disponibilidad, precios y todo lo que quieras saber sobre tu próximo equipo.</p><WhatsAppButton className="button button-dark" icon={false}>Iniciar conversación <ArrowUpRight size={18} /></WhatsAppButton></article><article><Instagram size={32} strokeWidth={1.4} /><h2>Encontranos en Instagram</h2><p>Novedades, favoritos y una dosis de inspiración para tu próximo upgrade.</p><InstagramLink className="button button-outline">Ver Instagram <ArrowUpRight size={18} /></InstagramLink></article></div></section><Benefits /></>;
}
