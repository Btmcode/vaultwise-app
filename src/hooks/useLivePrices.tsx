
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
    return parseFloat(str.toString().replace(/,/g, '.'));
};

export function LivePricesProvider({ children }: ProviderProps) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchAllData = useCallback(async () => {
        setLoading(true);
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
                // The API now returns "Ürün" for the symbol/name
                const symbol = item['Ürün'];
                // Use the correct keys from the Firestore data structure
                const buyPrice = parseNumber(item['public_ask']);
                const sellPrice = parseNumber(item['public_bid']);
                const change24h = parseFloat(item['Değişim'] || '0');

                if (symbol) {
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
        fetchAllData();
    }, [fetchAllData]);

    const refreshData = useCallback(() => {
        if (loading) return;
        fetchAllData();
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
