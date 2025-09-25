
'use client';
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { PreciousMetalItem } from '@/lib/types';

export function usePreciousMetalsData(refreshInterval = 300000) { // 5 dakika
    const [data, setData] = useState<PreciousMetalItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const getManualData = (): PreciousMetalItem[] => {
        return [
            { "Ürün": "HAS ALTIN", "Değişim": -1.38, "Alış": 5090.180, "Satış": 5111.977 },
            { "Ürün": "Altın/ONS", "Değişim": -1.25, "Alış": 3816.65, "Satış": 3826.72 },
            { "Ürün": "USD/KG", "Değişim": -1.25, "Alış": 122095, "Satış": 122417 },
            { "Ürün": "EUR/KG", "Değişim": -0.68, "Alış": 104168, "Satış": 104612 },
            { "Ürün": "GÜM/ONS", "Değişim": -0.59, "Alış": 43.940, "Satış": 44.280 },
            { "Ürün": "GÜM/TL", "Değişim": -0.70, "Alış": 58614, "Satış": 59167 },
            { "Ürün": "GÜM/USD", "Değişim": -0.56, "Alış": 1413, "Satış": 1424 },
            { "Ürün": "GÜM/EUR", "Değişim": 0.00, "Alış": 1206, "Satış": 1217 }
        ];
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Check if db is properly initialized. If not, Firebase config is likely missing.
            if (!db || typeof db.INTERNAL === 'undefined') {
                throw new Error("Firestore is not initialized. Check your Firebase config.");
            }

            // 1. Check Firestore cache first
            const latestDocRef = doc(db, 'precious_metals', 'latest');
            const latestDoc = await getDoc(latestDocRef);
            const now = new Date();

            if (latestDoc.exists()) {
                const latestData = latestDoc.data();
                const timestamp = latestData.timestamp?.toDate();
                // If data is fresh (less than interval time), use it from cache
                if (timestamp && (now.getTime() - timestamp.getTime() < refreshInterval)) {
                    setData(latestData.data);
                    setLastUpdated(latestData.time ? `${latestData.date} ${latestData.time}` : new Date(timestamp).toLocaleString());
                    setLoading(false);
                    return;
                }
            }

            // 2. If cache is old or doesn't exist, fetch from our API endpoint
            const response = await fetch('/api/fetch-precious-metals');
            if (!response.ok) {
                // The API route itself will handle errors and return manual data if needed
                const errorData = await response.json().catch(() => ({error: 'API response was not ok and not valid JSON'}));
                throw new Error(errorData.error || 'API response was not ok');
            }
            
            const fetchedData = await response.json();
            
            // In a real app, the API route would be responsible for writing to Firestore.
            // The client-side hook just fetches the result.
            setData(fetchedData);
            setLastUpdated(new Date().toLocaleString());

        } catch (e) {
            console.error('Data fetching error:', e);
            setError(e as Error);
            // In case of a total failure (e.g., API route down), use manual data as a last resort
            setData(getManualData());
            setLastUpdated(new Date().toLocaleString() + ' (Hata)');
        } finally {
            setLoading(false);
        }
    }, [refreshInterval]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, refreshInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, refreshInterval]);

    const refreshData = () => {
        // Invalidate cache by forcing a new fetch
        fetchData();
    };

    return { data, loading, error, lastUpdated, refreshData };
}
