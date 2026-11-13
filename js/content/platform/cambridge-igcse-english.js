"use strict";

// ---------- Cambridge IGCSE First Language English, for the new app only. Original passages and lessons. ----------
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const E = { subject: "English", curriculum: "Cambridge", domain: "Communication and Expression" };
  const READ = { h: "Read the passage", say: "Read the passage, or press Read aloud to hear it part by part." };
  const STORM = `<div class="passage-text"><p><b>The Storm</b> <span class="muted">(a 2to.iQ passage)</span></p>
<p>By four o'clock the sky over the township had turned the colour of a bruise. Mama Dlamini stopped sweeping and stood very still, the broom held like a spear. Somewhere a dog began to bark, then thought better of it.</p>
<p>The first drops were fat and slow, each one landing on the dust with a soft cough. Then the wind arrived, slamming doors that nobody had left open, and the rain came all at once, as if someone had tipped the sky over.</p>
<p>Lindiwe ran for the washing line. She was laughing, though she could not have said why. Her mother's voice followed her, sharp and worried, but the thunder swallowed it whole.</p></div>`;
  const WATER = `<div class="passage-text"><p><b>Saving water at school</b> <span class="muted">(a 2to.iQ article)</span></p>
<p>Last year our school used more water than any other in the district. Some of this was bad luck: a pipe burst under the netball court and went unnoticed for weeks. But much of it was habit. Taps were left running during break, and the gardens were watered at midday, when most of the water simply evaporated.</p>
<p>This year the Grade 10s took charge. They fitted cheap push-taps in the bathrooms, so a tap turns itself off after a few seconds. They moved garden watering to early morning. They also put up a chart outside the office showing the meter reading every Friday, which turned saving water into a competition between classes.</p>
<p>The result surprised everyone. In one term, water use fell by almost a third, and the money saved paid for new library books.</p></div>`;
  const PHONES = `<div class="passage-text"><p><b>Text A</b> <span class="muted">(from a principal's newsletter)</span></p>
<p>Phones have no place in the classroom. Every buzz breaks concentration, and every screen is a doorway to distraction. Since we began collecting phones at the gate, teachers report calmer lessons, and learners talk to each other again at break.</p>
<p><b>Text B</b> <span class="muted">(from a learner's blog)</span></p>
<p>Banning phones treats us like children. My phone is my dictionary, my calculator and, when the taxi is late, the only way to tell my gran I'm safe. Teach us to use them well; don't pretend they don't exist.</p></div>`;
  const SLEEP = `<div class="passage-text"><p><b>Why teenagers struggle to wake up</b> <span class="muted">(a 2to.iQ article)</span></p>
<p>Parents often blame late nights on laziness, but biology tells a different story. During adolescence, the body releases melatonin, the hormone that makes us sleepy, about two hours later than it does in childhood. A teenager who cannot fall asleep before eleven is not being stubborn; their body clock has genuinely shifted.</p>
<p>Screens make matters worse. The blue light from phones delays melatonin even further, and social media keeps the brain alert. Early school starts add to the problem, so many teenagers are always short of sleep.</p>
<p>Some schools that have moved their start time later report better attendance and fewer car accidents among teenage drivers. Simpler changes help too: switching off screens an hour before bed, and keeping wake-up times regular, even at weekends.</p></div>`;

  PLATFORM_UNITS.push(
  // ===================== CAMBRIDGE IGCSE ENGLISH, YEAR 1 (GRADE 10) =====================
  { ...E, id: "cam10-eng-meaning", grade: 10, title: "Explicit and implicit meaning", topic: "Reading", category: "Communication",
    caps: "Cambridge IGCSE First Language English (0500): Reading (explicit and implicit meanings and attitudes)",
    intention: "Today I am finding what a text says directly and what it suggests.", prompt: "How can you tell how someone feels without them saying it?",
    passage: STORM,
    lesson: [
      { ...READ, html: STORM },
      { h: "Explicit meaning", say: "Explicit information is stated directly in the text. The passage tells us plainly that Lindiwe ran for the washing line.", html: P("Explicit: <b>stated</b>. Find it and quote it.") },
      { h: "Implicit meaning", say: "Implicit meaning is suggested, not stated. Mama Dlamini holds the broom like a spear, which suggests she is tense and ready, as if facing an enemy.", html: P("Implicit: <b>inferred</b> from clues. Explain the clue.") }
    ],
    example: { q: "What does 'her mother's voice followed her, sharp and worried' suggest?", steps: ["Sharp suggests a raised, urgent tone.", "Worried tells us how the mother feels.", "Implicitly, the mother thinks Lindiwe may be in danger in the storm."] },
    questions: [
      { type: "mcq", q: "At what time had the sky changed colour?", options: ["By four o'clock", "At noon", "At midnight", "The passage doesn't say"], answer: 0, hints: ["This is explicit.", "Look at the first sentence.", "Four o'clock."], explain: "The first sentence says 'By four o'clock'." },
      { type: "mcq", q: "What is Mama Dlamini doing when the passage begins?", options: ["Sweeping", "Cooking", "Hanging washing", "Sleeping"], answer: 0, hints: ["It is stated directly.", "She stopped doing something.", "She stopped sweeping."], explain: "She 'stopped sweeping'." },
      { type: "mcq", q: "Why does the writer say the dog 'thought better of it'?", options: ["To suggest that even the dog sensed something frightening", "Because the dog was asleep", "To show the dog was clever", "Because the dog ran away"], answer: 0, hints: ["The dog starts barking, then stops.", "Why might an animal go quiet?", "It senses danger."], explain: "It suggests a tense, threatening atmosphere that even the dog feels." },
      { type: "mcq", q: "What does Lindiwe's laughter suggest about her?", options: ["She finds the storm exciting", "She is frightened", "She is angry with her mother", "She is bored"], answer: 0, hints: ["She laughs while running in the rain.", "Compare her with her mother.", "Excited, not afraid."], explain: "Unlike her mother, she finds the storm thrilling." },
      { type: "mcq", q: "Which of these is implicit rather than explicit?", options: ["Mama Dlamini is uneasy about the storm", "Lindiwe ran for the washing line", "The first drops were fat and slow", "A dog began to bark"], answer: 0, hints: ["Which one is never stated directly?", "Three are written in the passage.", "Her unease is suggested by the spear image."], explain: "Her unease is inferred; the others are stated." }
    ],
    reflect: R("Finding the exact words", "Explaining the clue", "Reading it aloud"),
    parent: "Your child found what a story states directly and what it suggests.",
    teacher: "Shows retrieving explicit information and inferring implicit meanings and attitudes, with reference to the text.",
    done: "Explicit: stated. Implicit: suggested by clues you can explain." },

  { ...E, id: "cam10-eng-effects", grade: 10, title: "Writer's effects", topic: "Reading: language analysis", category: "Creativity",
    caps: "Cambridge IGCSE First Language English (0500): Reading (how writers achieve effects and influence readers)",
    intention: "Today I am explaining how a writer's words create effects.", prompt: "Which words in a story have ever given you goosebumps?",
    passage: STORM,
    lesson: [
      { ...READ, html: STORM },
      { h: "Imagery", say: "Writers choose images to make us see and feel. The sky the colour of a bruise suggests something dark, painful and threatening.", html: chainRow(["colour of a bruise", "dark, painful", "threat"]) },
      { h: "Explaining effects", say: "To explain an effect, quote the words, say what they literally mean, then what they suggest, and how they make the reader feel.", html: chainRow(["Quote", "Literal meaning", "Suggestion", "Effect on the reader"]) }
    ],
    example: { q: "Explain the effect of 'as if someone had tipped the sky over'.", steps: ["Literally, a huge amount of rain fell suddenly.", "Tipping a container suggests all the water pouring out at once.", "It makes the storm feel sudden and overwhelming."] },
    questions: [
      { type: "mcq", q: "'Each one landing on the dust with a soft cough.' What technique is this?", options: ["Personification", "Alliteration", "A rhetorical question", "A statistic"], answer: 0, hints: ["Can a raindrop cough?", "A human action is given to a thing.", "Personification."], explain: "Coughing is a human action given to the raindrops." },
      { type: "mcq", q: "What does 'slamming doors that nobody had left open' suggest about the wind?", options: ["It is so strong it seems to force its way in", "It is gentle", "People left the doors open", "It is not windy"], answer: 0, hints: ["Nobody left them open…", "…yet they slam.", "The wind forces them."], explain: "The wind seems powerful enough to force closed doors." },
      { type: "mcq", q: "What effect does 'the thunder swallowed it whole' create?", options: ["The thunder is so loud the mother can't be heard", "The mother is eaten", "The thunder is quiet", "Lindiwe ignores her mother"], answer: 0, hints: ["What is swallowed?", "The mother's voice.", "It disappears in the noise."], explain: "The thunder drowns out her voice completely." },
      { type: "mcq", q: "What is the best first step when explaining a writer's effect?", options: ["Quote the exact words", "Summarise the whole story", "Give your opinion of the weather", "Count the sentences"], answer: 0, hints: ["Start with evidence.", "Which words?", "Quote them."], explain: "Start by quoting the exact words you will analyse." },
      { type: "mcq", q: "Why might the writer compare the broom to a spear?", options: ["To show Mama Dlamini is ready to face the storm like a warrior", "Because brooms are weapons", "To describe the colour of the broom", "To show she is lazy"], answer: 0, hints: ["What is a spear used for?", "Facing an enemy.", "The storm is the enemy."], explain: "It presents her as a warrior bracing for the storm." }
    ],
    reflect: R("Quoting first", "Literal, then suggested meaning", "Thinking about the reader's feelings"),
    parent: "Your child explained how a writer's word choices create atmosphere and feeling.",
    teacher: "Shows analysing imagery and figurative language, explaining literal and connotative meanings and their effect on the reader.",
    done: "Quote, explain the literal meaning, then what it suggests and how it makes you feel." },

  { ...E, id: "cam10-eng-summary", grade: 10, title: "Summary writing", topic: "Reading and writing: summary", category: "Planning and Organisation",
    caps: "Cambridge IGCSE First Language English (0500): Reading and writing (selecting relevant information and summarising it in your own words)",
    intention: "Today I am selecting the main points and summarising them.", prompt: "How would you tell a friend about a film in three sentences?",
    passage: WATER,
    lesson: [
      { ...READ, html: WATER },
      { h: "Selecting points", say: "A summary only includes points that answer the question. If the question asks how the school saved water, leave out the burst pipe, which explains the problem, not the solution.", html: chainRow(["Read the question", "Mark relevant points", "Leave out extras"]) },
      { h: "Own words, concisely", say: "Write the points in your own words, in a smooth paragraph, within the word limit. Don't add your own opinion.", html: P("Self-closing taps, early-morning watering, a weekly class competition.") }
    ],
    example: { q: "Summarise how the Grade 10s saved water, in one sentence.", steps: ["Point 1: taps that switch off by themselves.", "Point 2: watering early, so less evaporates. Point 3: a weekly chart that made it a competition.", "They fitted self-closing taps, watered the gardens early and made saving water a class competition with a weekly meter chart."] },
    questions: [
      { type: "mcq", q: "The question asks how the school saved water. Which point belongs in the summary?", options: ["Push-taps were fitted in the bathrooms", "A pipe burst under the netball court", "The school used the most water in the district", "New library books were bought"], answer: 0, hints: ["Only solutions belong.", "Which one is something they did to save water?", "Push-taps."], explain: "Push-taps are a way of saving water; the others are background or results." },
      { type: "mcq", q: "Why was watering at midday wasteful?", options: ["Most of the water evaporated", "The gardens were closed", "Learners were in class", "The taps were broken"], answer: 0, hints: ["It is in the first paragraph.", "What happens to water in the midday heat?", "Evaporation."], explain: "Most of the water evaporated." },
      { type: "mcq", q: "Which point should be left out of a summary of the solutions?", options: ["The burst pipe", "Early-morning watering", "The weekly meter chart", "Push-taps"], answer: 0, hints: ["Which one is not a solution?", "It is part of the problem.", "The pipe."], explain: "The burst pipe is part of the problem, not the solution." },
      { type: "mcq", q: "Which version is in your own words and concise?", options: ["Watering moved to early morning to reduce evaporation.", "They moved garden watering to early morning.", "The gardens, which had previously been watered at midday when the water evaporated, were now watered in the morning instead.", "I think watering is good."], answer: 0, hints: ["One copies the text exactly.", "One is too long, one is opinion.", "Short and in your own words."], explain: "It is brief, accurate and not copied." },
      { type: "mcq", q: "What should a summary NOT include?", options: ["Your own opinion", "The main points", "Your own words", "A clear paragraph"], answer: 0, hints: ["A summary reports the text.", "It doesn't comment on it.", "No opinions."], explain: "A summary reports the writer's points, not your views." }
    ],
    reflect: R("Re-reading the question", "Leaving out extras", "Using my own words"),
    parent: "Your child picked out the main points of an article and summarised them concisely.",
    teacher: "Shows selecting relevant information for a specific focus and summarising concisely in own words.",
    done: "Answer the question, keep only relevant points, use your own words and no opinions." },

  { ...E, id: "cam10-eng-letter", grade: 10, title: "Directed writing: a persuasive letter", topic: "Writing: directed writing", category: "Communication",
    caps: "Cambridge IGCSE First Language English (0500): Directed writing (using and developing ideas from reading; writing for a specific purpose, audience and register)",
    intention: "Today I am writing to persuade, using ideas from a text.", prompt: "What would you ask your principal to change?",
    lesson: [
      { h: "Purpose, audience, register", say: "Before you write, ask: why am I writing, who will read it, and how formal should I be? A letter to a principal needs a polite, formal register.", html: chainRow(["Purpose", "Audience", "Register"]) },
      { h: "Using the reading text", say: "Directed writing asks you to use ideas from a passage. Select the ideas, then develop them with your own reasons and examples, rather than copying.", html: P("Use the ideas; don't copy the sentences.") },
      { h: "Persuasive techniques", say: "Persuade with a clear opening, reasons in a logical order, evidence, a polite answer to objections, and a confident call to action.", html: chainRow(["Clear aim", "Reasons and evidence", "Answer objections", "Call to action"]) }
    ],
    example: { q: "Write an opening sentence for a letter to your principal asking for push-taps.", steps: ["Purpose: to persuade. Audience: the principal. Register: formal.", "State the request politely and clearly.", "'I am writing to ask whether the school could install push-taps, a simple change that would save both water and money.'"] },
    questions: [
      { type: "mcq", q: "Which greeting suits a formal letter to a principal?", options: ["Dear Mr Naidoo,", "Hey Naidoo!", "Yo, sir", "To whoever"], answer: 0, hints: ["Formal register.", "Use their title and name.", "Dear Mr…"], explain: "'Dear Mr Naidoo,' is polite and formal." },
      { type: "mcq", q: "What is the main purpose of a persuasive letter?", options: ["To convince the reader to agree or act", "To describe a place", "To tell a story", "To list facts only"], answer: 0, hints: ["Persuade means…", "…convince.", "To make them act."], explain: "Persuasive writing aims to convince." },
      { type: "mcq", q: "Which is the best way to answer an objection?", options: ["'Some may worry about the cost, but push-taps are cheap and soon pay for themselves.'", "'Anyone who disagrees is wrong.'", "Ignore all objections.", "'Cost doesn't matter.'"], answer: 0, hints: ["Acknowledge the worry.", "Then give a reason.", "Stay polite."], explain: "It respects the concern, then answers it with a reason." },
      { type: "mcq", q: "Which ending is a clear call to action?", options: ["'Could we discuss this at the next staff meeting?'", "'That is all.'", "'Water is wet.'", "'Bye.'"], answer: 0, hints: ["What should the reader do next?", "A specific, polite request.", "The meeting."], explain: "It asks for a specific next step." },
      { type: "mcq", q: "When using ideas from a reading passage, you should…", options: ["develop them in your own words", "copy whole sentences", "ignore the passage", "only use the title"], answer: 0, hints: ["Examiners reward development.", "Not copying.", "Your own words."], explain: "Select ideas and develop them in your own words." }
    ],
    reflect: R("Thinking about the reader", "Answering objections", "Ending with a clear request"),
    parent: "Your child planned a formal persuasive letter using ideas from an article.",
    teacher: "Shows adapting register for purpose and audience, developing ideas from reading, and using persuasive structure.",
    done: "Know your purpose and reader, develop the ideas, answer objections, end with a request." },

  { ...E, id: "cam10-eng-describe", grade: 10, title: "Descriptive writing", topic: "Writing: composition", category: "Creativity",
    caps: "Cambridge IGCSE First Language English (0500): Composition (descriptive writing: vocabulary, imagery, structure and atmosphere)",
    intention: "Today I am writing description that creates a vivid picture.", prompt: "What place do you know so well you could describe it with your eyes closed?",
    lesson: [
      { h: "Show, don't tell", say: "Description creates a picture in the reader's mind. Instead of saying the market was busy, show it: hawkers calling, the smell of roasting mielies, people squeezing past.", html: P("<b>Tell:</b> The market was busy.") + P("<b>Show:</b> Hawkers sang their prices over the hiss of the grills.") },
      { h: "All the senses", say: "Use more than sight. Sounds, smells, textures and even tastes make a place feel real.", html: chainRow(["See", "Hear", "Smell", "Touch", "Taste"]) },
      { h: "Structure", say: "Description still needs a structure. You might move through space, from the gate to the centre, or through time, from dawn to dusk, or zoom from a wide view to a small detail.", html: chainRow(["Wide view", "Closer", "One small detail"]) }
    ],
    example: { q: "Improve: 'It was a hot day.'", steps: ["Choose a sense: touch.", "Show the effect of the heat instead of naming it.", "'The tar softened under my shoes, and even the shade felt like breath on my neck.'"] },
    questions: [
      { type: "mcq", q: "Which sentence shows rather than tells?", options: ["Steam curled from the pot as the spoon knocked against its sides.", "The food was nice.", "It was a good kitchen.", "Cooking happened."], answer: 0, hints: ["Which one lets you see and hear it?", "Look for specific details.", "Steam, spoon, knocking."], explain: "Specific sights and sounds let the reader experience the scene." },
      { type: "mcq", q: "Which sense does 'the sour tang of overripe mangoes' appeal to?", options: ["Smell or taste", "Hearing", "Touch", "Sight only"], answer: 0, hints: ["Sour and tang.", "You can smell or taste these.", "Smell or taste."], explain: "Sour and tang appeal to smell and taste." },
      { type: "mcq", q: "Which is a good structure for a descriptive piece?", options: ["Zooming from a wide view to a small detail", "Listing facts in a table", "Writing the conclusion first", "Using only dialogue"], answer: 0, hints: ["Description moves the reader's eye.", "Like a camera.", "Wide to close."], explain: "Zooming in guides the reader like a camera." },
      { type: "mcq", q: "Why should description avoid long strings of adjectives?", options: ["It can feel cluttered; precise verbs and nouns often work better", "Adjectives are not allowed", "It makes writing too short", "Examiners can't read them"], answer: 0, hints: ["'The big, old, tall, grey, sad tree'…", "…feels heavy.", "Precise words are stronger."], explain: "One precise verb or noun often beats several adjectives." },
      { type: "mcq", q: "What is the main aim of descriptive writing?", options: ["To create a vivid picture and atmosphere", "To argue a point", "To give instructions", "To summarise a text"], answer: 0, hints: ["It isn't arguing or instructing.", "It paints a scene.", "Picture and atmosphere."], explain: "Description creates a picture and a mood." }
    ],
    reflect: R("Showing, not telling", "Using different senses", "Planning a structure"),
    parent: "Your child practised descriptive writing using the senses and a clear structure.",
    teacher: "Shows using precise vocabulary, sensory imagery and deliberate structure to create atmosphere.",
    done: "Show with the senses, choose precise words, and give the description a shape." },

  // ===================== CAMBRIDGE IGCSE ENGLISH, YEAR 2 (GRADE 11) =====================
  { ...E, id: "cam11-eng-compare", grade: 11, title: "Comparing viewpoints", topic: "Reading: comparing texts", category: "Flexible Thinking",
    caps: "Cambridge IGCSE First Language English (0500): Reading (comparing ideas, opinions and how writers present them across texts)",
    intention: "Today I am comparing what two writers think and how they persuade.", prompt: "Should phones be allowed at school? Why?",
    passage: PHONES,
    lesson: [
      { ...READ, html: PHONES },
      { h: "Identifying viewpoints", say: "A viewpoint is the writer's opinion. Text A argues phones harm learning. Text B argues phones are useful tools and learners should be trusted.", html: chainRow(["Text A: keep phones out", "Text B: teach good use"]) },
      { h: "Comparing how", say: "Compare not only what they think, but how they persuade. Text A uses evidence from teachers. Text B uses personal examples and an emotional appeal about safety.", html: P("Link your points: <b>whereas</b>, <b>similarly</b>, <b>in contrast</b>.") }
    ],
    example: { q: "Compare the evidence each writer uses.", steps: ["Text A uses reports from teachers about calmer lessons.", "Text B uses personal experience: dictionary, calculator, contacting gran.", "Whereas Text A relies on what staff have observed, Text B draws on one learner's everyday needs."] },
    questions: [
      { type: "mcq", q: "What is Text A's viewpoint?", options: ["Phones should be kept out of the classroom", "Phones are useful tools", "Learners should be trusted", "Phones are good for safety"], answer: 0, hints: ["It is the principal's newsletter.", "Look at the first sentence.", "'No place in the classroom.'"], explain: "Text A says phones have no place in the classroom." },
      { type: "mcq", q: "Which phrase in Text B appeals most to emotion?", options: ["'the only way to tell my gran I'm safe'", "'my calculator'", "'Banning phones'", "'Teach us'"], answer: 0, hints: ["Which one makes you feel something?", "Think about family and safety.", "Gran."], explain: "Safety and family make an emotional appeal." },
      { type: "mcq", q: "'Every screen is a doorway to distraction' is an example of…", options: ["a metaphor", "a simile", "a statistic", "a question"], answer: 0, hints: ["A screen isn't literally a doorway.", "No 'like' or 'as'.", "A metaphor."], explain: "It says a screen is a doorway, without 'like' or 'as'." },
      { type: "mcq", q: "Which linking word shows contrast?", options: ["Whereas", "Similarly", "Also", "Furthermore"], answer: 0, hints: ["Contrast shows difference.", "Three of these add or compare.", "Whereas."], explain: "'Whereas' introduces a difference." },
      { type: "mcq", q: "Which statement is a fair comparison?", options: ["Text A focuses on learning in class, while Text B focuses on phones' everyday uses", "Both texts want phones banned", "Text B uses statistics", "Neither text gives reasons"], answer: 0, hints: ["Check each claim against the texts.", "Do both want a ban?", "Look at their focus."], explain: "It accurately contrasts their focus." }
    ],
    reflect: R("Naming each viewpoint", "Comparing methods, not just ideas", "Using linking words"),
    parent: "Your child compared two writers' opinions and how each one persuades.",
    teacher: "Shows identifying viewpoints and comparing how writers use evidence and language to persuade, using comparative connectives.",
    done: "Compare what each writer thinks and how they persuade, linked with comparison words." },

  { ...E, id: "cam11-eng-tone", grade: 11, title: "Connotation and tone", topic: "Reading: language analysis", category: "Communication",
    caps: "Cambridge IGCSE First Language English (0500): Reading (how word choice, connotation and tone shape meaning)",
    intention: "Today I am exploring how word choices create tone.", prompt: "Have you ever been upset by how something was said, rather than what?",
    lesson: [
      { h: "Connotation", say: "Words have a dictionary meaning, called denotation, and associations, called connotation. Slim and skinny both mean thin, but slim sounds positive, and skinny can sound negative.", html: chainRow(["slim: positive", "skinny: negative"]) },
      { h: "Tone", say: "Tone is the writer's attitude, shown through word choice. It might be angry, admiring, sarcastic, nostalgic or hopeful.", html: P("Name the tone, then <b>quote the words</b> that create it.") },
      { h: "Building the analysis", say: "Pick a word, give its connotations, link them to the tone, and say how the reader is meant to feel.", html: chainRow(["Word", "Connotations", "Tone", "Reader's response"]) }
    ],
    example: { q: "'The developers bulldozed the old cinema.' What tone does 'bulldozed' create?", steps: ["Literally, a bulldozer knocks buildings down.", "It suggests force, carelessness and destruction.", "The tone is critical: the writer disapproves of the developers."] },
    questions: [
      { type: "mcq", q: "Which word has the most positive connotation for someone careful with money?", options: ["Thrifty", "Stingy", "Mean", "Tight-fisted"], answer: 0, hints: ["They all mean careful with money.", "Three sound like criticism.", "Thrifty sounds wise."], explain: "'Thrifty' suggests sensible saving; the others sound critical." },
      { type: "mcq", q: "'The so-called experts were wrong again.' What is the tone?", options: ["Sarcastic", "Admiring", "Neutral", "Joyful"], answer: 0, hints: ["'So-called' doubts their title.", "'Again' mocks them.", "Sarcastic."], explain: "'So-called' and 'again' mock the experts." },
      { type: "mcq", q: "'We would sit on Gogo's stoep, the evening smelling of rain and woodsmoke.' What is the tone?", options: ["Nostalgic", "Angry", "Sarcastic", "Urgent"], answer: 0, hints: ["'We would' looks back.", "Warm sensory memories.", "Fondness for the past."], explain: "It looks back fondly on the past: nostalgic." },
      { type: "mcq", q: "What is connotation?", options: ["The associations and feelings a word carries", "A word's dictionary meaning", "The number of syllables", "A type of punctuation"], answer: 0, hints: ["Not the dictionary meaning.", "That's denotation.", "Associations."], explain: "Connotation is what a word suggests beyond its dictionary meaning." },
      { type: "mcq", q: "Which word suggests a crowd is threatening?", options: ["Mob", "Gathering", "Audience", "Group"], answer: 0, hints: ["Which sounds out of control?", "Which might be violent?", "Mob."], explain: "'Mob' suggests an angry, uncontrolled crowd." }
    ],
    reflect: R("Comparing similar words", "Naming the tone", "Linking words to the reader's feelings"),
    parent: "Your child explored how word choice creates a writer's tone.",
    teacher: "Shows distinguishing denotation from connotation and analysing how lexical choices create tone.",
    done: "Words carry feelings. Name the tone and quote the words that create it." },

  { ...E, id: "cam11-eng-summary", grade: 11, title: "Summary: concise and in your own words", topic: "Reading and writing: summary", category: "Planning and Organisation",
    caps: "Cambridge IGCSE First Language English (0500): Reading and writing (summarising selected ideas concisely, fluently and in own words)",
    intention: "Today I am writing a concise summary in my own words.", prompt: "What time does your body want to sleep?",
    passage: SLEEP,
    lesson: [
      { ...READ, html: SLEEP },
      { h: "Finding the points", say: "First mark the points that answer the question. For why teenagers struggle to wake up, the reasons are a later body clock, blue light from screens, alert brains from social media, and early school starts.", html: chainRow(["Body clock shifts", "Blue light", "Social media", "Early starts"]) },
      { h: "Concise, own words", say: "Combine points into fluent sentences, use your own words where you can, and leave out examples, statistics and repetition.", html: P("Cut: 'A teenager who cannot fall asleep before eleven is not being stubborn.' That is an example.") }
    ],
    example: { q: "Summarise the causes in one sentence.", steps: ["Point 1: the sleep hormone arrives later in adolescence.", "Points 2 and 3: screens and social media keep them awake. Point 4: school starts early.", "Teenagers' body clocks shift later, screens and social media delay sleep further, and early school starts leave them short of rest."] },
    questions: [
      { type: "mcq", q: "Which is a reason teenagers struggle to wake up?", options: ["Melatonin is released later in adolescence", "Teenagers are lazy", "Car accidents", "Better attendance"], answer: 0, hints: ["The writer rejects one of these.", "Look for biology.", "Melatonin."], explain: "The later release of melatonin is a cause; the writer rejects laziness." },
      { type: "mcq", q: "For a summary of the CAUSES, which detail should be left out?", options: ["Fewer car accidents at schools that start later", "The body clock shifts later", "Blue light delays melatonin", "School starts early"], answer: 0, hints: ["Which one isn't a cause?", "It is a result of a solution.", "Car accidents."], explain: "Fewer accidents is a result of later starts, not a cause." },
      { type: "mcq", q: "Which is the most concise own-words version of 'the body releases melatonin … about two hours later than it does in childhood'?", options: ["Teenagers' sleep hormone arrives later.", "The body releases melatonin about two hours later than in childhood.", "Melatonin, a hormone, which is the hormone that makes us sleepy, comes later.", "Biology tells a different story."], answer: 0, hints: ["One is copied.", "One repeats itself.", "Short and own words."], explain: "It keeps the meaning in fewer, original words." },
      { type: "mcq", q: "What should you do with ideas that are repeated?", options: ["Combine them into one point", "Write them twice", "Add your opinion", "Quote them"], answer: 0, hints: ["Concise means no repetition.", "Merge them.", "One point."], explain: "Combine repeated ideas to stay concise." },
      { type: "mcq", q: "Which is a suggested solution, not a cause?", options: ["Switching off screens an hour before bed", "Blue light", "Early school starts", "A later body clock"], answer: 0, hints: ["Causes explain the problem.", "Solutions fix it.", "Switching off screens."], explain: "Switching off screens is a way to help, not a cause." }
    ],
    reflect: R("Marking the relevant points", "Cutting examples", "Combining ideas"),
    parent: "Your child wrote a concise summary of an article in their own words.",
    teacher: "Shows selecting points for a specific focus, excluding examples and repetition, and writing fluently in own words.",
    done: "Keep only what the question asks for, cut examples, and combine ideas in your own words." },

  { ...E, id: "cam11-eng-argue", grade: 11, title: "Argumentative writing", topic: "Writing: composition", category: "Communication",
    caps: "Cambridge IGCSE First Language English (0500): Composition (argumentative writing: structure, development of ideas and counter-argument)",
    intention: "Today I am building a strong argument, including the other side.", prompt: "What change at school would you argue for?",
    lesson: [
      { h: "A clear position", say: "An argument takes a clear position and supports it with reasons. State your view in the introduction, so the reader knows where you stand.", html: P("Thesis: <b>Schools should start at nine, not half past seven.</b>") },
      { h: "Paragraphs that prove", say: "Each paragraph makes one point, supports it with evidence or an example, then explains why it matters.", html: chainRow(["Point", "Evidence", "Explain"]) },
      { h: "The counter-argument", say: "Strong arguments deal with the other side. Present an objection fairly, then answer it with a reason.", html: P("<b>Some argue</b> later starts mean later finishes; <b>however</b>, rested learners learn faster.") }
    ],
    example: { q: "Write a topic sentence for a paragraph supporting later school starts.", steps: ["Choose one reason: sleep and learning.", "Make it a clear claim.", "'Starting later would let teenagers' body clocks work with learning, not against it.'"] },
    questions: [
      { type: "mcq", q: "Which is a clear thesis statement?", options: ["School uniforms should be optional in Grades 10 to 12.", "Uniforms are a thing.", "Some people like uniforms and some don't.", "What about uniforms?"], answer: 0, hints: ["A thesis takes a position.", "Which one says what should happen?", "The first."], explain: "It states a clear, arguable position." },
      { type: "mcq", q: "What is a counter-argument?", options: ["An opposing view you present and then answer", "An argument with your teacher", "A list of facts", "Your conclusion"], answer: 0, hints: ["Counter means against.", "The other side's view.", "Which you then answer."], explain: "You present the other side fairly, then rebut it." },
      { type: "mcq", q: "Which phrase best introduces a rebuttal?", options: ["However,", "Firstly,", "In addition,", "For example,"], answer: 0, hints: ["A rebuttal turns against the objection.", "You need a contrast word.", "However."], explain: "'However' signals you are answering the objection." },
      { type: "mcq", q: "What should follow evidence in a paragraph?", options: ["An explanation of why it supports your point", "A new, unrelated topic", "The conclusion", "A question to the reader"], answer: 0, hints: ["Point, evidence, …", "Don't leave evidence alone.", "Explain it."], explain: "Explain how the evidence proves your point." },
      { type: "mcq", q: "Which conclusion is strongest?", options: ["'A later start is a small change that would give us healthier, sharper learners: it is time to try it.'", "'That's it.'", "'In conclusion, I have written an essay.'", "'Some people agree.'"], answer: 0, hints: ["A conclusion restates the case.", "And leaves an impact.", "The first."], explain: "It restates the argument and ends with a call to act." }
    ],
    reflect: R("Stating my position clearly", "Point, evidence, explain", "Answering the other side"),
    parent: "Your child practised building an argument, including answering the other side.",
    teacher: "Shows formulating a thesis, structuring paragraphs with evidence and explanation, and handling counter-arguments.",
    done: "Clear position, one point per paragraph, answer the other side, end strongly." },

  { ...E, id: "cam11-eng-story", grade: 11, title: "Narrative writing: building tension", topic: "Writing: composition", category: "Creativity",
    caps: "Cambridge IGCSE First Language English (0500): Composition (narrative writing: structure, characterisation, tension and endings)",
    intention: "Today I am shaping a story and building tension.", prompt: "What makes you keep reading a story?",
    lesson: [
      { h: "The shape of a story", say: "A short story needs a clear shape: an opening that hooks, rising tension, a climax and a resolution. In a short piece, keep to a few characters and one main event.", html: chainRow(["Hook", "Rising tension", "Climax", "Resolution"]) },
      { h: "Building tension", say: "Slow time down at key moments. Use short sentences, sensory detail and information you hold back, so the reader is anxious to know what happens.", html: P("The handle turned. Slowly. Then stopped.") },
      { h: "Endings", say: "A good ending feels earned. It can resolve the problem, surprise the reader, or leave a meaningful question, but it should never feel rushed.", html: P("Avoid: 'And then I woke up. It was all a dream.'") }
    ],
    example: { q: "Rewrite to build tension: 'I heard a noise and went to see what it was.'", steps: ["Slow it down and add sensory detail.", "Use short sentences.", "'A scrape. Then silence. I put down my pen and listened, my heart loud in my ears.'"] },
    questions: [
      { type: "mcq", q: "Which opening hooks the reader best?", options: ["'Nobody believed Thabo when he said the river was rising.'", "'This is a story about a boy.'", "'Once upon a time there was a day.'", "'I will now tell you a story.'"], answer: 0, hints: ["A hook raises a question.", "Which makes you want to know more?", "Why didn't they believe him?"], explain: "It raises a question and hints at danger." },
      { type: "mcq", q: "Which technique builds tension?", options: ["Short sentences at a key moment", "Long lists of background facts", "Explaining everything at once", "Skipping the climax"], answer: 0, hints: ["Tension slows things down.", "Short, sharp sentences.", "The first."], explain: "Short sentences slow the moment and raise suspense." },
      { type: "mcq", q: "What is the climax of a story?", options: ["The moment of greatest tension or the turning point", "The first sentence", "The title", "The description of the setting"], answer: 0, hints: ["The tension rises towards it.", "Things change here.", "The turning point."], explain: "The climax is the peak of tension." },
      { type: "mcq", q: "Why should a short story have only a few characters?", options: ["So each can be developed in the space available", "Characters are not allowed", "To make it longer", "Examiners dislike names"], answer: 0, hints: ["Space is limited.", "Characters need development.", "Fewer, deeper."], explain: "Fewer characters can be developed properly." },
      { type: "mcq", q: "Which ending is weakest?", options: ["'Then I woke up and it was all a dream.'", "An ending that resolves the main problem", "An ending with a meaningful surprise", "An ending that leaves a thoughtful question"], answer: 0, hints: ["Which one cancels the whole story?", "It undoes everything.", "The dream ending."], explain: "The dream ending cancels the story instead of resolving it." }
    ],
    reflect: R("Planning the story's shape", "Short sentences for tension", "Choosing an earned ending"),
    parent: "Your child practised shaping a story and building tension.",
    teacher: "Shows structuring narrative, controlling pace to build tension, and crafting effective openings and endings.",
    done: "Hook, build tension, reach a climax, and end in a way the story has earned." }
  );
}
