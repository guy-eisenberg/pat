import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useLoadingScreen from './useLoadingScreen';

function useQuery<T = any, D = T>(
  func: () => Promise<T>,
  defaultValue: D,
  ...dep: any
): { data: T | D; invalidate: () => void } {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState<T | D>(defaultValue);

  const funcMemo = useRef(func);

  const invalidate = useCallback(() => {
    setLoading(true);
    funcMemo
      .current()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    funcMemo.current = func;
  }, [dep, func]);

  useEffect(() => {
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dep]);

  const errorMessage = useMemo(() => {
    if (data === 'Unauthorized')
      return 'You have been logged out, most probably due to inactivity.';
  }, [data]);

  useLoadingScreen(loading, errorMessage || error);

  return { data, invalidate };
}

export default useQuery;
