import { useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import TradeInModal from './TradeInModal';

export default function TradeInButton({ product, className = 'trade-in-trigger' }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (product.category !== 'iphones') return null;

  return <>
    <button className={className} type="button" onClick={() => setOpen(true)}><RefreshCw size={17} />Plan Canje</button>
    <TradeInModal product={product} open={open} onClose={close} />
  </>;
}
