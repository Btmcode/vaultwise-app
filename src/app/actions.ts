
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
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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

export async function logout(lang: 'tr' | 'en') {
  cookies().delete("firebase-session");
  // Revalidate the root layout to ensure all cached user data is cleared
  revalidatePath('/', 'layout');
  // Redirect to the login page for the current language
  redirect(`/${lang}/login`);
}
