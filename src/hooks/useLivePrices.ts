
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { Asset } from '@/lib/types';
import axios from 'axios';

type LiveAssetData = Omit<Asset, 'name'>;

interface LivePricesContextType {
    liveAssets: Record<string, LiveAssetData>;
    loading: boolean;
    error: Error | null;
    lastUpdated: string;
    refreshData: () => void;
}

// 1. Create a context with a default undefined value
const LivePricesContext = createContext<LivePricesContextType | undefined>(undefined);

// 2. Create a provider component
export function LivePricesProvider({ children, refreshInterval = 60000 }: { children: ReactNode, refreshInterval?: number }) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad) {
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
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        // Fetch immediately on mount
        fetchData(true);
        // Then set up the interval
        const intervalId = setInterval(() => fetchData(false), refreshInterval);
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [fetchData, refreshInterval]);

    const refreshData = () => {
        fetchData(false);
    };

    const value = { liveAssets, loading, error, lastUpdated, refreshData };

    return (
        <LivePricesContext.Provider value={value}>
            {children}
        </LivePricesContext.Provider>
    );
}

// 3. Create a custom hook to use the context
export function useLivePrices() {
    const context = useContext(LivePricesContext);
    if (context === undefined) {
        throw new Error('useLivePrices must be used within a LivePricesProvider');
    }
    return context;
}
