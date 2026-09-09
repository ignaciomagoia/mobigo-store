import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import { ContactProvider } from './components/ContactProvider';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { categories } from './data/categories';

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const category = categories.find((c) => pathname === `/${c.id}`);
    if (!pathname.startsWith('/producto/')) document.title = `${category?.name || (pathname === '/contacto' ? 'Contacto' : 'Tu próximo upgrade')} · MobiGo Store`;
  }, [pathname]);
  return null;
}

export default function App() {
  return <ContactProvider><RouteEffects /><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido"><Routes><Route path="/" element={<Home />} /><Route path="/catalogo" element={<Catalog />} />{categories.map((category) => <Route key={category.id} path={`/${category.id}`} element={<Catalog key={category.id} categoryId={category.id} />} />)}<Route path="/producto/:id" element={<ProductDetail />} /><Route path="/contacto" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /></ContactProvider>;
}
