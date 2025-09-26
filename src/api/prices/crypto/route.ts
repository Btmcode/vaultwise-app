
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
  
  if (!coinmarketcapApiKey) {
    console.warn('CoinMarketCap API key not found. Crypto data will not be fetched.');
    return NextResponse.json({ error: 'CoinMarketCap API key not configured' }, { status: 500 });
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
    
    if (Object.keys(prices).length === 0) {
        return NextResponse.json({ error: 'No crypto data fetched from the API' }, { status: 404 });
    }

    return NextResponse.json(prices);
  } catch (error: any) {
    console.error('Crypto prices API route error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch crypto prices', details: error.message }, { status: 500 });
  }
}
