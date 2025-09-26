
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

type LiveAssetData = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
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

const parsePrice = (price: string | number | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        // Handles formats like "1,234.56" and "1234.56"
        return parseFloat(price.replace(/,/g, ''));
    }
    return 0;
};

const calculateChange = (forex: any): number => {
    if (forex && forex.lastOpen && forex.lastClose) {
        const lastOpen = parsePrice(forex.lastOpen);
        const lastClose = parsePrice(forex.lastClose);
        if (lastOpen > 0) {
            const change = ((lastClose - lastOpen) / lastOpen) * 100;
            return isFinite(change) ? change : 0;
        }
    }
    return 0;
}

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
                const symbol = item['Ürün'] || item.name;
                if (!symbol) return;
                
                // Safely access nested group data with optional chaining and provide a fallback
                const group = item.forex?.groups?.[0];
                const buyPrice = group ? parsePrice(group.bid) : parsePrice(item.public_bid);
                const sellPrice = group ? parsePrice(group.ask) : parsePrice(item.public_ask);
                const change24h = calculateChange(item.forex);

                processedAssets[symbol] = {
                    symbol: symbol,
                    buyPrice,
                    sellPrice,
                    change24h,
                };
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
        fetchAllData();
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
