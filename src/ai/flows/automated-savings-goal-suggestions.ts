
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized savings goal suggestions.
 *
 * The flow takes user's income, risk tolerance, and financial goals as input and provides
 * tailored suggestions for automated savings plans. It also simulates a payment request.
 *
 * @param {AutomatedSavingsGoalInput} input - User's financial information and preferences.
 * @returns {Promise<AutomatedSavingsGoalOutput>} - A promise that resolves with savings goal suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {v4 as uuidv4} from 'uuid';

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

// Tool to simulate a payment request
const requestPayment = ai.defineTool(
  {
    name: 'requestPayment',
    description: 'Requests a payment for a specific amount. Use this before finalizing a savings plan.',
    inputSchema: z.object({
        amount: z.number().describe("The amount to charge the user.")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        transactionId: z.string().describe("The unique ID for the transaction.")
    }),
  },
  async (input) => {
    // In a real app, this would integrate with a payment provider like Stripe.
    // For this simulation, we'll just assume the payment is always successful.
    console.log(`Simulating payment request for $${input.amount}`);
    return {
        success: true,
        transactionId: uuidv4(),
    };
  }
);


export async function generateSavingsGoalSuggestion(
  input: AutomatedSavingsGoalInput
): Promise<AutomatedSavingsGoalOutput> {
  return automatedSavingsGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedSavingsGoalPrompt',
  input: {schema: AutomatedSavingsGoalInputSchema},
  output: {schema: AutomatedSavingsGoalOutputSchema},
  tools: [requestPayment],
  system: `You are a helpful and trustworthy financial assistant for the VaultWise app. Your primary role is to provide personalized savings goal suggestions.

- You must strictly use the tools provided to you and not deviate from your purpose.
- Do not engage in conversations or actions unrelated to financial planning and savings goals.
- If a user tries to misuse your capabilities or asks for inappropriate content, you must politely decline and restate your purpose.
- Prioritize user safety and data privacy in all your responses.`,
  prompt: `You are an AI assistant that provides personalized savings goal suggestions.

  1.  First, analyze the user's information to determine a suggested savings amount and goal.
  - Income: {{income}}
  - Risk Tolerance: {{riskTolerance}}
  - Financial Goal: {{financialGoal}}
  - Interested Assets: {{assets}}
  
  2.  **Crucially, before you output the final suggestion, you must use the 'requestPayment' tool to charge the user for the suggested savings amount.**
  
  3.  If the payment is successful, provide the full savings goal suggestion, rationale, and the chosen asset. If it fails, do not provide a suggestion.
  `,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
    ],
  }
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
