import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, BadgeCheck, BatteryMedium, MessagesSquare } from 'lucide-react';
import { categories } from '../data/categories';
import { formatPrice } from '../lib/formatPrice';
import { productDisplayName, productInquiryMessage } from '../lib/productCopy';
import { getProductById } from '../services/products';
import useProductsResource from '../hooks/useProductsResource';
import ProductsState from '../components/ProductsState';
import ProductImage from '../components/ProductImage';
import { WhatsAppButton } from '../components/ContactProvider';
import TradeInButton from '../components/trade-in/TradeInButton';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id } = useParams();
  const loadProduct = useCallback((options) => getProductById(id, options), [id]);
  const { data: product, loading, error, retry } = useProductsResource(loadProduct);
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => { setActiveImage(0); if (product) document.title = `${product.name} ${product.capacity || ''} · MobiGo Store`; }, [id, product]);
  if (loading || error) return <div className="product-page container"><ProductsState detail loading={loading} error={error} onRetry={retry} /></div>;
  if (!product) return <NotFound product />;
  const category = categories.find((c) => c.id === product.category) || { id: 'catalogo', name: 'Catálogo' };
  const selected = product.gallery[activeImage] || product.gallery[0];
  const inquiry = productInquiryMessage(product);
  return <div className="product-page container"><nav className="breadcrumbs" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><ArrowRight size={12} /><Link to={`/${category.id}`}>{category.name}</Link><ArrowRight size={12} /><span>{product.name}</span></nav><div className="product-detail-layout"><div className="product-gallery"><div className="gallery-main"><span className={`condition-tag ${product.condition === 'Sellado' ? 'is-sellado' : 'is-usado'}`}><span />{product.condition}</span><ProductImage className={selected.view === 'detail' ? 'gallery-zoom' : ''} src={selected.src} alt={selected.alt} /></div><div className="gallery-thumbnails" aria-label="Galería de imágenes">{product.gallery.map((item, index) => <button key={`${item.src}-${index}`} onClick={() => setActiveImage(index)} className={`gallery-thumbnail ${activeImage === index ? 'is-active' : ''}`} aria-label={index === 0 ? 'Ver imagen completa' : 'Ver detalle de la imagen'} aria-pressed={activeImage === index}><ProductImage className={item.view === 'detail' ? 'thumbnail-zoom' : ''} src={item.src} alt="" /></button>)}</div></div><div className="detail-info"><span className="eyebrow">TU PRÓXIMO FAVORITO</span><h1>{productDisplayName(product)}</h1><p className="detail-subtitle">{product.color}</p><div className="detail-price">{formatPrice(product.price, product.currency)}</div><p className="detail-price-note">{product.priceArs != null ? `${formatPrice(product.priceArs, 'ARS')} · Precio en pesos argentinos.` : 'Precio de referencia en dólares estadounidenses.'}</p><div className="detail-attributes">{product.capacity && <div><span>{product.category === 'apple-watch' ? 'Tamaño' : product.category === 'accesorios' ? 'Compatible con' : 'Capacidad'}</span><strong>{product.capacity}</strong></div>}<div><span>Color</span><strong className="product-color"><i style={{ backgroundColor: product.colorHex }} />{product.color}</strong></div><div><span>Condición</span><strong>{product.condition}</strong></div>{product.battery != null && <div><span>Salud de batería</span><strong className="detail-battery"><BatteryMedium size={19} />{product.battery}%</strong></div>}</div><p className="stock-status"><span />{product.stock > 0 ? `Disponible · ${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}` : 'Sin stock por el momento'}</p><div className="detail-actions"><WhatsAppButton className="button button-dark detail-whatsapp" message={inquiry}>Consultar por WhatsApp<ArrowRight size={18} /></WhatsAppButton><TradeInButton product={product} className="button button-outline detail-trade-in" /></div><p className="detail-contact-note">Te asesoramos personalmente, sin compromiso.</p><div className="detail-trust"><span><BadgeCheck size={18} /> Garantía MobiGo</span><span><MessagesSquare size={18} /> Atención personalizada</span></div><p className="detail-demo-note">Confirmá precio, estado, stock y condiciones de garantía al consultar.</p></div></div></div>;
}
