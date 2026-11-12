import catalogueData from "../data/catalogue.json";
import type { CatalogueEntry, Pack } from "./types";

// Public interface of the content module.
export type { CatalogueEntry, ChoiceQuestion, LessonPage, NumberQuestion, OrderQuestion, Pack, Question, SortQuestion, Unit, WordHelp } from "./types";
export * from "./curriculum";

/** Every lesson's summary. Small, so it ships with the app; full lessons come in packs. */
export const CATALOGUE = catalogueData as CatalogueEntry[];

const packs = import.meta.glob<{ default: Pack }>("../data/units-*.json");
const loaded = new Map<string, Promise<Pack>>();
/** One level's lessons and word help, downloaded the first time it's needed. */
export function loadPack(pack: string): Promise<Pack> {
  const load = packs[`../data/units-${pack}.json`];
  if (!load) return Promise.reject(new Error(`No lesson pack called ${pack}.`));
  if (!loaded.has(pack)) loaded.set(pack, load().then(m => m.default));
  return loaded.get(pack)!;
}
export async function loadUnit(id: string) {
  const entry = CATALOGUE.find(u => u.id === id);
  if (!entry) throw new Error(`No lesson called ${id}.`);
  const pack = await loadPack(entry.pack);
  return { unit: pack.units.find(u => u.id === id)!, words: pack.words[id] };
}
