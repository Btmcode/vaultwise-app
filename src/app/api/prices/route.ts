
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API codes to application symbols
const codeToSymbolMap: Record<string, string> = {
    'GA': 'XAU',       // Gram Altın
    'G': 'XAG',        // Gümüş
    'BTC': 'BTC',      // Bitcoin
    'XAU_O': 'XAU_ONS',  // ONS Altın
    'XAU_USD_K': 'XAU_USD_KG',
    'XAU_EUR_K': 'XAU_EUR_KG',
    'XAG_O': 'XAG_ONS', // ONS Gümüş
    'GUMUSTR': 'XAG_TL',
    'GUMUSUSD': 'XAG_USD',
    'GUMUSEUR': 'XAG_EUR',
};

// A set of relevant codes for quick lookup
const relevantCodes = new Set(Object.keys(codeToSymbolMap));

export async function GET() {
  const nadirDovizApiUrl = process.env.PRICE_API_URL;
  const coinmarketcapApiKey = process.env.COINMARKETCAP_API_KEY;

  if (!nadirDovizApiUrl) {
      console.error('Nadir Doviz API URL is not configured.');
      return NextResponse.json({ error: 'Nadir Doviz API URLsi yapılandırılmamış.' }, { status: 500 });
  }

  const prices: Record<string, { price: number; change24h: number }> = {};

  try {
    // Fetch data from both APIs concurrently
    const [nadirdovizResponse, coinmarketcapResponse] = await Promise.allSettled([
      axios.post(nadirDovizApiUrl, {}),
      coinmarketcapApiKey 
        ? axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
            headers: { 'X-CMC_PRO_API_KEY': coinmarketcapApiKey },
          })
        : Promise.resolve(null)
    ]);

    // Process Nadir Doviz data
    if (nadirdovizResponse.status === 'fulfilled' && nadirdovizResponse.value.data) {
      const nadirdovizData = nadirdovizResponse.value.data;
      if (Array.isArray(nadirdovizData)) {
        nadirdovizData.forEach((item: any) => {
          const code = item.Kod;
          if (relevantCodes.has(code)) {
            const symbol = codeToSymbolMap[code];
            try {
              const price = parseFloat(item.Alis.replace(/\./g, '').replace(',', '.'));
              const change24h = parseFloat(item.Yuzde.replace(',', '.'));

              if (symbol && !isNaN(price) && !isNaN(change24h)) {
                  prices[symbol] = { price, change24h };
              }
            } catch (e) {
                console.warn(`Could not parse item from NadirDoviz: ${JSON.stringify(item)}`);
            }
          }
        });
      }
    } else {
        console.error('Failed to fetch or process data from Nadir Doviz API.');
    }

    // Process CoinMarketCap data
    if (coinmarketcapResponse.status === 'fulfilled' && coinmarketcapResponse.value?.data?.data?.BTC) {
      const btcData = coinmarketcapResponse.value.data.data.BTC;
      const price = btcData.quote.USD.price;
      const change24h = btcData.quote.USD.percent_change_24h;

      if (price && change24h) {
          prices['BTC'] = {
              price: parseFloat(price),
              change24h: parseFloat(change24h),
          };
      }
    } else if (coinmarketcapApiKey) {
        console.error('Failed to fetch or process data from CoinMarketCap API.');
    }
    
    // Add fallback data for assets not available in the APIs
    if (!prices['PAXG']) {
        prices['PAXG'] = { price: 2319.99, change24h: -0.7 };
    }
    if (!prices['XAUT']) {
        prices['XAUT'] = { price: 2321.1, change24h: -0.75 };
    }


    if (Object.keys(prices).length < 3) { // Check if we have at least some data
      throw new Error('Could not fetch sufficient price data from APIs.');
    }

    return NextResponse.json(prices);

  } catch (error: any) {
    console.error('API request or data processing error:', error.message);
    // Return fallback data in case of any error to prevent the app from crashing
    const fallbackPrices = {
        "XAU": { "price": 2450.12, "change24h": -0.82 },
        "XAG": { "price": 31.55, "change24h": -1.21 },
        "BTC": { "price": 68123.45, "change24h": 2.5 },
        "PAXG": { "price": 2319.99, "change24h": -0.7 },
        "XAUT": { "price": 2321.1, "change24h": -0.75 },
        "XAU_ONS": { "price": 2329.43, "change24h": -0.78 },
        "XAU_USD_KG": { "price": 74932.8, "change24h": -0.78 },
        "XAU_EUR_KG": { "price": 69821.5, "change24h": -0.78 },
        "XAG_ONS": { "price": 29.58, "change24h": -1.5 },
        "XAG_TL": { "price": 31.0, "change24h": -1.5 },
        "XAG_USD": { "price": 29.58, "change24h": -1.5 },
        "XAG_EUR": { "price": 27.56, "change24h": -1.5 },
    };
    return NextResponse.json(fallbackPrices);
  }
}
