
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API codes to application symbols
const codeToSymbolMap: Record<string, string> = {
    'GA': 'XAU',       // Gram Altın
    'G': 'XAG',        // Gümüş
    'BTC': 'BTC',      // Bitcoin (Fallback, will be overridden by CoinMarketCap)
    'USD': 'USD_TRY',  // USD/TRY Kuru
    'XAU.ONS': 'XAU_ONS',  // ONS Altın
    'XAU.USD.KG': 'XAU_USD_KG',
    'XAU.EUR.KG': 'XAU_EUR_KG',
    'XAG.ONS': 'XAG_ONS', // ONS Gümüş
    'GUMUSTRY': 'XAG_TL',
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
      return NextResponse.json({ error: 'Price API URL is not configured.' }, { status: 500 });
  }

  const prices: Record<string, { buyPrice?: number; sellPrice?: number; price?: number; change24h: number }> = {};

  try {
    // Fetch data from both APIs concurrently
    const [nadirdovizResponse, coinmarketcapResponse] = await Promise.allSettled([
      axios.post(nadirDovizApiUrl, {}),
      coinmarketcapApiKey 
        ? axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,PAXG,XAUT', {
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
              const buyPrice = parseFloat(item.Alis.replace(/\./g, '').replace(',', '.'));
              const sellPrice = parseFloat(item.Satis.replace(/\./g, '').replace(',', '.'));
              const change24h = parseFloat(item.Yuzde.replace(',', '.'));

              if (symbol && !isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(change24h)) {
                  prices[symbol] = { buyPrice, sellPrice, change24h };
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
    if (coinmarketcapResponse.status === 'fulfilled' && coinmarketcapResponse.value?.data?.data) {
        const cryptoData = coinmarketcapResponse.value.data.data;
        ['BTC', 'PAXG', 'XAUT'].forEach(symbol => {
            if (cryptoData[symbol]) {
                const data = cryptoData[symbol];
                const price = data.quote.USD.price;
                const change24h = data.quote.USD.percent_change_24h;

                if (price && change24h) {
                    prices[symbol] = {
                        price: parseFloat(price),
                        change24h: parseFloat(change24h),
                    };
                }
            }
        });
    } else if (coinmarketcapApiKey) {
        console.error('Failed to fetch or process data from CoinMarketCap API.');
    }
    
    // Add fallback data for assets not available in the APIs (if they weren't fetched)
    if (!prices['PAXG']) {
        prices['PAXG'] = { price: 2319.99, change24h: -0.7 };
    }
    if (!prices['XAUT']) {
        prices['XAUT'] = { price: 2321.1, change24h: -0.75 };
    }

    return NextResponse.json(prices);

  } catch (error: any) {
    console.error('API request or data processing error:', error.message);
    // Return fallback data in case of any error
    const fallbackPrices = {
        "XAU": { "buyPrice": 2450.12, "sellPrice": 2445.50, "change24h": -0.82 },
        "BTC": { "price": 68123.45, "change24h": 2.5 },
        "PAXG": { "price": 2319.99, "change24h": -0.7 },
        "XAUT": { "price": 2321.1, "change24h": -0.75 },
        "XAU_ONS": { "buyPrice": 2329.43, "sellPrice": 2328.00, "change24h": -0.78 },
        "XAU_USD_KG": { "buyPrice": 74932.8, "sellPrice": 74900.00, "change24h": -0.78 },
        "XAU_EUR_KG": { "buyPrice": 69821.5, "sellPrice": 69800.00, "change24h": -0.78 },
        "XAG_ONS": { "buyPrice": 29.58, "sellPrice": 29.50, "change24h": -1.5 },
        "XAG_TL": { "buyPrice": 31.0, "sellPrice": 30.90, "change24h": -1.5 },
        "XAG_USD": { "buyPrice": 29.58, "sellPrice": 29.50, "change24h": -1.5 },
        "XAG_EUR": { "buyPrice": 27.56, "sellPrice": 27.50, "change24h": -1.5 },
        "USD_TRY": { "buyPrice": 32.85, "sellPrice": 32.80, "change24h": 0.1 },
    };
    return NextResponse.json(fallbackPrices);
  }
}
