import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/categories';
import CatalogShowcase from '../components/CatalogShowcase';

export default function Home() {
  return <>
    <Hero />
    <section className="categories-section categories-section-clean container"><div className="category-grid">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</div></section>
    <CatalogShowcase linkTo="/iphones" linkLabel="Ver iPhones" />
  </>;
}
