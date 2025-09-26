'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { Asset, AssetSymbol } from '@/lib/types';


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
const parseNumber = (str: string): number => {
    if (!str || typeof str !== 'string') return 0;
    // Replaces dots used as thousand separators, then replaces comma decimal with a dot
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
};

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

        // Process Metals Data (index 0)
        const metalsResult = results[0];
        if (metalsResult.status === 'fulfilled' && Array.isArray(metalsResult.value)) {
            fetchSucceeded = true;
            metalsResult.value.forEach((item: any) => {
                const symbol = item['Ürün']; // The key from Firestore data
                if (symbol) {
                     const buyPrice = parseNumber(item['Alış']);
                     const sellPrice = parseNumber(item['Satış']);
                     
                     let change24h = 0;
                     if(buyPrice > 0){
                        change24h = ((sellPrice - buyPrice) / buyPrice) * 100;
                     }

                    combinedAssets[symbol] = {
                        symbol: symbol as AssetSymbol,
                        buyPrice: buyPrice,
                        sellPrice: sellPrice,
                        change24h: isFinite(change24h) ? change24h : 0,
                    };
                }
            });
        } else {
             partialFailure = true;
             const reason = metalsResult.status === 'rejected' ? (metalsResult.reason as Error).message : 'Invalid data format';
             errorMessages.push(`Precious Metals API: ${reason}`);
             console.error('Precious Metals fetch failed:', reason);
        }

        // Process Crypto Data (index 1)
        const cryptoResult = results[1];
        if (cryptoResult.status === 'fulfilled' && typeof cryptoResult.value === 'object' && cryptoResult.value !== null && !cryptoResult.value.error) {
             fetchSucceeded = true;
             Object.keys(cryptoResult.value).forEach(symbol => {
                const cryptoData = cryptoResult.value[symbol];
                 combinedAssets[symbol] = {
                    symbol: symbol as AssetSymbol,
                    price: cryptoData.price,
                    change24h: cryptoData.change24h
                 }
             });
        } else {
            partialFailure = true;
            const reason = cryptoResult.status === 'rejected' ? (cryptoResult.reason as Error).message : (cryptoResult.value?.error || 'Unknown error');
            errorMessages.push(`Crypto API: ${reason}`);
            console.error('Crypto fetch failed:', reason);
        }


        if(fetchSucceeded){
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
