
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

    const fetchData = useCallback(async (url: string, isInitialLoad: boolean) => {
        // Only show loader on the very first load or manual refresh
        if (isInitialLoad) setLoading(true);
        try {
            const response = await axios.get(url);
            if (response.data && Object.keys(response.data).length > 0) {
                setLiveAssets(prevAssets => ({ ...prevAssets, ...response.data }));
                setLastUpdated(new Date().toLocaleString());
                setError(null); // Clear error on successful fetch
            } else {
                 throw new Error("Received empty data from API");
            }
        } catch (e: any) {
            console.error(`Data fetching error from ${url}:`, e);
            // Don't overwrite existing data if a fetch fails, just show an error.
            setError(`Failed to load data. Please try again. (${e.message})`);
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, []);

    const fetchAllData = useCallback((isInitial: boolean) => {
        // Reset loading state for feedback on manual refresh
        if (!isInitial) {
             setLoading(true);
        }
        Promise.all([
            fetchData('/api/prices/metals', isInitial),
            fetchData('/api/prices/crypto', isInitial),
        ]).finally(() => {
            // Ensure loading is false after all fetches are settled, especially for manual refresh
            if (!isInitial) {
                setLoading(false);
            }
        });
    }, [fetchData]);

    // Initial fetch for both on component mount
    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);


    const refreshData = () => {
        // This is the manual refresh action triggered by the button
        fetchAllData(false);
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
