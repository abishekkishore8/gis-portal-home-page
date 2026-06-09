import { listVillagesServer } from '../src/app/data/village-server-repository';
import { getSiteContentServer } from '../src/app/data/site-content-repository';
import { HomePage } from '../src/app/pages/HomePage';

export default async function Page() {
  const [villages, siteContent] = await Promise.all([listVillagesServer(), getSiteContentServer()]);

  return <HomePage initialVillages={villages} siteContent={siteContent} />;
}