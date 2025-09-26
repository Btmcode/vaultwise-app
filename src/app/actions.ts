
"use server";

import {
  generateSavingsGoalSuggestion,
  type AutomatedSavingsGoalInput,
  type AutomatedSavingsGoalOutput,
} from "@/ai/flows/automated-savings-goal-suggestions";
import {
  analyzeFeedback as analyzeFeedbackFlow,
  type FeedbackAnalysisInput,
  type FeedbackAnalysisOutput,
} from "@/ai/flows/feedback-analysis";
import {
  getMarketAnalysis as getMarketAnalysisFlow,
  type MarketAnalysisInput,
  type MarketAnalysisOutput,
} from "@/ai/flows/market-analysis";
import { cookies } from "next/headers";

export async function getAutomatedSavingsGoal(
  input: AutomatedSavingsGoalInput
): Promise<AutomatedSavingsGoalOutput> {
  // In a real app, you would add user authentication checks here.
  const suggestion = await generateSavingsGoalSuggestion(input);
  return suggestion;
}

export async function analyzeFeedback(
  input: FeedbackAnalysisInput
): Promise<FeedbackAnalysisOutput> {
  // In a real app, you would add user authentication checks here.
  const analysis = await analyzeFeedbackFlow(input);
  return analysis;
}

export async function getMarketAnalysis(
  input: MarketAnalysisInput
): Promise<MarketAnalysisOutput> {
  const analysis = await getMarketAnalysisFlow(input);
  return analysis;
}

export async function logout() {
  cookies().delete("firebase-session");
}
