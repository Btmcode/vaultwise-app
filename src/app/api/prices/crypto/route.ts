import { NextResponse } from 'next/server';
import type { LiveAssetData } from '@/lib/types';

// Store the previous results to calculate the change
let previousPrices: Map<string, number> = new Map();

async function fetchAndProcessPrices(): Promise<LiveAssetData[]> {
    const allProducts: LiveAssetData[] = [];
    const productNameToAssetDetails: Record<string, { symbol: LiveAssetData['symbol']; displayOrder: number }> = {
        'HAS ALTIN': { symbol: 'XAU', displayOrder: 1 },
        'Altın/ONS': { symbol: 'XAU_ONS', displayOrder: 2 },
        'USD/KG': { symbol: 'XAU_USD_KG', displayOrder: 3 },
        'EUR/KG': { symbol: 'XAU_EUR_KG', displayOrder: 4 },
        'GÜM/ONS': { symbol: 'XAG_ONS', displayOrder: 5 },
        'GÜM/TL': { symbol: 'XAG_TL', displayOrder: 6 },
        'GÜM/USD': { symbol: 'XAG_USD', displayOrder: 7 },
        'GÜM/EUR': { symbol: 'XAG_EUR', displayOrder: 8 },
    };

    const currentPrices = new Map<string, number>();

    for (const tabGroupId of [1, 2]) {
        // Adding a cache-busting query parameter
        const url = `https://saglamoglualtin.com/component/tab-group/${tabGroupId}?t=${new Date().getTime()}`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Referer": "https://saglamoglualtin.com/",
            "X-Requested-With": "XMLHttpRequest"
        };
        try {
            // Using `cache: 'no-store'` is crucial to prevent Next.js from caching the fetch request
            const response = await fetch(url, { headers, cache: 'no-store' });
            if (!response.ok) {
                 console.error(`Failed to fetch tab group ${tabGroupId} with status: ${response.status}`);
                 continue;
            }
            const data = await response.json();
            
            for (const tab of data?.tabGroup?.tabs || []) {
                for (const prod of tab?.products || []) {
                    const name = prod.name;
                    const forex = prod.forex || {};
                    if (forex.groups && forex.groups.length > 0) {
                        const group = forex.groups[0];
                        const details = productNameToAssetDetails[name];
                        if (details) {
                            const buyPrice = parseFloat(group.ask.replace(",", ".")) || 0;
                            const sellPrice = parseFloat(group.bid.replace(",", ".")) || 0;

                            currentPrices.set(details.symbol, buyPrice);

                            let change24h = 0;
                            const prevPrice = previousPrices.get(details.symbol);
                            if (prevPrice && prevPrice > 0 && buyPrice > 0) {
                                change24h = ((buyPrice - prevPrice) / prevPrice) * 100;
                            }

                            allProducts.push({
                                symbol: details.symbol,
                                buyPrice,
                                sellPrice,
                                change24h,
                                price: sellPrice, // Use bid as the default price
                                displayOrder: details.displayOrder,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching data for tab group ${tabGroupId}:`, error);
            // Don't 'continue' here, as it might skip updating the previousPrices map
        }
    }

    // Update the previous prices map for the next run
    if (currentPrices.size > 0) {
        previousPrices = new Map(currentPrices);
    }

    return allProducts.sort((a, b) => a.displayOrder - b.displayOrder);
}


export async function GET() {
  try {
    const data = await fetchAndProcessPrices();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in prices API route:', error);
    return NextResponse.json({ message: 'Error fetching external prices' }, { status: 500 });
  }
}
