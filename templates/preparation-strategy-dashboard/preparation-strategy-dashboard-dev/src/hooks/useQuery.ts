import { useEffect, useMemo, useRef, useState } from 'react';
import useLoadingScreen from './useLoadingScreen';

function useQuery<T = any, D = T>(
  func: () => Promise<T>,
  defaultValue: D,
  ...dep: any
): { data: T | D; loading: boolean } {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState<T | D>(defaultValue);

  const funcMemo = useRef(func);

  useEffect(() => {
    funcMemo.current = func;
  }, [dep, func]);

  useEffect(() => {
    setLoading(true);
    funcMemo
      .current()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dep]);

  const errorMessage = useMemo(() => {
    if (data === 'Unauthorized')
      return 'You have been logged out, most probably due to inactivity.';
  }, [data]);

  useLoadingScreen(loading, errorMessage || error);

  return { data, loading };
}

export default useQuery;
