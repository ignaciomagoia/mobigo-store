import { Link } from 'react-router';
import { store } from '../config/store';

export default function Brand({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="MobiGo Store, inicio">
    {store.logo ? <img src={store.logo} alt="MobiGo Store" /> : <><span className="brand-name">Mobi<span>Go</span><i /></span><span className="brand-caption">STORE</span></>}
  </Link>;
}
