'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { Asset } from '@/lib/types';

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
            const response = await fetch(url, { cache: 'no-store'});
            if (!response.ok) {
                throw new Error(`Request to ${url} failed with status ${response.status}`);
            }
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                 // On success, clear any previous error and update assets
                return data;
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
        }
        setError(null);
        
        const results = await Promise.allSettled([
            fetchData('/api/fetch-precious-metals'),
            fetchData('/api/prices/crypto'),
        ]);

        const successfulResults = results
            .filter(res => res.status === 'fulfilled')
            .map(res => (res as PromiseFulfilledResult<any>).value);

        if(successfulResults.length > 0){
            const combinedAssets = successfulResults.reduce((acc, current) => ({ ...acc, ...current }), {});
            setLiveAssets(prev => ({...prev, ...combinedAssets}));
            setLastUpdated(new Date().toLocaleString());
            setError(null); // Clear previous errors on partial success
        }

        const allFailed = results.every(res => res.status === 'rejected');
        if (allFailed) {
            const firstError = results[0] as PromiseRejectedResult;
            setError(`Failed to load all price data. Please try again. (${firstError.reason?.message})`);
        } else if (results.some(res => res.status === 'rejected')) {
             setError(`Failed to load some price data. Displayed data might be incomplete.`);
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
