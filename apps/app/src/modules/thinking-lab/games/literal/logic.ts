// The Literal Robot (Logical and Analytical Thinking: sequencing and debugging), ported from js/activities/literal.js.
// Cards: gives = what it makes true; needs = what must be true first, with what Bolt does if it isn't;
// silly = always goes wrong; extra = harmless but not needed. Any order that reaches the goal with nothing silly works.
export interface Card { id: string; t: string; pic: string; did?: string; gives?: string[]; needs?: Record<string, string>; silly?: string; extra?: boolean }
export interface Task { title: string; goal: string[]; order: string[]; cards: Card[] }
export interface RunEvent { id: string; ok: boolean; extra?: boolean; text: string }

export const LITERAL_TASKS: Record<"younger" | "older", Task[]> = {
  younger: [
    { title: "Make a sandwich", goal: ["done"], order: ["bread", "open", "spread", "close"], cards: [
      { id: "bread", t: "Take two slices of bread", pic: "🍞", did: "Bolt takes two slices of bread.", gives: ["bread"] },
      { id: "open", t: "Open the peanut butter jar", pic: "🫙", did: "Bolt opens the jar.", gives: ["open"] },
      { id: "spread", t: "Spread peanut butter on the bread", pic: "🔪", did: "Bolt spreads peanut butter on the bread.", gives: ["spread"],
        needs: { bread: "Bolt spreads peanut butter on the table. There is no bread yet!", open: "Bolt rubs the closed jar on the bread. Nothing comes out!" } },
      { id: "close", t: "Put the two slices together", pic: "🥪", did: "Bolt puts the slices together. A sandwich!", gives: ["done"], needs: { spread: "Bolt squashes two plain slices together. That's just bread!" } },
      { id: "dance", t: "Do a happy dance", pic: "💃", did: "Bolt does a happy dance. Not needed, but fun!", extra: true }] },
    { title: "Go out in the rain", goal: ["coat", "out", "umbrella"], order: ["coat", "door", "walk", "umbrella"], cards: [
      { id: "coat", t: "Put on your raincoat", pic: "🧥", did: "Bolt puts on the raincoat.", gives: ["coat"] },
      { id: "door", t: "Open the front door", pic: "🚪", did: "Bolt opens the door.", gives: ["door"] },
      { id: "walk", t: "Walk outside", pic: "🚶", did: "Bolt walks outside.", gives: ["out"], needs: { door: "Bolt walks into the closed door. Bonk!", coat: "Bolt walks out with no raincoat. Soaking wet!" } },
      { id: "umbrella", t: "Open the umbrella", pic: "☂️", did: "Bolt opens the umbrella. Nice and dry!", gives: ["umbrella"], needs: { out: "Bolt opens the umbrella inside. It gets stuck in the doorway!" } },
      { id: "boots", t: "Put on gumboots", pic: "👢", did: "Bolt puts on gumboots. Good thinking!", extra: true }] }
  ],
  older: [
    { title: "Plant a bean", goal: ["covered", "watered", "sun"], order: ["soil", "hole", "bean", "cover", "water", "sun"], cards: [
      { id: "soil", t: "Fill the pot with soil", pic: "🪴", did: "Bolt fills the pot with soil.", gives: ["soil"] },
      { id: "hole", t: "Push a finger in to make a hole", pic: "👉", did: "Bolt makes a neat hole.", gives: ["hole"], needs: { soil: "Bolt pokes the bottom of an empty pot. There's no soil yet!" } },
      { id: "bean", t: "Drop the bean into the hole", pic: "🫘", did: "Bolt drops the bean in.", gives: ["bean"], needs: { hole: "Bolt drops the bean on top. A bird swoops down and eats it!" } },
      { id: "cover", t: "Cover the bean with soil", pic: "🤲", did: "Bolt covers the bean.", gives: ["covered"], needs: { bean: "Bolt covers the hole, but the bean is still in the packet!" } },
      { id: "water", t: "Water the pot", pic: "💧", did: "Bolt waters the pot.", gives: ["watered"], needs: { soil: "Bolt pours water into an empty pot. It runs out of the bottom!", covered: "Bolt waters the open hole. The bean floats away!" } },
      { id: "sun", t: "Put the pot on a sunny windowsill", pic: "☀️", did: "Bolt puts the pot in the sun.", gives: ["sun"] },
      { id: "dark", t: "Put the pot in a dark cupboard", pic: "🗄️", silly: "Bolt shuts the pot in a dark cupboard. Beans need light to grow!" }] },
    { title: "Make a cup of tea", goal: ["ready"], order: ["fill", "boil", "bag", "pour", "out"], cards: [
      { id: "fill", t: "Fill the kettle with water", pic: "🚰", did: "Bolt fills the kettle.", gives: ["water"] },
      { id: "boil", t: "Switch the kettle on until it boils", pic: "⚡", did: "Bolt boils the water.", gives: ["hot"], needs: { water: "Bolt boils an empty kettle. It smells like burning!" } },
      { id: "bag", t: "Put a teabag in the cup", pic: "🍵", did: "Bolt puts a teabag in the cup.", gives: ["bag"] },
      { id: "pour", t: "Pour the hot water into the cup", pic: "🫖", did: "Bolt pours. The tea turns brown.", gives: ["tea"],
        needs: { water: "Bolt tips the empty kettle. Nothing comes out!", hot: "Bolt pours cold water. Brrr, cold tea!", bag: "Bolt pours hot water into an empty cup. That's just hot water!" } },
      { id: "out", t: "Take the teabag out", pic: "🥄", did: "Bolt takes the teabag out. Tea is ready!", gives: ["ready"], needs: { tea: "Bolt takes a dry teabag out of the cup. There's no tea yet!" } },
      { id: "milk", t: "Add a little milk", pic: "🥛", did: "Bolt adds milk. Some people like it that way!", extra: true },
      { id: "kettlebag", t: "Put the teabag in the kettle", pic: "🫗", silly: "Bolt puts the teabag in the kettle. Now the kettle needs a big wash!" }] }
  ]
};
// Runs a program exactly as written: each step either works, goes wrong in a funny way, or is a harmless extra.
export function literalRun(task: Task, plan: string[]) {
  const have = new Set<string>(), events: RunEvent[] = [];
  plan.forEach(id => {
    const card = task.cards.find(c => c.id === id)!;
    if (card.silly) { events.push({ id, ok: false, text: card.silly }); return; }
    const missing = Object.keys(card.needs || {}).find(k => !have.has(k));
    if (missing) { events.push({ id, ok: false, text: card.needs![missing]! }); return; }
    (card.gives || []).forEach(g => have.add(g));
    events.push({ id, ok: true, extra: !!card.extra, text: card.did! });
  });
  const reached = task.goal.every(g => have.has(g));
  return { events, ok: reached && events.every(e => e.ok), reached };
}
