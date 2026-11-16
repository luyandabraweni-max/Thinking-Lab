// Story Weaver (Communication and Expression), ported from js/activities/story.js.
// The learner builds a picture story: who, where, the problem, then a beginning, middle and end, each with a feeling.
// There is no right answer.
export interface Place { id: string; label: string; at: string; props: string[]; sky: string; ground: string }
export interface Problem { label: string; pic: string; line: string; steps: [string, string][][] }
export interface Page { event?: [string, string]; feeling?: string; words?: string; pic?: string }
export interface Story { who?: string; whoName: string; where?: string; problem?: string; pages: Page[]; other?: { name: string; feel: string }; lesson?: number; title?: string }

export const SW_WHO: [string, string, string][] = [["me", "Me", ""], ["gogo", "Gogo, a wise grandmother", "👵🏾"], ["tortoise", "Tumi the tortoise", "🐢"], ["robot", "Bolt the robot", "🤖"]];
export const SW_WHERE: Place[] = [
  { id: "river", label: "By the river", at: "by the river", props: ["🌊", "🪨", "🌿"], sky: "var(--sky)", ground: "var(--ok-soft)" },
  { id: "market", label: "At the market", at: "at the busy market", props: ["🍊", "🧺", "⛱️"], sky: "var(--gold-soft)", ground: "var(--brand-soft)" },
  { id: "school", label: "At school", at: "at school", props: ["🏫", "📚", "⚽"], sky: "var(--sky)", ground: "var(--brand-soft)" },
  { id: "moon", label: "On the Moon", at: "on the Moon", props: ["🌍", "⭐", "🚀"], sky: "var(--ink)", ground: "var(--line)" },
  { id: "night", label: "In the village at night", at: "in the village one night", props: ["🌙", "🏠", "✨"], sky: "var(--shape-c)", ground: "var(--brand-soft)" }
];
export const SW_PROBLEMS: Record<string, Problem> = {
  lost: { label: "Something is lost", pic: "🔍", line: "Something precious was lost.", steps: [
    [["🗝️", "{who} looked everywhere for the lost key."], ["🎩", "{who} asked everyone, \"Have you seen my hat?\""], ["👣", "{who} found strange footprints."]],
    [["🍞", "{who} followed a trail of crumbs."], ["🧗", "{who} climbed up high to look."], ["🗺️", "{who} drew a map of every place it could be."]],
    [["🧺", "It was hiding in a basket all along!"], ["🐐", "A goat had it, and gave it back."], ["🎁", "{who} found it, and something even better."]]] },
  storm: { label: "A storm is coming", pic: "⛈️", line: "A big storm was coming.", steps: [
    [["☁️", "Dark clouds rolled in over the hills."], ["🌬️", "The wind began to whistle."], ["🐓", "The animals ran to hide."]],
    [["📦", "{who} helped everyone carry things inside."], ["🪢", "{who} tied down the roof with rope."], ["🕯️", "{who} lit a lamp so no one was scared."]],
    [["🌈", "The storm passed and a rainbow came out."], ["🏠", "Everyone was safe and dry."], ["💃", "They danced in the puddles together."]]] },
  sad: { label: "A friend is sad", pic: "💛", line: "A friend was feeling very sad.", steps: [
    [["🪑", "{who}'s friend sat alone, looking down."], ["💧", "{who} heard someone crying."], ["⚽", "A friend had lost a game and felt bad."]],
    [["👂", "{who} sat down and listened."], ["🍎", "{who} shared a snack."], ["🤪", "{who} made a funny face."]],
    [["😊", "The friend smiled again."], ["🤝", "They played together all afternoon."], ["💌", "The friend said, \"Thank you for noticing me.\""]]] },
  broken: { label: "Something is broken", pic: "🔧", line: "Something important was broken.", steps: [
    [["🚰", "The water tap stopped working."], ["🚲", "The bicycle chain was broken."], ["📻", "The radio went quiet."]],
    [["🔍", "{who} looked closely to see what was wrong."], ["🧑🏾‍🔧", "{who} asked a clever neighbour for help."], ["💡", "{who} tried three different ideas."]],
    [["✨", "It worked better than ever!"], ["🧠", "It was fixed, and {who} learned how it works."], ["🛠️", "They made something new from the parts."]]] }
};
export const SW_FEEL: [string, string, string][] = [["happy", "😊", "happy"], ["worried", "😟", "worried"], ["surprised", "😮", "surprised"], ["brave", "💪", "brave"], ["sad", "😢", "sad"], ["calm", "😌", "calm"]];
export const SW_STAGES = ["The beginning", "The middle", "The end"];
export const SW_LESSONS = ["Asking for help works", "Keep trying, even when it's hard", "Friends make things better", "Look closely before you decide"];

export const fillWho = (t: string, name: string) => t.replace(/\{who\}/g, name);
/** The words on one page of the finished storybook. */
export function pageLines(st: Story, i: number): string[] {
  const p = st.pages[i]!, w = SW_WHERE.find(x => x.id === st.where)!, feel = p.feeling ? SW_FEEL.find(f => f[0] === p.feeling) : undefined;
  const out: string[] = [];
  if (i === 0) out.push(`Once upon a time, ${st.whoName} was ${w.at}.`, SW_PROBLEMS[st.problem!]!.line);
  if (p.event) out.push(fillWho(p.event[1], st.whoName));
  if (feel) out.push(`${st.whoName} felt ${feel[2]}.`);
  if (p.words) out.push(p.words);
  if (i === 2 && st.other) out.push(`${st.other.name} felt ${SW_FEEL.find(f => f[0] === st.other!.feel)![2]} too.`);
  if (i === 2 && st.lesson != null) out.push(`The lesson: ${SW_LESSONS[st.lesson]!.toLowerCase()}.`);
  if (i === 2) out.push("The end.");
  return out;
}
