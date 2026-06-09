import { VillageCrudPanel } from '../../src/app/components/VillageCrudPanel';
import { getSiteContentServer } from '../../src/app/data/site-content-repository';
import { listVillagesServer } from '../../src/app/data/village-server-repository';
import { VillagesPage } from '../../src/app/pages/VillagesPage';

export default async function Page() {
  const [villages, siteContent] = await Promise.all([listVillagesServer(), getSiteContentServer()]);

  return (
    <div className="min-h-screen bg-gray-100">
      <VillagesPage initialVillages={villages} siteContent={siteContent} />
    </div>
  );
}