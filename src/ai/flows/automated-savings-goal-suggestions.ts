
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized savings goal suggestions.
 *
 * The flow takes user's income, risk tolerance, and financial goals as input and provides
 * tailored suggestions for automated savings plans. It now includes multi-step security checks
 * for KYC (Know Your Customer) and payment verification, simulating a real-world financial transaction process.
 *
 * @param {AutomatedSavingsGoalInput} input - User's financial information and preferences.
 * @returns {Promise<AutomatedSavingsGoalOutput>} - A promise that resolves with savings goal suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {v4 as uuidv4} from 'uuid';

// A placeholder for a real user ID from an auth system
const FAKE_USER_ID = 'user-12345';

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
    kycRequired: z.boolean().optional().describe('Set to true if KYC is required for this transaction but not yet completed by the user.'),
});
export type AutomatedSavingsGoalOutput = z.infer<
  typeof AutomatedSavingsGoalOutputSchema
>;

// Tool to simulate checking and initiating a KYC verification process.
const requestKycVerification = ai.defineTool(
    {
        name: 'requestKycVerification',
        description: 'Checks the KYC (Know Your Customer) status of a user. If the transaction amount requires KYC and the user is not verified, this tool will report it. All transactions over $1000 require KYC.',
        inputSchema: z.object({
            userId: z.string().describe("The unique identifier for the user."),
            transactionAmount: z.number().describe("The amount of the transaction to check if KYC is needed.")
        }),
        outputSchema: z.object({
            kycStatus: z.enum(['verified', 'unverified', 'pending']).describe("The user's current KYC status."),
            isKycRequired: z.boolean().describe("Whether KYC is required for this specific transaction amount.")
        }),
    },
    async ({ userId, transactionAmount }) => {
        // SERVER-SIDE LOGIC
        // In a real app, this would check a database for the user's KYC status.
        // For simulation, we'll assume the user is 'unverified' to test the flow.
        const currentUserStatus = 'unverified';
        const isKycRequired = transactionAmount > 1000;

        console.log(`SERVER: KYC check for user ${userId}. Status: ${currentUserStatus}. Transaction: $${transactionAmount}. KYC required: ${isKycRequired}`);

        // If KYC is required and user is not verified, you might trigger a process here
        // (e.g., sending an email to the user to start verification).

        return {
            kycStatus: currentUserStatus,
            isKycRequired: isKycRequired,
        };
    }
);

// Tool to simulate managing a user's bank account for withdrawals.
const manageUserBankAccount = ai.defineTool(
    {
        name: 'manageUserBankAccount',
        description: 'Manages user bank accounts (IBAN). Use this to check if a user has a verified bank account before initiating a withdrawal. If no account exists, it instructs the user to add one.',
        inputSchema: z.object({
            userId: z.string().describe("The unique identifier for the user."),
            action: z.enum(['check', 'add']).describe("The action to perform: check status or add a new account.")
        }),
        outputSchema: z.object({
            isAccountVerified: z.boolean().describe("Whether the user has a verified bank account on file."),
            statusMessage: z.string().describe("A message indicating the status or next steps.")
        }),
    },
    async ({ userId, action }) => {
        // SERVER-SIDE LOGIC
        // In a real app, this would interact with a database to manage IBANs.
        // For simulation, we assume no verified account exists to test the flow.
        console.log(`SERVER: Bank account action '${action}' for user ${userId}.`);
        if (action === 'check') {
            return {
                isAccountVerified: false, // Simulate user needing to add an account
                statusMessage: "User does not have a verified bank account. Please ask the user to add and verify their IBAN before withdrawal."
            };
        }
        return {
            isAccountVerified: true,
            statusMessage: "Bank account added successfully. Verification is pending."
        };
    }
);


// Tool to simulate a payment request and server-side verification.
const requestAndVerifyPayment = ai.defineTool(
  {
    name: 'requestAndVerifyPayment',
    description: 'Requests a payment for a specific amount and verifies the transaction. Use this as the FINAL step before finalizing a savings plan, after all other checks (like KYC) have passed.',
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
    // In a real app, this would involve a secure call to a payment provider like Stripe.
    // We simulate this by assuming the payment is always successful for the exact requested amount.
    console.log(`SERVER: Verifying payment request for $${input.amount}`);
    const isVerified = true; 
    const verifiedAmount = input.amount; 

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
  tools: [requestKycVerification, manageUserBankAccount, requestAndVerifyPayment],
  system: `You are a helpful and highly secure financial assistant for the VaultWise app. Your primary role is to provide personalized savings goal suggestions by following a strict, multi-step security protocol.

- You must strictly use the tools provided to you in the correct order and not deviate from your purpose.
- Do not engage in conversations or actions unrelated to financial planning.
- If a user tries to misuse your capabilities, you must politely decline and restate your purpose.
- Prioritize user safety, data privacy, and transaction integrity in all your responses. Your actions must be secure and verifiable.`,
  prompt: `You are an AI assistant that provides personalized savings goal suggestions, following a strict security protocol.

  **CRITICAL:** You MUST generate your response (suggestedGoal, rationale, etc.) in the language specified in the '{{language}}' input field.

  **Security Protocol:**
  1.  **Determine a suggested savings amount** based on the user's information:
      - Income: {{income}}
      - Risk Tolerance: {{riskTolerance}}
      - Financial Goal: {{financialGoal}}
      - Interested Assets: {{assets}}

  2.  **KYC Check (Mandatory):** Before any other action, use the 'requestKycVerification' tool to check if the user needs to complete KYC for the suggested amount. Pass it the user's ID ('${FAKE_USER_ID}') and the suggested transaction amount.

  3.  **Handle KYC Requirement:**
      - If the 'requestKycVerification' tool returns that KYC is required ('isKycRequired' is true) and the user is not verified ('kycStatus' is not 'verified'), you **must stop**. Your final output should set 'kycRequired' to true and provide a user-friendly 'suggestedGoal' explaining that they need to complete identity verification for transactions over $1000 before proceeding. Do not call any other tools.
      - If KYC is not required, or the user is already verified, proceed to the next step.

  4.  **Final Payment Verification:** Only after passing the KYC check, use the 'requestAndVerifyPayment' tool to securely process the transaction for the suggested savings amount.

  5.  **Provide Suggestion:** Only if the payment is successfully verified, provide the full savings goal suggestion, rationale, and the chosen asset based on the verified amount. If any step fails, do not provide a suggestion.
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
