
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Asset } from '@/lib/types';
import axios from 'axios';

type LiveAssetData = Omit<Asset, 'name'>;

export function useLivePrices(refreshInterval = 20000) { // 20 saniye
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = useCallback(async () => {
        // Sadece ilk yüklemede true yap, sonraki güncellemelerde arayüz titreşmesin
        if (Object.keys(liveAssets).length === 0) {
            setLoading(true);
        }
        
        try {
            const response = await axios.get('/api/prices');
            if (response.data) {
                setLiveAssets(response.data);
                setLastUpdated(new Date().toLocaleString());
            }
            setError(null);
        } catch (e) {
            console.error('Data fetching error:', e);
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [liveAssets]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, refreshInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, refreshInterval]);

    const refreshData = () => {
        fetchData();
    };

    return { liveAssets, loading, error, lastUpdated, refreshData };
}
