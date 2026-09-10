import { X } from 'lucide-react';

function FilterGroup({ title, options, selected, onToggle, swatches = false }) {
  if (!options.length) return null;
  return <fieldset className="catalog-filter-group">
    <legend>{title}</legend>
    <div className="catalog-filter-options">
      {options.map((option) => <label key={option.value} className="catalog-filter-option">
        <input type="checkbox" checked={selected.includes(option.value)} onChange={() => onToggle(option.value)} />
        {swatches && <i style={{ backgroundColor: option.color || '#d6d8da' }} />}
        <span>{option.label}</span>
      </label>)}
    </div>
  </fieldset>;
}

export default function CatalogFilters({ open, filters, options, onToggle, onClear, onClose }) {
  const hasFilters = Object.values(filters).some((items) => items.length);
  return <aside className={`catalog-sidebar ${open ? 'is-open' : ''}`} aria-label="Filtros del catálogo">
    <div className="catalog-filter-header">
      <div>
        <h3>Filtros</h3>
        <p>Combiná estado, modelo, capacidad y color.</p>
      </div>
      <button className="icon-button catalog-filter-close" type="button" aria-label="Cerrar filtros" onClick={onClose}><X size={20} /></button>
    </div>
    <button className="catalog-clear" type="button" onClick={onClear} disabled={!hasFilters}>Limpiar filtros</button>
    <FilterGroup title="Estado" options={options.conditions} selected={filters.conditions} onToggle={(value) => onToggle('conditions', value)} />
    <FilterGroup title="Modelo" options={options.models} selected={filters.models} onToggle={(value) => onToggle('models', value)} />
    <FilterGroup title="Capacidad" options={options.capacities} selected={filters.capacities} onToggle={(value) => onToggle('capacities', value)} />
    <FilterGroup title="Color" options={options.colors} selected={filters.colors} onToggle={(value) => onToggle('colors', value)} swatches />
  </aside>;
}
