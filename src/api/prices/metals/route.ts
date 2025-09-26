
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

  if (!nadirDovizApiUrl) {
      console.warn('Nadir Doviz API URL not found. Metals data will not be fetched.');
      return NextResponse.json({ error: 'Price API URL not configured' }, { status: 500 });
  }

  const prices: Record<string, { buyPrice?: number; sellPrice?: number; change24h: number }> = {};

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

    if (Object.keys(prices).length === 0) {
        return NextResponse.json({ error: 'No metal prices fetched from the API' }, { status: 404 });
    }

    return NextResponse.json(prices);
  } catch (error: any) {
    console.error('An unexpected error occurred in the metals prices API route:', error.message);
    return NextResponse.json({ error: 'Failed to fetch metal prices', details: error.message }, { status: 500 });
  }
}
