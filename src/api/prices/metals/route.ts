
import { NextResponse } from 'next/server';
import axios from 'axios';

// This entire route is being deprecated in favor of /api/fetch-precious-metals
// For now, we will keep a simplified fallback logic.

export async function GET() {
  // Return a static fallback. The main logic is now in another route.
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

  console.warn('/api/prices/metals is deprecated. Using fallback data.');
  return NextResponse.json(fallbackPrices);
}
