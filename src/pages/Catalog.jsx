import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/categories';
import { getProducts } from '../services/products';
import useProductsResource from '../hooks/useProductsResource';
import ProductsState from '../components/ProductsState';
import ProductGrid from '../components/ProductGrid';
import WhatsAppCTA from '../components/WhatsAppCTA';

export default function Catalog({ categoryId }) {
  const { data, loading, error, retry } = useProductsResource(getProducts);
  const products = data || [];
  const [query, setQuery] = useState('');
  const [condition, setCondition] = useState('todos');
  const [sort, setSort] = useState('featured');
  const category = categories.find((item) => item.id === categoryId);
  const visible = products.filter((p) => (!categoryId || p.category === categoryId) && (condition === 'todos' || p.condition === condition) && `${p.name} ${p.capacity || ''} ${p.color}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : Number(b.featured) - Number(a.featured));
  function resetFilters() { setQuery(''); setCondition('todos'); setSort('featured'); }
  return <><section className="catalog-page container"><nav className="breadcrumbs" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><ArrowRight size={12} /><span>{category?.name || 'Catálogo'}</span></nav><div className={`catalog-intro ${category ? `catalog-intro-${category.theme}` : ''}`}><span className="eyebrow">TU PRÓXIMO UPGRADE</span><h1>{category?.name || 'Encontrá tu match.'}</h1><p>{category?.subtitle || 'Equipos y accesorios seleccionados para acompañarte.'}</p></div><nav className="filter-row catalog-categories" aria-label="Categorías"><Link className={`filter-button ${!categoryId ? 'is-active' : ''}`} to="/catalogo">Todo</Link>{categories.map((c) => <Link key={c.id} className={`filter-button ${c.id === categoryId ? 'is-active' : ''}`} to={`/${c.id}`}>{c.name}</Link>)}</nav><div className="catalog-toolbar"><label className="search-field"><Search size={18} /><input type="search" placeholder="Buscá tu próximo favorito" aria-label="Buscar productos" value={query} onChange={(e) => setQuery(e.target.value)} /></label><div className="catalog-selects"><label><span className="sr-only">Condición</span><select value={condition} onChange={(e) => setCondition(e.target.value)}><option value="todos">Todas las condiciones</option><option value="Nuevo">Nuevos</option><option value="Usado">Usados</option></select></label><label><SlidersHorizontal size={16} /><span className="sr-only">Ordenar productos</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Destacados primero</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label></div></div>{!loading && !error && <p className="results-count" role="status">{visible.length} {visible.length === 1 ? 'producto' : 'productos'}</p>}{loading || error || !products.length ? <ProductsState loading={loading} error={error} onRetry={retry} /> : visible.length ? <ProductGrid products={visible} /> : <div className="empty-state"><Search size={30} /><h2>No encontramos ese match.</h2><p>Probá con otro nombre o cambiá los filtros.</p><button className="button button-dark" onClick={resetFilters}>Limpiar filtros</button></div>}<p className="catalog-note">Precios de referencia en USD y stock sujeto a confirmación.</p></section><WhatsAppCTA /></>;
}
