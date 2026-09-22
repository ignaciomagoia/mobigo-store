import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { formatArs, getProductInstallments } from '../lib/pricing';

export default function InstallmentsPopover({ product, exchangeRate, className = '', showRate = false }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const { priceArs, installments } = getProductInstallments(product, exchangeRate);

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (root.current && !root.current.contains(event.target)) setOpen(false);
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!priceArs || !installments.length) return null;

  return <div className={`installments-widget ${className}`} ref={root}>
    <button className="installments-trigger" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      Ver cuotas <ChevronDown size={15} />
    </button>
    {open && <div className="installments-popover" role="dialog" aria-label="Cuotas disponibles">
      <div className="installments-head">
        <span>CUOTAS</span>
        <button className="icon-button" type="button" aria-label="Cerrar cuotas" onClick={() => setOpen(false)}><X size={16} /></button>
      </div>
      <ul>
        {installments.map((item) => <li key={item.quantity}>
          <span>{item.quantity} {item.quantity === 1 ? 'cuota' : 'cuotas'}</span>
          <strong>{formatArs(item.amount)}</strong>
        </li>)}
      </ul>
      {showRate && <p>Blue venta: {formatArs(exchangeRate.sale)}</p>}
    </div>}
  </div>;
}
