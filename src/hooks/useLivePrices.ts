
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { Asset } from '@/lib/types';
import axios from 'axios';

type LiveAssetData = Omit<Asset, 'name'>;

interface LivePricesContextType {
    liveAssets: Record<string, LiveAssetData>;
    loading: boolean;
    error: string | null;
    lastUpdated: string;
    refreshData: () => void;
}

const LivePricesContext = createContext<LivePricesContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
    metalsInterval?: number;
    cryptoInterval?: number;
}

export function LivePricesProvider({ children, metalsInterval = 20000, cryptoInterval = 90000 }: ProviderProps) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = useCallback(async (url: string, isInitialLoad: boolean) => {
        if (isInitialLoad) setLoading(true);
        try {
            const response = await axios.get(url);
            if (response.data) {
                setLiveAssets(prevAssets => ({ ...prevAssets, ...response.data }));
                setLastUpdated(new Date().toLocaleString());
                setError(null); // Clear error on successful fetch
            }
        } catch (e: any) {
            console.error(`Data fetching error from ${url}:`, e);
            setError(`Failed to load data from ${url}. ${e.message}`);
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, []);

    const fetchAllData = useCallback((isInitial: boolean) => {
        fetchData('/api/prices/metals', isInitial);
        fetchData('/api/prices/crypto', isInitial);
    }, [fetchData]);

    // Initial fetch for both
    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);

    // Interval for metals
    useEffect(() => {
        const intervalId = setInterval(() => fetchData('/api/prices/metals', false), metalsInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, metalsInterval]);

    // Interval for crypto
    useEffect(() => {
        const intervalId = setInterval(() => fetchData('/api/prices/crypto', false), cryptoInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, cryptoInterval]);

    const refreshData = () => {
        // Reset loading state to give user feedback
        setLoading(true);
        fetchAllData(true);
    };

    const value = { liveAssets, loading, error, lastUpdated, refreshData };

    return (
        <LivePricesContext.Provider value={value}>
            {children}
        </LivePricesContext.Provider>
    );
}

export function useLivePrices() {
    const context = useContext(LivePricesContext);
    if (context === undefined) {
        throw new Error('useLivePrices must be used within a LivePricesProvider');
    }
    return context;
}
