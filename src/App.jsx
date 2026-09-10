import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import { ContactProvider } from './components/ContactProvider';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import { categories } from './data/categories';

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const category = categories.find((c) => pathname === `/${c.id}`);
    if (pathname.startsWith('/admin')) document.title = 'Admin · MobiGo Store';
    else if (!pathname.startsWith('/producto/')) document.title = `${category?.name || (pathname === '/contacto' ? 'Contacto' : 'Tu próximo upgrade')} · MobiGo Store`;
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return <ContactProvider><RouteEffects /><a className="skip-link" href="#contenido">Saltar al contenido</a>{!isAdmin && <Header />}<main id="contenido" className={isAdmin ? 'admin-main' : ''}><Routes><Route path="/" element={<Home />} /><Route path="/catalogo" element={<Catalog />} />{categories.map((category) => <Route key={category.id} path={`/${category.id}`} element={<Catalog key={category.id} categoryId={category.id} />} />)}<Route path="/producto/:id" element={<ProductDetail />} /><Route path="/contacto" element={<Contact />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin" element={<ProtectedAdminRoute />}><Route element={<AdminLayout />}><Route index element={<AdminDashboard />} /><Route path="productos" element={<AdminProducts />} /><Route path="productos/nuevo" element={<AdminProductFormPage />} /><Route path="productos/:id/editar" element={<AdminProductFormPage />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes></main>{!isAdmin && <Footer />}</ContactProvider>;
}
