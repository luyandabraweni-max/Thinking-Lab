import { describe, expect, it } from "vitest";
import { pageLines, SW_PROBLEMS, type Story } from "./logic";

describe("Story Weaver", () => {
  it("has a beginning, middle and end with three choices each, for every problem", () => {
    for (const p of Object.values(SW_PROBLEMS)) expect(p.steps.map(s => s.length)).toEqual([3, 3, 3]);
  });
  it("tells the story in full sentences, with the learner's own words and feelings", () => {
    const st: Story = { who: "gogo", whoName: "Gogo", where: "river", problem: "lost", title: "The Key", lesson: 1, other: { name: "Tumi the tortoise", feel: "worried" },
      pages: [{ event: SW_PROBLEMS.lost!.steps[0]![0]!, feeling: "brave", words: "She was not scared." }, { event: SW_PROBLEMS.lost!.steps[1]![0]! }, { event: SW_PROBLEMS.lost!.steps[2]![0]!, feeling: "happy" }] };
    expect(pageLines(st, 0)).toEqual(["Once upon a time, Gogo was by the river.", "Something precious was lost.", "Gogo looked everywhere for the lost key.", "Gogo felt brave.", "She was not scared."]);
    expect(pageLines(st, 2)).toEqual(["It was hiding in a basket all along!", "Gogo felt happy.", "Tumi the tortoise felt worried too.", "The lesson: keep trying, even when it's hard.", "The end."]);
  });
});
