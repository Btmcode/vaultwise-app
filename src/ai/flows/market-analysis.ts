
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
  marketData: z.string().describe('A string containing the current precious metals prices, changes, and 24h high/low.'),
  lastUpdated: z.string().describe('The last time the data was updated.'),
  language: z.enum(['tr', 'en']).describe('The language for the AI-generated response.'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

// 2. Define the output schema (but do not export it)
const MarketAnalysisOutputSchema = z.object({
  sentiment: z.enum(['Yükseliş', 'Düşüş', 'Nötr']).describe("The overall market sentiment based on the data. Use 'Yükseliş' for bullish, 'Düşüş' for bearish, 'Nötr' for neutral."),
  keyAsset: z.string().describe("The name of the asset that is most noteworthy or has the most significant movement (e.g., 'Has Altın', 'Gümüş/ONS')."),
  analysis: z.string().describe('The AI-generated analysis of the market data, explaining the sentiment and key asset choice in 2-3 sentences.'),
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
  system: `You are a financial expert specializing in precious metals. You provide brief, insightful, and concise analysis of market data for a non-expert audience.
- First, determine the overall market sentiment (Yükseliş, Düşüş, or Nötr) by looking at the general trend of the provided assets.
- Second, identify the single 'keyAsset' that shows the most interesting or significant activity (e.g., largest percentage change, breaking a high/low, or unusual stability).
- Finally, write a brief analysis (2-3 sentences) explaining your sentiment and why you chose the key asset. The analysis should be easy to understand for a non-expert. Be direct and clear.`,
  prompt: `Analyze the following precious metals prices and provide a brief assessment of the market situation, including overall sentiment, a key asset, and the rationale.
  Your response MUST be in the language specified in the '{{language}}' input field.

Market Data (Format: ASSET: Alış, Değişim %, 24s En Yüksek/En Düşük):
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
