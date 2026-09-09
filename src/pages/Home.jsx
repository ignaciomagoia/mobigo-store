import { useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import Promotion from '../components/Promotion';
import Benefits from '../components/Benefits';
import WhatsAppCTA from '../components/WhatsAppCTA';
import { categories } from '../data/categories';
import { getProducts, getFeaturedProducts } from '../services/products';
import useProductsResource from '../hooks/useProductsResource';
import ProductsState from '../components/ProductsState';

export default function Home() {
  const [filter, setFilter] = useState('todos');
  const loadProducts = useCallback((options) => filter === 'todos' ? getFeaturedProducts(options) : getProducts(options), [filter]);
  const { data, loading, error, retry } = useProductsResource(loadProducts);
  const visibleProducts = (data || []).filter((p) => filter === 'todos' || p.category === filter);
  return <>
    <Hero />
    <section className="categories-section container"><div className="section-heading"><div><span className="eyebrow">UN MUNDO DE POSIBILIDADES</span><h2>Encontrá tu match.</h2></div><p>Lo que te gusta. Todo en un lugar.</p></div><div className="category-grid">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</div></section>
    <section className="featured-section container" aria-labelledby="featured-title"><div className="section-heading"><div><span className="eyebrow">SELECCIONADOS PARA VOS</span><h2 id="featured-title">Listos para tu próximo capítulo.</h2></div><Link className="text-link" to="/catalogo">Ver todo <ArrowRight size={17} /></Link></div><div className="filter-row" aria-label="Filtrar productos destacados">{[{ id: 'todos', name: 'Destacados' }, ...categories].map((category) => <button key={category.id} className={`filter-button ${filter === category.id ? 'is-active' : ''}`} onClick={() => setFilter(category.id)} aria-pressed={filter === category.id}>{category.name}</button>)}</div><div aria-busy={loading}>{loading || error || !visibleProducts.length ? <ProductsState loading={loading} error={error} onRetry={retry} /> : <ProductGrid products={visibleProducts} />}</div><p className="catalog-note">Una selección para inspirarte. Precios expresados en USD. Consultá disponibilidad.</p></section>
    <Promotion /><Benefits /><WhatsAppCTA />
  </>;
}
