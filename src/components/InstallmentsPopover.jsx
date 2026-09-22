import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { formatArs, getProductInstallments } from '../lib/pricing';

export default function InstallmentsPopover({ product, exchangeRate, className = '', showRate = false }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const root = useRef(null);
  const trigger = useRef(null);
  const { priceArs, installments } = getProductInstallments(product, exchangeRate);

  useEffect(() => {
    if (!open) return undefined;

    function updatePosition() {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    function onPointerDown(event) {
      if (root.current && !root.current.contains(event.target) && trigger.current && !trigger.current.contains(event.target)) setOpen(false);
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    updatePosition();
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  if (!priceArs || !installments.length) return null;

  const popover = open && createPortal(<div className="installments-layer">
    <button className="installments-backdrop" type="button" aria-label="Cerrar cuotas" onClick={() => setOpen(false)} />
    <div className="installments-popover" ref={root} role="dialog" aria-label="Cuotas disponibles" style={position ? { '--installments-top': `${position.top}px`, '--installments-left': `${position.left}px`, '--installments-width': `${position.width}px` } : undefined}>
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
      <p>{showRate ? `Blue venta: ${formatArs(exchangeRate.sale)}.` : 'Valores calculados según la cotización vigente.'}</p>
    </div>
  </div>, document.body);

  return <div className={`installments-widget ${className}`} ref={root}>
    <button className="installments-trigger" ref={trigger} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      Ver cuotas <ChevronDown size={15} />
    </button>
    {popover}
  </div>;
}
