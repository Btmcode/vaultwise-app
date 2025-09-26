
import { NextResponse } from 'next/server';

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

const parseNumber = (str: string): number | null => {
    // API'den gelen "2.450,12" gibi string'leri doğru şekilde ayrıştırır
    if (!str) return null;
    const num = parseFloat(str.replace(/\./g, '').replace(',', '.'));
    return isNaN(num) ? null : num;
};

export async function GET() {
    const url = "https://saglamoglualtin.com/marge/products";
    const headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://saglamoglualtin.com/",
        "X-Requested-With": "XMLHttpRequest"
    };

    try {
        const response = await fetch(url, { headers, next: { revalidate: 60 } });

        if (!response.ok) {
            return NextResponse.json({ error: `API request failed with status ${response.status}` }, { status: 500 });
        }
        
        const data = await response.json();

        if (!data || !data.products) {
            return NextResponse.json({ error: 'API response missing "products" key' }, { status: 500 });
        }

        const processedProducts: Record<string, FormattedAsset> = {};

        for (const prod of data.products as ApiProduct[]) {
            const symbol = nameToSymbolMap[prod.name] || prod.name;
            const buyPrice = parseNumber(prod.public_bid);
            const sellPrice = parseNumber(prod.public_ask);
            
            if (buyPrice !== null && sellPrice !== null && buyPrice > 0 && sellPrice > 0) {
                const change24h = ((sellPrice - buyPrice) / buyPrice) * 100;
                processedProducts[symbol] = {
                    symbol,
                    buyPrice,
                    sellPrice,
                    change24h: isFinite(change24h) ? change24h : 0,
                };
            }
        }
        
        if (Object.keys(processedProducts).length === 0) {
            return NextResponse.json({ error: 'No valid products found in API response' }, { status: 500 });
        }

        return NextResponse.json(processedProducts);

    } catch (error: any) {
        console.error('Error fetching data from Saglamoglu API:', error.message);
        return NextResponse.json({ error: 'Error fetching data from Saglamoglu API: ' + error.message }, { status: 500 });
    }
}
