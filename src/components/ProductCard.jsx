import { ArrowUpRight, BatteryMedium } from 'lucide-react';
import { Link } from 'react-router';
import { formatPrice } from '../lib/formatPrice';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  return <article className="product-card">
    <Link className="product-image-link" to={`/producto/${product.id}`} aria-label={`Ver ${product.name} ${product.capacity || ''}`}>
      {product.label && <span className="product-label">{product.label}</span>}
      <ProductImage src={product.image} alt={`${product.name}, ${product.color}`} loading="lazy" />
      <span className={`condition-tag ${product.condition === 'Nuevo' ? 'is-new' : ''}`}><span />{product.condition}</span>
    </Link>
    <div className="product-info">
      <h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3>
      <p className="product-capacity">{product.capacity || product.model || 'Selección MobiGo'}</p>
      <div className="product-meta"><span className="product-color"><i style={{ backgroundColor: product.colorHex }} />{product.color}</span>{product.battery != null && <span className="battery" title="Salud de la batería"><BatteryMedium size={15} />{product.battery}%</span>}</div>
      <div className="product-price"><strong>{formatPrice(product.price, product.currency)}</strong><span>Precio de referencia</span></div>
      <Link to={`/producto/${product.id}`} className="product-button">Ver producto <ArrowUpRight size={18} /></Link>
    </div>
  </article>;
}
