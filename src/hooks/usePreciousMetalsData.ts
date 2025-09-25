
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { PreciousMetalItem } from '@/lib/types';
import axios from 'axios';

export function usePreciousMetalsData(refreshInterval = 20000) { // 20 saniye
    const [data, setData] = useState<PreciousMetalItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = useCallback(async () => {
        // Sadece ilk yüklemede true yap, sonraki güncellemelerde arayüz titreşmesin
        if (data.length === 0) {
            setLoading(true);
        }
        
        try {
            const response = await axios.get('/api/fetch-precious-metals');
            if (response.data) {
                setData(response.data);
                setLastUpdated(new Date().toLocaleString());
            }
            setError(null);
        } catch (e) {
            console.error('Data fetching error:', e);
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [data.length]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, refreshInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, refreshInterval]);

    const refreshData = () => {
        fetchData();
    };

    return { data, loading, error, lastUpdated, refreshData };
}
