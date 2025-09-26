
import { NextResponse } from 'next/server';
import axios from 'axios';

// Maps API codes to application symbols
const codeToSymbolMap: Record<string, string> = {
    'GA': 'XAU',       // Gram Altın
    'G': 'XAG',        // Gümüş
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

  // Start with fallback data. Fetched data will be merged on top of this.
  const fallbackPrices: Record<string, { buyPrice?: number; sellPrice?: number; change24h: number }> = {
      "XAU": { "buyPrice": 2450.12, "sellPrice": 2445.50, "change24h": -0.82 },
      "XAG": { "buyPrice": 31.55, "sellPrice": 31.40, "change24h": -1.2 },
      "XAU_ONS": { "buyPrice": 2329.43, "sellPrice": 2328.00, "change24h": -0.78 },
      "XAU_USD_KG": { "buyPrice": 74932.8, "sellPrice": 74900.00, "change24h": -0.78 },
      "XAU_EUR_KG": { "buyPrice": 69821.5, "sellPrice": 69800.00, "change24h": -0.78 },
      "XAG_ONS": { "buyPrice": 29.58, "sellPrice": 29.50, "change24h": -1.5 },
      "XAG_TL": { "buyPrice": 31.0, "sellPrice": 30.90, "change24h": -1.5 },
      "XAG_USD": { "buyPrice": 29.58, "sellPrice": 29.50, "change24h": -1.5 },
      "XAG_EUR": { "buyPrice": 27.56, "sellPrice": 27.50, "change24h": -1.5 },
      "USD_TRY": { "buyPrice": 32.85, "sellPrice": 32.80, "change24h": 0.1 },
  };

  if (!nadirDovizApiUrl) {
      console.warn('Nadir Doviz API URL not found. Returning fallback metals data.');
      return NextResponse.json(fallbackPrices);
  }

  const prices = { ...fallbackPrices };

  try {
    const response = await axios.post(nadirDovizApiUrl, {});

    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item: any) => {
        const code = item.Kod;
        if (relevantCodes.has(code)) {
          const symbol = codeToSymbolMap[code];
          try {
            const buyPriceStr = String(item.Alis).replace(/\./g, '').replace(',', '.');
            const sellPriceStr = String(item.Satis).replace(/\./g, '').replace(',', '.');
            const change24hStr = String(item.Yuzde).replace(',', '.');

            const buyPrice = parseFloat(buyPriceStr);
            const sellPrice = parseFloat(sellPriceStr);
            const change24h = parseFloat(change24hStr);

            if (symbol && !isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(change24h)) {
                prices[symbol] = { buyPrice, sellPrice, change24h };
            }
          } catch (e) {
              console.warn(`Could not parse item from NadirDoviz: ${JSON.stringify(item)}`, e);
          }
        }
      });
    }
    return NextResponse.json(prices);
  } catch (error: any) {
    console.error('An unexpected error occurred in the metals prices API route:', error.message);
    // Even in case of a totally unexpected error, return the fallback data
    return NextResponse.json(fallbackPrices);
  }
}
