
import { NextResponse } from 'next/server';

// Maps API product names to our application's asset symbols for consistency
const nameToSymbolMap: Record<string, string> = {
    'HAS ALTIN': 'XAU',
    'Altın/ONS': 'XAU_ONS',
    'USD/KG': 'XAU_USD_KG',
    'EUR/KG': 'XAU_EUR_KG',
    'GÜMÜŞ GRAM': 'XAG_TL',
    'GÜM/ONS': 'XAG_ONS',
    'GÜM/USD': 'XAG_USD',
    'GÜM/EUR': 'XAG_EUR',
    'Gram Gümüş': 'XAG_TL',
};

type ApiProduct = {
    name: string;
    public_bid: string;
    public_ask: string;
};

type FormattedAsset = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
};

const parseNumber = (str: string): number | null => {
    // The API returns strings like "2.450,12", which needs to be parsed correctly.
    // First, remove dots used as thousand separators, then replace comma with a dot for decimal.
    const num = parseFloat(str.replace(/\./g, '').replace(',', '.'));
    return isNaN(num) ? null : num;
};


export async function GET() {
    const url = "https://saglamoglualtin.com/marge/products";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://saglamoglualtin.com/",
        "X-Requested-With": "XMLHttpRequest"
    };

    // Fallback data in case the API request fails
    const fallbackPrices: Record<string, { buyPrice?: number; sellPrice?: number; change24h: number }> = {
        "XAU": { "buyPrice": 2450.12, "sellPrice": 2455.50, "change24h": 0.22 },
        "XAU_ONS": { "buyPrice": 2329.43, "sellPrice": 2331.00, "change24h": 0.07 },
        "XAU_USD_KG": { "buyPrice": 74932.8, "sellPrice": 75000.00, "change24h": 0.09 },
        "XAU_EUR_KG": { "buyPrice": 69821.5, "sellPrice": 69900.00, "change24h": 0.11 },
        "XAG_ONS": { "buyPrice": 29.58, "sellPrice": 29.65, "change24h": 0.24 },
        "XAG_TL": { "buyPrice": 31.0, "sellPrice": 31.10, "change24h": 0.32 },
    };

    try {
        const response = await fetch(url, { 
            headers: headers, 
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            console.error(`API request failed with status ${response.status}`);
            return NextResponse.json(fallbackPrices);
        }
        
        const data = await response.json();

        if (!data || !data.products) {
            console.warn('API response is missing "products" key. Using fallback data.');
            return NextResponse.json(fallbackPrices);
        }

        const processedProducts: FormattedAsset[] = [];

        for (const prod of data.products) {
            const symbol = nameToSymbolMap[prod.name];
            if (!symbol) continue;

            const buyPrice = parseNumber(prod.public_bid);
            const sellPrice = parseNumber(prod.public_ask);
            
            if (buyPrice !== null && sellPrice !== null && buyPrice > 0 && sellPrice > 0) {
                 // Calculate percentage change based on the difference between sell and buy
                const change24h = ((sellPrice - buyPrice) / buyPrice) * 100;

                processedProducts.push({
                    symbol: symbol,
                    buyPrice: buyPrice,
                    sellPrice: sellPrice,
                    change24h: isFinite(change24h) ? change24h : 0,
                });
            }
        }
        
        if (processedProducts.length === 0) {
             console.warn('API requests returned no valid products after filtering. Using fallback data.');
            return NextResponse.json(fallbackPrices);
        }

        const formattedData: Record<string, FormattedAsset> = {};
        for (const product of processedProducts) {
            formattedData[product.symbol] = product;
        }
        
        // Merge with fallback to ensure any unmapped but critical assets are present
        const responseData = { ...fallbackPrices, ...formattedData };

        // Ensure every item in the final response has the symbol property inside the object
        Object.keys(responseData).forEach(key => {
            (responseData as any)[key].symbol = key;
        });
        
        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error('Error fetching data from Saglamoglu marge/products API:', error.message);
        return NextResponse.json(fallbackPrices);
    }
}
