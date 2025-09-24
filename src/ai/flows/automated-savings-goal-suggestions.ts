
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized savings goal suggestions.
 *
 * The flow takes user's income, risk tolerance, and financial goals as input and provides
 * tailored suggestions for automated savings plans.
 *
 * @param {AutomatedSavingsGoalInput} input - User's financial information and preferences.
 * @returns {Promise<AutomatedSavingsGoalOutput>} - A promise that resolves with savings goal suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedSavingsGoalInputSchema = z.object({
  income: z.number().describe("The user’s monthly income."),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The user’s risk tolerance level.'),
  financialGoal: z
    .string()
    .describe(
      'The user’s primary financial goal (e.g., retirement, down payment on a house).'
    ),
  assets: z
    .array(z.string())
    .describe('The assets that the user is interested in (e.g., Gold, Bitcoin)'),
  language: z.enum(['tr', 'en']).describe('The language for the AI-generated response.'),
});
export type AutomatedSavingsGoalInput = z.infer<
  typeof AutomatedSavingsGoalInputSchema
>;

const AutomatedSavingsGoalOutputSchema = z.object({
  suggestedGoal: z
    .string()
    .describe(
      'A personalized savings goal suggestion based on the user’s input.'
    ),
  suggestedAmount: z
    .number()
    .describe(
      'The suggested amount to save regularly (e.g., monthly or weekly).'
    ),
  suggestedAsset: z
    .string()
    .describe('The suggested asset to save in (e.g., Gold, Bitcoin).'),
  rationale: z
    .string()
    .describe(
      'The rationale behind the suggested goal, amount, and asset, explaining how it aligns with the user’s input.'
    ),
});
export type AutomatedSavingsGoalOutput = z.infer<
  typeof AutomatedSavingsGoalOutputSchema
>;

export async function generateSavingsGoalSuggestion(
  input: AutomatedSavingsGoalInput
): Promise<AutomatedSavingsGoalOutput> {
  return automatedSavingsGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedSavingsGoalPrompt',
  input: {schema: AutomatedSavingsGoalInputSchema},
  output: {schema: AutomatedSavingsGoalOutputSchema},
  system: `You are a helpful financial assistant for the VaultWise app. Your primary role is to provide personalized and actionable savings goal suggestions.

- You must analyze the user's income, risk tolerance, and financial goals to create a realistic and suitable savings plan.
- The suggested amount should be a reasonable percentage of the user's income.
- The suggested asset should align with the user's risk tolerance and interests.
- Your response must be encouraging and easy to understand.`,
  prompt: `You are an AI assistant that provides personalized savings goal suggestions.

  **CRITICAL:** You MUST generate your response (suggestedGoal, rationale, etc.) in the language specified in the '{{language}}' input field.

  Based on the user's information, create a compelling and personalized savings suggestion.
  - Income: {{income}}
  - Risk Tolerance: {{riskTolerance}}
  - Financial Goal: {{financialGoal}}
  - Interested Assets: {{assets}}

  Provide a clear goal, a specific monthly savings amount, a suggested asset from their interests, and a simple rationale explaining your choices.
  `,
});

const automatedSavingsGoalFlow = ai.defineFlow(
  {
    name: 'automatedSavingsGoalFlow',
    inputSchema: AutomatedSavingsGoalInputSchema,
    outputSchema: AutomatedSavingsGoalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
