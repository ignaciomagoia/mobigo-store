import { PackageOpen, RefreshCw } from 'lucide-react';

export default function ProductsState({ loading, error, onRetry, detail = false }) {
  if (loading) return <div className="empty-state" role="status" aria-live="polite" aria-busy="true"><PackageOpen size={30} /><p>{detail ? 'Cargando producto…' : 'Cargando productos…'}</p></div>;
  if (error) return <div className="empty-state" role="alert"><RefreshCw size={30} /><h2>{detail ? 'No pudimos cargar este producto.' : 'No pudimos cargar los productos.'}</h2><p>Intentá nuevamente en unos instantes.</p><button className="button button-dark" onClick={onRetry}>Reintentar</button></div>;
  return <div className="empty-state" role="status"><PackageOpen size={30} /><h2>Pronto, más opciones para vos.</h2><p>Todavía no hay productos disponibles en esta selección.</p></div>;
}
