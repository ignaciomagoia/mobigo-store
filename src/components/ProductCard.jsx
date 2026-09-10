import { ArrowUpRight, BatteryMedium, Info } from 'lucide-react';
import { Link } from 'react-router';
import { formatPrice } from '../lib/formatPrice';
import { productDisplayName, productInquiryMessage } from '../lib/productCopy';
import ProductImage from './ProductImage';
import { WhatsAppButton } from './ContactProvider';
import TradeInButton from './trade-in/TradeInButton';

export default function ProductCard({ product }) {
  const conditionClass = product.condition === 'Sellado' ? 'is-sellado' : 'is-usado';
  return <article className="product-card">
    <Link className="product-image-link" to={`/producto/${product.id}`} aria-label={`Ver ${product.name} ${product.capacity || ''}`}>
      <span className={`product-label product-status ${conditionClass}`}>{product.condition}</span>
      <ProductImage src={product.image} alt={`${product.name}, ${product.color}`} loading="lazy" />
      <span className="product-price-pill">{formatPrice(product.price, product.currency)}</span>
    </Link>
    <div className="product-info">
      <h3><Link to={`/producto/${product.id}`}>{productDisplayName(product)}</Link></h3>
      <div className="product-specs">
        {product.battery != null && <span><BatteryMedium size={15} />Batería: {product.battery}%</span>}
        <span className="product-color"><i style={{ backgroundColor: product.colorHex }} />Color: {product.color}</span>
      </div>
      <Link to={`/producto/${product.id}`} className="product-more-link"><Info size={16} />Más información <ArrowUpRight size={14} /></Link>
      <div className="product-card-actions">
        <WhatsAppButton className="product-whatsapp" message={productInquiryMessage(product)}>Consultar por WhatsApp</WhatsAppButton>
        <TradeInButton product={product} className="product-trade-in" />
      </div>
    </div>
  </article>;
}
