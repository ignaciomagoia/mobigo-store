import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, BadgeCheck, Eye, Package, Sparkles } from 'lucide-react';
import { getAdminProducts } from '../../services/adminProducts';
import { isAbortError } from '../../lib/errors';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    getAdminProducts({ signal: controller.signal })
      .then((data) => {
        if (!mounted) return;
        setProducts(data);
        setError('');
      })
      .catch((loadError) => {
        if (!mounted || controller.signal.aborted || isAbortError(loadError)) return;
        setError(loadError.message || 'No pudimos cargar las estadísticas.');
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const active = products.filter((product) => product.active).length;
  const featured = products.filter((product) => product.featured).length;
  const sealed = products.filter((product) => product.condition === 'Sellado').length;

  return <section className="admin-page">
    <div className="admin-page-heading">
      <div><span className="eyebrow">MOBIGO ADMIN</span><h1>Inicio</h1><p>Vista rápida del catálogo conectado a Supabase.</p></div>
      <Link className="button button-dark" to="/admin/productos/nuevo">Agregar producto <ArrowRight size={17} /></Link>
    </div>
    {error && <div className="admin-alert" role="alert">{error}</div>}
    <div className="admin-stats">
      <article><Package size={24} /><span>{products.length}</span><p>Productos cargados</p></article>
      <article><Eye size={24} /><span>{active}</span><p>Activos en tienda</p></article>
      <article><Sparkles size={24} /><span>{featured}</span><p>Destacados</p></article>
      <article><BadgeCheck size={24} /><span>{sealed}</span><p>Sellados</p></article>
    </div>
    <div className="admin-panel">
      <h2>Flujo recomendado</h2>
      <p>Cargá un producto, marcá `Activo` para publicarlo y usá `Destacado` para mostrarlo primero en el catálogo público.</p>
      <Link className="text-link" to="/admin/productos">Gestionar productos <ArrowRight size={16} /></Link>
    </div>
  </section>;
}
