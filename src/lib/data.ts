
import type { ChartData, AutoSavePlan } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// --- Chart Data ---
const generateChartData = (period: 'day' | 'week' | 'month' | 'year', count: number, baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    if (period === 'day') {
      date.setDate(now.getDate() - i);
    } else if (period === 'week') {
      date.setDate(now.getDate() - (i * 7));
    } else if (period === 'month') {
        date.setMonth(now.getMonth() - i);
    } else if (period === 'year') {
        date.setFullYear(now.getFullYear() - i);
    }
    
    value *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
};

const generateLiveChartData = (minutes: number, baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  const now = new Date();
  for (let i = minutes - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i);
    value *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
}

export const chartData: ChartData = {
  "live": generateLiveChartData(60, 68000, 0.005),
  "1d": generateChartData('day', 24, 68200, 0.01),
  "1w": generateChartData('day', 7, 67500, 0.02),
  "1m": generateChartData('day', 30, 69000, 0.03),
  "3m": generateChartData('week', 12, 65000, 0.04),
  "6m": generateChartData('week', 26, 62000, 0.045),
  "1y": generateChartData('month', 12, 45000, 0.05),
  "5y": generateChartData('month', 60, 20000, 0.08),
};
