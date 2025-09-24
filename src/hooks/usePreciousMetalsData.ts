'use client';
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
        try {
            const latestDocRef = doc(db, 'precious_metals', 'latest');
            const latestDoc = await getDoc(latestDocRef);
            const now = new Date();

            if (latestDoc.exists()) {
                const latestData = latestDoc.data();
                const timestamp = latestData.timestamp?.toDate();
                if (timestamp && (now.getTime() - timestamp.getTime() < refreshInterval)) {
                    setData(latestData.data);
                    setLastUpdated(`${latestData.date} ${latestData.time}`);
                    setLoading(false);
                    return;
                }
            }
            
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0];

            try {
                const response = await fetch('/api/fetch-precious-metals');
                if (!response.ok) throw new Error('API response was not ok');
                const fetchedData = await response.json();

                await setDoc(latestDocRef, {
                    data: fetchedData,
                    timestamp: new Date(),
                    date: currentDate,
                    time: currentTime
                });

                const historyDocRef = doc(db, 'precious_metals_history', `${currentDate}_${currentTime.replace(/:/g, '-')}`);
                await setDoc(historyDocRef, {
                    data: fetchedData,
                    timestamp: new Date(),
                    date: currentDate,
                    time: currentTime
                });

                setData(fetchedData);
                setLastUpdated(`${currentDate} ${currentTime}`);

            } catch (apiError) {
                console.error('API Error:', apiError);
                const manualData = getManualData();
                await setDoc(latestDocRef, {
                    data: manualData,
                    timestamp: new Date(),
                    date: currentDate,
                    time: currentTime,
                    isManual: true
                });
                setData(manualData);
                setLastUpdated(`${currentDate} ${currentTime} (Manuel)`);
            }
        } catch (e) {
            console.error('Data fetching error:', e);
            setError(e as Error);
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
        fetchData();
    };

    return { data, loading, error, lastUpdated, refreshData };
}
