
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { AssetSymbol } from '@/lib/types';

// This type represents the structure of the data after being processed
// It aligns with what the components expect.
type LiveAssetData = {
    symbol: AssetSymbol;
    buyPrice?: number;
    sellPrice?: number;
    price?: number; // For crypto
    change24h: number;
};

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

// Function to parse numeric values from string, handling different decimal formats
const parseNumber = (str: string | number): number => {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return 0;
    // Replaces dots used as thousand separators, then replaces comma decimal with a dot
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
};

export function LivePricesProvider({ children }: ProviderProps) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchAllData = useCallback(async (isInitial: boolean) => {
        if (isInitial) {
            setLoading(true);
        }
        setError(null);
        
        try {
            const response = await fetch('/api/fetch-precious-metals', { cache: 'no-store'});
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({error: `Request failed with status ${response.status}`}));
                throw new Error(errorBody.error || `Request failed`);
            }
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                 throw new Error("Invalid data format received from API.");
            }

            const processedAssets: Record<string, LiveAssetData> = {};
            data.forEach((item: any) => {
                const symbol = item['name'];
                const buyPrice = parseNumber(item['public_bid']);
                const sellPrice = parseNumber(item['public_ask']);
                
                if (symbol && buyPrice > 0 && sellPrice > 0) {
                     const change24h = ((sellPrice - buyPrice) / buyPrice) * 100;
                     processedAssets[symbol] = {
                        symbol: symbol as AssetSymbol,
                        buyPrice,
                        sellPrice,
                        change24h: isFinite(change24h) ? change24h : 0,
                    };
                }
            });
            
            setLiveAssets(processedAssets);
            setLastUpdated(new Date().toLocaleString());

        } catch (e: any) {
            console.error(`Data fetching error:`, e.message);
            setError(`Failed to load price data. Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }, []);


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
