
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

type PreciousMetal = {
  'Ürün': string;
  'Alış': number;
  'Satış': number;
  'Değişim': number;
};

// Yedek veri
const getManualData = (): PreciousMetal[] => {
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

const parseNumber = (str: string) => {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
};

const nameToSymbolMap: Record<string, string> = {
    'HAS ALTIN': 'XAU',
    'Altın/ONS': 'XAU_ONS',
    'USD/KG': 'XAU_USD_KG',
    'EUR/KG': 'XAU_EUR_KG',
    'GÜMÜŞ GRAM': 'XAG_TL',
    'GÜM/ONS': 'XAG_ONS',
    'GÜM/USD': 'XAG_USD',
    'GÜM/EUR': 'XAG_EUR',
    'Gram Gümüş': 'XAG_TL',
};

type FormattedAsset = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
};

export async function GET() {
    try {
        const response = await axios.get('https://saglamoglualtin.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const data: PreciousMetal[] = [];

        $('#goldTabs > .tab-content > #g > .kurlar > tbody > tr').each((i, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 4) {
                const productName = $(tds[0]).text().trim();
                const changeText = $(tds[1]).find('.deger').text().trim().replace('%', '');
                const buyText = $(tds[2]).text().trim();
                const sellText = $(tds[3]).text().trim();

                const item: PreciousMetal = {
                    'Ürün': productName,
                    'Değişim': parseNumber(changeText),
                    'Alış': parseNumber(buyText),
                    'Satış': parseNumber(sellText),
                };
                data.push(item);
            }
        });
        
        if (data.length === 0) {
            console.warn('Cheerio scraper returned no data. Using manual fallback data.');
            const manualData = getManualData();
            const formattedFallback = manualData.reduce((acc, item) => {
                const symbol = Object.keys(nameToSymbolMap).find(key => nameToSymbolMap[key] === item['Ürün']) || item['Ürün'];
                 if(symbol) {
                    acc[symbol] = {
                        symbol: symbol,
                        buyPrice: item['Alış'],
                        sellPrice: item['Satış'],
                        change24h: item['Değişim']
                    };
                }
                return acc;
            }, {} as Record<string, FormattedAsset>);
            return NextResponse.json(formattedFallback);
        }

        const processedProducts: Record<string, FormattedAsset> = {};

        for (const prod of data) {
            const symbol = nameToSymbolMap[prod['Ürün']];
            if (!symbol) continue;

            const buyPrice = prod['Alış'];
            const sellPrice = prod['Satış'];
            
            if (buyPrice && sellPrice && buyPrice > 0 && sellPrice > 0) {
                processedProducts[symbol] = {
                    symbol: symbol,
                    buyPrice: buyPrice,
                    sellPrice: sellPrice,
                    change24h: prod['Değişim'],
                };
            }
        }

        return NextResponse.json(processedProducts);

    } catch (error) {
        console.error('Error fetching or parsing data from saglamoglualtin.com:', error);
        const manualData = getManualData();
        const formattedFallback = manualData.reduce((acc, item) => {
            const symbol = Object.keys(nameToSymbolMap).find(key => nameToSymbolMap[key] === item['Ürün']) || item['Ürün'];
             if(symbol) {
                acc[symbol] = {
                    symbol: symbol,
                    buyPrice: item['Alış'],
                    sellPrice: item['Satış'],
                    change24h: item['Değişim']
                };
            }
            return acc;
        }, {} as Record<string, FormattedAsset>);
        return NextResponse.json(formattedFallback);
    }
}
