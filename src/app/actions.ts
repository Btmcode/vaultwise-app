
"use server";

import {
  generateSavingsGoalSuggestion,
  type AutomatedSavingsGoalInput,
  type AutomatedSavingsGoalOutput,
} from "@/ai/flows/automated-savings-goal-suggestions";

export async function getAutomatedSavingsGoal(
  input: AutomatedSavingsGoalInput
): Promise<AutomatedSavingsGoalOutput> {
  // In a real app, you would add user authentication checks here.
  const suggestion = await generateSavingsGoalSuggestion(input);
  return suggestion;
}
