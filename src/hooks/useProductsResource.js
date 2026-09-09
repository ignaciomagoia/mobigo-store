import { useEffect, useState } from 'react';

// Cada cambio de consulta cancela la petición anterior. El identificador del
// loader evita mostrar por un instante el producto anterior al cambiar de ruta.
export default function useProductsResource(loader) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loader: null, data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loader, data: null, loading: true, error: null });
    Promise.resolve().then(() => loader({ signal: controller.signal }))
      .then((data) => {
        if (!controller.signal.aborted) setState({ loader, data, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ loader, data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [loader, attempt]);

  const result = state.loader === loader ? state : { data: null, loading: true, error: null };
  return { ...result, retry: () => setAttempt((value) => value + 1) };
}
