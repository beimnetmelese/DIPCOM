import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../utils/api.ts";

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export function useInfiniteApiList<TApi, T>(
  path: string,
  params: Record<string, string | undefined>,
  mapItem: (item: TApi) => T,
) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);
  const requestRef = useRef(0);
  const loadingRef = useRef(false);

  const filterKey = `${path}?${Object.entries(params)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;

  const loadPage = useCallback(async (reset = false) => {
    if (loadingRef.current || (!reset && !hasMore)) return;
    const requestId = ++requestRef.current;
    const nextPage = reset ? 1 : pageRef.current + 1;
    const search = new URLSearchParams({ page: String(nextPage), page_size: "25" });
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    loadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await apiRequest<PaginatedResponse<TApi>>(`${path}?${search}`);
      if (requestId !== requestRef.current) return;
      const mapped = response.results.map(mapItem);
      setItems((previous) => reset ? mapped : [...previous, ...mapped]);
      pageRef.current = nextPage;
      setHasMore(Boolean(response.next));
    } catch (error) {
      console.error(error);
    } finally {
      if (requestId === requestRef.current) {
        loadingRef.current = false;
        setIsLoading(false);
      }
    }
  // params are represented by filterKey, avoiding a new object from rerunning the request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, hasMore, isLoading, mapItem]);

  useEffect(() => {
    // Ignore a response started with the previous search/filter values.
    requestRef.current += 1;
    loadingRef.current = false;
    pageRef.current = 0;
    setHasMore(true);
    setItems([]);
    void loadPage(true);
  }, [filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadPage();
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadPage]);

  return { items, hasMore, isLoading, refresh: () => loadPage(true), sentinelRef };
}
