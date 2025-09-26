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
                const errorBody = await response.json().catch(() => ({error: `Request to ${url} failed with status ${response.status}`}));
                throw new Error(errorBody.error || `Request to ${url} failed`);
            }
            return await response.json();
        } catch (e: any) {
            console.error(`Data fetching error from ${url}:`, e.message);
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

        let combinedAssets: Record<string, LiveAssetData> = {};
        let fetchSucceeded = false;
        let partialFailure = false;
        let errorMessages: string[] = [];

        results.forEach((res, index) => {
             const apiName = index === 0 ? 'Precious Metals' : 'Crypto';
            if (res.status === 'fulfilled' && res.value && !res.value.error) {
                combinedAssets = { ...combinedAssets, ...res.value };
                fetchSucceeded = true;
            } else {
                partialFailure = true;
                const reason = res.status === 'rejected' ? res.reason?.message : res.value?.error;
                errorMessages.push(`${apiName} API: ${reason || 'Unknown error'}`);
                console.error(`${apiName} fetch failed:`, reason);
            }
        });

        if(fetchSucceeded){
            // Ensure every item has a symbol property, as our components expect it.
            Object.keys(combinedAssets).forEach(key => {
              if(!combinedAssets[key].symbol) {
                combinedAssets[key].symbol = key as any;
              }
            });
            setLiveAssets(combinedAssets);
            setLastUpdated(new Date().toLocaleString());
            if (partialFailure) {
                 setError(`Failed to load some price data. Displayed data might be incomplete. Errors: ${errorMessages.join(', ')}`);
            } else {
                 setError(null);
            }
        } else {
            setError(`Failed to load all price data. Errors: ${errorMessages.join(', ')}`);
        }

        setLoading(false);
    }, [fetchData]);


    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);

    const refreshData = useCallback(() => {
        if (loading) return;
        setLoading(true);
        fetchAllData(false).finally(() => setLoading(false));
    }, [fetchAllData, loading]);

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
