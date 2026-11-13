"use strict";

// ---------- IEB lessons for the new app only. Original content. ----------
// IEB learners keep every CAPS lesson; these come on top. They practise what IEB examines differently: reasoning in
// unfamiliar problems, source-based and data questions, and judging claims. Advanced Programme Mathematics is an extra
// subject, shown to IEB learners unless they take Mathematical Literacy.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const IEB = { curriculum: "IEB" };
  const MA = { ...IEB, subject: "Mathematics", domain: "Logical and Analytical Thinking" };
  const EN = { ...IEB, subject: "English Home Language", domain: "Communication and Expression" };
  const LS = { ...IEB, subject: "Life Sciences", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" };
  const AP = { ...IEB, subject: "Advanced Programme Mathematics", domain: "Logical and Analytical Thinking" };
  const READ = html => ({ h: "Read the source", say: "Read the source, or press Read aloud to hear it part by part.", html });
  const ieb = (subject, focus) => `IEB ${subject} (CAPS content, IEB assessment): ${focus}`;
  const apm = focus => `IEB Advanced Programme Mathematics: ${focus}`;

  const CARTOON = `<div class="passage-text"><p><b>Source: a cartoon, described</b> <span class="muted">(a 2to.iQ text)</span></p>
<p>A huge billboard reads <b>"SAVE WATER. SAVE LIVES."</b> Beneath it, a sprinkler is watering the billboard company's perfect green lawn at midday. A thin learner walks past carrying two buckets from a communal tap. The caption reads: <i>"We're all in this together."</i></p></div>`;
  const EDITORIAL = `<div class="passage-text"><p><b>Source: from a community newspaper editorial</b> <span class="muted">(a 2to.iQ text)</span></p>
<p>The so-called experts want us to believe that load-shedding schedules are fair. Ordinary residents know better. Every week, the leafy suburbs seem to get their power back first, while our township waits in the dark. It is time for the municipality to stop hiding behind spreadsheets and tell us the truth.</p></div>`;
  const POEM = `<div class="passage-text"><p><b>Inheritance</b> <span class="muted">(a 2to.iQ poem)</span></p>
<p>My grandmother's hands were maps:<br>rivers of blue under paper skin,<br>a scar where the paraffin stove<br>once argued with her.</p>
<p>She never wrote a letter in her life,<br>yet every recipe I know<br>is written in the margins of her palms,<br>and I am still learning to read them.</p></div>`;
  const CLAIM = `<div class="passage-text"><p><b>Source: a social-media post</b> <span class="muted">(made up)</span></p>
<p>"Scientists PROVE that drinking 3 cups of rooibos tea a day stops heart disease! A study of 40 people found that tea drinkers had lower blood pressure after 2 weeks. Share before Big Pharma deletes this!"</p></div>`;

  PLATFORM_UNITS.push(
  // ===================== GRADE 10 =====================
  { ...MA, id: "ieb10-ma-patterns", grade: 10, title: "Explaining a pattern", topic: "Reasoning in unfamiliar problems", category: "Pattern Thinking",
    caps: ieb("Mathematics", "Grade 10 number patterns, with emphasis on generalising and justifying in unfamiliar contexts"),
    intention: "Today I am finding a rule for a pattern and explaining why it works.", prompt: "How do you know a pattern will continue?",
    lesson: [
      { h: "Unfamiliar, not impossible", say: "IEB papers often set problems you have never seen before. Start by trying small cases, record them in a table, and look for what changes each time.", html: chainRow(["Try small cases", "Make a table", "Spot the change"]) },
      { h: "Finding the rule", say: "Matchstick squares in a row: 1 square uses 4 matches, 2 squares use 7, 3 squares use 10. Each new square adds 3, so the rule is 3n plus 1.", html: P("Squares: 1, 2, 3 → matches: 4, 7, 10") + P("Rule: <b>3n + 1</b>") },
      { h: "Explaining why", say: "A rule is stronger when you explain it from the picture. The first square needs one extra match to start, and each square then adds 3 new matches.", html: P("Explain the rule from the <b>structure</b>, not only from the numbers.") }
    ],
    example: { q: "Using 3n + 1, how many matches make 20 squares in a row?", steps: ["Substitute n = 20.", "3 × 20 + 1.", "61 matches."] },
    questions: [
      { type: "num", q: "Using 3n + 1, how many matches make 10 squares in a row?", answer: "31", options: ["31", "30", "40", "13"], hints: ["Substitute n = 10.", "3 × 10 + 1.", "31."], explain: "3 × 10 + 1 = 31." },
      { type: "num", q: "A pattern goes 5, 9, 13, 17. What is the next term?", answer: "21", options: ["21", "20", "22", "34"], hints: ["Find the difference.", "It goes up by 4.", "17 + 4."], explain: "Each term adds 4: 17 + 4 = 21." },
      { type: "mcq", q: "Which rule gives 5, 9, 13, 17, …?", options: ["4n + 1", "5n", "n + 4", "4n"], answer: 0, hints: ["The difference is 4, so start with 4n.", "When n = 1, 4n = 4.", "Add 1 to get 5."], explain: "4n + 1 gives 5, 9, 13, 17." },
      { type: "num", q: "With 3n + 1, how many squares can you make with exactly 100 matches?", answer: "33", options: ["33", "34", "100", "30"], hints: ["Solve 3n + 1 = 100.", "3n = 99.", "n = 33."], explain: "3n + 1 = 100 gives n = 33." },
      { type: "mcq", q: "Why is explaining the rule from the picture stronger than only checking numbers?", options: ["It shows why the rule always works, not just for the cases tried", "It is faster", "Pictures are always correct", "Examiners don't read numbers"], answer: 0, hints: ["A few cases could be a coincidence.", "The structure explains it.", "Always works."], explain: "Explaining from the structure shows the rule works for every case." }
    ],
    reflect: R("Trying small cases", "Making a table", "Explaining from the picture"),
    parent: "Your child found and explained the rule behind a pattern, as IEB papers ask.",
    teacher: "Shows generalising linear patterns, solving for n, and justifying a rule from the structure of the problem.",
    done: "Try small cases, find the rule, then explain why it works." },

  { ...MA, id: "ieb10-ma-geometry-proof", grade: 10, title: "Justifying in geometry", topic: "Euclidean geometry: reasoning", category: "Problem Solving",
    caps: ieb("Mathematics", "Grade 10 Euclidean geometry, with emphasis on giving reasons for every statement"),
    intention: "Today I am writing geometry answers with a reason for every step.", prompt: "Why might a correct answer still lose marks?",
    lesson: [
      { h: "Statement and reason", say: "In geometry, every statement needs a reason. Write the statement, then the reason in brackets, using the accepted wording.", html: P("∠A = 70° <b>(vertically opposite ∠s)</b>") },
      { h: "Common reasons", say: "Angles on a straight line add up to 180 degrees. Angles in a triangle add up to 180 degrees. With parallel lines, alternate angles are equal and co-interior angles add up to 180 degrees.", html: chainRow(["∠s on a str line", "∠s in a △", "alt ∠s, AB ∥ CD", "co-int ∠s"]) },
      { h: "Building a chain", say: "In unfamiliar diagrams, work forwards from what you know. Each new angle you find, with its reason, can unlock the next one.", html: P("Known → reason → new angle → reason → answer") }
    ],
    example: { q: "AB ∥ CD. A transversal makes ∠1 = 65° at AB. Find the alternate angle at CD.", steps: ["The lines are parallel.", "Alternate angles are equal.", "The angle is 65° (alt ∠s, AB ∥ CD)."] },
    questions: [
      { type: "num", q: "Two angles on a straight line: one is 125°. Find the other, in degrees.", answer: "55", options: ["55", "65", "125", "235"], hints: ["Angles on a straight line add to 180°.", "180 − 125.", "55."], explain: "180° − 125° = 55° (∠s on a str line)." },
      { type: "num", q: "A triangle has angles of 50° and 60°. Find the third angle, in degrees.", answer: "70", options: ["70", "80", "110", "60"], hints: ["Angles in a triangle add to 180°.", "180 − 50 − 60.", "70."], explain: "180° − 110° = 70° (∠s in a △)." },
      { type: "mcq", q: "AB ∥ CD and co-interior angles are x and 110°. What is x?", options: ["70°", "110°", "180°", "90°"], answer: 0, hints: ["Co-interior angles add to 180°.", "180 − 110.", "70°."], explain: "x = 70° (co-int ∠s, AB ∥ CD)." },
      { type: "mcq", q: "Which answer earns full marks?", options: ["∠B = 40° (∠s in a △)", "∠B = 40°", "∠B = 40° because I worked it out", "40"], answer: 0, hints: ["Every statement needs a reason.", "Use the accepted wording.", "The first."], explain: "It gives the statement and the accepted reason." },
      { type: "mcq", q: "When must you state that lines are parallel in your reason?", options: ["When using alternate, corresponding or co-interior angles", "Never", "Only in triangles", "Only for straight lines"], answer: 0, hints: ["Some angle facts only work with parallel lines.", "Which ones?", "Alternate, corresponding, co-interior."], explain: "These angle facts depend on the lines being parallel." }
    ],
    reflect: R("Writing a reason for each step", "Knowing the accepted wording", "Working forwards from what I know"),
    parent: "Your child practised giving a reason for every step in geometry.",
    teacher: "Shows using angle relationships with correctly stated reasons and constructing chains of reasoning in unfamiliar diagrams.",
    done: "Every statement needs a reason, in the accepted wording." },

  { ...EN, id: "ieb10-en-visual", grade: 10, title: "Reading a visual source", topic: "Visual literacy: satire", category: "Reflection",
    caps: ieb("English Home Language", "Grade 10 visual literacy, with emphasis on irony and critical comment in unseen sources"),
    intention: "Today I am analysing how a cartoon uses irony to criticise.", prompt: "Have you seen a cartoon that made a serious point?",
    passage: CARTOON,
    lesson: [
      READ(CARTOON),
      { h: "Irony", say: "Irony is when what is said or shown is the opposite of what is really happening. The billboard says save water, while the company wastes water on its lawn.", html: P("Message: <b>save water</b>. Reality: <b>wasting water</b>.") },
      { h: "Who is criticised?", say: "Satire uses humour or irony to criticise. Here the target is the company, and anyone who preaches to others while doing the opposite.", html: chainRow(["Target", "Technique", "Message"]) }
    ],
    example: { q: "Explain the irony of the caption 'We're all in this together.'", steps: ["The caption claims everyone shares the burden.", "The cartoon shows the company wasting water while a poor learner carries buckets.", "The caption is ironic: they are clearly not in it together."] },
    questions: [
      { type: "mcq", q: "What is the main target of the cartoon's criticism?", options: ["The billboard company", "The learner", "Water", "The tap"], answer: 0, hints: ["Who is doing the opposite of what they say?", "The company owns the lawn.", "The company."], explain: "The company preaches saving water while wasting it." },
      { type: "mcq", q: "Why is the sprinkler running at midday significant?", options: ["Most water evaporates then, so it is especially wasteful", "It is cooler then", "Plants only drink at noon", "It is the law"], answer: 0, hints: ["What happens to water in the midday heat?", "It evaporates.", "Wasteful."], explain: "Watering at midday wastes the most water." },
      { type: "mcq", q: "What does the contrast between the green lawn and the learner with buckets suggest?", options: ["Inequality in who carries the burden of saving water", "Everyone has enough water", "The learner is gardening", "Lawns are bad"], answer: 0, hints: ["Who has plenty?", "Who struggles?", "Inequality."], explain: "It highlights unequal access and burden." },
      { type: "mcq", q: "What is satire?", options: ["Using humour or irony to criticise", "A true news report", "A type of poem", "An advert"], answer: 0, hints: ["Cartoons often do it.", "It criticises.", "Through humour or irony."], explain: "Satire criticises through humour or irony." },
      { type: "mcq", q: "Which answer best analyses the caption?", options: ["The caption is ironic, because the cartoon shows the burden falls unequally.", "The caption is nice.", "The caption says we are together.", "There is a caption at the bottom."], answer: 0, hints: ["Analysis explains how and why.", "Not just what it says.", "The first."], explain: "It names the technique and explains its effect." }
    ],
    reflect: R("Spotting the contrast", "Naming the target", "Explaining the irony"),
    parent: "Your child analysed how a cartoon uses irony to criticise.",
    teacher: "Shows interpreting visual texts, identifying irony and satirical targets, and analysing contrasts in unseen sources.",
    done: "Find the contrast, name the target, and explain the irony." },

  { ...EN, id: "ieb10-en-bias", grade: 10, title: "Language, bias and manipulation", topic: "Critical language awareness", category: "Flexible Thinking",
    caps: ieb("English Home Language", "Grade 10 critical language awareness: bias, emotive language and manipulation"),
    intention: "Today I am spotting how language is used to persuade and manipulate.", prompt: "How can the same event be told in two very different ways?",
    passage: EDITORIAL,
    lesson: [
      READ(EDITORIAL),
      { h: "Emotive and loaded words", say: "Writers choose words that carry feelings. Calling people the so-called experts mocks them, and waits in the dark makes us feel sympathy.", html: chainRow(["so-called experts", "waits in the dark", "hiding behind spreadsheets"]) },
      { h: "Evidence or impression?", say: "Ask what evidence is given. The word seem shows the writer has an impression, not proof. Strong criticism needs facts.", html: P("Ask: <b>what is the evidence?</b>") }
    ],
    example: { q: "What is the effect of 'hiding behind spreadsheets'?", steps: ["Hiding suggests dishonesty.", "Spreadsheets suggests cold numbers instead of people.", "It makes the municipality seem secretive and uncaring."] },
    questions: [
      { type: "mcq", q: "What does 'so-called experts' suggest?", options: ["The writer doubts their expertise", "The writer admires them", "They are famous", "They are new"], answer: 0, hints: ["'So-called' questions a title.", "The writer doesn't trust them.", "Doubt."], explain: "'So-called' mocks and doubts their status." },
      { type: "mcq", q: "Which word shows the writer has an impression, not proof?", options: ["seem", "power", "township", "truth"], answer: 0, hints: ["Look at 'seem to get their power back first'.", "Not certain.", "Seem."], explain: "'Seem' signals an impression, not evidence." },
      { type: "mcq", q: "What would most strengthen the writer's argument?", options: ["Data comparing outage hours in different areas", "More capital letters", "Angrier words", "A longer title"], answer: 0, hints: ["What is missing?", "Evidence.", "Data."], explain: "Facts and figures would support the claim." },
      { type: "mcq", q: "'Ordinary residents know better' appeals to…", options: ["a sense of shared identity against the experts", "scientific evidence", "humour", "the law"], answer: 0, hints: ["Who are 'ordinary residents'?", "Us, the readers.", "Us against them."], explain: "It builds a shared 'us' against the experts." },
      { type: "mcq", q: "Which statement is most balanced?", options: ["Some residents believe the schedule favours certain areas, and want the data published.", "The municipality are liars.", "Experts are useless.", "Everyone knows it's unfair."], answer: 0, hints: ["Balanced means fair to both sides.", "No loaded words.", "The first."], explain: "It reports the concern without loaded language." }
    ],
    reflect: R("Finding loaded words", "Asking for evidence", "Rewriting in a balanced way"),
    parent: "Your child spotted bias and emotive language in an editorial.",
    teacher: "Shows identifying loaded and emotive language, distinguishing evidence from impression, and producing balanced alternatives.",
    done: "Spot the loaded words, ask for evidence, and say it fairly." },

  { ...LS, id: "ieb10-ls-graphs", grade: 10, title: "Reading a scientific source", topic: "Data-based questions: graphs",
    caps: ieb("Life Sciences", "Grade 10 scientific skills: reading and interpreting graphs in unseen sources"),
    intention: "Today I am reading a graph carefully and describing the trend.", prompt: "What do you look at first on a graph?",
    lesson: [
      { h: "Read before you answer", say: "Start with the title, the axes, the units and the scale. Many marks are lost by misreading the scale.", html: chainRow(["Title", "Axes and units", "Scale", "Trend"]) },
      { h: "Describing a trend", say: "Describe the overall pattern and give data from the graph. For example: as temperature increases from 10 to 35 degrees Celsius, the rate of photosynthesis increases from 4 to 20 units.", html: P("Trend + <b>data from the graph</b>") },
      { h: "Explain, don't just describe", say: "If the question asks you to explain, give the biological reason, not only the pattern. Enzymes work faster as temperature increases, up to their optimum.", html: P("Describe = <b>what</b>. Explain = <b>why</b>.") }
    ],
    example: { q: "A graph shows heart rate rising from 70 to 140 beats per minute during 5 minutes of exercise. Describe and explain.", steps: ["Describe: heart rate doubles, from 70 to 140 beats per minute.", "Explain: muscles need more oxygen and glucose during exercise.", "So the heart pumps faster to deliver more blood."] },
    questions: [
      { type: "mcq", q: "What should you check first on a graph?", options: ["The title, axes, units and scale", "The colour", "The last point only", "Nothing"], answer: 0, hints: ["Know what is shown.", "And how it is measured.", "Title, axes, units, scale."], explain: "Understanding the axes and scale prevents misreading." },
      { type: "mcq", q: "Which is the best description of a trend?", options: ["As temperature increases from 10 °C to 35 °C, the rate increases from 4 to 20 units.", "It goes up.", "The graph is nice.", "The rate is high."], answer: 0, hints: ["Use data.", "Give the range.", "The first."], explain: "It describes the pattern and quotes data." },
      { type: "mcq", q: "A question says 'explain the trend'. What must you include?", options: ["The biological reason for the pattern", "Only the numbers", "The graph title", "Your opinion"], answer: 0, hints: ["Explain means why.", "Use biology.", "The reason."], explain: "Explaining needs a biological reason." },
      { type: "num", q: "Heart rate rises from 70 to 140 beats per minute. By how many beats per minute did it increase?", answer: "70", options: ["70", "140", "210", "2"], hints: ["Subtract.", "140 − 70.", "70."], explain: "140 − 70 = 70 beats per minute." },
      { type: "mcq", q: "On a graph, each small square on the y-axis is 2 units, not 1. What is the risk?", options: ["Reading values wrongly if you assume 1 unit per square", "No risk", "The graph is broken", "The x-axis changes"], answer: 0, hints: ["Check the scale.", "Misreading.", "Wrong values."], explain: "Assuming the wrong scale gives wrong readings." }
    ],
    reflect: R("Checking the scale", "Quoting data", "Describing then explaining"),
    parent: "Your child practised reading graphs carefully and explaining trends.",
    teacher: "Shows interpreting axes and scales, describing trends with data, and distinguishing description from explanation.",
    done: "Check the axes and scale, describe with data, then explain with biology." },

  { ...LS, id: "ieb10-ls-investigation", grade: 10, title: "Planning an investigation", topic: "Scientific investigation",
    caps: ieb("Life Sciences", "Grade 10 scientific investigation: aim, hypothesis, variables, validity and reliability"),
    intention: "Today I am planning a valid and reliable investigation.", prompt: "How would you test whether music helps plants grow?",
    lesson: [
      { h: "Aim and hypothesis", say: "The aim says what you are investigating. The hypothesis is a prediction you can test. For example: seeds kept at 25 degrees Celsius will germinate faster than seeds kept at 10 degrees Celsius.", html: P("Aim: <b>to investigate…</b> · Hypothesis: <b>a testable prediction</b>") },
      { h: "Validity", say: "An investigation is valid if it tests what it claims to. Change only one variable, and keep everything else the same.", html: P("Valid: tests the <b>right thing</b>, fairly.") },
      { h: "Reliability", say: "Results are reliable if they can be repeated. Use large samples and repeat the investigation, then calculate averages.", html: P("Reliable: <b>repeat</b> and use <b>large samples</b>.") }
    ],
    example: { q: "Plan: does temperature affect how fast seeds germinate?", steps: ["Independent: temperature. Dependent: time to germinate.", "Fixed: the type of seed, the amount of water, light and soil.", "Use 20 seeds at each temperature and repeat, to improve reliability."] },
    questions: [
      { type: "mcq", q: "Which is a testable hypothesis?", options: ["Seeds at 25 °C will germinate faster than seeds at 10 °C.", "Seeds are interesting.", "Do seeds grow?", "Temperature exists."], answer: 0, hints: ["It must predict a result.", "That can be measured.", "The first."], explain: "It predicts a measurable result." },
      { type: "mcq", q: "Using 20 seeds instead of 2 mainly improves…", options: ["reliability", "the aim", "the hypothesis", "the colour"], answer: 0, hints: ["More seeds give more data.", "Odd results matter less.", "Reliability."], explain: "Large samples make results more reliable." },
      { type: "mcq", q: "Keeping light and water the same for all seeds improves…", options: ["validity", "speed", "the aim", "the hypothesis"], answer: 0, hints: ["Only one thing should change.", "So the test is fair.", "Validity."], explain: "Controlling variables makes the test valid." },
      { type: "mcq", q: "What is the dependent variable when testing temperature on germination?", options: ["Time to germinate", "Temperature", "Type of seed", "Amount of water"], answer: 0, hints: ["What do you measure?", "How long it takes.", "Time to germinate."], explain: "You measure the time to germinate." },
      { type: "mcq", q: "Why repeat the investigation?", options: ["To check the results are consistent", "To use more seeds", "To change the aim", "Because it is fun"], answer: 0, hints: ["Will you get the same result?", "Consistency.", "Reliability."], explain: "Repeating checks that results are consistent." }
    ],
    reflect: R("Writing the hypothesis", "Validity versus reliability", "Choosing what to keep the same"),
    parent: "Your child planned a fair, repeatable science investigation.",
    teacher: "Shows formulating aims and hypotheses, identifying variables, and distinguishing validity from reliability.",
    done: "Valid: test the right thing fairly. Reliable: repeat with large samples." },

  // ===================== GRADE 11 =====================
  { ...MA, id: "ieb11-ma-functions-context", grade: 11, title: "Functions in context", topic: "Modelling with functions", category: "Problem Solving",
    caps: ieb("Mathematics", "Grade 11 functions, with emphasis on interpreting graphs and parameters in real contexts"),
    intention: "Today I am interpreting a parabola in a real situation.", prompt: "What shape does a ball make when you throw it?",
    lesson: [
      { h: "A parabola in context", say: "The height of a ball is h equals minus 5 t squared plus 20 t, where t is time in seconds. The negative sign means the parabola opens downwards: the ball goes up, then comes down.", html: P("h = −5t² + 20t") },
      { h: "Key points mean something", say: "The turning point is the maximum height. The t-intercepts show when the ball is at ground level. Always say what each point means in the context.", html: chainRow(["Turning point: highest point", "t-intercepts: on the ground"]) },
      { h: "Finding the turning point", say: "For a parabola a t squared plus b t, the turning point is at t equals minus b over 2a. Here that is minus 20 over minus 10, which is 2 seconds.", html: P("t = −b ÷ 2a = −20 ÷ (−10) = <b>2 s</b>") }
    ],
    example: { q: "Find the maximum height of h = −5t² + 20t.", steps: ["The turning point is at t = 2 s.", "h = −5(2)² + 20(2) = −20 + 40.", "The maximum height is 20 m."] },
    questions: [
      { type: "mcq", q: "Why does h = −5t² + 20t open downwards?", options: ["The coefficient of t² is negative", "The 20 is positive", "t is time", "It has no constant"], answer: 0, hints: ["Look at the t² term.", "It is −5.", "Negative opens down."], explain: "A negative t² coefficient makes the parabola open downwards." },
      { type: "num", q: "At what time is the ball at its highest, in seconds?", answer: "2", options: ["2", "4", "20", "10"], hints: ["t = −b ÷ 2a.", "−20 ÷ (−10).", "2."], explain: "t = −20 ÷ (−10) = 2 s." },
      { type: "num", q: "When does the ball land? Solve −5t² + 20t = 0 for t > 0, in seconds.", answer: "4", options: ["4", "2", "20", "5"], hints: ["Factorise: −5t(t − 4) = 0.", "t = 0 or t = 4.", "t > 0."], explain: "−5t(t − 4) = 0 gives t = 4 s." },
      { type: "mcq", q: "What does the turning point represent here?", options: ["The ball's maximum height and when it happens", "The start of the throw", "Where the ball lands", "The speed of the ball"], answer: 0, hints: ["The highest point.", "Of the ball's path.", "Maximum height."], explain: "It gives the maximum height and its time." },
      { type: "mcq", q: "Why is only t > 0 sensible here?", options: ["Time after the throw can't be negative", "Parabolas are always positive", "The ball is heavy", "It is a rule of algebra"], answer: 0, hints: ["Think about the context.", "Time starts at the throw.", "No negative time."], explain: "In this context, time starts at 0." }
    ],
    reflect: R("Linking points to the context", "Using t = −b ÷ 2a", "Factorising to find roots"),
    parent: "Your child used a parabola to work out the height and flight time of a ball.",
    teacher: "Shows interpreting a quadratic model, finding and interpreting turning points and roots, and applying contextual restrictions.",
    done: "Every key point on the graph means something in the real situation." },

  { ...MA, id: "ieb11-ma-probability", grade: 11, title: "Probability: dependent or independent?", topic: "Probability: reasoning", category: "Flexible Thinking",
    caps: ieb("Mathematics", "Grade 11 probability: Venn diagrams, independent and mutually exclusive events, with justification"),
    intention: "Today I am deciding whether events are independent, and proving it.", prompt: "Does today's weather change the chance of tomorrow's?",
    lesson: [
      { h: "Mutually exclusive", say: "Two events are mutually exclusive if they can't happen together. Then P of A or B equals P of A plus P of B.", html: P("Mutually exclusive: P(A and B) = 0") },
      { h: "Independent", say: "Two events are independent if one doesn't change the chance of the other. Then P of A and B equals P of A times P of B.", html: P("Independent: P(A and B) = P(A) × P(B)") },
      { h: "Proving it", say: "IEB questions often ask you to prove independence. Calculate P of A times P of B, and compare it with P of A and B. If they are equal, the events are independent.", html: P("Compare <b>P(A) × P(B)</b> with <b>P(A and B)</b>.") }
    ],
    example: { q: "P(A) = 0.5, P(B) = 0.4 and P(A and B) = 0.2. Are A and B independent?", steps: ["P(A) × P(B) = 0.5 × 0.4 = 0.2.", "P(A and B) = 0.2.", "They are equal, so A and B are independent."] },
    questions: [
      { type: "mcq", q: "P(A) = 0.3, P(B) = 0.5 and P(A and B) = 0.15. Are A and B independent?", options: ["Yes, because 0.3 × 0.5 = 0.15", "No", "Only if they are mutually exclusive", "You can't tell"], answer: 0, hints: ["Multiply P(A) and P(B).", "0.15.", "Compare."], explain: "0.3 × 0.5 = 0.15 = P(A and B), so they are independent." },
      { type: "mcq", q: "P(A) = 0.6, P(B) = 0.5 and P(A and B) = 0.2. Are A and B independent?", options: ["No, because 0.6 × 0.5 = 0.3, not 0.2", "Yes", "Yes, because 0.2 is small", "You can't tell"], answer: 0, hints: ["0.6 × 0.5 = 0.3.", "Is that 0.2?", "No."], explain: "0.3 ≠ 0.2, so they are not independent." },
      { type: "num", q: "A and B are mutually exclusive. P(A) = 0.25 and P(B) = 0.4. Find P(A or B).", answer: "0.65", options: ["0.65", "0.1", "0.15", "1"], hints: ["Mutually exclusive: add.", "0.25 + 0.4.", "0.65."], explain: "0.25 + 0.4 = 0.65." },
      { type: "mcq", q: "Can two events with non-zero probabilities be both independent and mutually exclusive?", options: ["No", "Yes, always", "Only with coins", "Only with dice"], answer: 0, hints: ["Mutually exclusive: P(A and B) = 0.", "Independent: P(A and B) = P(A) × P(B) > 0.", "They contradict."], explain: "If both probabilities are above 0, the product can't be 0." },
      { type: "mcq", q: "Rolling a 6 on a dice, then tossing heads on a coin. These events are…", options: ["independent", "mutually exclusive", "the same event", "impossible"], answer: 0, hints: ["Does the dice affect the coin?", "No.", "Independent."], explain: "One doesn't affect the other." }
    ],
    reflect: R("Comparing the two values", "Mutually exclusive versus independent", "Writing the conclusion"),
    parent: "Your child tested whether events are independent and proved it with calculations.",
    teacher: "Shows distinguishing independent and mutually exclusive events and justifying independence numerically.",
    done: "Independent if P(A) × P(B) = P(A and B). Show the comparison." },

  { ...EN, id: "ieb11-en-text-visual", grade: 11, title: "Comparing a text and an image", topic: "Comparative analysis", category: "Reflection",
    caps: ieb("English Home Language", "Grade 11 comparative analysis of a written text and a visual source"),
    intention: "Today I am comparing how a poem and an image present the same idea.", prompt: "Which tells a story better, a picture or words?",
    passage: POEM,
    lesson: [
      READ(POEM),
      { h: "The image", say: "Imagine a photograph: an old woman's hands, close up, holding a wooden spoon over a pot. The light falls on the lines and scars of her skin.", html: P("<b>Image (described):</b> close-up of an old woman's hands, holding a wooden spoon over a pot; light on the lines and scars.") },
      { h: "Comparing", say: "Both present hands as carrying history. The poem uses metaphor, hands as maps and margins, while the photograph uses close-up framing and light. Compare the idea, then the methods.", html: chainRow(["Shared idea", "Poem's methods", "Image's methods"]) }
    ],
    example: { q: "Compare how both texts present the grandmother's hands.", steps: ["Shared idea: her hands hold her life story and knowledge.", "The poem uses the map and margin metaphors.", "The image uses a close-up and light to draw attention to scars and lines."] },
    questions: [
      { type: "mcq", q: "What does the metaphor 'my grandmother's hands were maps' suggest?", options: ["Her hands record her life journey", "She was a geography teacher", "She drew maps", "Her hands were lost"], answer: 0, hints: ["Maps show journeys.", "Her hands show her life.", "A record of her life."], explain: "Her hands record where life has taken her." },
      { type: "mcq", q: "What does 'every recipe I know is written in the margins of her palms' suggest?", options: ["Her knowledge was passed on through doing, not writing", "She wrote recipes on her hands", "She had no recipes", "The speaker can't cook"], answer: 0, hints: ["She never wrote a letter.", "Yet the speaker knows her recipes.", "Learnt by watching."], explain: "Her knowledge was passed down through cooking together." },
      { type: "mcq", q: "Which camera technique matches the poem's focus on detail?", options: ["A close-up", "A wide landscape shot", "A blurred background only", "A picture of a city"], answer: 0, hints: ["The poem looks closely.", "At the hands.", "Close-up."], explain: "A close-up mirrors the poem's attention to detail." },
      { type: "mcq", q: "Which sentence compares rather than just describes?", options: ["While the poem uses metaphor, the photograph uses light to reveal the same history.", "The poem has two stanzas.", "The photo shows hands.", "Both are good."], answer: 0, hints: ["Comparison links both texts.", "Look for 'while'.", "The first."], explain: "It links the methods of both texts to one idea." },
      { type: "mcq", q: "What does 'I am still learning to read them' suggest?", options: ["The speaker is still discovering what the grandmother taught", "The speaker can't read", "The hands have words", "The grandmother is still teaching reading"], answer: 0, hints: ["Reading the palms is a metaphor.", "Understanding her legacy.", "Still discovering."], explain: "The speaker is still understanding her grandmother's legacy." }
    ],
    reflect: R("Finding the shared idea", "Comparing methods", "Using comparison words"),
    parent: "Your child compared how a poem and an image present the same idea.",
    teacher: "Shows identifying shared themes across a written and a visual text and comparing literary and visual techniques.",
    done: "Find the shared idea, then compare how each text presents it." },

  { ...EN, id: "ieb11-en-argument-eval", grade: 11, title: "Evaluating an argument", topic: "Critical reading: fallacies", category: "Flexible Thinking",
    caps: ieb("English Home Language", "Grade 11 critical reading: evaluating arguments and identifying fallacies"),
    intention: "Today I am testing whether an argument holds up.", prompt: "Have you ever won an argument without really being right?",
    lesson: [
      { h: "Claim, reason, evidence", say: "A sound argument makes a claim, gives reasons and supports them with evidence. Weak arguments skip the evidence or use tricks instead.", html: chainRow(["Claim", "Reason", "Evidence"]) },
      { h: "Common fallacies", say: "A fallacy is a flaw in reasoning. An ad hominem attacks the person instead of the argument. A false dilemma pretends there are only two options. A hasty generalisation draws a big conclusion from too few examples.", html: chainRow(["Ad hominem", "False dilemma", "Hasty generalisation"]) },
      { h: "Evaluating", say: "To evaluate, say whether the reasoning is sound, name any flaw, and explain how it weakens the argument.", html: P("Name the flaw, then explain <b>why it weakens</b> the argument.") }
    ],
    example: { q: "'You can't trust Thandi's idea about recycling; she drives a big car.' Evaluate.", steps: ["The claim attacks Thandi, not her idea.", "This is an ad hominem fallacy.", "Her car doesn't make her recycling argument wrong, so the reasoning is weak."] },
    questions: [
      { type: "mcq", q: "'Either we ban all phones, or learners will fail.' What fallacy is this?", options: ["False dilemma", "Ad hominem", "Hasty generalisation", "None"], answer: 0, hints: ["Only two options are offered.", "Are there others?", "False dilemma."], explain: "It ignores other options, such as rules for phone use." },
      { type: "mcq", q: "'My two cousins hated that school, so it's a terrible school.' What fallacy is this?", options: ["Hasty generalisation", "False dilemma", "Ad hominem", "None"], answer: 0, hints: ["How many examples?", "Two.", "Too few."], explain: "Two examples are too few for a big conclusion." },
      { type: "mcq", q: "'He's only 16, so his views on climate change are worthless.' What fallacy is this?", options: ["Ad hominem", "False dilemma", "Hasty generalisation", "None"], answer: 0, hints: ["It attacks the person.", "Not the argument.", "Ad hominem."], explain: "It dismisses the person, not the argument." },
      { type: "mcq", q: "What makes an argument strong?", options: ["Reasons supported by reliable evidence", "Loud repetition", "Attacking opponents", "Using long words"], answer: 0, hints: ["Claim, reason…", "…evidence.", "Reliable evidence."], explain: "Strong arguments support reasons with reliable evidence." },
      { type: "mcq", q: "Which is the best evaluation?", options: ["The argument is weak because it attacks the speaker rather than answering her point.", "The argument is bad.", "I disagree.", "The argument is long."], answer: 0, hints: ["Name the flaw.", "Explain its effect.", "The first."], explain: "It names the flaw and explains why it weakens the argument." }
    ],
    reflect: R("Claim, reason, evidence", "Naming the fallacy", "Explaining the weakness"),
    parent: "Your child tested arguments for flaws in reasoning.",
    teacher: "Shows analysing argument structure, identifying common fallacies and evaluating their effect on persuasiveness.",
    done: "Check the claim, reasons and evidence, and name any flaw." },

  { ...LS, id: "ieb11-ls-data-tables", grade: 11, title: "Data in tables", topic: "Data-based questions: tables",
    caps: ieb("Life Sciences", "Grade 11 scientific skills: interpreting tables, calculating percentages and drawing conclusions"),
    intention: "Today I am interpreting a data table and drawing a conclusion.", prompt: "How would you show that a vaccine works?",
    lesson: [
      { h: "Reading a table", say: "A table shows data in rows and columns. Read the headings and units first. In this study, 1 000 people were vaccinated and 1 000 were not.", html: P("Vaccinated: 1 000 people, 20 got sick.") + P("Not vaccinated: 1 000 people, 150 got sick.") },
      { h: "Calculating percentages", say: "To compare groups, convert to percentages. 20 out of 1 000 is 2 percent. 150 out of 1 000 is 15 percent.", html: chainRow(["20 ÷ 1 000 = 2%", "150 ÷ 1 000 = 15%"]) },
      { h: "Drawing a conclusion", say: "A conclusion answers the aim using the data. The vaccinated group had a much lower rate of illness, so the vaccine reduced illness in this study.", html: P("Conclusion = answer to the aim + <b>data</b>.") }
    ],
    example: { q: "By how many percentage points did vaccination reduce illness?", steps: ["Unvaccinated: 15%.", "Vaccinated: 2%.", "15 − 2 = 13 percentage points."] },
    questions: [
      { type: "num", q: "20 out of 1 000 vaccinated people got sick. What percentage is that? (Type the number only.)", answer: "2", options: ["2", "20", "0.2", "50"], hints: ["20 ÷ 1 000.", "= 0.02.", "2%."], explain: "20 ÷ 1 000 = 0.02 = 2%." },
      { type: "num", q: "150 out of 1 000 unvaccinated people got sick. What percentage is that? (Type the number only.)", answer: "15", options: ["15", "150", "1.5", "85"], hints: ["150 ÷ 1 000.", "= 0.15.", "15%."], explain: "150 ÷ 1 000 = 15%." },
      { type: "mcq", q: "Which conclusion is supported by the data?", options: ["In this study, vaccinated people were less likely to get sick.", "Vaccines cure all diseases.", "Nobody vaccinated got sick.", "The study proves nothing."], answer: 0, hints: ["Stay within the data.", "2% against 15%.", "Less likely."], explain: "It is supported and doesn't overstate the result." },
      { type: "mcq", q: "Why were the two groups the same size?", options: ["To make a fair comparison", "To save money", "Because 1 000 is lucky", "It doesn't matter"], answer: 0, hints: ["Comparing groups.", "Equal sizes help.", "Fairness."], explain: "Equal group sizes make comparison fairer." },
      { type: "mcq", q: "Why is a large sample, like 1 000, useful?", options: ["It makes the results more reliable", "It makes the study shorter", "It changes the aim", "It removes the need for a control"], answer: 0, hints: ["Odd results matter less.", "More data.", "Reliability."], explain: "Large samples improve reliability." }
    ],
    reflect: R("Reading the headings", "Converting to percentages", "Linking the conclusion to the aim"),
    parent: "Your child interpreted a data table and drew a careful conclusion.",
    teacher: "Shows extracting data from tables, comparing groups using percentages and drawing evidence-based conclusions.",
    done: "Read the headings, convert to percentages, and conclude with data." },

  { ...LS, id: "ieb11-ls-claims", grade: 11, title: "Evaluating a health claim", topic: "Science in society",
    caps: ieb("Life Sciences", "Grade 11 nature of science: evaluating claims, sample size, controls and sources"),
    intention: "Today I am testing a health claim like a scientist.", prompt: "Have you seen a health 'miracle' online?",
    passage: CLAIM,
    lesson: [
      READ(CLAIM),
      { h: "Questions to ask", say: "How many people were studied? Was there a control group? How long did the study last? Who funded it? Was it published and checked by other scientists?", html: chainRow(["Sample size", "Control", "Duration", "Source"]) },
      { h: "What it does and doesn't show", say: "Lower blood pressure after two weeks is not the same as preventing heart disease. A small, short study can suggest an idea, but it can't prove it.", html: P("Suggests ≠ <b>proves</b>.") }
    ],
    example: { q: "Identify two weaknesses in the rooibos claim.", steps: ["The sample is small: only 40 people.", "The study lasted only 2 weeks, but heart disease develops over years.", "So it can't show that tea 'stops heart disease'."] },
    questions: [
      { type: "mcq", q: "Why is a sample of 40 people a weakness?", options: ["It is too small to be reliable", "40 is an odd number", "It is too large", "It isn't a weakness"], answer: 0, hints: ["Small samples…", "…can give misleading results.", "Too small."], explain: "Small samples are less reliable." },
      { type: "mcq", q: "Why is 2 weeks too short to support the claim?", options: ["Heart disease develops over years", "Tea takes a month to brew", "Blood pressure never changes", "It is long enough"], answer: 0, hints: ["The claim is about heart disease.", "How long does that take?", "Years."], explain: "A 2-week study can't show long-term prevention." },
      { type: "mcq", q: "What is missing that would make the study more valid?", options: ["A control group that drank no tea", "More capital letters", "A celebrity", "A shorter study"], answer: 0, hints: ["What do you compare with?", "People without tea.", "A control group."], explain: "A control group lets you compare fairly." },
      { type: "mcq", q: "What is the problem with the word 'PROVE'?", options: ["One small study can't prove a claim", "It is spelt wrongly", "Scientists never use words", "It is too short"], answer: 0, hints: ["Science builds evidence.", "Over many studies.", "One study isn't proof."], explain: "One small study can suggest, not prove." },
      { type: "mcq", q: "'Share before Big Pharma deletes this!' is an example of…", options: ["an emotional appeal that avoids evidence", "scientific evidence", "a control group", "a hypothesis"], answer: 0, hints: ["It creates urgency and suspicion.", "No evidence.", "Emotional appeal."], explain: "It uses fear and urgency instead of evidence." }
    ],
    reflect: R("Asking the five questions", "Suggests versus proves", "Spotting emotional appeals"),
    parent: "Your child evaluated a health claim like a scientist.",
    teacher: "Shows evaluating scientific claims in terms of sample size, controls, duration and source reliability.",
    done: "Ask: how many, compared with what, for how long, and who says so?" },

  // ===================== GRADE 12 =====================
  { ...MA, id: "ieb12-ma-optimisation", grade: 12, title: "Calculus in context: optimisation", topic: "Differential calculus", category: "Problem Solving",
    caps: ieb("Mathematics", "Grade 12 differential calculus: optimisation in unfamiliar contexts"),
    intention: "Today I am using calculus to find the best possible value.", prompt: "How would a farmer get the biggest field from a fixed amount of fencing?",
    lesson: [
      { h: "What optimisation means", say: "Optimisation means finding a maximum or minimum, such as the largest area or the lowest cost. At a maximum or minimum, the derivative is zero.", html: P("At a max or min: <b>f′(x) = 0</b>") },
      { h: "Set up the function", say: "A farmer has 40 metres of fencing for a rectangle against a wall. The wall is one side, so only three sides need fencing. Let the two short sides be x. Then the long side is 40 minus 2x. The area is x times 40 minus 2x.", html: P("A = x(40 − 2x) = 40x − 2x²") },
      { h: "Differentiate and solve", say: "The derivative is 40 minus 4x. Set it to zero: x equals 10. The long side is 20, so the largest area is 200 square metres.", html: P("A′ = 40 − 4x = 0 → x = 10 → A = <b>200 m²</b>") }
    ],
    example: { q: "Check that x = 10 gives a maximum.", steps: ["A″ = −4.", "A negative second derivative means the graph is concave down.", "So x = 10 gives a maximum."] },
    questions: [
      { type: "mcq", q: "At a maximum or minimum, what is the derivative?", options: ["0", "1", "Undefined", "Negative"], answer: 0, hints: ["The tangent is flat.", "Gradient 0.", "f′(x) = 0."], explain: "The gradient is zero at a turning point." },
      { type: "mcq", q: "If A = 40x − 2x², what is A′?", options: ["40 − 4x", "40 − 2x", "40x − 4x", "−4x"], answer: 0, hints: ["Differentiate each term.", "40x → 40; −2x² → −4x.", "40 − 4x."], explain: "A′ = 40 − 4x." },
      { type: "num", q: "Solve 40 − 4x = 0.", answer: "10", options: ["10", "4", "40", "20"], hints: ["4x = 40.", "x = 40 ÷ 4.", "10."], explain: "x = 10." },
      { type: "num", q: "With x = 10, the area is 10 × (40 − 20). What is it, in m²?", answer: "200", options: ["200", "400", "100", "300"], hints: ["40 − 20 = 20.", "10 × 20.", "200."], explain: "10 × 20 = 200 m²." },
      { type: "mcq", q: "Why must 0 < x < 20 here?", options: ["Both sides must have positive length", "Fences are always shorter than 20 m", "Calculus only works below 20", "It doesn't matter"], answer: 0, hints: ["x > 0 for a side.", "40 − 2x > 0.", "So x < 20."], explain: "Both x and 40 − 2x must be positive." }
    ],
    reflect: R("Setting up the area formula", "Differentiating", "Checking it is a maximum"),
    parent: "Your child used calculus to find the biggest possible area for a fixed amount of fencing.",
    teacher: "Shows formulating a function from context, using f′(x) = 0 to optimise, verifying the nature of the turning point and applying domain restrictions.",
    done: "Write the function, set the derivative to zero, solve, and check." },

  { ...MA, id: "ieb12-ma-proof", grade: 12, title: "Proof and counterexample", topic: "Mathematical reasoning", category: "Flexible Thinking",
    caps: ieb("Mathematics", "Grade 12 reasoning: proving general statements and disproving with counterexamples"),
    intention: "Today I am proving statements, or disproving them with one example.", prompt: "How many examples does it take to prove something is always true?",
    lesson: [
      { h: "Proving in general", say: "To prove a statement is always true, use algebra that covers every case. Checking a few examples is not a proof.", html: P("Examples suggest. <b>Algebra proves.</b>") },
      { h: "A proof", say: "Prove that the sum of two consecutive integers is odd. Let them be n and n plus 1. Their sum is 2n plus 1. 2n is even, so 2n plus 1 is odd, for every integer n.", html: P("n + (n + 1) = 2n + 1 → always <b>odd</b>") },
      { h: "Counterexamples", say: "To disprove a statement, one counterexample is enough. 'All prime numbers are odd' is false, because 2 is prime and even.", html: P("One counterexample <b>disproves</b> a general claim.") }
    ],
    example: { q: "Prove that the product of two even numbers is a multiple of 4.", steps: ["Let the numbers be 2a and 2b.", "Product: 2a × 2b = 4ab.", "4ab is a multiple of 4 for all integers a and b."] },
    questions: [
      { type: "mcq", q: "What disproves 'All prime numbers are odd'?", options: ["2", "3", "9", "11"], answer: 0, hints: ["Find a prime that is even.", "There is only one.", "2."], explain: "2 is prime and even." },
      { type: "mcq", q: "How do we write a general even number in algebra?", options: ["2n", "n + 2", "n²", "2n + 1"], answer: 0, hints: ["Even numbers are multiples of 2.", "2 times something.", "2n."], explain: "2n is even for every integer n." },
      { type: "mcq", q: "Why doesn't checking 10 examples prove a statement?", options: ["The next case might not work", "10 is too small", "Examples are always wrong", "It does prove it"], answer: 0, hints: ["There are infinitely many cases.", "You can't check them all.", "One might fail."], explain: "Examples can't cover every case." },
      { type: "mcq", q: "'n² + n + 41 is always prime.' Which value of n is a counterexample?", options: ["n = 40", "n = 1", "n = 2", "n = 3"], answer: 0, hints: ["Try n = 40.", "40² + 40 + 41 = 1 681.", "1 681 = 41²."], explain: "When n = 40, the value is 1 681 = 41², which isn't prime." },
      { type: "mcq", q: "n + (n + 1) = 2n + 1. Why does this prove the sum is odd?", options: ["2n is even, and adding 1 makes it odd for every n", "Because n is odd", "Because 1 is odd", "It doesn't"], answer: 0, hints: ["2n is always even.", "Even + 1…", "…is odd."], explain: "An even number plus 1 is always odd." }
    ],
    reflect: R("Writing numbers in algebra", "Hunting for a counterexample", "Explaining why a proof is general"),
    parent: "Your child proved general statements with algebra and disproved others with counterexamples.",
    teacher: "Shows constructing algebraic proofs, recognising the limits of empirical checking and using counterexamples.",
    done: "Prove with algebra for every case; disprove with one counterexample." },

  { ...EN, id: "ieb12-en-unseen-poem", grade: 12, title: "Responding to an unseen poem", topic: "Unseen poetry", category: "Reflection",
    caps: ieb("English Home Language", "Grade 12 unseen poetry: planning and writing a focused critical response"),
    intention: "Today I am planning a critical response to a poem I haven't seen before.", prompt: "What do you do first when you read a new poem?",
    passage: POEM,
    lesson: [
      READ(POEM),
      { h: "First reading, then focus", say: "Read once for the overall meaning, then again with the question in mind. Underline images, word choices and shifts in tone.", html: chainRow(["Overall meaning", "Re-read for the question", "Mark key words"]) },
      { h: "A focused thesis", say: "Answer the question in one sentence, and then prove it. For example: the poem shows the grandmother's body as a record of knowledge passed on without writing.", html: P("Thesis: <b>an answer you will prove</b>") },
      { h: "Structure and turn", say: "Look for where the poem turns. Here the second stanza moves from describing her hands to what the speaker inherited. Shifts like this are often the key to meaning.", html: P("Find the <b>turn</b>.") }
    ],
    example: { q: "Write a topic sentence about the first stanza.", steps: ["Focus: the hands as a record of hardship.", "Evidence: 'a scar where the paraffin stove once argued with her'.", "'The first stanza presents her hands as a record of a hard life, with the personified stove suggesting daily struggle.'"] },
    questions: [
      { type: "mcq", q: "What should you do on a second reading?", options: ["Re-read with the question in mind and mark key words", "Skip to the last line", "Count the syllables", "Start writing immediately"], answer: 0, hints: ["Focus.", "On the question.", "Mark key words."], explain: "A focused second reading targets what the question asks." },
      { type: "mcq", q: "What technique is 'the paraffin stove once argued with her'?", options: ["Personification", "Simile", "Alliteration", "Onomatopoeia"], answer: 0, hints: ["Can a stove argue?", "A human action.", "Personification."], explain: "The stove is given a human action." },
      { type: "mcq", q: "Where does the poem turn?", options: ["At the start of the second stanza", "In the title", "In the last word", "There is no turn"], answer: 0, hints: ["From describing her hands…", "…to what the speaker inherited.", "Second stanza."], explain: "The second stanza shifts to the speaker's inheritance." },
      { type: "mcq", q: "Which is the best thesis?", options: ["The poem presents the grandmother's hands as a record of knowledge passed on without writing.", "The poem is about hands.", "I like this poem.", "The poem has eight lines."], answer: 0, hints: ["A thesis is arguable.", "And answers the question.", "The first."], explain: "It is a focused interpretation that can be proved." },
      { type: "mcq", q: "What does 'She never wrote a letter in her life' add?", options: ["A contrast with the 'writing' in her palms", "A fact about the post office", "Humour only", "Nothing"], answer: 0, hints: ["Later her palms are 'written'.", "A contrast.", "Unwritten knowledge."], explain: "It contrasts formal writing with knowledge held in her hands." }
    ],
    reflect: R("Reading twice", "Finding the turn", "Writing a thesis first"),
    parent: "Your child planned a critical response to an unseen poem.",
    teacher: "Shows approaching unseen poetry systematically, formulating a focused thesis and analysing imagery and structural shifts.",
    done: "Read twice, find the turn, write a thesis, then prove it." },

  { ...EN, id: "ieb12-en-transactional", grade: 12, title: "Writing a report from sources", topic: "Transactional writing", category: "Planning and Organisation",
    caps: ieb("English Home Language", "Grade 12 transactional writing: synthesising sources into a formal report"),
    intention: "Today I am writing a formal report using information from sources.", prompt: "Who reads reports, and what do they need from them?",
    lesson: [
      { h: "Purpose and reader", say: "A report informs a decision-maker. It is formal, clear and organised under headings, with a recommendation at the end.", html: chainRow(["Introduction", "Findings", "Recommendation"]) },
      { h: "Synthesising sources", say: "Combine information from several sources, in your own words. Group related points together instead of summarising each source separately.", html: P("Group by <b>theme</b>, not by source.") },
      { h: "Formal register", say: "Use the third person, avoid slang and contractions, and keep opinions for the recommendation, supported by the findings.", html: P("Formal: <b>third person</b>, no slang, no contractions.") }
    ],
    example: { q: "Turn a source note into a formal finding: 'loads of kids walk like 5km in the dark'.", steps: ["Remove slang and vague words.", "Use precise, third-person language.", "'A significant number of learners walk more than five kilometres to school before sunrise.'"] },
    questions: [
      { type: "mcq", q: "Who is a report usually written for?", options: ["Someone who must make a decision", "A friend", "A diary", "A poem's reader"], answer: 0, hints: ["Reports lead to action.", "Who acts?", "A decision-maker."], explain: "Reports inform decision-makers." },
      { type: "mcq", q: "How should information from several sources be organised?", options: ["Grouped by theme", "One paragraph per source", "In random order", "Copied exactly"], answer: 0, hints: ["Synthesise.", "Combine related points.", "By theme."], explain: "Grouping by theme shows synthesis." },
      { type: "mcq", q: "Which sentence suits a formal report?", options: ["Learner attendance decreased by 12% during winter.", "Loads of kids didn't pitch in winter.", "I think winter is bad.", "Winter's the worst, hey."], answer: 0, hints: ["Formal register.", "Precise data.", "The first."], explain: "It is formal, precise and in the third person." },
      { type: "mcq", q: "Where does the writer's recommendation belong?", options: ["At the end, supported by the findings", "In the title", "In every sentence", "Nowhere"], answer: 0, hints: ["Findings first.", "Then what should happen.", "At the end."], explain: "The recommendation follows from the findings." },
      { type: "mcq", q: "Which is a contraction to avoid in formal writing?", options: ["don't", "do not", "learners", "therefore"], answer: 0, hints: ["Contractions join words.", "With an apostrophe.", "don't."], explain: "Write 'do not' instead of 'don't'." }
    ],
    reflect: R("Grouping by theme", "Using formal register", "Ending with a recommendation"),
    parent: "Your child practised writing a formal report from several sources.",
    teacher: "Shows synthesising information across sources, organising a formal report and maintaining an appropriate register.",
    done: "Inform the decision-maker: group by theme, stay formal, end with a recommendation." },

  { ...LS, id: "ieb12-ls-evolution-data", grade: 12, title: "Evidence for evolution: resistance", topic: "Evolution: interpreting evidence",
    caps: ieb("Life Sciences", "Grade 12 evolution by natural selection: interpreting data on antibiotic resistance"),
    intention: "Today I am using data to explain natural selection.", prompt: "Why must you finish a course of antibiotics?",
    lesson: [
      { h: "Natural selection", say: "Individuals in a population vary. Some variations help survival. Those individuals survive, reproduce and pass on the helpful alleles, so the population changes over generations.", html: chainRow(["Variation", "Selection", "Survival and reproduction", "Change over generations"]) },
      { h: "The data", say: "In a made-up hospital study, 5 percent of a bacterial population was resistant to an antibiotic in year 1. After years of heavy antibiotic use, 60 percent was resistant by year 6.", html: P("Resistant bacteria: year 1 = <b>5%</b> → year 6 = <b>60%</b>") },
      { h: "Explaining with the data", say: "The antibiotic killed non-resistant bacteria. Resistant ones survived and reproduced, so the proportion of resistant bacteria increased.", html: P("The antibiotic is the <b>selecting agent</b>.") }
    ],
    example: { q: "Use the data to explain the increase in resistance.", steps: ["Resistance rose from 5% to 60% over 6 years.", "The antibiotic killed non-resistant bacteria, while resistant ones survived.", "Survivors reproduced and passed on resistance, so it became more common."] },
    questions: [
      { type: "num", q: "Resistance rose from 5% to 60%. By how many percentage points did it rise?", answer: "55", options: ["55", "65", "12", "60"], hints: ["Subtract.", "60 − 5.", "55."], explain: "60 − 5 = 55 percentage points." },
      { type: "mcq", q: "What is the selecting agent in this example?", options: ["The antibiotic", "The hospital", "The bacteria", "The patients"], answer: 0, hints: ["What kills some bacteria?", "Not all of them.", "The antibiotic."], explain: "The antibiotic selects against non-resistant bacteria." },
      { type: "mcq", q: "Where did the resistance come from?", options: ["Variation already present in the population", "The antibiotic created it on purpose", "The bacteria chose to resist", "The hospital added it"], answer: 0, hints: ["Natural selection acts on variation.", "It was already there.", "A few resistant bacteria."], explain: "Some bacteria were already resistant; the antibiotic didn't create it." },
      { type: "mcq", q: "Why does not finishing a course of antibiotics help resistance spread?", options: ["The more resistant bacteria may survive and multiply", "The antibiotic becomes stronger", "Bacteria forget the antibiotic", "It doesn't matter"], answer: 0, hints: ["Which bacteria are left?", "The toughest.", "They multiply."], explain: "Stopping early can leave the most resistant bacteria to multiply." },
      { type: "mcq", q: "Which statement uses the data correctly?", options: ["Resistance increased from 5% to 60% over six years of heavy antibiotic use.", "All bacteria are now resistant.", "Antibiotics never work.", "Resistance decreased."], answer: 0, hints: ["Quote the data accurately.", "Don't overstate.", "The first."], explain: "It reports the data accurately without exaggerating." }
    ],
    reflect: R("The four steps of natural selection", "Quoting the data", "Naming the selecting agent"),
    parent: "Your child used data to explain how bacteria become resistant to antibiotics.",
    teacher: "Shows explaining natural selection with reference to data, identifying the selecting agent and avoiding Lamarckian misconceptions.",
    done: "Variation, selection, survival and reproduction: support each step with data." },

  { ...LS, id: "ieb12-ls-genetics-ethics", grade: 12, title: "Genetics and ethics", topic: "Genetic technology in society",
    caps: ieb("Life Sciences", "Grade 12 genetics: evaluating the benefits and concerns of genetic technologies"),
    intention: "Today I am weighing up the benefits and concerns of genetic technology.", prompt: "Should everyone know their genetic risks?",
    lesson: [
      { h: "Genetic technologies", say: "Genetic technologies include genetically modified crops, genetic testing and DNA profiling. Each brings benefits and raises concerns.", html: chainRow(["GM crops", "Genetic testing", "DNA profiling"]) },
      { h: "Weighing both sides", say: "GM maize can resist pests, so farmers need less pesticide. But some people worry about the cost of seed for small farmers. They also worry about effects on biodiversity.", html: P("Benefit: fewer pests, less spraying · Concern: seed costs, biodiversity") },
      { h: "Ethical questions", say: "Ethics asks what is right. Who owns genetic information? Should insurers see it? A balanced answer presents both sides, then reaches a justified view.", html: P("Present both sides, then a <b>justified view</b>.") }
    ],
    example: { q: "Give one benefit and one concern of genetic testing for disease risk.", steps: ["Benefit: people can take early action, such as screening or lifestyle changes.", "Concern: the information could be misused, for example by insurers or employers.", "A balanced answer weighs both and suggests protections, such as privacy laws."] },
    questions: [
      { type: "mcq", q: "What is one benefit of pest-resistant GM maize?", options: ["Less pesticide may be needed", "It is always cheaper for every farmer", "It never needs water", "It removes all pests for ever"], answer: 0, hints: ["The plant resists pests.", "So…", "less spraying."], explain: "Pest resistance can reduce pesticide use." },
      { type: "mcq", q: "What is one concern about GM seed for small farmers?", options: ["The cost of buying patented seed each season", "The seeds are too small", "GM maize is blue", "There are no concerns"], answer: 0, hints: ["Think about money.", "Patented seed.", "Cost."], explain: "Patented seed can be expensive to buy every season." },
      { type: "mcq", q: "Which is an ethical question about genetic testing?", options: ["Should insurers be allowed to see the results?", "How long is a DNA molecule?", "What colour is DNA?", "How many genes do humans have?"], answer: 0, hints: ["Ethics asks what is right.", "Not a factual question.", "Insurers."], explain: "It asks what is right, not what is true." },
      { type: "mcq", q: "DNA profiling is used to…", options: ["identify individuals, for example in forensic cases", "change a person's genes", "make crops grow faster", "cure all diseases"], answer: 0, hints: ["Profiling identifies.", "Crime scenes.", "Identify individuals."], explain: "DNA profiling identifies people from their DNA." },
      { type: "mcq", q: "What makes an ethics answer strong?", options: ["Presenting both sides and reaching a justified view", "Only giving your opinion", "Listing facts with no view", "Agreeing with everyone"], answer: 0, hints: ["Balance.", "Then a conclusion.", "Justified."], explain: "Strong answers weigh both sides and justify a view." }
    ],
    reflect: R("Listing benefits and concerns", "Asking ethical questions", "Reaching a justified view"),
    parent: "Your child weighed up the benefits and concerns of genetic technologies.",
    teacher: "Shows describing genetic technologies, evaluating benefits and concerns, and constructing balanced, justified ethical arguments.",
    done: "Present the benefits and the concerns, then reach a justified view." },

  // ===================== ADVANCED PROGRAMME MATHEMATICS (STARTER SET) =====================
  { ...AP, id: "apm10-absolute", grade: 10, title: "Absolute value", topic: "Algebra: absolute value", category: "Problem Solving",
    caps: apm("Module 1, Algebra (absolute value: equations and inequalities)"),
    intention: "Today I am solving equations with absolute value.", prompt: "How far is −5 from 0?",
    lesson: [
      { h: "Distance from zero", say: "The absolute value of a number is its distance from zero, so it is never negative. The absolute value of minus 5 is 5.", html: P("|−5| = 5 and |5| = 5") },
      { h: "Equations", say: "If the absolute value of x minus 3 equals 4, then x minus 3 is 4 or minus 4. So x is 7 or minus 1.", html: P("|x − 3| = 4 → x − 3 = 4 or x − 3 = −4 → <b>x = 7 or x = −1</b>") },
      { h: "Inequalities", say: "If the absolute value of x is less than 2, then x is within 2 of zero. So x is between minus 2 and 2.", html: P("|x| < 2 → <b>−2 < x < 2</b>") }
    ],
    example: { q: "Solve |2x + 1| = 5.", steps: ["2x + 1 = 5 or 2x + 1 = −5.", "2x = 4 or 2x = −6.", "x = 2 or x = −3."] },
    questions: [
      { type: "num", q: "What is |−8|?", answer: "8", options: ["8", "−8", "0", "64"], hints: ["Distance from 0.", "Never negative.", "8."], explain: "|−8| = 8." },
      { type: "mcq", q: "Solve |x| = 6.", options: ["x = 6 or x = −6", "x = 6 only", "x = 36", "No solution"], answer: 0, hints: ["Two numbers are 6 from 0.", "Positive and negative.", "±6."], explain: "Both 6 and −6 are 6 units from 0." },
      { type: "mcq", q: "Solve |x − 3| = 4.", options: ["x = 7 or x = −1", "x = 7 only", "x = 1 or x = −7", "x = 4"], answer: 0, hints: ["x − 3 = 4 or x − 3 = −4.", "x = 7 or x = −1.", "Check both."], explain: "x = 7 or x = −1." },
      { type: "mcq", q: "Solve |x| < 2.", options: ["−2 < x < 2", "x < 2", "x > 2 or x < −2", "x = 2"], answer: 0, hints: ["Within 2 of zero.", "Between −2 and 2.", "−2 < x < 2."], explain: "x lies between −2 and 2." },
      { type: "mcq", q: "Solve |x + 1| = −3.", options: ["No solution", "x = 2", "x = −4", "x = 2 or x = −4"], answer: 0, hints: ["Can an absolute value be negative?", "No.", "No solution."], explain: "An absolute value can't equal a negative number." }
    ],
    reflect: R("Thinking of distance from zero", "Splitting into two cases", "Checking for no solution"),
    parent: "Your child solved equations and inequalities with absolute value.",
    teacher: "Shows interpreting absolute value as distance, solving absolute value equations by cases and solving simple inequalities.",
    done: "Absolute value is distance: split into two cases, and it is never negative." },

  { ...AP, id: "apm11-induction", grade: 11, title: "Proof by induction", topic: "Algebra: mathematical induction", category: "Pattern Thinking",
    caps: apm("Module 1, Algebra (proof by mathematical induction)"),
    intention: "Today I am proving statements for every natural number using induction.", prompt: "How do you know every domino in a row will fall?",
    lesson: [
      { h: "The domino idea", say: "Induction proves a statement for every natural number. Show the first case is true, then show that if any case is true, the next one is true too. Like dominoes, they all fall.", html: chainRow(["Base case", "Assume true for k", "Prove for k + 1", "Conclude"]) },
      { h: "An example", say: "Prove that 1 plus 2 plus up to n equals n times n plus 1 over 2. When n is 1, both sides are 1. Assume it is true for k.", html: P("1 + 2 + … + n = n(n + 1) ÷ 2") },
      { h: "The inductive step", say: "Add k plus 1 to both sides. The left side becomes k times k plus 1 over 2, plus k plus 1. This simplifies to k plus 1 times k plus 2, over 2. That is the formula for k plus 1. So it is true for all n.", html: P("k(k + 1)/2 + (k + 1) = <b>(k + 1)(k + 2)/2</b>") }
    ],
    example: { q: "Check the base case of 1 + 3 + 5 + … + (2n − 1) = n².", steps: ["When n = 1, the left side is 1.", "The right side is 1² = 1.", "Both sides are equal, so the base case holds."] },
    questions: [
      { type: "mcq", q: "What is the first step of proof by induction?", options: ["Show the base case is true", "Assume it is false", "Check 10 examples", "Differentiate"], answer: 0, hints: ["The first domino.", "Usually n = 1.", "Base case."], explain: "Start by proving the base case." },
      { type: "mcq", q: "In the inductive step, what do you assume?", options: ["The statement is true for n = k", "It is true for all n", "It is false for n = k", "Nothing"], answer: 0, hints: ["One domino falls.", "For some k.", "True for n = k."], explain: "You assume it holds for n = k." },
      { type: "mcq", q: "What must you then prove?", options: ["That it is true for n = k + 1", "That it is true for n = 1 again", "That k is even", "That it is false"], answer: 0, hints: ["The next domino.", "k + 1.", "True for k + 1."], explain: "Show that truth for k implies truth for k + 1." },
      { type: "num", q: "Using 1 + 2 + … + n = n(n + 1) ÷ 2, find 1 + 2 + … + 10.", answer: "55", options: ["55", "110", "50", "100"], hints: ["n = 10.", "10 × 11 ÷ 2.", "55."], explain: "10 × 11 ÷ 2 = 55." },
      { type: "mcq", q: "Why are both steps needed?", options: ["The base case starts the chain, and the step keeps it going", "Only one is needed", "To make the proof longer", "Examiners like two steps"], answer: 0, hints: ["Dominoes need a first push…", "…and each must knock the next.", "Both."], explain: "Without either step, the chain breaks." }
    ],
    reflect: R("The domino picture", "Writing the k + 1 statement", "Using the assumption"),
    parent: "Your child learnt to prove statements for every number using mathematical induction.",
    teacher: "Shows structuring a proof by induction: base case, inductive hypothesis, inductive step and conclusion.",
    done: "Prove the first case, assume k, prove k + 1, then conclude." },

  { ...AP, id: "apm11-complex", grade: 11, title: "Complex numbers", topic: "Algebra: complex numbers", category: "Flexible Thinking",
    caps: apm("Module 1, Algebra (complex numbers: arithmetic and solving quadratics)"),
    intention: "Today I am working with complex numbers.", prompt: "What number squared gives −1?",
    lesson: [
      { h: "The number i", say: "There is no real number whose square is minus 1. We define i so that i squared equals minus 1. Numbers like 3 plus 2i are complex numbers.", html: P("i² = −1 · complex number: <b>a + bi</b>") },
      { h: "Adding and multiplying", say: "Add the real parts and the imaginary parts separately. When multiplying, expand the brackets and replace i squared with minus 1.", html: P("(1 + 2i)(3 − i) = 3 − i + 6i − 2i² = <b>5 + 5i</b>") },
      { h: "Solving quadratics", say: "x squared plus 4 equals 0 has no real solutions, but it has complex ones: x equals 2i or minus 2i.", html: P("x² = −4 → <b>x = ±2i</b>") }
    ],
    example: { q: "Simplify (2 + 3i) + (4 − i).", steps: ["Real parts: 2 + 4 = 6.", "Imaginary parts: 3i − i = 2i.", "6 + 2i."] },
    questions: [
      { type: "mcq", q: "What is i²?", options: ["−1", "1", "i", "0"], answer: 0, hints: ["By definition.", "No real number does this.", "−1."], explain: "i² = −1 by definition." },
      { type: "mcq", q: "Simplify (3 + 2i) + (1 + 4i).", options: ["4 + 6i", "4 + 8i", "3 + 6i", "10i"], answer: 0, hints: ["3 + 1 = 4.", "2i + 4i = 6i.", "4 + 6i."], explain: "(3 + 1) + (2 + 4)i = 4 + 6i." },
      { type: "mcq", q: "Simplify (1 + 2i)(3 − i).", options: ["5 + 5i", "3 − 2i", "1 + 5i", "5 − 5i"], answer: 0, hints: ["3 − i + 6i − 2i².", "−2i² = +2.", "5 + 5i."], explain: "3 + 5i + 2 = 5 + 5i." },
      { type: "mcq", q: "Solve x² + 9 = 0.", options: ["x = ±3i", "x = ±3", "x = 9i", "No solution"], answer: 0, hints: ["x² = −9.", "√(−9) = 3i.", "±3i."], explain: "x = ±3i." },
      { type: "mcq", q: "What is i⁴?", options: ["1", "−1", "i", "−i"], answer: 0, hints: ["i⁴ = (i²)².", "(−1)².", "1."], explain: "i⁴ = (−1)² = 1." }
    ],
    reflect: R("Remembering i² = −1", "Collecting real and imaginary parts", "Solving with ±i"),
    parent: "Your child calculated with complex numbers and used them to solve equations.",
    teacher: "Shows performing arithmetic with complex numbers and solving quadratics with complex roots.",
    done: "i² = −1. Keep real and imaginary parts separate." },

  { ...AP, id: "apm11-limits", grade: 11, title: "Limits and continuity", topic: "Calculus: limits", category: "Pattern Thinking",
    caps: apm("Module 1, Calculus (limits and continuity)"),
    intention: "Today I am finding limits and testing whether a function is continuous.", prompt: "Can you get closer and closer to something without reaching it?",
    lesson: [
      { h: "What a limit is", say: "As x gets closer to a, f of x gets closer to some value. That value is the limit of f of x as x approaches a. The function doesn't need to be defined at a itself.", html: P("lim (x → a) f(x)") },
      { h: "Simplify first", say: "Substituting x equals 2 into x squared minus 4 over x minus 2 gives 0 over 0. Factorise first: x minus 2 times x plus 2, over x minus 2, simplifies to x plus 2. The limit is 4.", html: P("(x² − 4) ÷ (x − 2) = x + 2 → limit as x → 2 is <b>4</b>") },
      { h: "Continuity", say: "A function is continuous at a if it is defined at a, the limit exists there, and they are equal. You could draw the graph there without lifting your pen.", html: chainRow(["f(a) defined", "The limit exists", "They are equal"]) }
    ],
    example: { q: "Find the limit of (x² − 9) ÷ (x − 3) as x → 3.", steps: ["Substituting gives 0 ÷ 0, so simplify.", "(x − 3)(x + 3) ÷ (x − 3) = x + 3.", "As x → 3, the limit is 6."] },
    questions: [
      { type: "num", q: "Find the limit of (2x + 1) as x → 3.", answer: "7", options: ["7", "6", "3", "5"], hints: ["Substitute x = 3.", "2(3) + 1.", "7."], explain: "2(3) + 1 = 7." },
      { type: "num", q: "Find the limit of (x² − 4) ÷ (x − 2) as x → 2.", answer: "4", options: ["4", "0", "2", "Undefined"], hints: ["Factorise the top.", "Simplify to x + 2.", "2 + 2."], explain: "It simplifies to x + 2, so the limit is 4." },
      { type: "mcq", q: "Substituting gives 0 ÷ 0. What should you do?", options: ["Simplify, for example by factorising", "Say the limit is 0", "Say the limit doesn't exist", "Give up"], answer: 0, hints: ["0 ÷ 0 is indeterminate.", "Try to simplify.", "Factorise."], explain: "0 ÷ 0 means you should simplify first." },
      { type: "mcq", q: "Which is needed for f to be continuous at x = a?", options: ["f(a) is defined, the limit exists, and they are equal", "Only that f(a) is defined", "Only that the limit exists", "That f is a straight line"], answer: 0, hints: ["Three conditions.", "All must hold.", "The first."], explain: "All three conditions are needed." },
      { type: "mcq", q: "f(x) = 1 ÷ x. Is f continuous at x = 0?", options: ["No, f(0) is undefined", "Yes", "Only for positive x", "It is a straight line"], answer: 0, hints: ["Can you divide by 0?", "No.", "f(0) is undefined."], explain: "f(0) is undefined, so f isn't continuous there." }
    ],
    reflect: R("Substituting first", "Factorising when I get 0 ÷ 0", "The three continuity conditions"),
    parent: "Your child found limits and tested whether functions are continuous.",
    teacher: "Shows evaluating limits, resolving indeterminate forms algebraically and applying the definition of continuity.",
    done: "Substitute; if you get 0 ÷ 0, simplify first. Continuous means defined, limit exists, and equal." },

  { ...AP, id: "apm12-integration", grade: 12, title: "Integration and area", topic: "Calculus: integration", category: "Problem Solving",
    caps: apm("Module 1, Calculus (antiderivatives and definite integrals; area under a curve)"),
    intention: "Today I am integrating to find the area under a curve.", prompt: "How could you find the area of a shape with a curved edge?",
    lesson: [
      { h: "Reversing differentiation", say: "Integration reverses differentiation. The integral of x to the n is x to the n plus 1, over n plus 1, plus a constant c.", html: P("∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + c, for n ≠ −1") },
      { h: "Definite integrals", say: "A definite integral from a to b gives a number. First find the antiderivative. Then subtract its value at a from its value at b.", html: P("∫ from a to b of f(x) dx = F(b) − F(a)") },
      { h: "Area under a curve", say: "For a curve above the x-axis, the definite integral gives the area between the curve and the axis. The area under y equals x squared from 0 to 3 is 9.", html: P("∫ from 0 to 3 of x² dx = [x³ ÷ 3] from 0 to 3 = <b>9</b>") }
    ],
    example: { q: "Find ∫ from 1 to 2 of 2x dx.", steps: ["The antiderivative of 2x is x².", "F(2) − F(1) = 4 − 1.", "= 3."] },
    questions: [
      { type: "mcq", q: "What is ∫ x³ dx?", options: ["x⁴ ÷ 4 + c", "3x² + c", "x⁴ + c", "x³ ÷ 3 + c"], answer: 0, hints: ["Add 1 to the power.", "Divide by the new power.", "x⁴ ÷ 4."], explain: "∫ x³ dx = x⁴ ÷ 4 + c." },
      { type: "mcq", q: "Why add + c to an indefinite integral?", options: ["Constants vanish when you differentiate, so any constant is possible", "c means calculus", "It is always 0", "To make it longer"], answer: 0, hints: ["Differentiate x² + 5.", "You get 2x.", "The constant is lost."], explain: "Any constant differentiates to 0, so it must be included." },
      { type: "num", q: "Find ∫ from 0 to 2 of 3x² dx.", answer: "8", options: ["8", "12", "6", "4"], hints: ["The antiderivative is x³.", "2³ − 0³.", "8."], explain: "[x³] from 0 to 2 = 8." },
      { type: "num", q: "Find the area under y = 4 from x = 0 to x = 5.", answer: "20", options: ["20", "9", "4", "25"], hints: ["It is a rectangle.", "4 × 5.", "20."], explain: "∫ from 0 to 5 of 4 dx = 20." },
      { type: "mcq", q: "Integration is the reverse of…", options: ["differentiation", "multiplication", "factorisation", "substitution"], answer: 0, hints: ["Antiderivative.", "Undo the derivative.", "Differentiation."], explain: "Integration reverses differentiation." }
    ],
    reflect: R("Raising the power and dividing", "F(b) − F(a)", "Linking integrals to area"),
    parent: "Your child integrated functions and used integration to find areas.",
    teacher: "Shows finding antiderivatives of power functions, evaluating definite integrals and interpreting them as area.",
    done: "Raise the power, divide by it, then evaluate F(b) − F(a)." },

  { ...AP, id: "apm12-normal", grade: 12, title: "The normal distribution", topic: "Statistics module: normal distribution", category: "Inquiry and Exploration",
    caps: apm("Module 2, Statistics (the normal distribution and z-scores)"),
    intention: "Today I am using the normal distribution and z-scores.", prompt: "Why are most people close to average height?",
    lesson: [
      { h: "The bell curve", say: "Many measurements, like heights, follow a normal distribution: a symmetrical bell-shaped curve centred on the mean.", html: P("Symmetrical about the <b>mean</b>.") },
      { h: "The 68, 95, 99.7 rule", say: "About 68 percent of values lie within 1 standard deviation of the mean, about 95 percent within 2, and about 99.7 percent within 3.", html: chainRow(["±1σ: 68%", "±2σ: 95%", "±3σ: 99.7%"]) },
      { h: "z-scores", say: "A z-score tells you how many standard deviations a value is from the mean. The formula is: z equals x minus the mean, divided by the standard deviation.", html: P("z = (x − μ) ÷ σ") }
    ],
    example: { q: "Test marks have a mean of 60 and a standard deviation of 10. Find the z-score of a mark of 75.", steps: ["z = (75 − 60) ÷ 10.", "= 15 ÷ 10.", "= 1.5: the mark is 1.5 standard deviations above the mean."] },
    questions: [
      { type: "num", q: "Mean 60, standard deviation 10. Find the z-score of 80.", answer: "2", options: ["2", "20", "1", "0.5"], hints: ["(80 − 60) ÷ 10.", "20 ÷ 10.", "2."], explain: "z = 20 ÷ 10 = 2." },
      { type: "mcq", q: "About what percentage of values lie within 1 standard deviation of the mean?", options: ["68%", "95%", "99.7%", "50%"], answer: 0, hints: ["The rule: 68, 95, 99.7.", "1 standard deviation.", "68%."], explain: "About 68% lie within ±1σ." },
      { type: "mcq", q: "What does a z-score of −1 mean?", options: ["The value is 1 standard deviation below the mean", "The value is negative", "The value is the mean", "The value is impossible"], answer: 0, hints: ["Negative z: below the mean.", "By how many σ?", "1."], explain: "z = −1 is one standard deviation below the mean." },
      { type: "num", q: "Heights: mean 160 cm, σ = 8 cm. About 95% of heights lie between 144 cm and what height, in cm?", answer: "176", options: ["176", "168", "184", "160"], hints: ["95% is within ±2σ.", "160 + 2 × 8.", "176."], explain: "160 + 16 = 176 cm." },
      { type: "mcq", q: "What shape is a normal distribution?", options: ["A symmetrical bell curve", "A straight line", "A U-shape", "A rectangle"], answer: 0, hints: ["Most values are near the middle.", "Fewer at the edges.", "A bell."], explain: "It is a symmetrical bell-shaped curve." }
    ],
    reflect: R("The 68, 95, 99.7 rule", "Calculating z-scores", "Picturing the bell curve"),
    parent: "Your child used the normal distribution and z-scores to describe data.",
    teacher: "Shows applying the empirical rule, calculating and interpreting z-scores in context.",
    done: "Bell-shaped and symmetrical: 68, 95, 99.7, and z = (x − μ) ÷ σ." }
  );
}
