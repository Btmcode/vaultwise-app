
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Haritalama, hedef sitedeki isimleri uygulama sembollerine çevirir.
const nameToSymbolMap: Record<string, string> = {
    'HAS ALTIN': 'XAU',
    'GÜMÜŞ': 'XAG',
    'BITCOIN': 'BTC',
    'ALTIN/ONS': 'XAU_ONS',
    'USD/KG': 'XAU_USD_KG',
    'EUR/KG': 'XAU_EUR_KG',
    'GÜMÜŞ/ONS': 'XAG_ONS',
    'GÜMÜŞ/TL': 'XAG_TL',
    'GÜMÜŞ/USD': 'XAG_USD',
    'GÜMÜŞ/EUR': 'XAG_EUR',
};

export async function GET() {
  const apiUrl = process.env.PRICE_API_URL;

  if (!apiUrl) {
      return NextResponse.json({ error: 'API URLsi yapılandırılmamış.' }, { status: 500 });
  }

  try {
    // saglamoglualtin.com'dan veri çekmek için axios kullanılıyor.
    const { data } = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const prices: Record<string, { price: number; change24h: number }> = {};

    // Sitenin HTML yapısına göre doğru seçiciler kullanılıyor.
    // #tab-1 içindeki her bir .box elementi bir varlığı temsil ediyor.
    $('#tab-1 .box, #tab-2 .box, #tab-3 .box').each((i, el) => {
      const name = $(el).find('.g-a').text().trim().toUpperCase();
      // Fiyat ve değişim verileri doğru sınıflardan alınıyor.
      const priceStr = $(el).find('.a-f').text().trim().replace('₺', '').replace('.', '').replace(',', '.');
      const changeStr = $(el).find('.d-y span').text().trim().replace('%', '').replace(',', '.');

      const symbol = nameToSymbolMap[name];
      if (symbol) {
        const price = parseFloat(priceStr);
        const change24h = parseFloat(changeStr) || 0; // Eğer değişim yoksa 0 ata
        // NaN kontrolü
        if (!isNaN(price)) {
            prices[symbol] = {
                price: price,
                change24h: change24h
            };
        }
      }
    });
    
    // Uygulamada olan ama sitede olmayan varlıklar için statik veri ekleyelim
    if (!prices['PAXG']) {
        prices['PAXG'] = { price: 2319.99, change24h: -0.7 };
    }
    if (!prices['XAUT']) {
        prices['XAUT'] = { price: 2321.1, change24h: -0.75 };
    }


    if (Object.keys(prices).length === 0) {
      return NextResponse.json({ error: 'Fiyatlar ayrıştırılamadı. Seçicileri (selectors) kontrol edin.' }, { status: 500 });
    }

    return NextResponse.json(prices);

  } catch (error) {
    console.error('Veri kazıma hatası:', error);
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
