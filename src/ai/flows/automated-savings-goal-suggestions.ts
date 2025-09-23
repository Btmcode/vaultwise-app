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
  income: z.number().describe('The user\u2019s monthly income.'),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The user\u2019s risk tolerance level.'),
  financialGoal: z
    .string()
    .describe(
      'The user\u2019s primary financial goal (e.g., retirement, down payment on a house).'
    ),
  assets: z
    .array(z.string())
    .describe('The assets that the user is interested in (e.g., Gold, Bitcoin)'),
});
export type AutomatedSavingsGoalInput = z.infer<
  typeof AutomatedSavingsGoalInputSchema
>;

const AutomatedSavingsGoalOutputSchema = z.object({
  suggestedGoal: z
    .string()
    .describe(
      'A personalized savings goal suggestion based on the user\u2019s input.'
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
      'The rationale behind the suggested goal, amount, and asset, explaining how it aligns with the user\u2019s input.'
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
  prompt: `You are an AI assistant that provides personalized savings goal suggestions based on user input.

  Consider the user's income, risk tolerance, and financial goals to generate a tailored suggestion.

  Here's the user's information:
  - Income: {{income}}
  - Risk Tolerance: {{riskTolerance}}
  - Financial Goal: {{financialGoal}}
  - Interested Assets: {{assets}}

  Generate a savings goal suggestion, a suggested amount to save regularly, a suggested asset to save in, and a rationale for your suggestions.
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
