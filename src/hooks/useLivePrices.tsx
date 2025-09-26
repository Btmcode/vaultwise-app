
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

type LiveAssetData = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
    price?: number; 
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

export function LivePricesProvider({ children }: ProviderProps) {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [metalsResponse, cryptoResponse] = await Promise.all([
                fetch('/api/prices/metals', { cache: 'no-store'}),
                fetch('/api/prices/crypto', { cache: 'no-store'})
            ]);
            
            if (!metalsResponse.ok) {
                const errorBody = await metalsResponse.json().catch(() => ({error: `Metals request failed with status ${metalsResponse.status}`}));
                throw new Error(errorBody.error || `Metals request failed`);
            }
             if (!cryptoResponse.ok) {
                const errorBody = await cryptoResponse.json().catch(() => ({error: `Crypto request failed with status ${cryptoResponse.status}`}));
                throw new Error(errorBody.error || `Crypto request failed`);
            }

            const metalsData = await metalsResponse.json();
            const cryptoData = await cryptoResponse.json();

            const processedAssets: Record<string, LiveAssetData> = {};
            
            Object.keys(metalsData).forEach(symbol => {
                 processedAssets[symbol] = {
                    symbol: symbol,
                    buyPrice: metalsData[symbol].buyPrice,
                    sellPrice: metalsData[symbol].sellPrice,
                    change24h: metalsData[symbol].change24h,
                 }
            });

            Object.keys(cryptoData).forEach(symbol => {
                 processedAssets[symbol] = {
                    symbol: symbol,
                    price: cryptoData[symbol].price,
                    buyPrice: cryptoData[symbol].price, // Use price for buy/sell
                    sellPrice: cryptoData[symbol].price,
                    change24h: cryptoData[symbol].change24h
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
