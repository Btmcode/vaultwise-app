
'use server';
/**
 * @fileOverview A Genkit flow for analyzing and categorizing user feedback.
 *
 * This flow takes user-submitted text, analyzes its sentiment, and classifies it
 * into a predefined category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Define the input schema
const FeedbackAnalysisInputSchema = z.object({
  feedbackText: z.string().describe('The user’s feedback message.'),
});
export type FeedbackAnalysisInput = z.infer<typeof FeedbackAnalysisInputSchema>;

// 2. Define the output schema
const FeedbackAnalysisOutputSchema = z.object({
  category: z
    .enum(['Bug Report', 'Feature Request', 'General Praise', 'Complaint', 'Other'])
    .describe('The category of the feedback.'),
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The sentiment of the feedback.'),
});
export type FeedbackAnalysisOutput = z.infer<
  typeof FeedbackAnalysisOutputSchema
>;

// 3. Define the exported server action
export async function analyzeFeedback(
  input: FeedbackAnalysisInput
): Promise<FeedbackAnalysisOutput> {
  return feedbackAnalysisFlow(input);
}

// 4. Define the prompt
const prompt = ai.definePrompt({
  name: 'feedbackAnalysisPrompt',
  input: {schema: FeedbackAnalysisInputSchema},
  output: {schema: FeedbackAnalysisOutputSchema},
  system: `You are an expert at analyzing user feedback. Your task is to categorize the feedback into one of the following categories: 'Bug Report', 'Feature Request', 'General Praise', 'Complaint', or 'Other'. You also need to determine the sentiment of the feedback: 'Positive', 'Negative', or 'Neutral'.`,
  prompt: `Analyze the following user feedback and provide a category and sentiment.

Feedback: {{{feedbackText}}}
`,
});

// 5. Define the flow
const feedbackAnalysisFlow = ai.defineFlow(
  {
    name: 'feedbackAnalysisFlow',
    inputSchema: FeedbackAnalysisInputSchema,
    outputSchema: FeedbackAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
