# How the Thinking Lab adapts to each learner

**Status: provisional.** These rules were written before any specialist review, so the platform could start adapting while we wait. Every number below is a starting guess. Please challenge any of them. Each one is a single value in `js/core/adapt.js` (the `ADAPT` table), so changing it is quick.

## Principles

These follow the *Learner Differences and Adaptive Model* and the *Learner Profile Architecture*:

1. **Respond to what the learner does, not to a label.** No rule uses a diagnosis or a category. Rules only look at what happened in sessions: hints, "make it easier", moving on without an answer, breaks, and very quick wrong answers.
2. **Changes for the learner are gentle and can be undone on the spot.** Each one comes with a button to go back, for example "Show all the choices" or "Do all 8 questions".
3. **A change of level is never made by the platform.** It is suggested to an adult, with its evidence, and only happens if the adult chooses "Use this".
4. **Adults stay in control.** Parents and specialists can turn automatic changes off for a learner. They can see what is changing and why, and every decision is logged.
5. **No single moment decides anything.** Each rule needs several questions, and level suggestions need evidence from more than one day.

## What the learner sees during a session

| Rule | When it applies | What changes | How the learner undoes it |
|---|---|---|---|
| **Help sooner** | Help (hints, "make it easier" or moving on) was used on 60% or more of at least 6 questions in the last 3 session days | The "What would help?" choices appear after **1** wrong answer instead of 2, and after 45 seconds without an answer instead of 90 | They choose "Keep going" |
| **Shorter lessons** | Moved on without an answer 3 or more times in the last 3 session days | Lessons have 3 questions instead of all of them | "Do all N questions" on the lesson's first screen |
| **Fewer choices to start** | Chose "make it easier" on 3 of the last 6 questions in one learning area (for example maths) | Questions in that area start with 2 choices: the right one and one other | "Show all the choices" |
| **Regular break offers** | Chose a break on 2 or more of the last 3 session days | Every 4 questions, the learner is asked "Would a break help?" | They choose "Keep going" |
| **Take your time** | 2 wrong answers within 3 seconds of seeing the question, in one session | A one-time gentle message: "Take your time. Read the question again, then choose." | Nothing to undo |

The "fewer choices" rule switches itself off. Questions that start with 2 choices aren't counted as the learner asking for easier ones, so once they stop asking, the rule stops after about 6 questions.

## What adults see (parent Support tab, specialist Overview)

- **How the platform adapts for [learner]**: each automatic change that is on now, and the evidence behind it.
- **Suggested changes** to the learning level in one area, each with "Use this" or "Not now":

| Suggestion | When |
|---|---|
| **Ready for more**: try the next level | 80% or more of the last 8 questions at the current level in that area were answered right the first time with no help, on 2 or more different days |
| **May be too hard right now**: try the level below | On half or more of the last 6 questions at the current level in that area, the answer wasn't shown yet or the learner asked for it to be made easier, on 2 or more different days |

- "Not now" hides a suggestion for 2 weeks.
- A suggestion only offers a level that has lessons in that area.
- Every change is listed under **Changes made**, with the date and who made it.
- **Support used**: the specialist's recent sessions table shows hints, "made easier", "moved on", "took a break" and "answered very quickly" for each question.

"Answered right the first time with no help" now also excludes questions where the learner chose "make it easier". Before this change, those counted as answered without support.

## How specialists take part

- **Review the rules in the portal.** On the specialist home screen, choose "Review the adaptation rules". For each rule, a specialist says "Agree as it is", "Needs a change" or "Not sure yet", and can explain why. They can read other specialists' reviews and download them all for the 2to.iQ team.
- **Switch rules on or off for one learner.** In a learner's "Supports and plan" tab, each automatic change can be turned off on its own. The family sees every change in the log.
- **Plan the next session.** A specialist can choose up to 5 games, lessons or breaks. The learner sees them as "My plan today", marked as made by their teacher, and can still choose something else.

## Questions for the specialist review

1. Are 60% (help sooner) and 3 moves-on (shorter lessons) the right triggers? Should they differ by age group?
2. Is 3 seconds a fair line for "very quick"? It should catch guessing, not fast and confident learners.
3. Should "fewer choices to start" also apply to ordering and sorting questions? Today it only applies to choice questions.
4. Should the platform ever lower the level by itself in the moment, for example after a very hard lesson? Today only adults can.
5. Which of these should be explained to the learner, and how? Today the learner sees a short note only for "fewer choices" and "shorter lesson".
6. Moving on without answering might mean the work is too hard, too long, or not interesting. Should the platform ask the learner which?

## Other ways the platform adapts (set by the learner or an adult)

| Need in the Adaptive Model | In the platform |
|---|---|
| Captions for spoken content (deaf, hard of hearing) | "Show the words when it talks" in My way, setup and the parent's settings. Long read-alouds are captioned a sentence at a time. |
| Sign language video | Built in, but there are **no videos yet**. Recordings need a SASL interpreter. Each clip is matched to a spoken line (see `js/core/speech.js`), and the My way option appears once the first clip is added. |
| Eye gaze, head pointer | "Choose by resting the pointer" in setup: resting on a button for 1, 1.4 or 2 seconds chooses it, with a bar showing the time left. This works with the eye-tracking built into iPadOS and Windows, and with Tobii-style pointers. |
| Switch access | Single-switch scanning (already there) |
| Voice input (dysgraphia, motor) | "Let the learner answer by speaking" in setup, **off by default**. The learner says their answer ("square", "the first one", "twenty three") and then presses Check. Some browsers send the sound to Google or Apple to turn it into words, so the guardian must agree first. It is never the only way to answer. |
| Braille output | Works through the device's screen reader and a braille display. The platform doesn't need its own braille feature, but it still **needs testing with a real screen reader and display**. |
