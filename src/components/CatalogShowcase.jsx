import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Link } from 'react-router';
import { getProducts } from '../services/products';
import useProductsResource from '../hooks/useProductsResource';
import ProductsState from './ProductsState';
import ProductGrid from './ProductGrid';
import CatalogFilters from './CatalogFilters';

const emptyFilters = { conditions: [], models: [], capacities: [], colors: [] };

function uniqueOptions(items, getValue, getLabel = getValue) {
  return [...new Map(items.map((item) => {
    const value = getValue(item);
    return value ? [value, { value, label: getLabel(item) }] : null;
  }).filter(Boolean)).values()].sort((a, b) => a.label.localeCompare(b.label, 'es', { numeric: true }));
}

function filterBySelection(value, selected) {
  return !selected.length || selected.includes(value);
}

export default function CatalogShowcase({ categoryId = 'iphones', title = 'iPhones disponibles', eyebrow = 'CATÁLOGO MOBIGO', linkTo, linkLabel }) {
  const { data, loading, error, retry } = useProductsResource(getProducts);
  const products = data || [];
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const scopedProducts = useMemo(() => products.filter((product) => !categoryId || product.category === categoryId), [products, categoryId]);
  const options = useMemo(() => ({
    conditions: uniqueOptions(scopedProducts, (product) => product.condition),
    models: uniqueOptions(scopedProducts, (product) => product.model || product.name),
    capacities: uniqueOptions(scopedProducts, (product) => product.capacity),
    colors: uniqueOptions(scopedProducts, (product) => product.color === 'Consultar color' ? null : product.color).map((option) => ({
      ...option,
      color: scopedProducts.find((product) => product.color === option.value)?.colorHex,
    })),
  }), [scopedProducts]);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    return scopedProducts.filter((product) => {
      const model = product.model || product.name;
      const text = `${product.name} ${model} ${product.capacity || ''} ${product.color || ''}`.toLocaleLowerCase('es');
      return (!normalizedQuery || text.includes(normalizedQuery))
        && filterBySelection(product.condition, filters.conditions)
        && filterBySelection(model, filters.models)
        && filterBySelection(product.capacity, filters.capacities)
        && filterBySelection(product.color === 'Consultar color' ? null : product.color, filters.colors);
    });
  }, [filters, query, scopedProducts]);

  function toggleFilter(type, value) {
    setFilters((current) => {
      const selected = current[type];
      return { ...current, [type]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] };
    });
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setQuery('');
  }

  const resultsText = loading ? 'Buscando productos...' : `Mostrando ${visible.length} ${visible.length === 1 ? 'producto' : 'productos'}`;
  return <section className="catalog-showcase container" aria-labelledby="catalog-showcase-title">
    <div className="section-heading catalog-showcase-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="catalog-showcase-title">{title}</h2>
        <p className="results-count" role="status">{resultsText}</p>
      </div>
      {linkTo && <Link className="text-link" to={linkTo}>{linkLabel || 'Ver catálogo'}</Link>}
    </div>
    <div className="catalog-search-row">
      <label className="search-field catalog-search-field"><Search size={18} /><input type="search" placeholder="Buscar por modelo, capacidad o color" aria-label="Buscar productos" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <button className="button button-outline catalog-filter-toggle" type="button" onClick={() => setFiltersOpen(true)}><Filter size={17} />Filtros</button>
    </div>
    {filtersOpen && <button className="catalog-filter-backdrop" type="button" aria-label="Cerrar filtros" onClick={() => setFiltersOpen(false)} />}
    <div className="catalog-layout">
      <CatalogFilters open={filtersOpen} filters={filters} options={options} onToggle={toggleFilter} onClear={clearFilters} onClose={() => setFiltersOpen(false)} />
      <div className="catalog-products" aria-busy={loading}>
        {loading || error || !scopedProducts.length ? <ProductsState loading={loading} error={error} onRetry={retry} /> : visible.length ? <ProductGrid products={visible} /> : <div className="empty-state">
          <Search size={30} />
          <h2>No encontramos ese modelo.</h2>
          <p>Probá limpiar filtros o buscar otra capacidad.</p>
          <button className="button button-dark" onClick={clearFilters}>Limpiar filtros</button>
        </div>}
      </div>
    </div>
    <p className="catalog-note">Precios expresados en USD. Todas las consultas se coordinan por WhatsApp.</p>
  </section>;
}
