
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API product names to our application's asset symbols for consistency
const nameToSymbolMap: Record<string, string> = {
    'HAS ALTIN': 'XAU',
    'Altın/ONS': 'XAU_ONS',
    'USD/KG': 'XAU_USD_KG',
    'EUR/KG': 'XAU_EUR_KG',
    'GÜMÜŞ GRAM': 'XAG_TL', // This might need verification from the new endpoint's data
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
    // The API returns strings like "2,450.12", which needs to be parsed correctly.
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
        const response = await axios.get<{ products: ApiProduct[] }>(url, { headers, timeout: 10000 });
        const processedProducts: FormattedAsset[] = [];

        if (!response.data || !response.data.products) {
            console.warn('API response is missing "products" key. Using fallback data.');
            return NextResponse.json(fallbackPrices);
        }

        for (const prod of response.data.products) {
            const symbol = nameToSymbolMap[prod.name];
            if (!symbol) continue;

            const buyPrice = parseNumber(prod.public_bid);
            const sellPrice = parseNumber(prod.public_ask);

            if (buyPrice !== null && sellPrice !== null && buyPrice > 0 && sellPrice > 0) {
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
        return NextResponse.json({ ...fallbackPrices, ...formattedData });

    } catch (error) {
        console.error('Error fetching data from Saglamoglu marge/products API:', error);
        return NextResponse.json(fallbackPrices);
    }
}
