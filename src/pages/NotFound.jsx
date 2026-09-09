import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound({ product = false }) {
  return <section className="not-found container"><span className="eyebrow">404 · NOS FUIMOS UN POCO LEJOS</span><h1>{product ? 'Ese producto no está por acá.' : 'Esta página se desconectó.'}</h1><p>Tu próximo favorito te está esperando en nuestro catálogo.</p><Link className="button button-dark" to="/catalogo">Explorar productos <ArrowRight size={18} /></Link></section>;
}
