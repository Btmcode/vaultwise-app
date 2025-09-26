
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

type LiveAssetData = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
    price?: number; // for crypto if ever needed
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
    if (price === null || price === undefined) return 0;
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        // Handles both "1.234,56" and "1234.56"
        const num = parseFloat(price.replace(/\./g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
    }
    return 0;
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
                // The symbol is the 'Urun' field from Firestore
                const symbol = item.Urun; 
                if (!symbol) return;
                
                const buyPrice = parsePrice(item.Alis);
                const sellPrice = parsePrice(item.Satis);
                const change24h = parsePrice(item.DegisimYuzde);

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
        const interval = setInterval(fetchAllData, 60000); // Auto-refresh every 60 seconds
        return () => clearInterval(interval);
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
