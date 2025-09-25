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
}

export function LivePricesProvider({ children }: ProviderProps) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = useCallback(async (url: string) => {
        try {
            const response = await axios.get(url);
            if (response.data && Object.keys(response.data).length > 0) {
                 // On success, clear any previous error and update assets
                setError(null);
                setLiveAssets(prevAssets => ({ ...prevAssets, ...response.data }));
            } else {
                 throw new Error(`Received empty data from ${url}`);
            }
        } catch (e: any) {
            console.error(`Data fetching error from ${url}:`, e.message);
            // Re-throw to be caught by Promise.allSettled and handled there
            throw e;
        }
    }, []);

    const fetchAllData = useCallback(async (isInitial: boolean) => {
        if (isInitial) {
            setLoading(true);
        } else {
            // For manual refresh, clear old errors
            setError(null);
        }
        
        const results = await Promise.allSettled([
            fetchData('/api/prices/metals'),
            fetchData('/api/prices/crypto'),
        ]);

        const isAnySuccess = results.some(res => res.status === 'fulfilled');
        const allFailed = results.every(res => res.status === 'rejected');

        if(isAnySuccess){
            setLastUpdated(new Date().toLocaleString());
        }

        if (allFailed) {
            const firstError = results[0] as PromiseRejectedResult;
            setError(`Failed to load all price data. Please try again. (${firstError.reason?.message})`);
        }

        if (isInitial) {
            setLoading(false);
        }
    }, [fetchData]);


    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);

    const refreshData = useCallback(() => {
        setLoading(true);
        fetchAllData(false).finally(() => setLoading(false));
    }, [fetchAllData]);

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
