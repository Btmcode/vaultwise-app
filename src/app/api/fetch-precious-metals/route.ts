
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Manuel veri (API veya scraping başarısız olursa kullanılacak yedek veri)
const getManualData = () => {
    return [
        { "Ürün": "HAS ALTIN", "Değişim": -1.38, "Alış": 5090.180, "Satış": 5111.977 },
        { "Ürün": "Altın/ONS", "Değişim": -1.25, "Alış": 3816.65, "Satış": 3826.72 },
        { "Ürün": "USD/KG", "Değişim": -1.25, "Alış": 122095, "Satış": 122417 },
        { "Ürün": "EUR/KG", "Değişim": -0.68, "Alış": 104168, "Satış": 104612 },
        { "Ürün": "GÜM/ONS", "Değişim": -0.59, "Alış": 43.940, "Satış": 44.280 },
        { "Ürün": "GÜM/TL", "Değişim": -0.70, "Alış": 58614, "Satış": 59167 },
        { "Ürün": "GÜM/USD", "Değişim": -0.56, "Alış": 1413, "Satış": 1424 },
        { "Ürün": "GÜM/EUR", "Değişim": 0.00, "Alış": 1206, "Satış": 1217 }
    ];
};

export async function GET() {
    try {
        // Web sitesinden veri çekme
        const response = await axios.get('https://saglamoglualtin.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 saniye timeout
        });

        // HTML içeriğini parse et
        const $ = cheerio.load(response.data);

        // TODO: Web sitesinden veri çekme mantığı burada uygulanacak.
        // Örnek: $('#goldTabs table tr').each(...)
        // Bu kısım henüz implemente edilmediği için şimdilik manuel veri döndürülüyor.
        
        console.log('Web sitesinden veri çekme mantığı henüz tamamlanmadı, manuel veri kullanılıyor...');
        return NextResponse.json(getManualData());

    } catch (error) {
        console.error('Veri çekme hatası:', error);
        // Hata durumunda manuel veriyi döndür
        return NextResponse.json(getManualData());
    }
}
