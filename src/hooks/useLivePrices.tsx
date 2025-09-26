
'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

// Bu tip, verinin işlendikten sonraki yapısını temsil eder
// ve bileşenlerin beklentileriyle uyumludur.
type LiveAssetData = {
    symbol: string;
    buyPrice?: number;
    sellPrice?: number;
    price?: number; // Kripto için
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

// String'den sayısal değerleri ayrıştıran fonksiyon, farklı ondalık formatlarını ele alır
const parseNumber = (str: string | number | undefined): number => {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return 0;
    // Firestore'dan gelen "1,234.56" gibi formatlar yerine "1234.56" formatını kabul eder
    return parseFloat(str.replace(/,/g, ''));
};

// Değişimi hesaplayan fonksiyon
const calculateChange = (item: any): number => {
    if (item && item.forex && item.forex.lastOpen && item.forex.lastClose) {
        const lastOpen = parseNumber(item.forex.lastOpen);
        const lastClose = parseNumber(item.forex.lastClose);
        if (lastOpen > 0) {
            return ((lastClose - lastOpen) / lastOpen) * 100;
        }
    }
    // Veri eksikse geri dönüş değeri
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
                // `item.name` alanını sembol olarak kullan
                const symbol = item.name;

                // Doğru fiyatları `forex.groups` içinden al
                const buyPrice = item.forex?.groups?.[0]?.bid ? parseNumber(item.forex.groups[0].bid) : 0;
                const sellPrice = item.forex?.groups?.[0]?.ask ? parseNumber(item.forex.groups[0].ask) : 0;
                
                // Değişimi `forex.lastOpen` ve `forex.lastClose` ile hesapla
                const change24h = calculateChange(item);

                if (symbol) {
                     processedAssets[symbol] = {
                        symbol: symbol,
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
