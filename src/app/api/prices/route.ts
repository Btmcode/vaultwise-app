
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Bu haritalama, kazıdığınız veriyi uygulamanızın kullandığı sembollere çevirir.
// Hedef web sitesindeki isimlendirmeye göre bunu düzenlemeniz gerekebilir.
const nameToSymbolMap: Record<string, string> = {
    'GRAM ALTIN': 'XAU',
    'GÜMÜŞ': 'XAG',
    'BITCOIN': 'BTC'
};

export async function GET() {
  try {
    // --- BAŞLANGIÇ: SİZİN İÇİN HAZIRLANAN BÖLÜM ---
    
    // Adım 1: Gerçek veri çekmek için aşağıdaki satırın yorumunu kaldırın ve doğru URL'yi girin.
    // const { data } = await axios.get("https://www.hedefsite.com/altin-fiyatlari");

    // Adım 2: Yukarıdaki satırın yorumunu kaldırdıktan sonra, aşağıdaki sahte HTML verisini silebilirsiniz.
    // Bu sahte veri, kodun geri kalanının çalışmasını sağlamak için bir yer tutucudur.
    const data = `
      <html>
        <body>
          <table>
            <tbody>
              <tr>
                <td>GRAM ALTIN</td>
                <td>2.450,12</td> 
                <td>%0.5</td>
              </tr>
              <tr>
                <td>GÜMÜŞ</td>
                <td>30,45</td>
                <td>%-1.2</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;
    // --- BİTİŞ: SİZİN İÇİN HAZIRLANAN BÖLÜM ---


    const $ = cheerio.load(data);
    const prices: Record<string, { price: number; change24h: number }> = {};

    // Bu seçici (selector), hedef sitenin HTML yapısına göre güncellenmelidir.
    // Örnek olarak, bir <table> içindeki her bir satırı (<tr>) hedefliyoruz.
    $('table tbody tr').each((i, el) => {
      // 1. kolon (isim), 2. kolon (fiyat), 3. kolon (değişim) olduğunu varsayıyoruz.
      const name = $(el).find('td').eq(0).text().trim().toUpperCase();
      const priceStr = $(el).find('td').eq(1).text().trim().replace('.', '').replace(',', '.');
      const changeStr = $(el).find('td').eq(2).text().trim().replace('%', '').replace(',', '.');

      const symbol = nameToSymbolMap[name];
      if (symbol) {
        prices[symbol] = {
          price: parseFloat(priceStr),
          change24h: parseFloat(changeStr)
        };
      }
    });

    if (Object.keys(prices).length === 0) {
      return NextResponse.json({ error: 'Fiyatlar ayrıştırılamadı. Seçicileri (selectors) kontrol edin.' }, { status: 500 });
    }

    return NextResponse.json(prices);

  } catch (error) {
    console.error('Veri kazıma hatası:', error);
    return NextResponse.json({ error: 'Harici siteden veri alınamadı.' }, { status: 500 });
  }
}
