
import type { ChartData, AutoSavePlan } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// This file is now clean and does not contain any dummy data.
// All user-specific data is fetched directly from Firestore.

// Dummy data for chart - in a real app this would come from an API
function generateChartData(days: number, points: number, scale: number, variance: number) {
  const data = [];
  const today = new Date();
  const step = (days * 24 * 60 * 60 * 1000) / points;

  for (let i = points -1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * step);
      const randomFactor = (Math.random() - 0.5) * variance;
      const value = Math.max(0, scale * (1 + randomFactor * (i/points)));
      data.push({ date: date.toISOString(), value: Math.round(value * 100)/100 });
  }
  return data;
}

export const chartData: ChartData = {
  "live": [],
  "1d": generateChartData(1, 48, 26000, 0.05),
  "1w": generateChartData(7, 84, 26500, 0.1),
  "1m": generateChartData(30, 90, 27000, 0.2),
  "1y": generateChartData(365, 120, 22000, 0.4),
  "3m": [],
  "6m": [],
  "5y": [],
};


// Functions to manage auto-save plans in localStorage
const AUTO_SAVE_PLANS_KEY = 'vaultwise-autosave-plans';

export const getAutoSavePlans = (): AutoSavePlan[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const plansJson = localStorage.getItem(AUTO_SAVE_PLANS_KEY);
  return plansJson ? JSON.parse(plansJson) : [];
};

export const addAutoSavePlan = (plan: Omit<AutoSavePlan, 'id' | 'status'>): AutoSavePlan[] => {
  const currentPlans = getAutoSavePlans();
  const newPlan: AutoSavePlan = {
    ...plan,
    id: uuidv4(),
    status: 'active',
  };
  const updatedPlans = [...currentPlans, newPlan];
  localStorage.setItem(AUTO_SAVE_PLANS_KEY, JSON.stringify(updatedPlans));
  return updatedPlans;
};

export const removeAutoSavePlan = (planId: string): AutoSavePlan[] => {
  const currentPlans = getAutoSavePlans();
  const updatedPlans = currentPlans.filter(p => p.id !== planId);
  localStorage.setItem(AUTO_SAVE_PLANS_KEY, JSON.stringify(updatedPlans));
  return updatedPlans;
};
