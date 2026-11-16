"use strict";

// ---------- Cambridge Lower Secondary (Stages 7 to 9 = Grades 7 to 9), for the new app only. Original content. ----------
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const M = { subject: "Mathematics", curriculum: "Cambridge", domain: "Logical and Analytical Thinking" };
  const E = { subject: "English", curriculum: "Cambridge", domain: "Communication and Expression" };
  const S = { subject: "Science", curriculum: "Cambridge", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" };
  const READ = html => ({ h: "Read the text", say: "Read the text, or press Read aloud to hear it part by part.", html });
  const cm = (stage, focus) => `Cambridge Lower Secondary Mathematics (0862), Stage ${stage}: ${focus}`;
  const ce = (stage, focus) => `Cambridge Lower Secondary English (1111), Stage ${stage}: ${focus}`;
  const cs = (stage, focus) => `Cambridge Lower Secondary Science (0893), Stage ${stage}: ${focus}`;

  const GATE = `<div class="passage-text"><p><b>The Gate</b> <span class="muted">(a 2to.iQ story opening)</span></p>
<p>Ayanda had walked past the old gate every day for a year, and every day it had been locked. Today it stood open, just a little, the padlock hanging from the chain like a loose tooth. She checked the street behind her. Empty. Her hand was already on the cold metal before she had decided anything at all.</p></div>`;
  const HARBOUR = `<div class="passage-text"><p><b>The Harbour at Dawn</b> <span class="muted">(a 2to.iQ story extract)</span></p>
<p>The fishing boats came in one by one, low in the water. Uncle Sizwe stood on the wall with his arms folded, counting them the way other men count money. When the last boat rounded the point, his shoulders dropped. He laughed then, too loudly, and clapped the nearest stranger on the back.</p></div>`;
  const PLASTIC = `<div class="passage-text"><p><b>Should our town ban plastic bags?</b> <span class="muted">(a 2to.iQ article)</span></p>
<p>Plastic bags are cheap, light and useful, which is exactly the problem: we use them for minutes and throw them away. In our town, volunteers removed more than 3 000 bags from the river last year.</p>
<p>However, a ban is not simple. Some small shop owners say paper bags cost them five times as much, and some families reuse plastic bags as bin liners.</p>
<p>A charge for each bag may be a fairer first step. Where shops have charged for bags, many shoppers have switched to bags they can reuse.</p></div>`;

  PLATFORM_UNITS.push(
  // ===================== STAGE 7 (GRADE 7) =====================
  { ...M, id: "cam7-integers", grade: 7, title: "Negative numbers", topic: "Number: integers", category: "Pattern Thinking",
    caps: cm(7, "Number (adding, subtracting, multiplying and dividing integers)"),
    intention: "Today I am calculating with negative numbers.", prompt: "Where do you see negative numbers in real life?",
    lesson: [
      { h: "The number line", say: "Negative numbers are less than zero. On a number line they are to the left of zero. Minus 5 is colder than minus 2.", html: chainRow(["−5", "−2", "0", "3"]) },
      { h: "Adding and subtracting", say: "Adding a negative number is the same as subtracting. Subtracting a negative number is the same as adding. 4 minus minus 3 is 4 plus 3, which is 7.", html: P("4 + (−3) = 1 · 4 − (−3) = <b>7</b>") },
      { h: "Multiplying and dividing", say: "When multiplying or dividing, two signs the same give a positive answer. Two different signs give a negative answer.", html: chainRow(["+ × + = +", "− × − = +", "+ × − = −"]) }
    ],
    example: { q: "The temperature is −4 °C and rises by 9 degrees. What is the new temperature?", steps: ["Start at −4.", "Rise by 9: −4 + 9.", "= 5 °C."] },
    questions: [
      { type: "num", q: "Work out −6 + 10.", answer: "4", options: ["4", "−16", "16", "−4"], hints: ["Start at −6.", "Move 10 to the right.", "4."], explain: "−6 + 10 = 4." },
      { type: "num", q: "Work out 5 − (−2).", answer: "7", options: ["7", "3", "−7", "−3"], hints: ["Subtracting a negative is adding.", "5 + 2.", "7."], explain: "5 − (−2) = 5 + 2 = 7." },
      { type: "num", q: "Work out −3 × −4.", answer: "12", options: ["12", "−12", "−7", "7"], hints: ["Same signs give positive.", "3 × 4 = 12.", "Positive 12."], explain: "Two negatives multiply to a positive: 12." },
      { type: "num", q: "Work out −20 ÷ 5.", answer: "−4", options: ["−4", "4", "−15", "−100"], hints: ["Different signs give negative.", "20 ÷ 5 = 4.", "−4."], explain: "Different signs give a negative: −4." },
      { type: "mcq", q: "Which is the coldest temperature?", options: ["−8 °C", "−3 °C", "0 °C", "2 °C"], answer: 0, hints: ["Coldest is lowest.", "Furthest left on the number line.", "−8."], explain: "−8 is the lowest temperature." }
    ],
    reflect: R("The number line", "The sign rules", "Thinking about temperature"),
    parent: "Your child calculated with negative numbers.",
    teacher: "Shows ordering integers and applying the four operations with negative numbers.",
    done: "Subtracting a negative adds. Same signs multiply to positive." },

  { ...M, id: "cam7-expressions", grade: 7, title: "Expressions and substitution", topic: "Algebra", category: "Problem Solving",
    caps: cm(7, "Algebra (writing expressions; collecting like terms; substitution)"),
    intention: "Today I am writing and simplifying expressions.", prompt: "How would you write 'three more than a number' in maths?",
    lesson: [
      { h: "Letters for numbers", say: "In algebra, a letter stands for an unknown number. 'Three more than n' is n plus 3. 'Double n' is 2n.", html: chainRow(["n + 3", "2n", "n − 5"]) },
      { h: "Collecting like terms", say: "Like terms have the same letter. 3a plus 2a is 5a. But 3a plus 2b can't be simplified, because the letters are different.", html: P("3a + 2a + 4b = <b>5a + 4b</b>") },
      { h: "Substitution", say: "To substitute, replace the letter with its value. If n is 4, then 2n plus 3 is 2 times 4 plus 3, which is 11.", html: P("n = 4: 2n + 3 = <b>11</b>") }
    ],
    example: { q: "Simplify 5x + 3 + 2x − 1, then find its value when x = 2.", steps: ["Collect x terms: 5x + 2x = 7x. Numbers: 3 − 1 = 2.", "7x + 2.", "When x = 2: 7 × 2 + 2 = 16."] },
    questions: [
      { type: "mcq", q: "Which expression means 'five less than y'?", options: ["y − 5", "5 − y", "5y", "y + 5"], answer: 0, hints: ["Start with y.", "Take 5 away.", "y − 5."], explain: "Five less than y is y − 5." },
      { type: "mcq", q: "Simplify 4a + 3a.", options: ["7a", "12a", "7a²", "4a3a"], answer: 0, hints: ["Like terms.", "4 + 3.", "7a."], explain: "4a + 3a = 7a." },
      { type: "mcq", q: "Simplify 2x + 5y + 3x.", options: ["5x + 5y", "10xy", "5x + 8y", "10x"], answer: 0, hints: ["Collect the x terms.", "2x + 3x = 5x.", "Keep 5y."], explain: "5x + 5y." },
      { type: "num", q: "Find 3n − 2 when n = 5.", answer: "13", options: ["13", "15", "17", "11"], hints: ["Replace n with 5.", "3 × 5 − 2.", "13."], explain: "15 − 2 = 13." },
      { type: "num", q: "Find a + b when a = 7 and b = −3.", answer: "4", options: ["4", "10", "−4", "−10"], hints: ["7 + (−3).", "7 − 3.", "4."], explain: "7 + (−3) = 4." }
    ],
    reflect: R("Writing words as algebra", "Collecting like terms", "Substituting carefully"),
    parent: "Your child wrote, simplified and evaluated algebraic expressions.",
    teacher: "Shows forming expressions from words, collecting like terms and substituting integer values.",
    done: "Collect like terms, then substitute to find the value." },

  { ...E, id: "cam7-eng-inference", grade: 7, title: "Reading between the lines", topic: "Reading: inference", category: "Communication",
    caps: ce(7, "Reading (inferring meaning and character from clues)"),
    intention: "Today I am working out what a writer suggests without saying.", prompt: "How can you tell what someone is thinking without asking them?",
    passage: GATE,
    lesson: [
      READ(GATE),
      { h: "Clues and inferences", say: "An inference is a sensible conclusion from clues. Ayanda checks the empty street, which suggests she feels she might be doing something she shouldn't.", html: chainRow(["Clue", "What it suggests"]) },
      { h: "Explaining your inference", say: "Always say which words led you to your inference. Look at this line: 'Her hand was already on the cold metal before she had decided.' It suggests her curiosity is stronger than her caution.", html: P("Inference + <b>quotation</b> + explanation") }
    ],
    example: { q: "What does 'every day it had been locked' tell us about Ayanda?", steps: ["She noticed the gate every single day.", "That suggests she has wondered about it for a long time.", "She is curious about what is behind it."] },
    questions: [
      { type: "mcq", q: "Why does Ayanda check the street behind her?", options: ["She doesn't want to be seen", "She is lost", "She is waiting for a taxi", "She hears music"], answer: 0, hints: ["The street is empty.", "Why would that matter?", "She doesn't want to be seen."], explain: "Checking for watchers suggests she feels it might not be allowed." },
      { type: "mcq", q: "What does the simile 'like a loose tooth' suggest about the padlock?", options: ["It is about to come off", "It is new and strong", "It is made of teeth", "It is painful"], answer: 0, hints: ["What happens to a loose tooth?", "It falls out soon.", "About to come off."], explain: "A loose tooth will soon fall out, like the padlock." },
      { type: "mcq", q: "What does 'before she had decided anything at all' suggest?", options: ["Her curiosity acts before her caution", "She is very careful", "She doesn't want to go in", "She is asleep"], answer: 0, hints: ["Her hand moves first.", "Thinking comes later.", "Curiosity wins."], explain: "She acts on curiosity before thinking it through." },
      { type: "mcq", q: "Which is an inference rather than a fact from the text?", options: ["Ayanda is curious about the gate", "The gate was open", "The padlock hung from the chain", "The street was empty"], answer: 0, hints: ["Three are stated.", "One is worked out from clues.", "Her curiosity."], explain: "Her curiosity is inferred; the others are stated." },
      { type: "mcq", q: "What is the best way to support an inference?", options: ["Quote the words that led to it", "Say 'I just know'", "Retell the whole story", "Use a dictionary"], answer: 0, hints: ["Use evidence.", "From the text.", "Quote it."], explain: "Quoting the clue shows how you reached your inference." }
    ],
    reflect: R("Finding clues", "Quoting the words", "Explaining what they suggest"),
    parent: "Your child worked out what a story suggests about a character, using clues.",
    teacher: "Shows making and justifying inferences about character and situation with reference to the text.",
    done: "Find the clue, quote it, and explain what it suggests." },

  { ...E, id: "cam7-eng-paragraphs", grade: 7, title: "Paragraphs that flow", topic: "Writing: cohesion", category: "Planning and Organisation",
    caps: ce(7, "Writing (organising paragraphs; topic sentences; connectives for cohesion)"),
    intention: "Today I am organising my writing into clear, linked paragraphs.", prompt: "How do you know when to start a new paragraph?",
    lesson: [
      { h: "One idea per paragraph", say: "Start a new paragraph for a new idea, a new time, a new place or a new speaker. Each paragraph should have one main idea.", html: chainRow(["New idea", "New time", "New place", "New speaker"]) },
      { h: "Topic sentences", say: "A topic sentence tells the reader what the paragraph is about. It usually comes first.", html: P("<b>Topic sentence:</b> Our school garden has changed the way we eat.") },
      { h: "Connectives", say: "Connectives link ideas. Use firstly and next for order, however for contrast, and as a result for cause and effect.", html: chainRow(["Firstly", "However", "As a result", "Finally"]) }
    ],
    example: { q: "Write a topic sentence for a paragraph about why exercise helps learning.", steps: ["Decide the main idea: exercise helps learning.", "Make it a clear, general sentence.", "'Regular exercise can help learners concentrate in class.'"] },
    questions: [
      { type: "mcq", q: "When should you start a new paragraph?", options: ["When you move to a new idea", "After every sentence", "Only at the end", "When the page is full"], answer: 0, hints: ["Paragraphs group ideas.", "A new idea needs…", "…a new paragraph."], explain: "A new idea, time, place or speaker starts a new paragraph." },
      { type: "mcq", q: "What does a topic sentence do?", options: ["Tells the reader what the paragraph is about", "Ends the story", "Asks a question", "Lists every detail"], answer: 0, hints: ["It introduces.", "The main idea.", "Usually first."], explain: "It states the paragraph's main idea." },
      { type: "mcq", q: "Which connective shows contrast?", options: ["However", "Firstly", "As a result", "Next"], answer: 0, hints: ["Contrast means a difference.", "Not order or cause.", "However."], explain: "'However' introduces a contrasting idea." },
      { type: "mcq", q: "Which connective shows cause and effect?", options: ["As a result", "However", "Firstly", "Meanwhile"], answer: 0, hints: ["Something happens because of something else.", "Result.", "As a result."], explain: "'As a result' links a cause to its effect." },
      { type: "mcq", q: "Which is the best topic sentence for a paragraph about the dangers of litter?", options: ["Litter harms animals, rivers and our health.", "I saw a packet.", "Litter.", "Have you ever wondered?"], answer: 0, hints: ["Clear and general.", "Sets up the paragraph.", "The first."], explain: "It clearly states the paragraph's main idea." }
    ],
    reflect: R("One idea per paragraph", "Writing the topic sentence first", "Choosing connectives"),
    parent: "Your child organised writing into clear paragraphs with topic sentences and connectives.",
    teacher: "Shows paragraphing by idea, writing topic sentences and using connectives for cohesion.",
    done: "One idea per paragraph, a clear topic sentence, linked by connectives." },

  { ...S, id: "cam7-sci-specialised-cells", grade: 7, title: "Specialised cells", topic: "Biology: cells",
    caps: cs(7, "Biology (cell structure; specialised cells and their functions)"),
    intention: "Today I am finding out how cells are shaped for their jobs.", prompt: "Why do you think nerve cells are so long?",
    lesson: [
      { h: "Cells have jobs", say: "All living things are made of cells. Many cells are specialised: their shape and structure suit a particular job.", html: P("Structure fits <b>function</b>.") },
      { h: "Examples", say: "Red blood cells have no nucleus and a dimpled shape, so they carry more oxygen. Root hair cells have long extensions to take in water. Nerve cells are long, to carry messages around the body.", html: chainRow(["Red blood cell: carries oxygen", "Root hair cell: absorbs water", "Nerve cell: carries messages"]) },
      { h: "Cells, tissues, organs", say: "Similar cells working together form a tissue. Tissues form organs, like the heart. Organs work together in organ systems.", html: chainRow(["Cell", "Tissue", "Organ", "Organ system"]) }
    ],
    example: { q: "Explain how a root hair cell is adapted to its job.", steps: ["Its job is to absorb water from the soil.", "It has a long, thin extension.", "This gives a large surface area for absorbing water."] },
    questions: [
      { type: "mcq", q: "What is the job of a red blood cell?", options: ["Carrying oxygen", "Absorbing water", "Carrying messages", "Making food"], answer: 0, hints: ["It is in the blood.", "It contains haemoglobin.", "Oxygen."], explain: "Red blood cells carry oxygen." },
      { type: "mcq", q: "Why are nerve cells long?", options: ["To carry messages over long distances in the body", "To store fat", "To absorb water", "To make the body taller"], answer: 0, hints: ["They connect parts of the body.", "Messages travel along them.", "Long distances."], explain: "Their length lets them carry signals across the body." },
      { type: "mcq", q: "What is formed when similar cells work together?", options: ["A tissue", "An organ system", "An organism", "A nucleus"], answer: 0, hints: ["The next level up from cells.", "Before organs.", "A tissue."], explain: "Groups of similar cells form tissues." },
      { type: "mcq", q: "Why does a root hair cell have a large surface area?", options: ["To absorb more water", "To look nice", "To make it heavier", "To photosynthesise"], answer: 0, hints: ["More surface…", "…more contact with the soil.", "More water absorbed."], explain: "A larger surface absorbs more water." },
      { type: "mcq", q: "Which is the correct order, from smallest?", options: ["Cell, tissue, organ, organ system", "Organ, cell, tissue, system", "Tissue, cell, organ, system", "System, organ, tissue, cell"], answer: 0, hints: ["Start with the smallest unit.", "Cells form tissues.", "Then organs, then systems."], explain: "Cell → tissue → organ → organ system." }
    ],
    reflect: R("Linking shape to job", "The examples", "The levels of organisation"),
    parent: "Your child learnt how cells are specially shaped for their jobs.",
    teacher: "Shows relating the structure of specialised cells to function and describing levels of organisation.",
    done: "A cell's shape suits its job. Cells → tissues → organs → systems." },

  { ...S, id: "cam7-sci-dissolving", grade: 7, title: "Dissolving and solutions", topic: "Chemistry: the particle model",
    caps: cs(7, "Chemistry (dissolving; solutions; solubility; the particle model)"),
    intention: "Today I am explaining dissolving using particles.", prompt: "Where does the sugar go when you stir it into tea?",
    lesson: [
      { h: "Solute, solvent, solution", say: "When sugar dissolves in water, sugar is the solute, water is the solvent, and the mixture is a solution.", html: chainRow(["Solute (sugar)", "Solvent (water)", "Solution"]) },
      { h: "What particles do", say: "The sugar particles spread out between the water particles. They are too small to see, but they are still there. The mass is conserved.", html: P("Mass of solution = mass of solute + mass of solvent") },
      { h: "Dissolving faster", say: "Sugar dissolves faster in warm water, when stirred, and when the particles are smaller, like caster sugar.", html: chainRow(["Heat", "Stir", "Smaller pieces"]) }
    ],
    example: { q: "10 g of salt dissolves in 100 g of water. What is the mass of the solution?", steps: ["Mass is conserved when dissolving.", "10 g + 100 g.", "110 g."] },
    questions: [
      { type: "mcq", q: "In salty water, what is the solvent?", options: ["Water", "Salt", "Salty water", "Air"], answer: 0, hints: ["The solvent does the dissolving.", "The liquid.", "Water."], explain: "Water is the solvent." },
      { type: "num", q: "5 g of sugar dissolves in 200 g of water. What is the mass of the solution, in grams?", answer: "205", options: ["205", "200", "195", "5"], hints: ["Mass is conserved.", "5 + 200.", "205."], explain: "5 + 200 = 205 g." },
      { type: "mcq", q: "Where does sugar go when it dissolves?", options: ["Its particles spread between the water particles", "It disappears completely", "It turns into water", "It sinks and hides"], answer: 0, hints: ["It is still there.", "Too small to see.", "Spread out."], explain: "The particles spread out among the water particles." },
      { type: "mcq", q: "Which makes sugar dissolve faster?", options: ["Stirring", "Using cold water", "Using bigger lumps", "Waiting without stirring"], answer: 0, hints: ["Movement helps.", "It mixes the particles.", "Stirring."], explain: "Stirring helps the particles spread out faster." },
      { type: "mcq", q: "A substance that does not dissolve is…", options: ["insoluble", "a solvent", "a solution", "soluble"], answer: 0, hints: ["Soluble means it dissolves.", "The opposite…", "…insoluble."], explain: "Insoluble substances don't dissolve." }
    ],
    reflect: R("Picturing the particles", "Solute, solvent, solution", "Mass is conserved"),
    parent: "Your child explained dissolving using particles.",
    teacher: "Shows using solute, solvent and solution correctly, explaining dissolving with the particle model and applying conservation of mass.",
    done: "Dissolved particles spread out, and the total mass stays the same." },

  // ===================== STAGE 8 (GRADE 8) =====================
  { ...M, id: "cam8-equations", grade: 8, title: "Solving linear equations", topic: "Algebra: equations", category: "Problem Solving",
    caps: cm(8, "Algebra (solving linear equations, including with brackets and unknowns on both sides)"),
    intention: "Today I am solving equations with unknowns on both sides.", prompt: "How is an equation like a balance scale?",
    lesson: [
      { h: "Keep it balanced", say: "An equation is like a balance. Whatever you do to one side, you must do to the other.", html: P("Do the <b>same</b> to both sides.") },
      { h: "Brackets first", say: "Expand brackets first. 3 times x plus 2 equals 21 becomes 3x plus 6 equals 21. Then 3x equals 15, so x equals 5.", html: P("3(x + 2) = 21 → 3x + 6 = 21 → 3x = 15 → <b>x = 5</b>") },
      { h: "Unknowns on both sides", say: "Collect the x terms on one side. 5x plus 3 equals 2x plus 12. Subtract 2x: 3x plus 3 equals 12. So 3x equals 9 and x equals 3.", html: P("5x + 3 = 2x + 12 → 3x = 9 → <b>x = 3</b>") }
    ],
    example: { q: "Solve 4x − 7 = 2x + 5.", steps: ["Subtract 2x from both sides: 2x − 7 = 5.", "Add 7: 2x = 12.", "Divide by 2: x = 6."] },
    questions: [
      { type: "num", q: "Solve 2x + 5 = 17.", answer: "6", options: ["6", "11", "12", "8.5"], hints: ["Subtract 5.", "2x = 12.", "x = 6."], explain: "2x = 12, so x = 6." },
      { type: "num", q: "Solve 4(x − 1) = 20.", answer: "6", options: ["6", "5", "4", "21"], hints: ["Expand: 4x − 4 = 20.", "4x = 24.", "x = 6."], explain: "4x = 24, so x = 6." },
      { type: "num", q: "Solve 7x + 2 = 3x + 18.", answer: "4", options: ["4", "5", "2", "20"], hints: ["Subtract 3x: 4x + 2 = 18.", "4x = 16.", "x = 4."], explain: "4x = 16, so x = 4." },
      { type: "num", q: "Solve x ÷ 3 = 9.", answer: "27", options: ["27", "3", "12", "6"], hints: ["Undo dividing by 3.", "Multiply by 3.", "27."], explain: "x = 9 × 3 = 27." },
      { type: "mcq", q: "Check: is x = 5 a solution of 3x − 4 = 11?", options: ["Yes, because 15 − 4 = 11", "No", "Only if x is negative", "You can't check"], answer: 0, hints: ["Substitute x = 5.", "3 × 5 − 4.", "11."], explain: "3(5) − 4 = 11, so yes." }
    ],
    reflect: R("Doing the same to both sides", "Expanding brackets first", "Checking my answer"),
    parent: "Your child solved equations with brackets and unknowns on both sides.",
    teacher: "Shows solving linear equations involving brackets and unknowns on both sides, and verifying solutions.",
    done: "Expand, collect the unknowns on one side, solve, then check." },

  { ...M, id: "cam8-percentage-change", grade: 8, title: "Percentage increase and decrease", topic: "Number: percentages", category: "Problem Solving",
    caps: cm(8, "Number (percentage increase and decrease; using multipliers)"),
    intention: "Today I am working out percentage increases and decreases.", prompt: "How do you know if a sale is really a bargain?",
    lesson: [
      { h: "Percentage of an amount", say: "To find 20 percent of 50, divide by 100 and multiply by 20, or multiply by 0.2. 20 percent of 50 is 10.", html: P("20% of 50 = 0.2 × 50 = <b>10</b>") },
      { h: "Using multipliers", say: "To increase by 20 percent, multiply by 1.2. To decrease by 20 percent, multiply by 0.8.", html: chainRow(["+20%: × 1.2", "−20%: × 0.8"]) },
      { h: "Percentage change", say: "Percentage change is the change divided by the original amount, times 100. A price rising from 40 to 50 dollars is a 25 percent increase.", html: P("(50 − 40) ÷ 40 × 100 = <b>25%</b>") }
    ],
    example: { q: "A $60 jacket is reduced by 15%. What is the new price?", steps: ["Multiplier for a 15% decrease: 0.85.", "60 × 0.85.", "= $51."] },
    questions: [
      { type: "num", q: "Find 30% of 80.", answer: "24", options: ["24", "30", "50", "2.4"], hints: ["0.3 × 80.", "Or 10% is 8.", "3 × 8."], explain: "0.3 × 80 = 24." },
      { type: "mcq", q: "Which multiplier increases an amount by 5%?", options: ["1.05", "0.95", "1.5", "5"], answer: 0, hints: ["100% + 5% = 105%.", "As a decimal…", "1.05."], explain: "105% = 1.05." },
      { type: "num", q: "A $200 bike is reduced by 25%. What is the new price, in dollars?", answer: "150", options: ["150", "175", "50", "225"], hints: ["Multiplier 0.75.", "200 × 0.75.", "150."], explain: "200 × 0.75 = $150." },
      { type: "num", q: "A price rises from $40 to $46. What is the percentage increase? (Type the number only.)", answer: "15", options: ["15", "6", "13", "46"], hints: ["Change: 6.", "6 ÷ 40 = 0.15.", "15%."], explain: "6 ÷ 40 × 100 = 15%." },
      { type: "mcq", q: "A price goes up 10%, then down 10%. Is it back to the original?", options: ["No, it is 1% lower", "Yes", "No, it is 1% higher", "It doubles"], answer: 0, hints: ["Try $100.", "100 → 110 → 99.", "Lower."], explain: "1.1 × 0.9 = 0.99, so it ends 1% lower." }
    ],
    reflect: R("Using multipliers", "Change ÷ original", "Trying with $100"),
    parent: "Your child worked out percentage increases, decreases and changes.",
    teacher: "Shows calculating percentages of amounts, using multipliers for increase and decrease, and finding percentage change.",
    done: "Use a multiplier, and for change: (new − old) ÷ old × 100." },

  { ...E, id: "cam8-eng-character", grade: 8, title: "Character and setting", topic: "Reading: fiction", category: "Creativity",
    caps: ce(8, "Reading (how writers present character and setting through language and detail)"),
    intention: "Today I am analysing how a writer reveals a character.", prompt: "How can you tell someone is worried without them saying so?",
    passage: HARBOUR,
    lesson: [
      READ(HARBOUR),
      { h: "Show through action", say: "Writers reveal character through what people do, not only what they say. Uncle Sizwe counts the boats and his shoulders drop when the last one returns.", html: chainRow(["Action", "Body language", "What it reveals"]) },
      { h: "Setting creates mood", say: "The harbour at dawn, with boats low in the water, creates a quiet, tense mood. Setting can reflect how characters feel.", html: P("Setting shapes <b>mood</b>.") }
    ],
    example: { q: "What does 'his shoulders dropped' reveal?", steps: ["Dropping shoulders show tension leaving the body.", "It happens when the last boat returns.", "He had been worried, and now he is relieved."] },
    questions: [
      { type: "mcq", q: "Why does Uncle Sizwe count the boats?", options: ["He is worried that one might not return", "He is selling them", "He is bored", "He is learning to count"], answer: 0, hints: ["Watch his reaction.", "Relief when the last one arrives.", "Worry."], explain: "He is anxious until every boat is safely back." },
      { type: "mcq", q: "What does 'the way other men count money' suggest?", options: ["The boats are as precious to him as money", "He is greedy", "He is a banker", "The boats are cheap"], answer: 0, hints: ["People count money carefully.", "It matters to them.", "Precious."], explain: "The comparison shows how much the boats matter." },
      { type: "mcq", q: "Why does he laugh 'too loudly'?", options: ["His relief bursts out after the tension", "Something is funny", "He is angry", "He can't hear"], answer: 0, hints: ["When does he laugh?", "After the last boat.", "Relief."], explain: "The loud laugh releases his built-up worry." },
      { type: "mcq", q: "What mood does the setting create at the start?", options: ["Quiet and tense", "Loud and joyful", "Frightening and violent", "Bored"], answer: 0, hints: ["Dawn, boats low in the water.", "Waiting.", "Quiet tension."], explain: "The quiet harbour and waiting create tension." },
      { type: "mcq", q: "Which is the best analysis?", options: ["The writer shows Uncle Sizwe's worry through his folded arms and careful counting.", "Uncle Sizwe is a man.", "There are boats.", "I like the story."], answer: 0, hints: ["Analysis explains how.", "Refer to details.", "The first."], explain: "It links details to what they reveal." }
    ],
    reflect: R("Watching actions", "Body language", "Linking setting to mood"),
    parent: "Your child analysed how a writer reveals a character's feelings through actions and setting.",
    teacher: "Shows analysing characterisation through action and body language and the effect of setting on mood.",
    done: "Actions reveal feelings; setting creates mood." },

  { ...E, id: "cam8-eng-balanced", grade: 8, title: "A balanced argument", topic: "Reading and writing: discursive", category: "Flexible Thinking",
    caps: ce(8, "Reading and writing (balanced, discursive texts; presenting both sides; reaching a conclusion)"),
    intention: "Today I am reading and planning a balanced argument.", prompt: "Is it ever hard to decide which side you're on?",
    passage: PLASTIC,
    lesson: [
      READ(PLASTIC),
      { h: "Both sides", say: "A balanced argument presents both sides fairly before reaching a conclusion. This article gives reasons for a ban, then reasons against.", html: chainRow(["For", "Against", "Conclusion"]) },
      { h: "Signal words", say: "Writers use signal words to move between sides: however, on the other hand, despite this. The conclusion weighs the evidence.", html: P("<b>However</b>, <b>on the other hand</b>, <b>despite this</b>") }
    ],
    example: { q: "What does the writer conclude, and why?", steps: ["The writer suggests a charge for each bag.", "This avoids the problems of a full ban.", "It still encourages reusable bags, as other places have shown."] },
    questions: [
      { type: "mcq", q: "Which is an argument FOR a ban?", options: ["Volunteers removed over 3 000 bags from the river", "Paper bags cost shops more", "Families reuse bags as bin liners", "Bags are light"], answer: 0, hints: ["Which shows harm from bags?", "The river.", "3 000 bags."], explain: "The river pollution supports a ban." },
      { type: "mcq", q: "Which is an argument AGAINST a ban?", options: ["Paper bags cost small shops five times as much", "Bags pollute rivers", "Bags are used for minutes", "Bags are thrown away"], answer: 0, hints: ["Who would be harmed by a ban?", "Small shops.", "Cost."], explain: "The cost to small shops argues against a ban." },
      { type: "mcq", q: "Which word signals the move to the other side?", options: ["However", "Plastic", "Volunteers", "Exactly"], answer: 0, hints: ["Look at the start of paragraph 2.", "A contrast word.", "However."], explain: "'However' introduces the opposing view." },
      { type: "mcq", q: "What is the writer's conclusion?", options: ["A charge for each bag may be a fairer first step", "Ban all plastic immediately", "Do nothing", "Ban paper bags"], answer: 0, hints: ["Look at the last paragraph.", "A middle way.", "A charge."], explain: "The writer suggests charging for bags." },
      { type: "mcq", q: "What makes the argument balanced?", options: ["It fairly presents both sides before concluding", "It is very short", "It uses only one side", "It has a title"], answer: 0, hints: ["Balance means fairness.", "Both sides.", "Then a conclusion."], explain: "It gives both sides fairly." }
    ],
    reflect: R("Sorting for and against", "Signal words", "Weighing up the conclusion"),
    parent: "Your child explored how a balanced argument presents both sides.",
    teacher: "Shows identifying arguments for and against, recognising discursive signal words and evaluating a reasoned conclusion.",
    done: "Present both sides fairly, signal the switch, and weigh them in the conclusion." },

  { ...S, id: "cam8-sci-digestion", grade: 8, title: "The digestive system", topic: "Biology: digestion",
    caps: cs(8, "Biology (the human digestive system; the role of enzymes; absorption)"),
    intention: "Today I am following food through the digestive system.", prompt: "What happens to your lunch after you swallow it?",
    lesson: [
      { h: "The journey", say: "Food travels from the mouth, down the oesophagus, to the stomach, then the small intestine and the large intestine.", html: chainRow(["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine"]) },
      { h: "Breaking food down", say: "Teeth break food into smaller pieces. Enzymes break large molecules into small ones the body can absorb. The stomach's acid helps enzymes there and kills bacteria.", html: P("Physical: <b>teeth</b>. Chemical: <b>enzymes</b>.") },
      { h: "Absorption", say: "Small food molecules pass through the wall of the small intestine into the blood. The large intestine absorbs water.", html: chainRow(["Small intestine: nutrients into the blood", "Large intestine: water"]) }
    ],
    example: { q: "Why must large food molecules be broken down?", steps: ["Large molecules are too big to pass through the gut wall.", "Enzymes break them into small, soluble molecules.", "These can be absorbed into the blood."] },
    questions: [
      { type: "mcq", q: "Where does food go after the mouth?", options: ["The oesophagus", "The large intestine", "The lungs", "The heart"], answer: 0, hints: ["The tube you swallow into.", "It leads to the stomach.", "Oesophagus."], explain: "Food is swallowed down the oesophagus." },
      { type: "mcq", q: "Where are most nutrients absorbed into the blood?", options: ["Small intestine", "Stomach", "Mouth", "Large intestine"], answer: 0, hints: ["It is long and folded.", "Close to the blood.", "Small intestine."], explain: "Most absorption happens in the small intestine." },
      { type: "mcq", q: "What do digestive enzymes do?", options: ["Break large molecules into small ones", "Make food bigger", "Carry oxygen", "Absorb water"], answer: 0, hints: ["They are chemical helpers.", "Large to small.", "Break down."], explain: "Enzymes break large molecules into smaller ones." },
      { type: "mcq", q: "What is the main job of the large intestine?", options: ["Absorbing water", "Chewing", "Making acid", "Absorbing oxygen"], answer: 0, hints: ["Near the end of the gut.", "It takes back something important.", "Water."], explain: "The large intestine absorbs water." },
      { type: "mcq", q: "Why does the stomach contain acid?", options: ["It kills bacteria and helps stomach enzymes work", "To dissolve teeth", "To make food colder", "To absorb water"], answer: 0, hints: ["It protects us.", "And helps digestion.", "Two jobs."], explain: "Acid kills bacteria and provides the right pH for stomach enzymes." }
    ],
    reflect: R("Following the journey", "Physical versus chemical digestion", "Where absorption happens"),
    parent: "Your child followed food through the digestive system.",
    teacher: "Shows describing the pathway of digestion, the role of enzymes and acid, and the sites of absorption.",
    done: "Teeth and enzymes break food down; the small intestine absorbs it." },

  { ...S, id: "cam8-sci-light", grade: 8, title: "Reflection and refraction", topic: "Physics: light",
    caps: cs(8, "Physics (reflection and the law of reflection; refraction of light)"),
    intention: "Today I am explaining how light reflects and bends.", prompt: "Why does a straw look bent in a glass of water?",
    lesson: [
      { h: "Light travels in straight lines", say: "Light travels in straight lines called rays. We see objects when light from them enters our eyes.", html: P("Light → object → <b>eye</b>") },
      { h: "Reflection", say: "When light hits a mirror, it reflects. The angle of incidence equals the angle of reflection. Both angles are measured from the normal. The normal is a line at right angles to the mirror.", html: P("Angle of incidence = <b>angle of reflection</b>") },
      { h: "Refraction", say: "Light changes speed when it moves from one material to another, for example from water into air. This makes it change direction, or refract. That is why a straw looks bent.", html: P("Change of speed → change of <b>direction</b>") }
    ],
    example: { q: "A ray hits a mirror at 35° to the normal. What is the angle of reflection?", steps: ["The angle of incidence is 35°.", "The angle of reflection equals the angle of incidence.", "35°."] },
    questions: [
      { type: "num", q: "The angle of incidence is 50°. What is the angle of reflection, in degrees?", answer: "50", options: ["50", "40", "100", "130"], hints: ["They are equal.", "The law of reflection.", "50."], explain: "The angles are equal: 50°." },
      { type: "mcq", q: "What is the normal?", options: ["A line at right angles to the surface", "The mirror itself", "The reflected ray", "A type of light"], answer: 0, hints: ["Angles are measured from it.", "It is perpendicular.", "At 90°."], explain: "The normal is perpendicular to the surface." },
      { type: "mcq", q: "Why does a straw look bent in water?", options: ["Light refracts as it passes from water into air", "The straw really bends", "Water is a mirror", "Light stops in water"], answer: 0, hints: ["Light changes material.", "It changes speed.", "Refraction."], explain: "Light changes direction as it leaves the water." },
      { type: "mcq", q: "What causes refraction?", options: ["Light changing speed between materials", "Light getting brighter", "A mirror", "Sound waves"], answer: 0, hints: ["Speed changes.", "Between materials.", "That bends the ray."], explain: "Changing speed causes a change in direction." },
      { type: "mcq", q: "How do we see a book on a table?", options: ["Light reflected from the book enters our eyes", "Our eyes send out light", "The book makes its own light", "Sound bounces off it"], answer: 0, hints: ["Books don't glow.", "Light bounces off them.", "Into our eyes."], explain: "Light from a source reflects off the book into our eyes." }
    ],
    reflect: R("Drawing ray diagrams", "Measuring from the normal", "The straw example"),
    parent: "Your child explained how light reflects off mirrors and bends in water.",
    teacher: "Shows applying the law of reflection with reference to the normal and explaining refraction in terms of change of speed.",
    done: "Reflection: angles equal. Refraction: speed changes, so direction changes." },

  // ===================== STAGE 9 (GRADE 9) =====================
  { ...M, id: "cam9-pythagoras", grade: 9, title: "Pythagoras' theorem", topic: "Geometry: right-angled triangles", category: "Problem Solving",
    caps: cm(9, "Geometry and measure (Pythagoras' theorem in two dimensions)"),
    intention: "Today I am using Pythagoras' theorem to find missing sides.", prompt: "How long is the diagonal of a soccer field?",
    lesson: [
      { h: "The theorem", say: "In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. The hypotenuse is the longest side, opposite the right angle.", html: P("a² + b² = <b>c²</b>") },
      { h: "Finding the hypotenuse", say: "If the two shorter sides are 3 and 4, then c squared is 9 plus 16, which is 25. So c is 5.", html: P("3² + 4² = 25 → c = <b>5</b>") },
      { h: "Finding a shorter side", say: "To find a shorter side, subtract. If c is 13 and a is 5, then b squared is 169 minus 25, which is 144, so b is 12.", html: P("13² − 5² = 144 → b = <b>12</b>") }
    ],
    example: { q: "A ladder 10 m long leans against a wall with its foot 6 m from the wall. How high up the wall does it reach?", steps: ["The ladder is the hypotenuse: 10 m.", "h² = 10² − 6² = 100 − 36 = 64.", "h = 8 m."] },
    questions: [
      { type: "num", q: "The two shorter sides are 6 and 8. Find the hypotenuse.", answer: "10", options: ["10", "14", "100", "48"], hints: ["36 + 64.", "= 100.", "√100."], explain: "√100 = 10." },
      { type: "num", q: "The hypotenuse is 13 and one side is 12. Find the other side.", answer: "5", options: ["5", "25", "1", "17.7"], hints: ["Subtract the squares.", "169 − 144 = 25.", "√25."], explain: "√25 = 5." },
      { type: "mcq", q: "Which side is the hypotenuse?", options: ["The longest side, opposite the right angle", "The shortest side", "Any side", "The bottom side"], answer: 0, hints: ["Find the right angle.", "Look across from it.", "Longest."], explain: "It is opposite the right angle and is the longest side." },
      { type: "mcq", q: "Do the sides 5, 12 and 13 make a right-angled triangle?", options: ["Yes, because 25 + 144 = 169", "No", "Only if it is drawn", "You can't tell"], answer: 0, hints: ["Check a² + b² = c².", "25 + 144.", "169 = 13²."], explain: "25 + 144 = 169 = 13², so yes." },
      { type: "num", q: "A rectangle is 9 cm by 12 cm. How long is its diagonal, in cm?", answer: "15", options: ["15", "21", "225", "10.5"], hints: ["The diagonal is the hypotenuse.", "81 + 144 = 225.", "√225."], explain: "√225 = 15 cm." }
    ],
    reflect: R("Spotting the hypotenuse", "Adding or subtracting squares", "Drawing the triangle"),
    parent: "Your child used Pythagoras' theorem to find missing sides.",
    teacher: "Shows applying Pythagoras' theorem to find the hypotenuse and shorter sides, and testing for right angles.",
    done: "a² + b² = c²: add to find the hypotenuse, subtract to find a shorter side." },

  { ...M, id: "cam9-expected-frequency", grade: 9, title: "Probability and expected frequency", topic: "Statistics and probability", category: "Inquiry and Exploration",
    caps: cm(9, "Statistics and probability (relative frequency; expected frequency; comparing with theoretical probability)"),
    intention: "Today I am predicting how often an event should happen.", prompt: "If you toss a coin 100 times, will you get exactly 50 heads?",
    lesson: [
      { h: "Expected frequency", say: "Expected frequency is the probability times the number of trials. Rolling a dice 60 times, you expect a 6 about 1 sixth of 60, which is 10 times.", html: P("Expected frequency = P(event) × number of trials") },
      { h: "Relative frequency", say: "Relative frequency is how often something actually happened, divided by the number of trials. If you got 12 sixes in 60 rolls, the relative frequency is 12 over 60, or 0.2.", html: P("Relative frequency = times it happened ÷ trials") },
      { h: "Is it fair?", say: "With many trials, relative frequency should be close to the theoretical probability. A big difference after many trials may suggest the dice is biased.", html: P("More trials → more <b>reliable</b> estimate") }
    ],
    example: { q: "A spinner has P(red) = 0.25. It is spun 200 times. How many reds do you expect?", steps: ["Expected = P × trials.", "0.25 × 200.", "= 50 reds."] },
    questions: [
      { type: "num", q: "A coin is tossed 80 times. How many heads do you expect?", answer: "40", options: ["40", "80", "20", "50"], hints: ["P(heads) = 0.5.", "0.5 × 80.", "40."], explain: "0.5 × 80 = 40." },
      { type: "num", q: "A dice is rolled 120 times. How many 3s do you expect?", answer: "20", options: ["20", "40", "3", "60"], hints: ["P(3) = 1/6.", "120 ÷ 6.", "20."], explain: "1/6 × 120 = 20." },
      { type: "num", q: "A drawing pin lands point-up 30 times in 50 throws. What is the relative frequency of point-up?", answer: "0.6", options: ["0.6", "30", "0.3", "1.6"], hints: ["Times ÷ trials.", "30 ÷ 50.", "0.6."], explain: "30 ÷ 50 = 0.6." },
      { type: "mcq", q: "A dice lands on 6 in 300 of 600 rolls. What might this suggest?", options: ["The dice may be biased", "The dice is fair", "Nothing at all", "Sixes are impossible"], answer: 0, hints: ["Expected about 100.", "300 is far more.", "Possibly biased."], explain: "300 is far more than the expected 100, so it may be biased." },
      { type: "mcq", q: "Why is a relative frequency from 1 000 trials more reliable than from 10?", options: ["More trials give a better estimate of the true probability", "Bigger numbers are always right", "10 trials are illegal", "It isn't more reliable"], answer: 0, hints: ["Small samples vary a lot.", "Large samples settle down.", "Better estimate."], explain: "With more trials, results get closer to the true probability." }
    ],
    reflect: R("P × trials", "Times ÷ trials", "Comparing with theory"),
    parent: "Your child predicted results using probability and compared them with experiments.",
    teacher: "Shows calculating expected and relative frequency and interpreting differences from theoretical probability.",
    done: "Expected = P × trials. Relative frequency = times ÷ trials." },

  { ...E, id: "cam9-eng-structure", grade: 9, title: "How texts are structured", topic: "Reading: structure", category: "Planning and Organisation",
    caps: ce(9, "Reading (how writers structure non-fiction texts for effect)"),
    intention: "Today I am analysing how a writer structures a text.", prompt: "Why do news reports put the most important facts first?",
    passage: PLASTIC,
    lesson: [
      READ(PLASTIC),
      { h: "Structure is a choice", say: "Writers decide what goes first, in the middle and last. This article opens with the problem, then gives the other side, and ends with a solution.", html: chainRow(["Problem", "Complication", "Solution"]) },
      { h: "Openings and endings", say: "The opening hooks the reader with a surprising idea: plastic bags are useful, and that is exactly the problem. The ending leaves the reader with a possible way forward.", html: P("Opening: <b>hook</b>. Ending: <b>resolution</b>.") }
    ],
    example: { q: "Why does the writer put the river statistic in the first paragraph?", steps: ["It gives evidence of the problem early.", "A concrete number makes the problem real.", "It hooks the reader before the complications."] },
    questions: [
      { type: "mcq", q: "How does the article begin?", options: ["With a surprising statement about why bags are a problem", "With the solution", "With a story about a shop", "With a question"], answer: 0, hints: ["Look at the first sentence.", "'Which is exactly the problem.'", "A surprising statement."], explain: "It opens by turning the bags' usefulness into the problem." },
      { type: "mcq", q: "What is the purpose of the second paragraph?", options: ["To present complications with a ban", "To repeat the first paragraph", "To end the article", "To tell a joke"], answer: 0, hints: ["It starts with 'However'.", "The other side.", "Complications."], explain: "It shows why a ban is not simple." },
      { type: "mcq", q: "Why does the writer end with a possible solution?", options: ["To leave the reader with a way forward", "Because they ran out of words", "To confuse the reader", "To start a new topic"], answer: 0, hints: ["After problem and complication…", "…comes a resolution.", "A way forward."], explain: "It resolves the tension the article built up." },
      { type: "mcq", q: "Which structure does the article follow?", options: ["Problem, complication, solution", "Solution, problem, question", "Story, list, poem", "Question, answer, question"], answer: 0, hints: ["Look at each paragraph's job.", "Problem first.", "Then complication, then solution."], explain: "Problem → complication → solution." },
      { type: "mcq", q: "Which is the best comment on structure?", options: ["By moving from problem to complication to solution, the writer guides the reader towards the bag charge.", "The article has three paragraphs.", "The article is about bags.", "It is well written."], answer: 0, hints: ["Explain the effect.", "On the reader.", "The first."], explain: "It explains how the structure guides the reader." }
    ],
    reflect: R("Finding each paragraph's job", "Looking at the opening and ending", "Explaining the effect"),
    parent: "Your child analysed how the structure of an article guides the reader.",
    teacher: "Shows analysing the function of paragraphs and the effect of structural choices in non-fiction.",
    done: "Ask what each part does, and how the order guides the reader." },

  { ...E, id: "cam9-eng-speech", grade: 9, title: "Writing a speech", topic: "Writing and speaking: persuasion", category: "Communication",
    caps: ce(9, "Writing and speaking (writing and delivering a persuasive speech for an audience)"),
    intention: "Today I am writing a speech that persuades an audience.", prompt: "What makes a speaker worth listening to?",
    lesson: [
      { h: "Speeches are heard", say: "A speech is written to be heard. So use short sentences. Speak directly to the audience with you and we. Use clear signpost words like firstly and finally.", html: chainRow(["Short sentences", "You and we", "Signposts"]) },
      { h: "Rhetorical devices", say: "Speakers use the rule of three, rhetorical questions and repetition to make ideas memorable. For example: we can recycle, we can reuse, we can refuse.", html: P("<b>We can</b> recycle. <b>We can</b> reuse. <b>We can</b> refuse.") },
      { h: "A strong ending", say: "End with a call to action that tells the audience exactly what to do next.", html: P("'Bring one reusable bag tomorrow. That's all it takes to start.'") }
    ],
    example: { q: "Write an opening line for a speech about saving water.", steps: ["Hook the audience directly.", "Use a question or a striking fact.", "'What would you do if you turned on the tap tomorrow and nothing came out?'"] },
    questions: [
      { type: "mcq", q: "Why do speeches use 'you' and 'we'?", options: ["To involve the audience directly", "To make them longer", "Because it is formal", "To avoid facts"], answer: 0, hints: ["Speeches talk to people.", "Direct address.", "Involves them."], explain: "Direct address makes the audience feel involved." },
      { type: "mcq", q: "'We can recycle, we can reuse, we can refuse' uses…", options: ["the rule of three and repetition", "a statistic", "a simile", "a counter-argument"], answer: 0, hints: ["Count the ideas.", "Notice what repeats.", "Three, repeated."], explain: "Three parallel ideas with a repeated phrase." },
      { type: "mcq", q: "Which is a rhetorical question?", options: ["'Do we really want our children to inherit a dirty river?'", "'What time is it?'", "'The river is dirty.'", "'Recycle now.'"], answer: 0, hints: ["It doesn't expect an answer.", "It makes a point.", "The first."], explain: "It makes a point rather than asking for information." },
      { type: "mcq", q: "Which ending is a clear call to action?", options: ["'Bring one reusable bag tomorrow.'", "'Thank you.'", "'That's my speech.'", "'Bags exist.'"], answer: 0, hints: ["What should the audience do?", "Something specific.", "Bring a bag."], explain: "It tells the audience exactly what to do." },
      { type: "mcq", q: "Why are short sentences useful in a speech?", options: ["They are easier for listeners to follow", "They are required by law", "They hide the meaning", "They make the speech longer"], answer: 0, hints: ["Listeners can't re-read.", "Keep it clear.", "Easy to follow."], explain: "Listeners follow short sentences more easily." }
    ],
    reflect: R("Writing for the ear", "Rule of three", "The call to action"),
    parent: "Your child practised writing a persuasive speech.",
    teacher: "Shows adapting writing for spoken delivery, using rhetorical devices and crafting a call to action.",
    done: "Write for the ear: short, direct, memorable, with a clear call to action." },

  { ...S, id: "cam9-sci-reactivity", grade: 9, title: "The reactivity of metals", topic: "Chemistry: metals",
    caps: cs(9, "Chemistry (the reactivity series; displacement reactions)"),
    intention: "Today I am ordering metals by how reactive they are.", prompt: "Why do iron gates rust but gold rings don't?",
    lesson: [
      { h: "The reactivity series", say: "Metals can be put in order of how readily they react. Potassium and sodium are very reactive. Gold and silver hardly react at all.", html: chainRow(["Potassium", "Sodium", "Magnesium", "Zinc", "Iron", "Copper", "Gold"]) + P("Most reactive → least reactive") },
      { h: "Reactions with acid and water", say: "More reactive metals react faster with acids and water, giving off hydrogen gas. Magnesium fizzes quickly in acid; copper doesn't react with dilute acid.", html: P("metal + acid → salt + <b>hydrogen</b>") },
      { h: "Displacement", say: "A more reactive metal displaces a less reactive metal from a solution of its compound. Iron placed in copper sulfate becomes coated in copper.", html: P("iron + copper sulfate → iron sulfate + <b>copper</b>") }
    ],
    example: { q: "Will zinc displace copper from copper sulfate solution?", steps: ["Zinc is above copper in the reactivity series.", "A more reactive metal displaces a less reactive one.", "Yes: zinc sulfate and copper are formed."] },
    questions: [
      { type: "mcq", q: "Which metal is most reactive?", options: ["Potassium", "Iron", "Copper", "Gold"], answer: 0, hints: ["The top of the series.", "It reacts violently with water.", "Potassium."], explain: "Potassium is at the top of the series." },
      { type: "mcq", q: "What gas is given off when magnesium reacts with acid?", options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"], answer: 0, hints: ["Metal + acid → salt + …", "It makes a squeaky pop.", "Hydrogen."], explain: "Metals and acids produce hydrogen." },
      { type: "mcq", q: "Will copper displace iron from iron sulfate?", options: ["No, copper is less reactive than iron", "Yes", "Only when hot", "Only in water"], answer: 0, hints: ["Compare their positions.", "Copper is below iron.", "No."], explain: "A less reactive metal can't displace a more reactive one." },
      { type: "mcq", q: "Why is gold used for jewellery?", options: ["It is very unreactive, so it doesn't tarnish", "It is very reactive", "It is cheap", "It fizzes in water"], answer: 0, hints: ["Gold rings stay shiny.", "It hardly reacts.", "Unreactive."], explain: "Gold's low reactivity keeps it shiny." },
      { type: "mcq", q: "Iron is placed in copper sulfate solution. What do you see?", options: ["Copper forms on the iron", "Nothing happens", "The iron turns to gold", "The solution freezes"], answer: 0, hints: ["Iron is more reactive.", "It displaces copper.", "Copper appears."], explain: "Iron displaces copper, which coats the iron." }
    ],
    reflect: R("Learning the series", "Comparing positions", "Predicting displacement"),
    parent: "Your child ordered metals by reactivity and predicted reactions.",
    teacher: "Shows using the reactivity series to predict reactions with acids and displacement reactions.",
    done: "Higher in the series means more reactive, and it can displace metals below it." },

  { ...S, id: "cam9-sci-carbon-cycle", grade: 9, title: "The carbon cycle and climate", topic: "Earth and space: climate",
    caps: cs(9, "Earth and space (the carbon cycle; the greenhouse effect; human impact on climate)"),
    intention: "Today I am tracing carbon through the carbon cycle.", prompt: "Where does the carbon in a burning log go?",
    lesson: [
      { h: "Carbon moves around", say: "Carbon moves between the air, living things, the oceans and rocks. Plants take in carbon dioxide for photosynthesis. Respiration, decay and burning release it.", html: chainRow(["Photosynthesis: takes CO₂ in", "Respiration, decay, burning: give CO₂ out"]) },
      { h: "The greenhouse effect", say: "Carbon dioxide and some other gases trap heat in the atmosphere, keeping Earth warm enough for life. More of these gases trap more heat.", html: P("More greenhouse gases → more heat <b>trapped</b>") },
      { h: "Human impact", say: "Burning fossil fuels and cutting down forests add carbon dioxide to the air faster than it is removed. This is causing global temperatures to rise.", html: chainRow(["Burning fossil fuels", "Deforestation", "More CO₂", "Warming"]) }
    ],
    example: { q: "Explain how cutting down forests increases carbon dioxide in the air.", steps: ["Trees remove carbon dioxide by photosynthesis.", "Fewer trees means less carbon dioxide is removed.", "If the trees are burnt, their stored carbon is released too."] },
    questions: [
      { type: "mcq", q: "Which process removes carbon dioxide from the air?", options: ["Photosynthesis", "Respiration", "Burning", "Decay"], answer: 0, hints: ["Plants do it.", "They use CO₂ to make glucose.", "Photosynthesis."], explain: "Photosynthesis takes carbon dioxide in." },
      { type: "mcq", q: "Which process releases carbon dioxide?", options: ["Burning fuels", "Photosynthesis", "Dissolving in rain only", "Freezing"], answer: 0, hints: ["Combustion.", "Fossil fuels.", "Burning."], explain: "Burning releases carbon dioxide." },
      { type: "mcq", q: "What does the greenhouse effect do?", options: ["Traps heat in the atmosphere", "Cools the Earth down", "Removes all CO₂", "Makes plants grow faster only"], answer: 0, hints: ["Like a blanket.", "Heat stays in.", "Traps heat."], explain: "Greenhouse gases trap heat." },
      { type: "mcq", q: "Why is the greenhouse effect needed for life?", options: ["Without it, Earth would be too cold", "It makes oxygen", "It stops rain", "It isn't needed"], answer: 0, hints: ["Earth needs some warmth.", "Without any trapped heat…", "…too cold."], explain: "Some trapped heat keeps Earth warm enough for life." },
      { type: "mcq", q: "Which action would reduce carbon dioxide in the air?", options: ["Planting trees", "Burning more coal", "Cutting down forests", "Driving more"], answer: 0, hints: ["Which removes CO₂?", "Photosynthesis.", "Plant trees."], explain: "More trees remove more carbon dioxide." }
    ],
    reflect: R("Following carbon around the cycle", "In and out processes", "Linking to climate"),
    parent: "Your child traced carbon through the carbon cycle and linked it to climate change.",
    teacher: "Shows describing processes in the carbon cycle, explaining the greenhouse effect and evaluating human impact.",
    done: "Photosynthesis takes carbon dioxide in; respiration, decay and burning release it." }
  );
}
