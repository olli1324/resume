import { useEffect, useState, useCallback } from 'react';
import { listOrdered, getSingleton, listSections } from '../lib/api';

export function useList(table, { onlyVisible = false } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listOrdered(table, { onlyVisible });
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [table, onlyVisible]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}

export function useSingleton(table) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const row = await getSingleton(table);
      setData(row);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useSections({ onlyVisible = false } = {}) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listSections({ onlyVisible });
      setSections(data);
    } finally {
      setLoading(false);
    }
  }, [onlyVisible]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sections, loading, refresh };
}
