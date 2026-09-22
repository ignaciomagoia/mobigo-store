import { useEffect, useState } from 'react';
import { getBlueDollarRate } from '../services/exchangeRate';

export default function useExchangeRate({ enabled = true } = {}) {
  const [state, setState] = useState({ rate: null, loading: enabled, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ rate: null, loading: false, error: null });
      return undefined;
    }

    let mounted = true;
    setState((current) => ({ ...current, loading: !current.rate, error: null }));

    getBlueDollarRate()
      .then((rate) => {
        if (mounted) setState({ rate, loading: false, error: null });
      })
      .catch((error) => {
        if (mounted) setState({ rate: null, loading: false, error });
      });

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return state;
}
