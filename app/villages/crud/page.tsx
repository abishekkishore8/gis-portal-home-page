import { listVillagesServer } from '../../../src/app/data/village-server-repository';
import { VillageCrudPanel } from '../../../src/app/components/VillageCrudPanel';

export default async function Page() {
  const villages = await listVillagesServer();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl px-6 py-6">
        <VillageCrudPanel villages={villages} />
      </div>
    </div>
  );
}
