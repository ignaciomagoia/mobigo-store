import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/categories';
import WhatsAppCTA from '../components/WhatsAppCTA';
import CatalogShowcase from '../components/CatalogShowcase';

export default function Catalog({ categoryId }) {
  const category = categories.find((item) => item.id === categoryId);
  return <><section className="catalog-page"><div className="container"><nav className="breadcrumbs" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><ArrowRight size={12} /><span>{category?.name || 'Catálogo'}</span></nav><div className={`catalog-intro ${category ? `catalog-intro-${category.theme}` : ''}`}><span className="eyebrow">TU PRÓXIMO UPGRADE</span><h1>{category?.name || 'Catálogo MobiGo'}</h1><p>{category?.subtitle || 'Productos disponibles para consultar por WhatsApp.'}</p></div><nav className="filter-row catalog-categories" aria-label="Categorías"><Link className={`filter-button ${!categoryId ? 'is-active' : ''}`} to="/catalogo">Todo</Link>{categories.map((c) => <Link key={c.id} className={`filter-button ${c.id === categoryId ? 'is-active' : ''}`} to={`/${c.id}`}>{c.name}</Link>)}</nav></div><CatalogShowcase categoryId={categoryId || null} title={category?.name ? `${category.name} disponibles` : 'Productos disponibles'} eyebrow="CATÁLOGO" /></section><WhatsAppCTA /></>;
}
