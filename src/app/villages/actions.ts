'use server';

import { revalidatePath } from 'next/cache';
import type { VillageUpdate } from '../data/village-db';
import { createVillageServer, deleteVillageServer, updateVillageServer } from '../data/village-server-repository';

export async function createVillageAction(formData: FormData) {
  await createVillageServer(formData);
  revalidatePath('/');
  revalidatePath('/villages');
}

export async function updateVillageAction(id: string, patch: VillageUpdate) {
  await updateVillageServer(id, patch);
  revalidatePath('/');
  revalidatePath('/villages');
}

export async function deleteVillageAction(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) {
    throw new Error('Village id is required.');
  }

  await deleteVillageServer(id);
  revalidatePath('/');
  revalidatePath('/villages');
}