import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

export default function CategoryCard({ category }) {
  return <Link to={`/${category.id}`} className={`category-card category-${category.theme}`}>
    <span className="category-copy"><h3>{category.name}</h3><span>{category.subtitle}</span></span>
    <img src={category.image} alt={category.name} loading="lazy" />
    <span className="category-arrow"><ArrowUpRight size={20} /></span>
  </Link>;
}
