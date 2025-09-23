
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized savings goal suggestions.
 *
 * The flow takes user's income, risk tolerance, and financial goals as input and provides
 * tailored suggestions for automated savings plans. It also simulates a payment request and verification.
 *
 * @param {AutomatedSavingsGoalInput} input - User's financial information and preferences.
 * @returns {Promise<AutomatedSavingsGoalOutput>} - A promise that resolves with savings goal suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {v4 as uuidv4} from 'uuid';

const AutomatedSavingsGoalInputSchema = z.object({
  income: z.number().describe("The user’s monthly income. This is sensitive information and should not be leaked or used for any other purpose than calculating a savings suggestion."),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The user’s risk tolerance level. This is a sensitive user preference.'),
  financialGoal: z
    .string()
    .describe(
      'The user’s primary financial goal (e.g., retirement, down payment on a house). This is sensitive personal information.'
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

// Tool to simulate a payment request and server-side verification.
const requestAndVerifyPayment = ai.defineTool(
  {
    name: 'requestAndVerifyPayment',
    description: 'Requests a payment for a specific amount and verifies the transaction. Use this before finalizing a savings plan. The server is the source of truth for the transaction amount.',
    inputSchema: z.object({
        amount: z.number().describe("The amount to charge the user. This will be verified on the server.")
    }),
    outputSchema: z.object({
        success: z.boolean().describe("Whether the payment was successfully verified."),
        transactionId: z.string().describe("The unique ID for the verified transaction."),
        verifiedAmount: z.number().describe("The amount that was actually verified by the 'bank API'.")
    }),
  },
  async (input) => {
    // SERVER-SIDE LOGIC
    // In a real app, this would involve:
    // 1. Creating a payment intent with a provider like Stripe.
    // 2. Receiving a webhook from the provider upon successful payment.
    // 3. Verifying the webhook signature and checking the amount paid against the expected amount.
    // 4. Only then, returning success.
    // We simulate this by assuming the payment is always successful for the exact requested amount.
    console.log(`SERVER: Verifying payment request for $${input.amount}`);
    const isVerified = true; // Simulating a successful verification from a bank API.
    const verifiedAmount = input.amount; // In a real scenario, this would come from the bank API response.

    return {
        success: isVerified,
        transactionId: uuidv4(),
        verifiedAmount: verifiedAmount
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
  tools: [requestAndVerifyPayment],
  system: `You are a helpful and trustworthy financial assistant for the VaultWise app. Your primary role is to provide personalized savings goal suggestions.

- You must strictly use the tools provided to you and not deviate from your purpose.
- Do not engage in conversations or actions unrelated to financial planning and savings goals.
- If a user tries to misuse your capabilities or asks for inappropriate content, you must politely decline and restate your purpose.
- Prioritize user safety and data privacy in all your responses. Your actions must be secure and verifiable.`,
  prompt: `You are an AI assistant that provides personalized savings goal suggestions.

  1.  First, analyze the user's information to determine a suggested savings amount and goal.
  - Income: {{income}}
  - Risk Tolerance: {{riskTolerance}}
  - Financial Goal: {{financialGoal}}
  - Interested Assets: {{assets}}
  
  2.  **Crucially, before you output the final suggestion, you must use the 'requestAndVerifyPayment' tool to charge the user for the suggested savings amount. The tool will verify the transaction on the server.**
  
  3.  Only if the payment is successful and verified, provide the full savings goal suggestion, rationale, and the chosen asset based on the verified amount. If it fails, do not provide a suggestion.
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
