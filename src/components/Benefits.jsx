import { BadgeCheck, ClipboardCheck, MessagesSquare, Truck } from 'lucide-react';

const benefits = [
  { icon: BadgeCheck, title: 'Garantía', subtitle: 'La tranquilidad de elegir con confianza.' },
  { icon: ClipboardCheck, title: 'Equipos revisados', subtitle: 'Probados y seleccionados, en cada detalle.' },
  { icon: MessagesSquare, title: 'Atención personalizada', subtitle: 'Te ayudamos a elegir lo mejor para vos.' },
  { icon: Truck, title: 'Envíos a todo el país', subtitle: 'Tu próximo upgrade llega a donde estés.' },
];

export default function Benefits() {
  return <section className="benefits container" aria-label="Beneficios de comprar en MobiGo">{benefits.map(({ icon: Icon, title, subtitle }) => <div className="benefit" key={title}><Icon size={29} strokeWidth={1.35} /><h3>{title}</h3><p>{subtitle}</p></div>)}</section>;
}
