import type { Village } from '../data/village-types';
import { createVillageAction, deleteVillageAction } from '../villages/actions';

type VillageCrudPanelProps = {
  villages: Village[];
};

export function VillageCrudPanel({ villages }: VillageCrudPanelProps) {
  const sampleScores = JSON.stringify(villages[0]?.scores ?? [], null, 2);
  const sampleImages = JSON.stringify(villages[0]?.images ?? [], null, 2);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-[16px] text-gray-900">Village CRUD</h2>
        <p className="text-[13px] text-gray-600">Create and delete villages directly through Supabase server actions.</p>
      </div>

      <form action={createVillageAction} className="grid gap-3 md:grid-cols-2">
        <input name="id" placeholder="id" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="name" placeholder="name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="district" placeholder="district" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="state" placeholder="state" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="lat" type="number" step="any" placeholder="latitude" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="lng" type="number" step="any" placeholder="longitude" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="population" type="number" placeholder="population" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="households" type="number" placeholder="households" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input name="overallScore" type="number" min="0" max="5" placeholder="overall score" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <textarea name="images" defaultValue={sampleImages} className="min-h-28 rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" required />
        <textarea name="scores" defaultValue={sampleScores} className="min-h-40 rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" required />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white md:col-span-2">Create village</button>
      </form>

      <div className="mt-6 space-y-2">
        <h3 className="text-[14px] text-gray-900">Delete village</h3>
        <div className="grid gap-2">
          {villages.map((village) => (
            <form key={village.id} action={deleteVillageAction} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
              <div>
                <p className="text-sm text-gray-900">{village.name}</p>
                <p className="text-xs text-gray-500">{village.id} · {village.state}</p>
              </div>
              <input type="hidden" name="id" value={village.id} />
              <button type="submit" className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700">Delete</button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}