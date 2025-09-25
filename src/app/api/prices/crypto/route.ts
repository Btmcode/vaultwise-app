
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API codes to application symbols
const codeToSymbolMap: Record<string, string> = {
    'BTC': 'BTC',
    'PAXG': 'PAXG',
    'XAUT': 'XAUT',
};

export async function GET() {
  const coinmarketcapApiKey = process.env.COINMARKETCAP_API_KEY;
  
  const fallbackPrices = {
      "BTC": { "price": 68123.45, "change24h": 2.5 },
      "PAXG": { "price": 2319.99, "change24h": -0.7 },
      "XAUT": { "price": 2321.1, "change24h": -0.75 },
  };

  if (!coinmarketcapApiKey) {
    console.warn('CoinMarketCap API key not found. Returning fallback crypto data.');
    return NextResponse.json(fallbackPrices);
  }

  const prices: Record<string, { price?: number; change24h: number }> = {};

  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,PAXG,XAUT', {
      headers: { 'X-CMC_PRO_API_KEY': coinmarketcapApiKey },
    });

    if (response.data?.data) {
        const cryptoData = response.data.data;
        Object.keys(codeToSymbolMap).forEach(symbol => {
            if (cryptoData[symbol]) {
                const data = cryptoData[symbol];
                const price = data.quote.USD.price;
                const change24h = data.quote.USD.percent_change_24h;

                if (price && change24h !== undefined) {
                    prices[symbol] = {
                        price: parseFloat(price as any),
                        change24h: parseFloat(change24h as any),
                    };
                }
            }
        });
    }
    // If we fetched some prices, merge them with fallback for resilience
    return NextResponse.json({ ...fallbackPrices, ...prices });
  } catch (error: any) {
    console.error('Crypto prices API route error:', error.message);
    // In case of any error, return the fallback data to prevent app crash
    return NextResponse.json(fallbackPrices);
  }
}
