'use server';

import { revalidatePath } from 'next/cache';
import { clusterMemoryFragments } from '@/ai/flows/cluster-memory-fragments';
import { getFragments, addFragment, updateClustering, setClusterMinted as setMinted } from '@/lib/data';

export type SubmitState = {
  message: string;
  success: boolean;
};

export async function submitFragmentAction(
  prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const text = formData.get('fragment') as string;
  const author = formData.get('author') as string;

  if (!text || text.length > 200 || !author) {
    return { message: 'Invalid input. Make sure your memory is under 200 characters.', success: false };
  }

  try {
    // 1. Add new fragment
    await addFragment({ text, author });
    
    // 2. Get all fragments to re-cluster
    const allFragments = await getFragments();
    const clusterInput = allFragments.map(f => ({ id: f.id, text: f.text }));
    
    // 3. Call AI to cluster them
    const newClusters = await clusterMemoryFragments(clusterInput);
    
    // 4. Update the data store with new cluster assignments
    await updateClustering(newClusters);
    
    revalidatePath('/');
    revalidatePath('/map');
    
    return { message: 'Memory fragment woven into the collective.', success: true };
  } catch (error) {
    console.error(error);
    return { message: 'An AI error occurred. Please try again.', success: false };
  }
}

export async function mintClusterAction(clusterId: string): Promise<{ success: boolean; message: string }> {
    try {
        await setMinted(clusterId);
        revalidatePath(`/chain/${clusterId}`);
        revalidatePath('/map');
        return { success: true, message: 'Memory chain minted successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to mint cluster.' };
    }
}
