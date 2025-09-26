import type { ChartData, AutoSavePlan } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// This file is now clean and does not contain any dummy data.
// All user-specific data is fetched directly from Firestore.

export const chartData: ChartData = {
  "live": [],
  "1d": [],
  "1w": [],
  "1m": [],
  "3m": [],
  "6m": [],
  "1y": [],
  "5y": [],
};
