'use server';

/**
 * @fileOverview An AI-powered tool that analyzes memory fragments and groups similar fragments into clusters.
 * 
 * - clusterMemoryFragments - A function that handles the clustering process.
 * - ClusterMemoryFragmentsInput - The input type for the clusterMemoryFragments function.
 * - ClusterMemoryFragmentsOutput - The return type for the ClusterMemoryFragments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClusterMemoryFragmentsInputSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string().describe('The memory fragment text.'),
  })
).describe('An array of memory fragments to cluster.');
export type ClusterMemoryFragmentsInput = z.infer<typeof ClusterMemoryFragmentsInputSchema>;

const ClusterMemoryFragmentsOutputSchema = z.array(
  z.object({
    clusterId: z.string().describe('The ID of the cluster.'),
    fragmentIds: z.array(z.string()).describe('An array of memory fragment IDs belonging to this cluster.'),
  })
).describe('An array of memory fragment clusters.');
export type ClusterMemoryFragmentsOutput = z.infer<typeof ClusterMemoryFragmentsOutputSchema>;

export async function clusterMemoryFragments(input: ClusterMemoryFragmentsInput): Promise<ClusterMemoryFragmentsOutput> {
  return clusterMemoryFragmentsFlow(input);
}

const clusterMemoryFragmentsPrompt = ai.definePrompt({
  name: 'clusterMemoryFragmentsPrompt',
  input: {schema: ClusterMemoryFragmentsInputSchema},
  output: {schema: ClusterMemoryFragmentsOutputSchema},
  prompt: `You are an AI assistant that helps to cluster memory fragments based on keyword similarity, sentiment analysis, and a touch of randomness.

Given the following memory fragments, group them into clusters of similar memories. Each cluster should have a unique cluster ID.

Fragments:
{{#each this}}
- ID: {{this.id}}, Text: {{this.text}}
{{/each}}

Return the clusters as a JSON array of objects, where each object has a clusterId and an array of fragmentIds.

Output format: 
\`\`\`
[
  {
    "clusterId": "1",
    "fragmentIds": ["id1", "id2"]
  },
  {
    "clusterId": "2",
    "fragmentIds": ["id3", "id4"]
  }
]
\`\`\`
`,
});

const clusterMemoryFragmentsFlow = ai.defineFlow(
  {
    name: 'clusterMemoryFragmentsFlow',
    inputSchema: ClusterMemoryFragmentsInputSchema,
    outputSchema: ClusterMemoryFragmentsOutputSchema,
  },
  async input => {
    const {output} = await clusterMemoryFragmentsPrompt(input);
    return output!;
  }
);
