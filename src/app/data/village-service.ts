import { listVillagesServer } from './village-server-repository';
import type { Village } from './village-types';

export async function getVillages(): Promise<Village[]> {
  return listVillagesServer();
}