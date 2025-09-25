
'use server';
/**
 * @fileOverview A Genkit flow for analyzing precious metals market data.
 *
 * This flow takes a string of market data, analyzes it, and provides a brief
 * assessment of the market situation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Define the input schema (but do not export it)
const MarketAnalysisInputSchema = z.object({
  marketData: z.string().describe('A string containing the current precious metals prices and changes.'),
  lastUpdated: z.string().describe('The last time the data was updated.'),
  language: z.enum(['tr', 'en']).describe('The language for the AI-generated response.'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

// 2. Define the output schema (but do not export it)
const MarketAnalysisOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis of the market data.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

// 3. Define the exported server action
export async function getMarketAnalysis(
  input: MarketAnalysisInput
): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}

// 4. Define the prompt
const prompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: {schema: MarketAnalysisInputSchema},
  output: {schema: MarketAnalysisOutputSchema},
  system: 'You are a financial expert. You provide brief and concise analysis of precious metals prices.',
  prompt: `Analyze the following precious metals prices and provide a brief assessment of the market situation.
  Your response MUST be in the language specified in the '{{language}}' input field.

Market Data:
{{{marketData}}}

Last updated: {{lastUpdated}}
`,
});

// 5. Define the flow (but do not export it)
const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
