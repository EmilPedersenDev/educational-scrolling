import { useCallback, useEffect, useRef, useState } from 'react';
import { DailyContent, supabase } from '../lib/supabase';

const COLUMNS = 'id,date,title,content,read_more_link,created_at';

export function useDailyContent(iso: string) {
  const cache = useRef<Record<string, DailyContent[]>>({});
  const [items, setItems] = useState<DailyContent[]>(cache.current[iso] ?? []);
  const [loading, setLoading] = useState(!cache.current[iso]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (date: string, { bypassCache = false } = {}) => {
    if (!bypassCache && cache.current[date]) {
      setItems(cache.current[date]);
      setLoading(false);
      setError(null);
      return;
    }

    setError(null);
    if (bypassCache) setRefreshing(true);
    else setLoading(true);

    const { data, error: queryError } = await supabase
      .from('daily_content')
      .select(COLUMNS)
      .eq('date', date)
      .order('id', { ascending: true });

    if (queryError) {
      setError(queryError.message);
    } else {
      cache.current[date] = data ?? [];
      setItems(data ?? []);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load(iso);
  }, [iso, load]);

  return {
    items,
    loading,
    refreshing,
    error,
    refresh: () => load(iso, { bypassCache: true }),
    retry: () => load(iso, { bypassCache: true }),
  };
}
