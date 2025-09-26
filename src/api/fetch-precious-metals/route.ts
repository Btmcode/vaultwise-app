
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API product names to our application's asset symbols for consistency
const nameToSymbolMap: Record<string, string> = {
    'HAS ALTIN': 'XAU',
    'Altın/ONS': 'XAU_ONS',
    'USD/KG': 'XAU_USD_KG',
    'EUR/KG': 'XAU_EUR_KG',
    'GÜMÜŞ GRAM': 'XAG_TL',
    'GÜM/ONS': 'XAG_ONS',
    'GÜM/USD': 'XAG_USD', // Additional mapping
    'GÜM/EUR': 'XAG_EUR', // Additional mapping
};

type ApiProduct = {
    name: string;
    forex?: {
        groups?: {
            ask: string; // Satış
            bid: string; // Alış
        }[];
    };
};

type ApiTabData = {
    products: ApiProduct[];
};

type ApiTabGroupData = {
    tabGroup: {
        tabs: ApiTabData[];
    };
};

type FormattedAsset = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
};

const parseNumber = (str: string): number | null => {
    // Replaces comma with dot for decimal conversion
    const num = parseFloat(str.replace(',', '.'));
    return isNaN(num) ? null : num;
};

// Fetches and processes products from a single tab group ID
async function fetchTabGroupProducts(tabGroupId: number): Promise<FormattedAsset[]> {
    const url = `https://saglamoglualtin.com/component/tab-group/${tabGroupId}`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://saglamoglualtin.com/",
        "X-Requested-With": "XMLHttpRequest"
    };

    const response = await axios.get<ApiTabGroupData>(url, { headers, timeout: 10000 });
    const processedProducts: FormattedAsset[] = [];

    if (!response.data || !response.data.tabGroup || !response.data.tabGroup.tabs) {
        return [];
    }

    for (const tab of response.data.tabGroup.tabs) {
        for (const prod of tab.products) {
            const symbol = nameToSymbolMap[prod.name];
            if (!symbol) continue; // Skip if the product is not in our map

            const forexGroup = prod.forex?.groups?.[0];
            if (!forexGroup) continue; // Skip if there's no price data

            const sellPrice = parseNumber(forexGroup.ask); // Satış
            const buyPrice = parseNumber(forexGroup.bid);  // Alış

            // Filter out products with invalid or zero prices
            if (buyPrice !== null && sellPrice !== null && buyPrice > 0 && sellPrice > 0) {
                // Calculate percentage change based on the spread
                const change24h = ((sellPrice - buyPrice) / buyPrice) * 100;

                processedProducts.push({
                    symbol: symbol,
                    buyPrice: buyPrice,
                    sellPrice: sellPrice,
                    change24h: isFinite(change24h) ? change24h : 0, // Ensure change is a finite number
                });
            }
        }
    }
    return processedProducts;
}

export async function GET() {
    // Fallback data in case all API requests fail
    const fallbackPrices: Record<string, { buyPrice?: number; sellPrice?: number; change24h: number }> = {
        "XAU": { "buyPrice": 2450.12, "sellPrice": 2455.50, "change24h": 0.22 },
        "XAU_ONS": { "buyPrice": 2329.43, "sellPrice": 2331.00, "change24h": 0.07 },
        "XAU_USD_KG": { "buyPrice": 74932.8, "sellPrice": 75000.00, "change24h": 0.09 },
        "XAU_EUR_KG": { "buyPrice": 69821.5, "sellPrice": 69900.00, "change24h": 0.11 },
        "XAG_ONS": { "buyPrice": 29.58, "sellPrice": 29.65, "change24h": 0.24 },
        "XAG_TL": { "buyPrice": 31.0, "sellPrice": 31.10, "change24h": 0.32 },
    };
    
    console.log("Fetching data from tab group endpoints...");

    try {
        const tabGroupIds = [1, 2];
        const results = await Promise.allSettled(
            tabGroupIds.map(id => fetchTabGroupProducts(id))
        );

        const allProducts = results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => (result as PromiseFulfilledResult<FormattedAsset[]>).value);

        if (allProducts.length === 0) {
            console.warn('API requests to tab groups returned no valid data. Using fallback data.');
            return NextResponse.json(fallbackPrices);
        }

        const formattedData: Record<string, FormattedAsset> = {};
        for (const product of allProducts) {
            formattedData[product.symbol] = product;
        }

        // Merge fetched data with fallback data to ensure critical assets are always present
        return NextResponse.json({ ...fallbackPrices, ...formattedData });

    } catch (error) {
        console.error('Error fetching data from Saglamoglu tab group API:', error);
        // On any critical error, return the fallback data to ensure app stability
        return NextResponse.json(fallbackPrices);
    }
}
