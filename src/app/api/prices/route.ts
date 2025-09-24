import { NextResponse } from 'next/server';
import axios from 'axios';

// Haritalama, API'den gelen kodları uygulama sembollerine çevirir.
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

// Sitedeki tam kodları içeren bir set.
const relevantCodes = new Set(Object.keys(codeToSymbolMap));

export async function GET() {
  const apiUrl = process.env.PRICE_API_URL;

  if (!apiUrl) {
      return NextResponse.json({ error: 'API URLsi yapılandırılmamış.' }, { status: 500 });
  }

  try {
    const { data: apiData } = await axios.post(apiUrl, {});

    if (!apiData || !Array.isArray(apiData)) {
      throw new Error("API'den beklenen formatta veri gelmedi.");
    }
    
    const prices: Record<string, { price: number; change24h: number }> = {};

    apiData.forEach((item: any) => {
      const code = item.Kod;
      if (relevantCodes.has(code)) {
        const symbol = codeToSymbolMap[code];
        const price = parseFloat(item.Alis);
        const change24h = parseFloat(item.Yuzde);

        if (symbol && !isNaN(price) && !isNaN(change24h)) {
            prices[symbol] = {
                price: price,
                change24h: change24h
            };
        }
      }
    });
    
    // Uygulamada olan ama API'de olmayan varlıklar için statik veri ekleyelim
    if (!prices['PAXG']) {
        prices['PAXG'] = { price: 2319.99, change24h: -0.7 };
    }
    if (!prices['XAUT']) {
        prices['XAUT'] = { price: 2321.1, change24h: -0.75 };
    }


    if (Object.keys(prices).length === 0) {
      return NextResponse.json({ error: 'Fiyatlar ayrıştırılamadı. API yanıtını kontrol edin.' }, { status: 500 });
    }

    return NextResponse.json(prices);

  } catch (error) {
    console.error('API isteği veya veri işleme hatası:', error);
    // Hata durumunda statik verileri döndürerek uygulamanın kırılmasını önleyelim.
    const fallbackPrices = {
        "XAU": { "price": 2320.78, "change24h": -0.8 },
        "XAG": { "price": 29.55, "change24h": -1.2 },
        "BTC": { "price": 68123.45, "change24h": 2.5 },
        "PAXG": { "price": 2319.99, "change24h": -0.7 },
        "XAUT": { "price": 2321.1, "change24h": -0.75 }
    };
    return NextResponse.json(fallbackPrices);
  }
}
