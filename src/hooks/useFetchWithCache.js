import { useState, useEffect, useCallback, useRef } from "react";

const cacheMap = new Map();

const useFetchWithCache = (url) => {
    const [data, setData] = useState(() => (url ? cacheMap.get(url) : null) || null);
    const [loading, setLoading] = useState(url ? !cacheMap.has(url) : false);
    const [error, setError] = useState(null);

    const abortControllerRef = useRef(null);

    const fetchData = useCallback(
        async (bypassCache = false) => {
            if (!url) {
                setLoading(false);
                return;
            }

            // Check cache first (unless bypassing) to avoid unnecessary network requests
            if (!bypassCache && cacheMap.has(url)) {
                setData(cacheMap.get(url));
                setLoading(false);
                setError(null);
                return;
            }

            if (bypassCache) {
                cacheMap.delete(url);
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); // cancel any ongoing request
            }
            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, {
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                cacheMap.set(url, result);
                setData(result);
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        },
        [url]
    );

    const refetch = useCallback(() => fetchData(true), [fetchData]);

    useEffect(() => {
        fetchData();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    return { data, loading, error, refetch };
};

export default useFetchWithCache;
