
'use client';
import { useState, useEffect, useCallback } from 'react';

type LiveAssetData = {
    symbol: string;
    buyPrice?: number;
    sellPrice?: number;
    change24h: number;
    price?: number; 
};

export function useLivePricesForLanding() {
    const [liveAssets, setLiveAssets] = useState<Record<string, LiveAssetData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        // Don't set loading to true on subsequent fetches to avoid flicker
        // setLoading(true); 
        setError(null);
        
        try {
            // In a real app, you might want a dedicated, unauthenticated endpoint for the landing page.
            // For now, we use the existing ones.
            const [metalsResponse, cryptoResponse] = await Promise.all([
                fetch('/api/prices/metals', { cache: 'no-store'}),
                fetch('/api/prices/crypto', { cache: 'no-store'})
            ]);
            
            if (!metalsResponse.ok || !cryptoResponse.ok) {
                // Combine error messages if possible
                const metalError = metalsResponse.statusText;
                const cryptoError = cryptoResponse.statusText;
                throw new Error(`Failed to fetch price data. Metals: ${metalError}, Crypto: ${cryptoError}`);
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
                    buyPrice: cryptoData[symbol].price,
                    sellPrice: cryptoData[symbol].price,
                    change24h: cryptoData[symbol].change24h
                 }
            });
            
            setLiveAssets(processedAssets);

        } catch (e: any) {
            console.error(`Landing page data fetching error:`, e.message);
            setError(`Canlı fiyat verileri şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
         const interval = setInterval(fetchAllData, 60000); // Auto-refresh every 60 seconds
        return () => clearInterval(interval);
    }, [fetchAllData]);

    return { liveAssets, loading, error };
}
