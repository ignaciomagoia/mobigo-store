import ProductCard from './ProductCard';

export default function ProductGrid({ products, exchangeRate }) {
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} exchangeRate={exchangeRate} />)}</div>;
}
