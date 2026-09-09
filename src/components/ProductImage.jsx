const fallback = '/images/products/placeholder.svg';

export default function ProductImage({ src, alt, ...props }) {
  return <img {...props} src={src || fallback} alt={alt} onError={(event) => {
    const img = event.currentTarget;
    if (!img.src.endsWith(fallback)) img.src = fallback;
  }} />;
}
