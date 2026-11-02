"use strict";

// ---------- Learn units: Grade 7 (CAPS Senior Phase: Mathematics, English HL, Natural Sciences, Life Orientation). Original content. ----------
const STORY_KAYA = `<div class="passage-text"><p><b>The Last Bus</b> <span class="muted">(a 2to.iQ short story)</span></p>
<p>Kaya checked her phone again. 17:52. The last bus to Mdantsane left at six, and she was still three blocks from the rank.</p>
<p>She had stayed late to finish the science project, because her partner, Ludwe, had not shown up. Again.</p>
<p>She ran. Her school bag bounced against her back like a drum. At the corner, an old man was struggling to lift a crate of oranges onto his cart. Kaya slowed down. If she stopped, she would miss the bus. If she didn't, he might hurt himself.</p>
<p>She stopped. Together they lifted the crate. "Enkosi, ntombi," he said, and pressed two oranges into her hands.</p>
<p>When she reached the rank, the bus was pulling away. Kaya's heart sank. Then she saw Ludwe at the back window, waving wildly at the driver. The bus stopped.</p>
<p>"I'm sorry about today," Ludwe said as she sat down, breathing hard. Kaya handed him an orange. "Tomorrow," she said, "you're doing the poster."</p></div>`;
const UNITS_G7 = [
  // ===================== GRADE 7 MATHEMATICS =====================
  { id: "g7-integers", grade: 7, subject: "Mathematics", title: "Integers: below zero", topic: "Ordering, adding and subtracting integers", domain: "Logical and Analytical Thinking", category: "Flexible Thinking",
    caps: "CAPS Grade 7 Mathematics, Term 3: Integers (count, order and compare integers; add and subtract integers; integers in context)",
    intention: "Today I am working with numbers below zero.", prompt: "How did the number line help you?",
    lesson: [
      { h: "Numbers below zero", say: "Integers are whole numbers, including negative numbers. Negative numbers are less than zero. Minus five degrees is colder than zero degrees.", html: chainRow(["−3", "−2", "−1", "0", "1", "2", "3"]) + P("Numbers to the <b>left</b> of 0 are <b>negative</b>. The further left, the smaller.") },
      { h: "Comparing integers", say: "Minus eight is less than minus two, because it is further left on the number line.", html: chainRow(["−8", "<", "−2"]) + P("Think of temperature: −8 °C is colder than −2 °C.") },
      { h: "Adding and subtracting", say: "Adding a positive number moves right. Subtracting moves left. Minus three plus five equals two. Two minus six equals minus four.", html: chainRow(["−3 + 5 = 2", "2 − 6 = −4"]) + P("Subtracting a negative is the same as adding: 4 − (−3) = 4 + 3 = 7.") }
    ],
    example: { q: "At 6 am it was −4 °C in Sutherland. By noon it was 9 degrees warmer. What was the temperature at noon?", steps: ["Warmer means add.", "Start at −4 and move 9 to the right.", "−4 + 9 = 5 °C."] },
    questions: [
      { type: "mcq", q: "Which is the smallest?", options: ["−7", "−1", "0", "3"], answer: 0, hints: ["Picture the number line.", "Negative numbers are left of zero.", "−7 is furthest left."], explain: "−7 is the smallest." },
      { type: "num", q: "What is −6 + 10?", answer: "4", options: ["4", "−16", "16", "−4"], hints: ["Start at −6.", "Move 10 to the right.", "You pass 0 after 6 steps, then 4 more."], explain: "−6 + 10 = 4." },
      { type: "num", q: "What is 3 − 8?", answer: "−5", options: ["−5", "5", "11", "−11"], hints: ["Start at 3.", "Move 8 to the left.", "3 steps gets you to 0, then 5 more."], explain: "3 − 8 = −5." },
      { type: "num", q: "What is 5 − (−2)?", answer: "7", options: ["7", "3", "−7", "−3"], hints: ["Subtracting a negative is adding.", "5 + 2.", "7."], explain: "5 − (−2) = 5 + 2 = 7." },
      { type: "order", q: "Order from smallest to biggest.", items: ["−9", "−4", "0", "6"], orderLabel: "smallest to biggest", hints: ["Negatives come first.", "−9 is further left than −4.", "Then 0, then 6."], explain: "−9, −4, 0, 6." },
      { type: "mcq", q: "A diver is 12 m below sea level and swims up 5 m. Where is she now?", options: ["−7 m", "−17 m", "7 m", "17 m"], answer: 0, hints: ["Below sea level is negative: −12.", "Up means add.", "−12 + 5."], explain: "−12 + 5 = −7, so 7 m below sea level." }
    ],
    reflect: { q: "What helped you most?", options: ["The number line", "Thinking about temperature", "The rule for subtracting negatives", "Not sure"] },
    parent: "Your child compared, added and subtracted negative and positive numbers.",
    teacher: "Shows ordering integers and adding and subtracting integers, including subtracting a negative, in context.",
    done: "Negative numbers are less than zero. Use a number line to add and subtract." },

  { id: "g7-exponents", grade: 7, subject: "Mathematics", title: "Squares, cubes and roots", topic: "Exponents", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 7 Mathematics, Term 1: Exponents (squares, cubes, square roots and cube roots; exponential form)",
    intention: "Today I am using exponents to write repeated multiplication.", prompt: "How is squaring different from doubling?",
    lesson: [
      { h: "Exponential form", say: "Two to the power of four means two times two times two times two, which is sixteen. The small number is the exponent.", html: chainRow(["2⁴", "=", "2 × 2 × 2 × 2", "=", "16"]) + P("The <b>base</b> is 2. The <b>exponent</b> 4 says how many times to multiply it.") },
      { h: "Squares and cubes", say: "Five squared is five times five, which is twenty-five. Three cubed is three times three times three, which is twenty-seven.", html: chainRow(["5² = 25", "3³ = 27"]) + PICS("🟩 🧊", "A square and a cube") + P("<b>Squared</b> makes the area of a square. <b>Cubed</b> makes the volume of a cube.") },
      { h: "Roots undo powers", say: "The square root of forty-nine is seven, because seven squared is forty-nine. The cube root of eight is two, because two cubed is eight.", html: chainRow(["√49 = 7", "∛8 = 2"]) + P("A <b>root</b> works backwards.") }
    ],
    example: { q: "A square garden has an area of 64 m². How long is each side?", steps: ["Area of a square = side × side.", "Which number times itself is 64?", "8 × 8 = 64, so each side is 8 m."] },
    questions: [
      { type: "num", q: "What is 6 squared?", answer: "36", options: ["36", "12", "66", "18"], hints: ["Squared means times itself.", "6 × 6.", "36."], explain: "6² = 6 × 6 = 36." },
      { type: "num", q: "What is 4 cubed?", answer: "64", options: ["64", "12", "16", "43"], hints: ["Cubed means three times.", "4 × 4 × 4.", "16 × 4."], explain: "4³ = 64." },
      { type: "num", q: "What is the square root of 81?", answer: "9", options: ["9", "40,5", "8", "18"], hints: ["Which number times itself is 81?", "Try 9 × 9.", "9."], explain: "√81 = 9." },
      { type: "mcq", q: "Which is the same as 10 × 10 × 10?", options: ["10³", "3¹⁰", "30", "10 × 3"], answer: 0, hints: ["Count how many tens.", "Three tens multiplied.", "10 to the power 3."], explain: "10 × 10 × 10 = 10³ = 1 000." },
      { type: "mcq", q: "Which is bigger, 2⁵ or 5²?", options: ["2⁵", "5²"], fixed: true, answer: 0, hints: ["Work out each one.", "2⁵ = 32 and 5² = 25.", "32 is bigger."], explain: "2⁵ = 32 is bigger than 5² = 25." }
    ],
    reflect: { q: "What helped you?", options: ["Writing out the multiplication", "Thinking of squares and cubes", "Working backwards for roots", "Not sure"] },
    parent: "Your child worked with squares, cubes, square roots and cube roots.",
    teacher: "Shows exponential notation, calculating squares and cubes, and finding square and cube roots.",
    done: "An exponent tells you how many times to multiply. Roots work backwards." },

  { id: "g7-equations", grade: 7, subject: "Mathematics", title: "Solving simple equations", topic: "Algebraic equations", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 7 Mathematics, Term 3: Algebraic equations (write equations from descriptions; solve by inspection and by trial and improvement)",
    intention: "Today I am finding the missing number in an equation.", prompt: "How did you check your answer?",
    lesson: [
      { h: "What is an equation?", say: "An equation says two things are equal. x plus four equals ten. The letter x stands for a number we do not know yet.", html: chainRow(["x + 4", "=", "10"]) + P("An <b>equation</b> is balanced, like a scale.") },
      { h: "Undo to solve", say: "To solve x plus four equals ten, undo adding four by subtracting four. Ten minus four is six, so x is six.", html: chainRow(["x + 4 = 10", "x = 10 − 4", "x = 6"]) + P("Use the <b>opposite operation</b> to find x.") },
      { h: "Always check", say: "Put your answer back in. Six plus four equals ten. It works.", html: chainRow(["6 + 4 = 10", "✓"]) + P("<b>Substitute</b> your answer to check it.") }
    ],
    example: { q: "Solve 3x = 21.", steps: ["3x means 3 times x.", "Undo times 3 by dividing by 3: 21 ÷ 3.", "x = 7. Check: 3 × 7 = 21."] },
    questions: [
      { type: "num", q: "Solve: x + 9 = 15", answer: "6", options: ["6", "24", "15", "9"], hints: ["Undo adding 9.", "15 − 9.", "6."], explain: "x = 15 − 9 = 6." },
      { type: "num", q: "Solve: 4y = 32", answer: "8", options: ["8", "28", "128", "36"], hints: ["Undo times 4.", "32 ÷ 4.", "8."], explain: "y = 32 ÷ 4 = 8." },
      { type: "num", q: "Solve: m − 7 = 12", answer: "19", options: ["19", "5", "84", "12"], hints: ["Undo subtracting 7.", "Add 7.", "12 + 7."], explain: "m = 12 + 7 = 19." },
      { type: "mcq", q: "Thabo thinks of a number, doubles it and adds 3. He gets 17. Which equation fits?", options: ["2n + 3 = 17", "n + 2 + 3 = 17", "3n + 2 = 17", "2(n + 3) = 17"], answer: 0, hints: ["Doubling is times 2.", "Then add 3.", "2n + 3."], explain: "2n + 3 = 17." },
      { type: "num", q: "Solve: 2n + 3 = 17", answer: "7", options: ["7", "10", "14", "8,5"], hints: ["First undo adding 3: 17 − 3.", "Then undo times 2.", "14 ÷ 2."], explain: "2n = 14, so n = 7." }
    ],
    reflect: { q: "What helped you most?", options: ["Thinking of a balance", "Using the opposite operation", "Checking my answer", "Not sure"] },
    parent: "Your child solved simple equations by undoing operations and checking the answer.",
    teacher: "Shows writing and solving one- and two-step linear equations by inverse operations and substitution.",
    done: "Undo each operation to find the unknown, then check." },

  // ===================== GRADE 7 ENGLISH HOME LANGUAGE =====================
  { id: "g7-story", grade: 7, subject: "English Home Language", title: "Short story: The Last Bus", topic: "Plot, conflict and character", domain: "Communication and Expression", category: "Reflection",
    caps: "CAPS Grade 7 English Home Language: Reading and Viewing (short story: plot, conflict, character, setting; inference)",
    intention: "Today I am reading a short story and analysing its plot and conflict.", prompt: "What would you have done in Kaya's place?",
    passage: STORY_KAYA,
    lesson: [
      { h: "Read the story", say: "Read the story, or press Read aloud to hear it part by part.", html: STORY_KAYA },
      { h: "Conflict", say: "Conflict is the problem in a story. Kaya faces an inner conflict: help the old man, or catch the bus.", html: chainRow(["Kaya", "vs", "time"]) + P("<b>Inner conflict</b> is a struggle inside a character's mind. <b>Outer conflict</b> is with another person or with the world.") },
      { h: "Plot and character", say: "The climax is the moment of greatest tension, when the bus pulls away. We learn about characters from what they do. Kaya stops to help, so she is kind.", html: chainRow(["Setting", "Rising action", "Climax", "Resolution"]) + P("<b>Show, don't tell</b>: actions reveal character.") }
    ],
    example: { q: "What does Kaya's choice to stop tell us about her?", steps: ["She knew she might miss the bus.", "She still chose to help a stranger.", "She is kind and puts others first."] },
    questions: [
      { type: "mcq", q: "Where is the story set?", options: ["On the way to a bus rank", "At a soccer match", "In a classroom", "On a farm"], answer: 0, hints: ["Where is Kaya running to?", "She needs to catch a bus.", "The bus rank."], explain: "Kaya is rushing through town to the bus rank." },
      { type: "mcq", q: "What is Kaya's inner conflict?", options: ["Whether to help the man or catch the bus", "Whether to buy oranges", "Whether to do her project", "Whether to call her mother"], answer: 0, hints: ["It is a choice in her mind.", "Two things she wants pull against each other.", "The bus or the old man."], explain: "She must choose between helping and catching the bus." },
      { type: "mcq", q: "Her school bag bounced against her back like a drum. What is this?", options: ["A simile", "A metaphor", "Personification", "Hyperbole"], answer: 0, hints: ["Look for like or as.", "It uses like.", "A simile."], explain: "It compares using like, so it is a simile." },
      { type: "mcq", q: "Why does Ludwe stop the bus?", options: ["He feels sorry for letting her down", "He wants an orange", "The driver asks him", "He missed his stop"], answer: 0, hints: ["What does he say to Kaya?", "I'm sorry about today.", "He wants to make up for it."], explain: "He apologises, so he is trying to make up for not helping with the project." },
      { type: "order", q: "Put the plot in order.", items: ["Kaya is late because she worked alone", "She stops to help the old man", "The bus pulls away", "Ludwe stops the bus"], orderLabel: "first to last", hints: ["Why is she late?", "What happens on the way?", "The climax, then the resolution."], explain: "Late, helps the man, the bus leaves, Ludwe stops it." }
    ],
    reflect: { q: "How did you understand the story best?", options: ["Reading it myself", "Listening to it", "Thinking about the choice", "Not sure"] },
    parent: "Your child read a short story and analysed its conflict, plot and characters.",
    teacher: "Shows identifying setting, inner conflict, plot structure, a simile and inferring character motivation.",
    done: "Stories are driven by conflict, and actions reveal character." },

  { id: "g7-figurative", grade: 7, subject: "English Home Language", title: "Figures of speech", topic: "Simile, metaphor, personification, hyperbole", domain: "Communication and Expression", category: "Creativity",
    caps: "CAPS Grade 7 English Home Language: Language Structures and Conventions; Literature (figurative language: simile, metaphor, personification, hyperbole, alliteration)",
    intention: "Today I am identifying figures of speech and their effect.", prompt: "Which figure of speech do you use when you talk?",
    lesson: [
      { h: "Simile and metaphor", say: "A simile compares using like or as. He ran like the wind. A metaphor says one thing is another. The classroom was a zoo.", html: chainRow(["Simile: like / as", "Metaphor: is"]) + P("Both compare. A <b>metaphor</b> is stronger because it says the thing <b>is</b> the other.") },
      { h: "Personification", say: "Personification gives human actions to things that are not human. The wind whispered through the trees.", html: `<div class="passage-text"><p>The wind <b>whispered</b> through the trees.</p></div>` + P("Wind cannot whisper. It is given a <b>human</b> action.") },
      { h: "Hyperbole and alliteration", say: "Hyperbole is huge exaggeration. I have told you a million times. Alliteration repeats the first sound. Seven slippery snakes.", html: chainRow(["Hyperbole: a million times", "Alliteration: seven slippery snakes"]) + P("Writers use these for <b>effect</b>: to make us feel, see or remember.") }
    ],
    example: { q: "What figure of speech is: My bag weighs a ton?", steps: ["Does the bag really weigh a ton?", "No, it is a huge exaggeration.", "It is hyperbole."] },
    questions: [
      { type: "mcq", q: "Her smile was as bright as the sun. What is this?", options: ["Simile", "Metaphor", "Alliteration", "Hyperbole"], answer: 0, hints: ["Look for like or as.", "As bright as.", "Simile."], explain: "It compares using as, so it is a simile." },
      { type: "mcq", q: "The old car groaned up the hill. What is this?", options: ["Personification", "Simile", "Hyperbole", "Alliteration"], answer: 0, hints: ["Can a car groan?", "Groaning is a human action.", "Personification."], explain: "A car is given a human action: personification." },
      { type: "mcq", q: "Time is a thief. What is this?", options: ["Metaphor", "Simile", "Alliteration", "Personification"], answer: 0, hints: ["Is there like or as?", "No. Time is said to be a thief.", "Metaphor."], explain: "It says time is a thief, so it is a metaphor." },
      { type: "mcq", q: "Big brown bears bounce. What is this?", options: ["Alliteration", "Hyperbole", "Metaphor", "Simile"], answer: 0, hints: ["Listen to the first sounds.", "B, b, b, b.", "Alliteration."], explain: "The repeated b sound is alliteration." },
      { type: "mcq", q: "What is the effect of: I'm so hungry I could eat a horse?", options: ["It shows how very hungry the speaker is", "It tells us the speaker likes horses", "It describes a horse", "It is a fact"], answer: 0, hints: ["Is it meant to be true?", "It exaggerates.", "It emphasises the hunger."], explain: "The hyperbole emphasises extreme hunger." }
    ],
    reflect: { q: "Which figure of speech is easiest to spot?", options: ["Simile", "Metaphor", "Personification", "Hyperbole"] },
    parent: "Your child identified similes, metaphors, personification, hyperbole and alliteration.",
    teacher: "Shows identifying figures of speech and explaining their effect.",
    done: "Figures of speech help writers create pictures and feelings." },

  { id: "g7-reported", grade: 7, subject: "English Home Language", title: "Direct and reported speech", topic: "Direct and indirect speech", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade 7 English Home Language: Language Structures and Conventions (direct and indirect speech; tense changes; punctuation)",
    intention: "Today I am changing direct speech into reported speech.", prompt: "What changes when you report what someone said?",
    lesson: [
      { h: "Direct speech", say: "Direct speech gives the exact words, inside speech marks. Sipho said, I am tired.", html: `<div class="passage-text"><p>Sipho said, "I am tired."</p></div>` + P("<b>Direct</b>: the exact words in inverted commas.") },
      { h: "Reported speech", say: "Reported speech tells what someone said without their exact words. Sipho said that he was tired.", html: `<div class="passage-text"><p>Sipho said that he was tired.</p></div>` + P("<b>Reported</b> (indirect): no speech marks, often with <b>that</b>.") },
      { h: "What changes", say: "In reported speech, the tense moves back. Am becomes was. Will becomes would. I becomes he or she. Today becomes that day.", html: chainRow(["am → was", "will → would", "I → he/she", "today → that day", "here → there"]) + P("Pronouns, tenses and time words <b>shift</b>.") }
    ],
    example: { q: "Change to reported speech: Lindi said, \"I will call you tomorrow.\"", steps: ["Remove the speech marks and add that.", "I becomes she. Will becomes would. You becomes me or the listener.", "Lindi said that she would call me the next day."] },
    questions: [
      { type: "mcq", q: "Which is reported speech?", options: ["Ama said that she was hungry.", "Ama said, \"I am hungry.\"", "\"I am hungry,\" said Ama.", "Ama: I am hungry."], answer: 0, hints: ["Reported speech has no speech marks.", "It often uses that.", "The first one."], explain: "Ama said that she was hungry. is reported speech." },
      { type: "mcq", q: "Neo said, \"I am playing soccer.\" Report it.", options: ["Neo said that he was playing soccer.", "Neo said that I am playing soccer.", "Neo said he is play soccer.", "Neo said that he will play soccer."], answer: 0, hints: ["I becomes he.", "Am playing moves back to was playing.", "Neo said that he was playing soccer."], explain: "I → he, am → was." },
      { type: "mcq", q: "In reported speech, will usually becomes …", options: ["would", "was", "shall", "will"], answer: 0, hints: ["The tense moves back.", "Will → …", "Would."], explain: "Will becomes would." },
      { type: "mcq", q: "Mom said, \"Come here.\" Which is correct reported speech?", options: ["Mom told me to come there.", "Mom said come here.", "Mom told me that come here.", "Mom said, come here."], answer: 0, hints: ["A command becomes told someone to.", "Here becomes there.", "Mom told me to come there."], explain: "Commands are reported with told … to, and here becomes there." },
      { type: "mcq", q: "Which word often joins the reporting verb to the reported words?", options: ["that", "but", "because", "and"], answer: 0, hints: ["He said … he was tired.", "A small joining word.", "That."], explain: "He said that he was tired." }
    ],
    reflect: { q: "What helped you most?", options: ["The list of changes", "Saying it out loud", "Thinking who is speaking", "Not sure"] },
    parent: "Your child practised changing direct speech into reported speech.",
    teacher: "Shows conversion from direct to indirect speech, including tense, pronoun and time-word changes and reported commands.",
    done: "Reported speech shifts the tense, pronouns and time words." },

  // ===================== GRADE 7 NATURAL SCIENCES =====================
  { id: "g7-biodiversity", grade: 7, subject: "Natural Sciences", title: "Biodiversity and classification", topic: "Classifying living things", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 7 Natural Sciences, Life and Living: Biodiversity (classification of living things; vertebrates and invertebrates; plants with and without seeds; importance of biodiversity)",
    intention: "Today I am classifying living things into groups.", prompt: "Why do scientists classify living things?",
    lesson: [
      { h: "What is biodiversity?", say: "Biodiversity is the variety of all living things in an area. South Africa has some of the highest biodiversity in the world.", html: PICS("🦏 🌿 🐋 🦋 🌸", "Many kinds of living things") + P("<b>Bio</b> means life. <b>Diversity</b> means variety.") },
      { h: "Vertebrates and invertebrates", say: "Animals with a backbone are vertebrates: fish, amphibians, reptiles, birds and mammals. Animals without a backbone are invertebrates, such as insects, spiders and worms.", html: chainRow(["Fish", "Amphibians", "Reptiles", "Birds", "Mammals"]) + P("<b>Vertebrates</b> have a backbone. <b>Invertebrates</b> do not.") },
      { h: "Why it matters", say: "Every species plays a role. Bees pollinate crops. Wetlands clean water. When we lose species, ecosystems become weaker.", html: PICS("🐝 → 🍎", "Bees pollinate fruit") + P("Biodiversity gives us <b>food</b>, <b>medicine</b> and <b>clean water</b>.") }
    ],
    example: { q: "A gecko has dry, scaly skin, lays eggs on land and has a backbone. Which group is it in?", steps: ["It has a backbone, so it is a vertebrate.", "Dry, scaly skin and eggs on land.", "It is a reptile."] },
    questions: [
      { type: "mcq", q: "Which animal is an invertebrate?", options: ["Spider", "Frog", "Eagle", "Shark"], answer: 0, hints: ["Which has no backbone?", "Frogs, eagles and sharks have backbones.", "Spider."], explain: "A spider has no backbone." },
      { type: "mcq", q: "Which group has hair or fur and feeds its young on milk?", options: ["Mammals", "Birds", "Reptiles", "Amphibians"], answer: 0, hints: ["Think of a dog or a human.", "Milk comes from the mother.", "Mammals."], explain: "Mammals have hair and feed young on milk." },
      { type: "mcq", q: "A frog lives in water as a tadpole and on land as an adult. Which group?", options: ["Amphibian", "Reptile", "Fish", "Mammal"], answer: 0, hints: ["It lives two lives: water and land.", "Amphi means both.", "Amphibian."], explain: "Frogs are amphibians." },
      { type: "sort", q: "Vertebrate or invertebrate?", items: ["Snail", "Penguin", "Earthworm", "Lizard"], bins: ["Invertebrate", "Vertebrate"], answer: [0, 1, 0, 1], hints: ["Does it have a backbone?", "Snails and worms have none.", "Penguins and lizards do."], explain: "Snail and earthworm are invertebrates. Penguin and lizard are vertebrates." },
      { type: "mcq", q: "Why is biodiversity important?", options: ["Ecosystems need many species to stay healthy", "It is not important", "Only big animals matter", "It only matters in zoos"], answer: 0, hints: ["Think about bees and crops.", "Every species has a role.", "Healthy ecosystems."], explain: "Many species working together keep ecosystems healthy." }
    ],
    reflect: { q: "What helped you classify?", options: ["Asking: does it have a backbone?", "Thinking of examples", "Looking at body features", "Not sure"] },
    parent: "Your child learned about biodiversity and classified animals into vertebrate and invertebrate groups.",
    teacher: "Shows classification of animals by key features and explaining the importance of biodiversity.",
    done: "Scientists group living things by their features." },

  { id: "g7-separating", grade: 7, subject: "Natural Sciences", title: "Separating mixtures", topic: "Filtration, evaporation, distillation, chromatography", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 7 Natural Sciences, Matter and Materials: Separating mixtures (hand sorting, sieving, filtration, decanting, evaporation, distillation, chromatography)",
    intention: "Today I am choosing the right method to separate a mixture.", prompt: "Which method would you use at home?",
    lesson: [
      { h: "Filtration and sieving", say: "A sieve separates big pieces from small ones. A filter lets liquid through and traps solid particles, like sand in muddy water.", html: PICS("🥣 ☕", "Sieve and filter") + P("<b>Filtration</b> separates an insoluble solid from a liquid.") },
      { h: "Evaporation", say: "When salt is dissolved in water, filtering will not work. Heat the solution. The water evaporates and the salt is left behind.", html: chainRow(["Salt water", "Heat", "Salt crystals"]) + P("<b>Evaporation</b> gets back a dissolved solid.") },
      { h: "Distillation and chromatography", say: "Distillation boils a liquid and cools the steam to collect pure water. Chromatography separates the colours in ink as water moves up paper.", html: chainRow(["Boil", "Steam", "Cool", "Pure water"]) + PICS("🖊️ 📄 🌈", "Ink colours separating on paper") + P("Each method uses a different <b>property</b>.") }
    ],
    example: { q: "How would you separate sand, salt and water?", steps: ["First filter: the sand stays in the filter paper.", "The salt water passes through.", "Then evaporate the water to get the salt."] },
    questions: [
      { type: "mcq", q: "Which method separates sand from water?", options: ["Filtration", "Evaporation", "Chromatography", "Magnetism"], answer: 0, hints: ["Sand does not dissolve.", "It can be trapped.", "Filtration."], explain: "Filtration traps the sand." },
      { type: "mcq", q: "How do you get salt back from salt water?", options: ["Evaporation", "Filtration", "Sieving", "Hand sorting"], answer: 0, hints: ["Salt is dissolved.", "A filter will not trap it.", "Heat to remove the water."], explain: "Evaporate the water and the salt is left." },
      { type: "mcq", q: "Which method separates the colours in black ink?", options: ["Chromatography", "Filtration", "Sieving", "Decanting"], answer: 0, hints: ["Paper and water.", "Colours travel different distances.", "Chromatography."], explain: "Chromatography separates ink colours." },
      { type: "mcq", q: "Which method gives you pure drinking water from sea water?", options: ["Distillation", "Sieving", "Chromatography", "Hand sorting"], answer: 0, hints: ["Boil and collect the steam.", "Cool the steam back to liquid.", "Distillation."], explain: "Distillation collects pure water from steam." },
      { type: "order", q: "Put the steps for separating sand, salt and water in order.", items: ["Filter the mixture", "Collect the salt water", "Evaporate the water", "Salt remains"], orderLabel: "first to last", hints: ["Remove the sand first.", "Then deal with the dissolved salt.", "Salt is left last."], explain: "Filter, collect, evaporate, salt remains." }
    ],
    reflect: { q: "What helped you choose a method?", options: ["Thinking about dissolving", "Picturing the equipment", "Thinking about particle size", "Not sure"] },
    parent: "Your child learned how to separate mixtures by filtering, evaporating, distilling and chromatography.",
    teacher: "Shows selecting separation methods based on properties such as solubility and particle size.",
    done: "Choose a separation method based on the properties of the mixture." },

  { id: "g7-heat", grade: 7, subject: "Natural Sciences", title: "How heat moves", topic: "Conduction, convection and radiation", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 7 Natural Sciences, Energy and Change: Heat transfer (conduction, convection, radiation; insulation and energy saving)",
    intention: "Today I am learning the three ways heat moves.", prompt: "Where do you see heat moving at home?",
    lesson: [
      { h: "Conduction", say: "Conduction is heat moving through a solid, by touch. A metal spoon in hot tea gets hot all the way up.", html: PICS("🥄 ☕", "Spoon in tea") + P("Metals are good <b>conductors</b>. Wood and plastic are <b>insulators</b>.") },
      { h: "Convection", say: "Convection is heat moving through liquids and gases. Warm water or air rises, cool water or air sinks, making a current.", html: chainRow(["Warm rises", "Cool sinks", "Current"]) + P("<b>Convection currents</b> heat a pot of water.") },
      { h: "Radiation", say: "Radiation is heat moving as invisible waves, even through empty space. The sun warms Earth by radiation.", html: PICS("☀️ 〰️ 🌍", "Sun's rays to Earth") + P("<b>Radiation</b> needs no particles. Dark, dull surfaces absorb it best.") }
    ],
    example: { q: "Why do pots have plastic or wooden handles?", steps: ["Metal conducts heat well.", "Plastic and wood are insulators.", "The handle stays cool, so you do not get burnt."] },
    questions: [
      { type: "mcq", q: "How does heat travel through a metal rod?", options: ["Conduction", "Convection", "Radiation"], answer: 0, hints: ["It is a solid.", "Heat passes particle to particle.", "Conduction."], explain: "Heat moves through solids by conduction." },
      { type: "mcq", q: "How does a heater warm a whole room?", options: ["Convection", "Conduction", "Only radiation"], answer: 0, hints: ["Warm air rises and moves.", "It makes a current.", "Convection."], explain: "Warm air rises and circulates by convection." },
      { type: "mcq", q: "How does heat from the sun reach Earth?", options: ["Radiation", "Conduction", "Convection"], answer: 0, hints: ["Space is empty.", "No particles to pass it on.", "Radiation."], explain: "Radiation can travel through empty space." },
      { type: "mcq", q: "Which is the best insulator?", options: ["Wool", "Copper", "Aluminium", "Iron"], answer: 0, hints: ["Insulators slow heat down.", "Metals conduct.", "Wool."], explain: "Wool traps air and is a good insulator." },
      { type: "mcq", q: "Why do people in hot places often paint roofs white?", options: ["Light colours reflect radiation", "White conducts heat", "White is cheaper", "It causes convection"], answer: 0, hints: ["Dark surfaces absorb heat.", "Light surfaces reflect it.", "Reflect radiation."], explain: "White reflects the sun's radiation and keeps the house cooler." }
    ],
    reflect: { q: "Which way of heat moving made most sense?", options: ["Conduction", "Convection", "Radiation", "Not sure"] },
    parent: "Your child learned how heat moves by conduction, convection and radiation.",
    teacher: "Shows distinguishing the three modes of heat transfer and applying insulation to everyday contexts.",
    done: "Heat moves by conduction, convection and radiation." },

  // ===================== GRADE 7 LIFE ORIENTATION =====================
  { id: "g7-selfimage", grade: 7, subject: "Life Orientation", title: "Self-image and peer pressure", topic: "Development of the self", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: "CAPS Grade 7 Life Orientation: Development of the self in society (self-image; peer pressure; personal strengths; respect for self and others)",
    intention: "Today I am thinking about how I see myself and how to handle peer pressure.", prompt: "What is one thing you like about yourself?",
    lesson: [
      { h: "Self-image", say: "Self-image is how you see yourself. It is shaped by your family, friends, media and your own thoughts. A healthy self-image accepts strengths and things you are working on.", html: PICS("🪞", "A mirror") + P("Social media shows <b>edited</b> lives. Compare yourself to who you were yesterday, not to a filter.") },
      { h: "Peer pressure", say: "Peer pressure is when people your age push you to do something. It can be positive, like studying together, or negative, like skipping class.", html: chainRow(["Positive: join a team", "Negative: bunk school"]) + P("<b>Peer pressure</b> can go either way.") },
      { h: "Saying no with confidence", say: "To resist negative pressure: say no clearly, give a reason or suggest something else, and walk away if you need to. Choose friends who respect your no.", html: chainRow(["Say no", "Give a reason", "Suggest something else", "Walk away"]) + P("Being <b>assertive</b> is clear and respectful.") }
    ],
    example: { q: "Friends dare Lebo to share a rude photo of a classmate. What can she do?", steps: ["It would hurt the classmate and could be against school rules or the law.", "She says: No, that's not cool.", "She suggests something else, and tells an adult if the photo is being shared."] },
    questions: [
      { type: "mcq", q: "Which is positive peer pressure?", options: ["Friends encourage you to join the choir", "Friends dare you to steal", "Friends tell you to skip school", "Friends tease someone"], answer: 0, hints: ["Positive pressure helps you grow.", "Which one is good for you?", "Joining the choir."], explain: "Being encouraged to join the choir is positive." },
      { type: "mcq", q: "Which is an assertive response?", options: ["\"No thanks, I'm not into that.\"", "Shouting at them", "Doing it so they like you", "Saying nothing and going along"], answer: 0, hints: ["Assertive is clear and respectful.", "Not aggressive, not passive.", "The first one."], explain: "A clear, calm no is assertive." },
      { type: "mcq", q: "What shapes your self-image?", options: ["All of these", "Family", "Friends", "Media"], answer: 0, hints: ["Many things influence us.", "Family, friends, media and our thoughts.", "All of these."], explain: "Family, friends, media and our own thoughts all shape self-image." },
      { type: "mcq", q: "Why can comparing yourself to social media be unhelpful?", options: ["Posts are often edited and show only the best moments", "Social media is always true", "Everyone looks the same", "It is not unhelpful"], answer: 0, hints: ["Do people post their bad days?", "Photos can be filtered.", "Edited highlights."], explain: "Social media often shows edited highlights, not real life." },
      { type: "sort", q: "Sort the strategies.", items: ["Walk away", "Give in to fit in", "Suggest another activity", "Keep it secret when someone is in danger"], bins: ["Helpful", "Unhelpful"], answer: [0, 1, 0, 1], hints: ["Which ones keep you true to yourself?", "Giving in and hiding danger do not help.", "Walking away and suggesting something else help."], explain: "Walking away and suggesting something else are helpful." }
    ],
    reflect: { q: "Which strategy will you use?", options: ["Saying no clearly", "Suggesting something else", "Walking away", "Talking to an adult"] },
    parent: "Your child explored self-image and practised assertive ways to handle peer pressure.",
    teacher: "Shows understanding of influences on self-image, positive and negative peer pressure, and assertive refusal skills.",
    done: "You can say no clearly and respectfully." },

  { id: "g7-rights", grade: 7, subject: "Life Orientation", title: "Rights and responsibilities", topic: "The Bill of Rights", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "CAPS Grade 7 Life Orientation: Constitutional rights and responsibilities (the Bill of Rights; children's rights; responsibilities that go with rights)",
    intention: "Today I am learning about my rights and the responsibilities that go with them.", prompt: "Which right matters most to you, and why?",
    lesson: [
      { h: "The Bill of Rights", say: "South Africa's Constitution was adopted in 1996. Chapter 2 is the Bill of Rights. It protects the rights of everyone in the country.", html: PICS("📜 ⚖️", "Constitution and justice") + P("The <b>Constitution</b> is the highest law in South Africa.") },
      { h: "Some of your rights", say: "Everyone has the right to equality, dignity, life, freedom of expression and a basic education. Children have extra protection, such as the right to be protected from abuse and harmful work.", html: chainRow(["Equality", "Dignity", "Education", "Freedom of expression"]) + P("Section 28 protects <b>children's rights</b>.") },
      { h: "Rights come with responsibilities", say: "If you have the right to education, you have the responsibility to attend and let others learn. Your freedom of expression must not be used to spread hate.", html: chainRow(["Right to education", "→", "Respect others' learning"]) + P("My rights end where they <b>harm</b> someone else's.") }
    ],
    example: { q: "You have freedom of expression. Can you post lies about a classmate?", steps: ["Freedom of expression is a right.", "But your classmate has a right to dignity.", "No. Rights have limits and come with responsibilities."] },
    questions: [
      { type: "mcq", q: "Which chapter of the Constitution is the Bill of Rights?", options: ["Chapter 2", "Chapter 1", "Chapter 10", "Chapter 5"], answer: 0, hints: ["It comes early in the Constitution.", "Right after the founding provisions.", "Chapter 2."], explain: "The Bill of Rights is Chapter 2." },
      { type: "mcq", q: "Which responsibility goes with the right to education?", options: ["Attend school and respect others' learning", "Stay home when you want", "Disrupt class", "Copy homework"], answer: 0, hints: ["What helps everyone learn?", "Being there and being respectful.", "The first one."], explain: "Attending and respecting others' learning goes with the right to education." },
      { type: "mcq", q: "Which right protects people from unfair discrimination?", options: ["Equality", "Freedom of movement", "Property", "Language"], answer: 0, hints: ["Everyone treated fairly.", "No one is less than another.", "Equality."], explain: "The right to equality protects against unfair discrimination." },
      { type: "mcq", q: "In what year was the current Constitution adopted?", options: ["1996", "1994", "1976", "2000"], answer: 0, hints: ["Two years after the first democratic election.", "1994 + 2.", "1996."], explain: "The Constitution was adopted in 1996." },
      { type: "sort", q: "Right or responsibility?", items: ["To be safe at school", "To not bully others", "To have a basic education", "To look after school property"], bins: ["Right", "Responsibility"], answer: [0, 1, 0, 1], hints: ["A right is something you are entitled to.", "A responsibility is something you must do.", "Not bullying and caring for property are duties."], explain: "Safety and education are rights. Not bullying and caring for property are responsibilities." }
    ],
    reflect: { q: "Which right matters most to you?", options: ["Equality", "Dignity", "Education", "Freedom of expression"] },
    parent: "Your child learned about the Bill of Rights and the responsibilities that go with rights.",
    teacher: "Shows knowledge of the Bill of Rights, children's rights and linking rights to responsibilities.",
    done: "Every right comes with a responsibility." },

  { id: "g7-study", grade: 7, subject: "Life Orientation", title: "Study skills that work", topic: "World of work: study skills", domain: "Creativity and Metacognition", category: "Planning and Organisation",
    caps: "CAPS Grade 7 Life Orientation: World of work (study skills and study methods; planning a study timetable; learning styles and strategies)",
    intention: "Today I am learning study methods that help me remember.", prompt: "Which study method will you try this week?",
    lesson: [
      { h: "Test yourself", say: "Re-reading feels easy but does not help much. Testing yourself, by covering your notes and trying to recall, helps you remember far better.", html: chainRow(["Read", "Cover", "Recall", "Check"]) + P("<b>Active recall</b> beats re-reading.") },
      { h: "Spread it out", say: "Study a little each day instead of everything the night before. Short sessions spread over time help memory.", html: chainRow(["Mon", "Wed", "Fri", "Sun"]) + P("<b>Spaced practice</b>: 25 minutes, then a 5-minute break.") },
      { h: "Make it visual", say: "Mind maps, flow diagrams and summaries in your own words help you see how ideas connect.", html: PICS("🧠 🗺️", "Mind map") + P("Turn notes into <b>pictures</b>, <b>diagrams</b> or <b>questions</b>.") }
    ],
    example: { q: "Zinhle has a science test on Friday. It is Monday. How should she plan?", steps: ["Split the work into small parts.", "Study one part each day, and test herself on earlier parts.", "On Thursday, do practice questions, then sleep well."] },
    questions: [
      { type: "mcq", q: "Which method helps memory most?", options: ["Testing yourself", "Re-reading many times", "Highlighting everything", "Studying with the TV on"], answer: 0, hints: ["Which one makes your brain work hardest?", "Trying to recall.", "Testing yourself."], explain: "Active recall by testing yourself works best." },
      { type: "mcq", q: "When is the best time to start studying for a test?", options: ["A few days before, a little each day", "The night before", "The morning of the test", "Never"], answer: 0, hints: ["Spread it out.", "Small sessions over days.", "A few days before."], explain: "Spaced practice over several days works better than cramming." },
      { type: "mcq", q: "What is a mind map?", options: ["A diagram linking ideas to a main topic", "A map of your town", "A list of dates", "A timetable"], answer: 0, hints: ["It is visual.", "The main idea is in the middle.", "Ideas branch out."], explain: "A mind map links ideas around a central topic." },
      { type: "mcq", q: "Which is the best study space?", options: ["Quiet, with your phone away", "In bed with music videos", "With friends chatting", "In front of the TV"], answer: 0, hints: ["Fewer distractions.", "Phones pull attention.", "Quiet, phone away."], explain: "A quiet space without phone distractions helps focus." },
      { type: "order", q: "Put the active recall steps in order.", items: ["Read a section", "Cover it", "Recall it aloud or on paper", "Check what you missed"], orderLabel: "first to last", hints: ["Start by learning.", "Then hide it.", "Then test and check."], explain: "Read, cover, recall, check." }
    ],
    reflect: { q: "Which method suits you best?", options: ["Testing myself", "Mind maps", "Short daily sessions", "Studying with a partner"] },
    parent: "Your child learned study methods such as testing yourself, spacing practice and mind maps.",
    teacher: "Shows knowledge of evidence-based study strategies and planning study time.",
    done: "Test yourself, spread study out, and make it visual." }
];
const WORDS_G7 = {
  "g7-integers": { words: [["➖", "Integer", "a whole number that can be positive, negative or zero"], ["❄️", "Negative", "less than zero"]] },
  "g7-exponents": { words: [["⬆️", "Exponent", "the small number that says how many times to multiply"], ["🌱", "Root", "the number that was multiplied by itself"]] },
  "g7-equations": { words: [["⚖️", "Equation", "a statement that two things are equal"], ["❓", "Variable", "a letter that stands for an unknown number"], ["🔁", "Substitute", "put a number in place of the letter"]] },
  "g7-story": { words: [["⚔️", "Conflict", "the main problem in a story"], ["⛰️", "Climax", "the moment of greatest tension"], ["🍊", "Enkosi, ntombi", "isiXhosa for thank you, girl"]], phrases: [["her heart sank", "she suddenly felt disappointed"]] },
  "g7-figurative": { words: [["🔗", "Simile", "a comparison using like or as"], ["🎭", "Metaphor", "saying one thing is another"], ["📢", "Hyperbole", "huge exaggeration for effect"]] },
  "g7-reported": { words: [["💬", "Direct speech", "the exact words someone said, in speech marks"], ["🗒️", "Reported speech", "telling what someone said without their exact words"]] },
  "g7-biodiversity": { words: [["🌍", "Biodiversity", "the variety of living things in an area"], ["🦴", "Vertebrate", "an animal with a backbone"], ["🐛", "Invertebrate", "an animal without a backbone"]] },
  "g7-separating": { words: [["☕", "Filtration", "separating a solid from a liquid with a filter"], ["♨️", "Evaporation", "a liquid turning into a gas"], ["🧪", "Distillation", "boiling a liquid and cooling the steam to collect it"]] },
  "g7-heat": { words: [["🥄", "Conduction", "heat moving through a solid"], ["🌀", "Convection", "heat moving through liquids and gases in currents"], ["☀️", "Radiation", "heat moving as waves"], ["🧤", "Insulator", "a material that slows heat down"]] },
  "g7-selfimage": { words: [["🪞", "Self-image", "how you see yourself"], ["👥", "Peer pressure", "a push from people your age"], ["🗣️", "Assertive", "clear and respectful"]] },
  "g7-rights": { words: [["📜", "Constitution", "the highest law of the country"], ["⚖️", "Bill of Rights", "the part of the Constitution that protects everyone's rights"], ["🤝", "Dignity", "being treated with respect as a person"]] },
  "g7-study": { words: [["🧠", "Active recall", "testing yourself to bring information back from memory"], ["📅", "Spaced practice", "studying a little at a time over several days"]] }
};
Object.assign(WORDS, WORDS_G7);
