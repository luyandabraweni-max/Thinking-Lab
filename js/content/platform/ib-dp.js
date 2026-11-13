"use strict";

// ---------- IB Diploma Programme (Grades 11 and 12), for the new app only. Original content. ----------
// Subject lessons end with a Theory of Knowledge link; the core (TOK and the Extended Essay) has lessons of its own.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const IB = { curriculum: "IB" };
  const AA = { ...IB, subject: "Mathematics: Analysis and Approaches", domain: "Logical and Analytical Thinking" };
  const AI = { ...IB, subject: "Mathematics: Applications and Interpretation", domain: "Logical and Analytical Thinking" };
  const LL = { ...IB, subject: "Language A: Language and Literature", domain: "Communication and Expression" };
  const SC = s => ({ ...IB, subject: s, domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" });
  const CORE = s => ({ ...IB, subject: s, domain: "Creativity and Metacognition", category: "Reflection" });
  const TOK = q => ({ h: "TOK link", say: `Theory of Knowledge link: ${q}`, html: P(`<b>TOK link:</b> ${q}`) });
  const dp = (subject, focus) => `IB Diploma Programme ${subject}: ${focus}`;
  const ADVERT = `<div class="passage-text"><p><b>Source: a public-service poster</b> <span class="muted">(described; a 2to.iQ text)</span></p>
<p>A black-and-white photograph shows an empty school desk in a classroom. On the desk lies a single cellphone, screen cracked. Across the top, in small white letters: <i>"She was only replying to 'ok'."</i> At the bottom, in bold red: <b>"DON'T TEXT AND DRIVE."</b></p></div>`;

  PLATFORM_UNITS.push(
  // ===================== DP YEAR 1 (GRADE 11) =====================
  { ...AA, id: "dp11-aa-sequences", grade: 11, title: "Arithmetic and geometric sequences", topic: "Number and algebra", category: "Pattern Thinking",
    caps: dp("Mathematics: Analysis and Approaches (SL/HL)", "Topic 1, number and algebra (arithmetic and geometric sequences and series; sum to infinity)"),
    intention: "Today I am working with arithmetic and geometric sequences and series.", prompt: "Which grows faster: adding 10 each time, or doubling each time?",
    lesson: [
      { h: "Arithmetic sequences", say: "An arithmetic sequence adds the same common difference d each time. The nth term is u1 plus n minus 1 times d.", html: P("uₙ = u₁ + (n − 1)d · Sₙ = n/2 (2u₁ + (n − 1)d)") },
      { h: "Geometric sequences", say: "A geometric sequence multiplies by the same common ratio r each time. The nth term is u1 times r to the power n minus 1.", html: P("uₙ = u₁ rⁿ⁻¹ · Sₙ = u₁(1 − rⁿ) ÷ (1 − r)") },
      { h: "Sum to infinity", say: "Sometimes the absolute value of r is less than 1. Then the terms shrink, and the series has a finite sum. The sum is u1 over 1 minus r.", html: P("S∞ = u₁ ÷ (1 − r), when |r| < 1") },
      TOK("Is a sum of infinitely many terms that is finite discovered or invented?")
    ],
    example: { q: "Find the sum to infinity of 8 + 4 + 2 + 1 + …", steps: ["u₁ = 8 and r = 1/2.", "|r| < 1, so the sum exists.", "S∞ = 8 ÷ (1 − 1/2) = 16."] },
    questions: [
      { type: "num", q: "An arithmetic sequence has u₁ = 3 and d = 5. Find u₁₀.", answer: "48", options: ["48", "53", "50", "45"], hints: ["u₁₀ = 3 + 9 × 5.", "9 × 5 = 45.", "48."], explain: "3 + 45 = 48." },
      { type: "num", q: "Find the sum of the first 10 terms of 3, 8, 13, …", answer: "255", options: ["255", "240", "48", "510"], hints: ["S₁₀ = 10/2 (6 + 9 × 5).", "5 × 51.", "255."], explain: "5 × (6 + 45) = 255." },
      { type: "num", q: "A geometric sequence has u₁ = 2 and r = 3. Find u₄.", answer: "54", options: ["54", "18", "162", "11"], hints: ["u₄ = 2 × 3³.", "3³ = 27.", "54."], explain: "2 × 27 = 54." },
      { type: "num", q: "Find the sum to infinity of 9 + 3 + 1 + …", answer: "13.5", options: ["13.5", "13", "27", "12"], hints: ["r = 1/3.", "9 ÷ (2/3).", "13.5."], explain: "9 ÷ (1 − 1/3) = 13.5." },
      { type: "mcq", q: "When does a geometric series have a sum to infinity?", options: ["When |r| < 1", "When r > 1", "Always", "When r = 1"], answer: 0, hints: ["The terms must shrink.", "The ratio must be small.", "|r| < 1."], explain: "Only shrinking terms (|r| < 1) give a finite sum." }
    ],
    reflect: R("Spotting d or r", "Choosing the right formula", "The TOK link"),
    parent: "Your child worked with sequences that grow by adding and by multiplying, and with infinite sums.",
    teacher: "Shows applying formulae for arithmetic and geometric sequences and series and the condition for a sum to infinity.",
    done: "Arithmetic adds d; geometric multiplies by r; S∞ needs |r| < 1." },

  { ...AI, id: "dp11-ai-regression", grade: 11, title: "Correlation and regression", topic: "Statistics and probability", category: "Inquiry and Exploration",
    caps: dp("Mathematics: Applications and Interpretation (SL/HL)", "Topic 4, statistics (scatter diagrams; Pearson's correlation coefficient; regression lines; interpolation and extrapolation)"),
    intention: "Today I am modelling relationships between two variables.", prompt: "Do taller people always have bigger feet?",
    lesson: [
      { h: "Scatter diagrams and r", say: "A scatter diagram shows two variables together. Pearson's r measures linear correlation, from minus 1 to 1. Close to 1 is strong positive; close to 0 is weak.", html: chainRow(["r ≈ 1: strong positive", "r ≈ 0: little linear correlation", "r ≈ −1: strong negative"]) },
      { h: "The regression line", say: "The regression line of y on x, y equals a x plus b, is used to predict y from x. Your calculator finds a and b.", html: P("ŷ = ax + b") },
      { h: "Use with care", say: "Predicting inside the data range is interpolation and is usually reliable. Predicting outside it is extrapolation and may be unreliable. Correlation does not prove causation.", html: P("Correlation ≠ <b>causation</b>") },
      TOK("Two variables are strongly correlated. What more do we need to know to claim that one causes the other?")
    ],
    example: { q: "The regression line for revision hours (x) and test score (y) is y = 4x + 40, for 2 to 10 hours. Predict the score for 6 hours.", steps: ["6 is inside the data range, so this is interpolation.", "y = 4(6) + 40.", "y = 64."] },
    questions: [
      { type: "mcq", q: "Which value of r shows the strongest correlation?", options: ["−0.95", "0.3", "0.6", "0"], answer: 0, hints: ["Look at the size, not the sign.", "Closest to 1 or −1.", "−0.95."], explain: "|−0.95| is closest to 1." },
      { type: "num", q: "Using y = 4x + 40, predict y when x = 5.", answer: "60", options: ["60", "45", "20", "200"], hints: ["Substitute x = 5.", "4 × 5 + 40.", "60."], explain: "20 + 40 = 60." },
      { type: "mcq", q: "Data runs from x = 2 to x = 10. Predicting at x = 25 is…", options: ["extrapolation, which may be unreliable", "interpolation", "always accurate", "impossible to calculate"], answer: 0, hints: ["25 is outside the range.", "Outside = extrapolation.", "Unreliable."], explain: "Predicting outside the data range is extrapolation." },
      { type: "mcq", q: "Ice-cream sales and drownings are strongly correlated. Why doesn't ice cream cause drowning?", options: ["A third factor, hot weather, increases both", "The data is wrong", "Correlation always proves causation", "Ice cream is safe to swim with"], answer: 0, hints: ["What happens in summer?", "More swimming and more ice cream.", "A hidden variable."], explain: "Hot weather drives both; correlation isn't causation." },
      { type: "mcq", q: "What does a value of r close to 0 suggest?", options: ["Little or no linear relationship", "A perfect relationship", "A strong negative relationship", "The line is vertical"], answer: 0, hints: ["r measures linear correlation.", "Near 0…", "…weak."], explain: "r near 0 means little linear correlation." }
    ],
    reflect: R("Reading r", "Interpolation versus extrapolation", "Correlation versus causation"),
    parent: "Your child modelled relationships between two sets of data and learnt the limits of predictions.",
    teacher: "Shows interpreting Pearson's r, using a regression line to predict, and distinguishing interpolation, extrapolation and causation.",
    done: "Use r for strength, the line to predict inside the data, and never confuse correlation with causation." },

  { ...LL, id: "dp11-ll-paper1", grade: 11, title: "Guided analysis of a non-literary text", topic: "Paper 1 skills", category: "Reflection",
    caps: dp("Language A: Language and Literature (SL/HL)", "Paper 1 (guided textual analysis of an unseen non-literary text)"),
    intention: "Today I am analysing how a non-literary text creates meaning.", prompt: "Which poster or advert has stayed in your mind?",
    passage: ADVERT,
    lesson: [
      { h: "Read the source", say: "Read the source, or press Read aloud to hear it part by part.", html: ADVERT },
      { h: "Text type, audience, purpose", say: "Start with the text type, its audience and its purpose. This is a public-service poster aimed at young drivers, warning against texting while driving.", html: chainRow(["Text type", "Audience", "Purpose"]) },
      { h: "Analysing techniques", say: "Look at visual and verbal choices and their effects. The empty desk implies a young person has died. The small quote is quiet and devastating; the bold red command is urgent.", html: chainRow(["Empty desk: absence", "Cracked phone: cause", "Red command: urgency"]) },
      TOK("How do images make knowledge claims differently from words?")
    ],
    example: { q: "Analyse the effect of 'She was only replying to ‘ok’.'", steps: ["'Only' and the tiny reply 'ok' stress how trivial the message was.", "Set against the empty desk, the contrast is shocking.", "The reader realises a life was lost for nothing, which makes the warning powerful."] },
    questions: [
      { type: "mcq", q: "Who is the most likely target audience?", options: ["Young people who drive or will soon drive", "Young children", "Car manufacturers", "Teachers only"], answer: 0, hints: ["The setting is a school.", "A young person.", "Young drivers."], explain: "The school desk links to young drivers." },
      { type: "mcq", q: "What does the empty desk suggest?", options: ["A learner has died and is missing", "The class is on holiday", "The desk is broken", "Learners are late"], answer: 0, hints: ["Who should be sitting there?", "She isn't there.", "Loss."], explain: "The empty desk symbolises a lost life." },
      { type: "mcq", q: "Why is the main message in bold red?", options: ["Red suggests danger and urgency", "Red is the only colour", "To match the phone", "It is decoration"], answer: 0, hints: ["The rest is black and white.", "Red stands out.", "Danger."], explain: "Red signals danger and draws the eye." },
      { type: "mcq", q: "What is the effect of the black-and-white photograph?", options: ["A sombre, mournful mood", "A cheerful mood", "It makes the poster cheaper", "It shows it is old"], answer: 0, hints: ["Think of mourning.", "Colour drains away.", "Sombre."], explain: "Black and white creates a sad, serious mood." },
      { type: "mcq", q: "Which is the strongest analytical sentence?", options: ["The contrast between the trivial 'ok' and the empty desk shocks readers into seeing how small choices have fatal consequences.", "The poster is about phones.", "There is a desk and a phone.", "I think it is a good poster."], answer: 0, hints: ["Analysis names a technique.", "And explains its effect.", "The first."], explain: "It identifies a technique and explains its effect on the audience." }
    ],
    reflect: R("Audience and purpose first", "Linking techniques to effects", "The TOK link"),
    parent: "Your child analysed how a poster uses images and words to persuade.",
    teacher: "Paper 1: shows identifying text type, audience and purpose and analysing visual and verbal techniques and their effects.",
    done: "Text type, audience, purpose, then technique and effect." },

  { ...SC("Biology"), id: "dp11-bio-membranes", grade: 11, title: "Membrane transport", topic: "Cell biology",
    caps: dp("Biology (SL/HL)", "membranes and membrane transport (diffusion, facilitated diffusion, osmosis, active transport)"),
    intention: "Today I am comparing the ways substances cross cell membranes.", prompt: "How does a cell let in what it needs and keep out what it doesn't?",
    lesson: [
      { h: "The membrane", say: "The cell membrane is a phospholipid bilayer with proteins embedded in it. It is partially permeable: small non-polar molecules pass easily; ions and large molecules need help.", html: P("Phospholipid bilayer + proteins = <b>partially permeable</b>") },
      { h: "Passive transport", say: "Three processes move substances down a concentration gradient: simple diffusion, facilitated diffusion through channel proteins, and osmosis. None of them uses energy from ATP.", html: chainRow(["Simple diffusion", "Facilitated diffusion", "Osmosis"]) + P("Down the gradient · <b>no ATP</b>") },
      { h: "Active transport", say: "Active transport uses ATP and pump proteins to move substances against their concentration gradient. An example is the sodium–potassium pump in nerve cells.", html: P("Against the gradient · <b>uses ATP</b>") },
      TOK("The fluid mosaic model replaced earlier models. What makes scientists accept a new model?")
    ],
    example: { q: "Root hair cells absorb mineral ions from soil where the ions are less concentrated. Which process is needed?", steps: ["The ions move from low to high concentration.", "That is against the gradient.", "So active transport, using ATP, is needed."] },
    questions: [
      { type: "mcq", q: "Which process uses ATP?", options: ["Active transport", "Simple diffusion", "Osmosis", "Facilitated diffusion"], answer: 0, hints: ["Which goes against the gradient?", "It needs energy.", "Active transport."], explain: "Active transport uses ATP." },
      { type: "mcq", q: "Facilitated diffusion uses…", options: ["channel or carrier proteins, without ATP", "ATP and pumps", "no proteins at all", "vesicles only"], answer: 0, hints: ["Facilitated means helped.", "By proteins.", "Still passive."], explain: "Proteins help, but no ATP is used." },
      { type: "mcq", q: "Osmosis is the movement of…", options: ["water across a partially permeable membrane", "ions against a gradient", "glucose using ATP", "proteins out of the cell"], answer: 0, hints: ["One particular substance.", "Through the membrane.", "Water."], explain: "Osmosis is water moving across a partially permeable membrane." },
      { type: "mcq", q: "Why can oxygen diffuse straight through the bilayer?", options: ["It is small and non-polar", "It is large and charged", "It uses a pump", "It is a protein"], answer: 0, hints: ["The bilayer's core is non-polar.", "Small molecules slip through.", "Small and non-polar."], explain: "Small non-polar molecules pass through the lipid bilayer." },
      { type: "mcq", q: "Which describes the sodium–potassium pump?", options: ["Active transport against concentration gradients", "Simple diffusion", "Osmosis", "Passive movement down a gradient"], answer: 0, hints: ["A pump.", "Uses ATP.", "Active transport."], explain: "It actively pumps ions against their gradients." }
    ],
    reflect: R("Passive versus active", "Down or against the gradient", "The TOK link"),
    parent: "Your child compared the ways substances move into and out of cells.",
    teacher: "Shows describing membrane structure and distinguishing diffusion, facilitated diffusion, osmosis and active transport.",
    done: "Passive: down the gradient, no ATP. Active: against it, using ATP." },

  { ...CORE("Theory of Knowledge"), id: "dp11-tok-questions", grade: 11, title: "Knowledge questions", topic: "TOK: thinking about knowledge",
    caps: dp("Theory of Knowledge", "knowledge questions; the knower; areas of knowledge"),
    intention: "Today I am asking questions about knowledge itself.", prompt: "How do you know that what you learnt in history is true?",
    lesson: [
      { h: "Questions about knowledge", say: "TOK asks how we know what we claim to know. A knowledge question is about knowledge itself, and it is open to debate. It uses TOK concepts such as evidence, certainty, truth and interpretation.", html: chainRow(["About knowledge", "Contestable", "Uses TOK concepts"]) },
      { h: "Subject question or knowledge question?", say: "When did apartheid end is a history question. How can historians decide which sources to trust is a knowledge question.", html: P("<b>Subject:</b> When did apartheid end?") + P("<b>Knowledge:</b> How do historians decide which sources to trust?") },
      { h: "Areas of knowledge", say: "TOK compares how knowledge is made in different areas: mathematics, the natural sciences, the human sciences, history and the arts.", html: chainRow(["Mathematics", "Natural sciences", "Human sciences", "History", "The arts"]) }
    ],
    example: { q: "Turn 'Is climate change real?' into a knowledge question.", steps: ["Move from the topic to how we know.", "Use TOK concepts: evidence, certainty, consensus.", "'How much certainty is needed before scientific knowledge should guide action?'"] },
    questions: [
      { type: "mcq", q: "Which is a knowledge question?", options: ["To what extent can we trust eyewitness accounts?", "What year did Mandela become president?", "How many bones are in the body?", "What is the capital of Kenya?"], answer: 0, hints: ["It is about how we know.", "It is debatable.", "The first."], explain: "It asks about the reliability of a way of knowing." },
      { type: "mcq", q: "What makes a question 'contestable'?", options: ["Reasonable people could disagree about the answer", "It has one correct answer", "It is about maths", "It is very short"], answer: 0, hints: ["Open to debate.", "More than one view.", "Disagreement."], explain: "Contestable questions allow reasonable disagreement." },
      { type: "mcq", q: "Which is a TOK concept?", options: ["Evidence", "Photosynthesis", "Algebra", "Grammar"], answer: 0, hints: ["It applies to all knowledge.", "Not a subject topic.", "Evidence."], explain: "Evidence is a concept used across all areas of knowledge." },
      { type: "mcq", q: "Which is an area of knowledge in TOK?", options: ["The arts", "Sport", "Cooking", "Social media"], answer: 0, hints: ["Five areas.", "Maths, sciences, history…", "The arts."], explain: "The arts are one of the TOK areas of knowledge." },
      { type: "mcq", q: "Why compare areas of knowledge?", options: ["Different areas produce and test knowledge in different ways", "To decide which subject is best", "To memorise more facts", "It isn't useful"], answer: 0, hints: ["Maths uses proof.", "Science uses experiments.", "Different methods."], explain: "Comparing methods helps us understand the nature of knowledge." }
    ],
    reflect: R("Moving from topic to 'how do we know?'", "Using TOK concepts", "Comparing areas of knowledge"),
    parent: "Your child explored questions about how we know what we know.",
    teacher: "TOK: shows distinguishing subject-specific from knowledge questions and using TOK concepts across areas of knowledge.",
    done: "Ask how we know, not just what we know." },

  { ...CORE("Extended Essay"), id: "dp11-ee-question", grade: 11, title: "A strong research question", topic: "Extended Essay: getting started", category: "Planning and Organisation",
    caps: dp("Extended Essay", "choosing a topic and writing a focused, researchable research question (4 000 words)"),
    intention: "Today I am shaping a focused research question for the Extended Essay.", prompt: "What topic could you happily research for months?",
    lesson: [
      { h: "What the EE is", say: "The Extended Essay is an independent research paper of up to 4 000 words, in one subject, guided by a supervisor.", html: P("Up to <b>4 000 words</b> · one subject · a supervisor") },
      { h: "Narrow the topic", say: "Start broad, then narrow. Water becomes water in South Africa, then the effect of the 2018 Cape Town drought restrictions on household water use.", html: chainRow(["Water", "Water in South Africa", "Cape Town 2018 restrictions and household use"]) },
      { h: "A good research question", say: "A good research question is focused and arguable. You can research it with the time and sources you have. It is clearly linked to one subject.", html: chainRow(["Focused", "Researchable", "Arguable", "Subject-specific"]) }
    ],
    example: { q: "Improve: 'Is pollution bad?'", steps: ["It is too broad and has an obvious answer.", "Narrow it: a place, a pollutant, a measurable effect.", "'To what extent did the 2020 lockdown reduce nitrogen dioxide levels in Johannesburg?'"] },
    questions: [
      { type: "mcq", q: "Which is the best research question?", options: ["To what extent did load-shedding affect small businesses in Soweto in 2023?", "What is electricity?", "Is load-shedding bad?", "Electricity in Africa."], answer: 0, hints: ["Focused.", "Arguable.", "The first."], explain: "It is focused, researchable and arguable." },
      { type: "mcq", q: "Why is 'Is pollution bad?' a weak question?", options: ["It is too broad and has an obvious answer", "It is too specific", "It is too long", "It uses a question mark"], answer: 0, hints: ["Could anyone disagree?", "Is it focused?", "Broad and obvious."], explain: "It is too broad and not really arguable." },
      { type: "num", q: "What is the maximum length of the Extended Essay, in words?", answer: "4 000", options: ["4 000", "2 000", "10 000", "1 500"], hints: ["Four thousand.", "A long essay.", "4 000."], explain: "The EE is up to 4 000 words." },
      { type: "mcq", q: "What does 'researchable' mean?", options: ["You can find enough evidence in the time you have", "It has never been studied", "It needs a laboratory", "It is easy"], answer: 0, hints: ["Can you actually answer it?", "With available sources.", "Enough evidence."], explain: "A researchable question can be answered with accessible evidence." },
      { type: "mcq", q: "Who guides you during the Extended Essay?", options: ["A supervisor", "Nobody", "Your classmates", "The IB examiner directly"], answer: 0, hints: ["A teacher at your school.", "They meet with you.", "Supervisor."], explain: "A supervisor at school guides the EE." }
    ],
    reflect: R("Narrowing the topic", "Checking the four qualities", "Rewriting a weak question"),
    parent: "Your child learnt how to shape a focused research question for the Extended Essay.",
    teacher: "Extended Essay: shows narrowing a topic and evaluating research questions for focus, feasibility, arguability and subject fit.",
    done: "Narrow the topic until the question is focused, researchable and arguable." },

  // ===================== DP YEAR 2 (GRADE 12) =====================
  { ...AA, id: "dp12-aa-binomial", grade: 12, title: "The binomial theorem", topic: "Number and algebra", category: "Pattern Thinking",
    caps: dp("Mathematics: Analysis and Approaches (SL/HL)", "Topic 1, number and algebra (binomial theorem; Pascal's triangle; ⁿCᵣ)"),
    intention: "Today I am expanding powers of brackets with the binomial theorem.", prompt: "What patterns can you see in Pascal's triangle?",
    lesson: [
      { h: "Pascal's triangle", say: "Each number in Pascal's triangle is the sum of the two above it. The rows give the coefficients for expanding a plus b to a power.", html: P("1<br>1 1<br>1 2 1<br>1 3 3 1<br>1 4 6 4 1") },
      { h: "The theorem", say: "The binomial theorem expands a plus b to the n. It is the sum of n choose r, times a to the n minus r, times b to the r.", html: P("(a + b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳ bʳ") },
      { h: "Finding one term", say: "The general term is n choose r, a to the n minus r, b to the r. For example, find the x squared term in x plus 2 to the 5. Use r equals 3. That gives 10 times x squared times 8, which is 80 x squared.", html: P("ⁿCᵣ aⁿ⁻ʳ bʳ → ⁵C₃ x² 2³ = <b>80x²</b>") },
      TOK("Pascal's triangle was known in China, Persia and India centuries before Pascal. What does this suggest about who gets credit for knowledge?")
    ],
    example: { q: "Expand (x + 1)³.", steps: ["Row 3 of Pascal's triangle: 1, 3, 3, 1.", "x³ + 3x²(1) + 3x(1)² + 1³.", "x³ + 3x² + 3x + 1."] },
    questions: [
      { type: "num", q: "What is ⁵C₂?", answer: "10", options: ["10", "5", "20", "25"], hints: ["Row 5: 1, 5, 10, 10, 5, 1.", "Position r = 2.", "10."], explain: "⁵C₂ = 10." },
      { type: "mcq", q: "Which is row 4 of Pascal's triangle?", options: ["1 4 6 4 1", "1 3 3 1", "1 4 4 1", "1 5 10 10 5 1"], answer: 0, hints: ["Add pairs from 1 3 3 1.", "1, 4, 6, 4, 1.", "The first."], explain: "1 4 6 4 1." },
      { type: "num", q: "Find the coefficient of x² in (x + 2)⁴.", answer: "24", options: ["24", "6", "12", "16"], hints: ["r = 2: ⁴C₂ x² 2².", "6 × 4.", "24."], explain: "⁴C₂ × 2² = 6 × 4 = 24." },
      { type: "num", q: "How many terms are in the expansion of (a + b)⁷?", answer: "8", options: ["8", "7", "14", "6"], hints: ["Always one more than the power.", "7 + 1.", "8."], explain: "(a + b)ⁿ has n + 1 terms." },
      { type: "mcq", q: "What is the constant term in (x + 3)²?", options: ["9", "6", "3", "1"], answer: 0, hints: ["Expand: x² + 6x + 9.", "The term with no x.", "9."], explain: "x² + 6x + 9; the constant term is 9." }
    ],
    reflect: R("Using Pascal's triangle", "The general term", "The TOK link"),
    parent: "Your child used the binomial theorem to expand powers of brackets.",
    teacher: "Shows using Pascal's triangle and ⁿCᵣ, applying the binomial theorem and finding specific terms.",
    done: "Use ⁿCᵣ aⁿ⁻ʳ bʳ; the coefficients come from Pascal's triangle." },

  { ...AI, id: "dp12-ai-chi-squared", grade: 12, title: "The chi-squared test", topic: "Statistics: hypothesis testing", category: "Inquiry and Exploration",
    caps: dp("Mathematics: Applications and Interpretation (SL/HL)", "Topic 4, statistics (χ² test for independence; hypotheses; p-values; degrees of freedom)"),
    intention: "Today I am testing whether two variables are independent.", prompt: "Does gender affect which sport people prefer? How could you test it?",
    lesson: [
      { h: "Hypotheses", say: "The null hypothesis says the variables are independent. The alternative says they are not. We test at a significance level, often 5 percent.", html: P("H₀: independent · H₁: not independent · level 5%") },
      { h: "Observed and expected", say: "For each cell, the expected frequency is row total times column total, divided by the grand total. The chi-squared statistic measures how far observed values are from expected.", html: P("Expected = (row total × column total) ÷ grand total") },
      { h: "The decision", say: "If the p-value is less than the significance level, reject the null hypothesis. Degrees of freedom are rows minus 1, times columns minus 1.", html: P("p < 0.05 → reject H₀ · df = (r − 1)(c − 1)") },
      TOK("A 5% significance level means we will sometimes be wrong. How much uncertainty is acceptable in knowledge claims?")
    ],
    example: { q: "A 2 × 3 table gives p = 0.02 at the 5% level. What do you conclude?", steps: ["Compare: 0.02 < 0.05.", "Reject H₀.", "There is evidence that the variables are not independent."] },
    questions: [
      { type: "mcq", q: "What does H₀ state in a χ² test for independence?", options: ["The variables are independent", "The variables are dependent", "The data is wrong", "The mean is zero"], answer: 0, hints: ["The null hypothesis.", "No association.", "Independent."], explain: "H₀: the variables are independent." },
      { type: "num", q: "Row total 40, column total 50, grand total 200. Find the expected frequency.", answer: "10", options: ["10", "20", "90", "4"], hints: ["40 × 50 ÷ 200.", "2 000 ÷ 200.", "10."], explain: "2 000 ÷ 200 = 10." },
      { type: "num", q: "How many degrees of freedom for a 3 × 4 table?", answer: "6", options: ["6", "12", "7", "5"], hints: ["(3 − 1)(4 − 1).", "2 × 3.", "6."], explain: "(3 − 1)(4 − 1) = 6." },
      { type: "mcq", q: "At the 5% level, p = 0.12. What do you do?", options: ["Do not reject H₀", "Reject H₀", "Change the data", "Use a 15% level instead"], answer: 0, hints: ["Compare 0.12 with 0.05.", "It is bigger.", "Don't reject."], explain: "0.12 > 0.05, so there isn't enough evidence to reject H₀." },
      { type: "mcq", q: "Why should expected frequencies not be too small?", options: ["The χ² test becomes unreliable", "Small numbers are illegal", "It makes p bigger", "It doesn't matter"], answer: 0, hints: ["The test has conditions.", "Expected values should usually be at least 5.", "Unreliable."], explain: "Small expected frequencies make the test unreliable." }
    ],
    reflect: R("Writing H₀ and H₁", "Expected frequencies", "Comparing p with the level"),
    parent: "Your child learnt to test whether two things are linked, using a statistical test.",
    teacher: "Shows stating hypotheses, calculating expected frequencies and degrees of freedom, and drawing conclusions from p-values.",
    done: "State H₀, compare p with the level, and conclude in context." },

  { ...LL, id: "dp12-ll-global-issue", grade: 12, title: "Exploring a global issue", topic: "Individual oral", category: "Communication",
    caps: dp("Language A: Language and Literature (SL/HL)", "individual oral (exploring a global issue through a literary and a non-literary text)"),
    intention: "Today I am planning how two texts explore a global issue.", prompt: "Which global issue matters most to you?",
    lesson: [
      { h: "The individual oral", say: "In the individual oral, you explore one global issue. You look at how it is presented in one literary text and one non-literary text. You discuss their content and their form.", html: chainRow(["Global issue", "Literary text", "Non-literary text"]) },
      { h: "Choosing the issue", say: "A global issue is significant and transnational, which means it crosses borders. It is felt in everyday life. Examples are access to education, gender roles and the impact of technology.", html: chainRow(["Significant", "Transnational", "Everyday impact"]) },
      { h: "Focusing on extracts", say: "Choose a short extract from each text. Analyse how the authors' choices present the issue, and compare the two texts, rather than just retelling them.", html: P("Content <b>and</b> form · compare, don't retell") },
      TOK("Can a work of fiction give us knowledge about real global issues?")
    ],
    example: { q: "How might a poem and the texting-and-driving poster explore 'the impact of technology'?", steps: ["Issue: technology's effect on attention and safety.", "The poster uses an empty desk to show the cost of distraction.", "A poem might use imagery of screens and absence; comparing their methods shows two angles on one issue."] },
    questions: [
      { type: "mcq", q: "How many texts does the individual oral use?", options: ["Two: one literary, one non-literary", "One", "Four", "Only non-literary texts"], answer: 0, hints: ["One of each kind.", "Literary and non-literary.", "Two."], explain: "One literary and one non-literary text." },
      { type: "mcq", q: "Which is a suitable global issue?", options: ["Unequal access to education", "My favourite food", "The plot of a novel", "Last week's weather"], answer: 0, hints: ["Significant and transnational.", "Affects many people.", "Education."], explain: "Access to education is significant and transnational." },
      { type: "mcq", q: "What should the oral focus on?", options: ["How each text's content and form present the issue", "Retelling the stories", "The authors' biographies only", "Your opinion only"], answer: 0, hints: ["Analysis, not summary.", "Content and form.", "How the issue is presented."], explain: "Analyse how the texts present the issue." },
      { type: "mcq", q: "Why choose short extracts?", options: ["They allow close, detailed analysis", "They are faster to memorise", "Long texts are banned", "To avoid analysis"], answer: 0, hints: ["Time is limited.", "Look closely.", "Detailed analysis."], explain: "Short extracts allow close analysis within the time." },
      { type: "mcq", q: "Which sentence compares the texts?", options: ["While the poster shocks with a single image, the poem builds unease slowly through repetition.", "The poster is red.", "The poem has stanzas.", "Both texts are good."], answer: 0, hints: ["It links both texts.", "Through their methods.", "The first."], explain: "It compares how each text presents the issue." }
    ],
    reflect: R("Choosing a global issue", "Picking extracts", "Comparing content and form"),
    parent: "Your child planned how to explore a global issue through two different texts.",
    teacher: "Individual oral: shows selecting a global issue and planning comparative analysis of content and form across text types.",
    done: "One global issue, two texts: compare how each presents it." },

  { ...SC("Chemistry"), id: "dp12-chem-equilibrium", grade: 12, title: "Equilibrium and Le Chatelier's principle", topic: "Equilibrium",
    caps: dp("Chemistry (SL/HL)", "dynamic equilibrium; Le Chatelier's principle; effect of conditions on equilibrium position"),
    intention: "Today I am predicting how equilibria respond to change.", prompt: "Why does a fizzy drink go flat when you open it?",
    lesson: [
      { h: "Dynamic equilibrium", say: "In a closed system, a reversible reaction reaches dynamic equilibrium. The forward and reverse reactions keep going at equal rates. So the concentrations stay constant.", html: P("Rate forward = rate reverse · concentrations <b>constant</b>") },
      { h: "Le Chatelier's principle", say: "If conditions change, the equilibrium shifts to oppose the change. Adding a reactant shifts it to the right. Increasing pressure shifts it towards fewer gas molecules.", html: chainRow(["Add reactant: shift right", "More pressure: fewer gas moles", "Catalyst: no shift"]) },
      { h: "Temperature", say: "Raising the temperature favours the endothermic direction. A catalyst speeds up both directions equally, so it doesn't change the position of equilibrium.", html: P("Heat → favours <b>endothermic</b> direction") },
      TOK("Le Chatelier's principle predicts but doesn't explain. Is a useful rule the same as understanding?")
    ],
    example: { q: "N₂ + 3H₂ ⇌ 2NH₃ (exothermic). What happens to the yield of ammonia if pressure increases?", steps: ["Left side: 4 gas moles; right side: 2.", "Higher pressure favours fewer gas moles.", "The equilibrium shifts right, increasing the yield of ammonia."] },
    questions: [
      { type: "mcq", q: "At dynamic equilibrium…", options: ["forward and reverse rates are equal", "the reaction has stopped", "only products remain", "concentrations keep changing"], answer: 0, hints: ["Dynamic means still moving.", "Both directions continue.", "Equal rates."], explain: "Both reactions continue at equal rates." },
      { type: "mcq", q: "N₂ + 3H₂ ⇌ 2NH₃ is exothermic. Raising the temperature…", options: ["shifts equilibrium left and lowers the yield", "shifts it right", "has no effect", "stops the reaction"], answer: 0, hints: ["Heat favours the endothermic direction.", "The reverse is endothermic.", "Left."], explain: "Higher temperature favours the endothermic reverse reaction." },
      { type: "mcq", q: "What effect does a catalyst have on the position of equilibrium?", options: ["None; it reaches equilibrium faster", "Shifts it right", "Shifts it left", "Removes the equilibrium"], answer: 0, hints: ["It speeds both directions.", "Equally.", "No shift."], explain: "A catalyst speeds both directions equally." },
      { type: "mcq", q: "More H₂ is added to N₂ + 3H₂ ⇌ 2NH₃. What happens?", options: ["The equilibrium shifts right", "It shifts left", "Nothing", "The catalyst is used up"], answer: 0, hints: ["The system opposes the change.", "It uses up the extra H₂.", "Right."], explain: "The system shifts right to use up the added reactant." },
      { type: "mcq", q: "Why does a fizzy drink go flat when opened?", options: ["Lower pressure shifts CO₂ out of solution", "The drink gets heavier", "The sugar reacts", "Light destroys the bubbles"], answer: 0, hints: ["Opening releases pressure.", "Dissolved CO₂ comes out.", "Pressure."], explain: "Releasing pressure shifts the equilibrium so CO₂ leaves the solution." }
    ],
    reflect: R("Opposing the change", "Counting gas moles", "The TOK link"),
    parent: "Your child predicted how chemical equilibria respond to changes in conditions.",
    teacher: "Shows describing dynamic equilibrium and applying Le Chatelier's principle to concentration, pressure, temperature and catalysts.",
    done: "The equilibrium shifts to oppose any change; a catalyst doesn't shift it." },

  { ...SC("Physics"), id: "dp12-phys-momentum", grade: 12, title: "Momentum and impulse", topic: "Mechanics",
    caps: dp("Physics (SL/HL)", "momentum and impulse; conservation of linear momentum; collisions"),
    intention: "Today I am using conservation of momentum in collisions.", prompt: "Why do airbags reduce injuries?",
    lesson: [
      { h: "Momentum", say: "Momentum is mass times velocity, measured in kilogram metres per second. It is a vector, so direction matters.", html: P("p = mv") },
      { h: "Conservation", say: "In an isolated system, total momentum before a collision equals total momentum after.", html: P("Σp before = <b>Σp after</b>") },
      { h: "Impulse", say: "Impulse is force times time, and it equals the change in momentum. Airbags increase the time of impact, so the force on the passenger is smaller.", html: P("FΔt = Δp · longer Δt → smaller <b>F</b>") },
      TOK("Conservation laws are assumed to hold everywhere in the universe. On what basis can we make such a universal claim?")
    ],
    example: { q: "A 2 kg trolley at 3 m/s hits a stationary 1 kg trolley, and they stick together. Find their velocity.", steps: ["Momentum before: 2 × 3 + 1 × 0 = 6 kg m/s.", "After: (2 + 1)v = 6.", "v = 2 m/s."] },
    questions: [
      { type: "num", q: "Find the momentum of a 5 kg ball moving at 4 m/s, in kg m/s.", answer: "20", options: ["20", "9", "1.25", "80"], hints: ["p = mv.", "5 × 4.", "20."], explain: "5 × 4 = 20 kg m/s." },
      { type: "num", q: "A 3 kg cart at 4 m/s hits a stationary 1 kg cart, and they stick together. Find their speed, in m/s.", answer: "3", options: ["3", "4", "12", "1"], hints: ["Before: 12 kg m/s.", "After: 4v = 12.", "v = 3."], explain: "12 ÷ 4 = 3 m/s." },
      { type: "num", q: "A force of 10 N acts for 3 s. What is the impulse, in N s?", answer: "30", options: ["30", "13", "3.3", "7"], hints: ["Impulse = FΔt.", "10 × 3.", "30."], explain: "10 × 3 = 30 N s." },
      { type: "mcq", q: "Why do airbags reduce injury?", options: ["They increase the impact time, reducing the force", "They reduce the passenger's mass", "They stop the car faster", "They add momentum"], answer: 0, hints: ["FΔt = Δp.", "Δp is fixed.", "Longer time, smaller force."], explain: "A longer stopping time means a smaller force for the same change in momentum." },
      { type: "mcq", q: "Why is momentum a vector?", options: ["It depends on velocity, which has direction", "Mass has direction", "It is always positive", "It isn't a vector"], answer: 0, hints: ["p = mv.", "Velocity has direction.", "So does p."], explain: "Momentum has the direction of the velocity." }
    ],
    reflect: R("p = mv", "Before = after", "Linking impulse to safety"),
    parent: "Your child used momentum to analyse collisions and explain car safety features.",
    teacher: "Shows calculating momentum and impulse and applying conservation of momentum to collisions.",
    done: "Total momentum is conserved; impulse = FΔt = change in momentum." },

  { ...CORE("Theory of Knowledge"), id: "dp12-tok-essay", grade: 12, title: "Building a TOK essay argument", topic: "TOK: the essay",
    caps: dp("Theory of Knowledge", "the TOK essay (claims, counterclaims and real-life examples across two areas of knowledge)"),
    intention: "Today I am building claims and counterclaims for a TOK essay.", prompt: "Can you think of something experts were once certain about that turned out to be wrong?",
    lesson: [
      { h: "The prescribed title", say: "The TOK essay answers one of six prescribed titles, in up to 1 600 words, usually exploring two areas of knowledge.", html: P("Up to <b>1 600 words</b> · a prescribed title · two areas of knowledge") },
      { h: "Claims and counterclaims", say: "Each claim is supported by a specific real-life example and then tested with a counterclaim. This shows you see more than one side.", html: chainRow(["Claim", "Example", "Counterclaim", "Example", "Evaluation"]) },
      { h: "Good examples", say: "Use specific, real examples, not hypothetical ones. For instance, the shift from Newton's to Einstein's physics shows that even very successful scientific knowledge can be revised.", html: P("Specific and real: <b>Newton → Einstein</b>") }
    ],
    example: { q: "Title idea: 'Is certainty possible in the natural sciences?' Give a claim and a counterclaim.", steps: ["Claim: scientific knowledge is provisional; Newton's laws were revised by Einstein.", "Counterclaim: some findings, such as the Earth orbiting the Sun, are so well supported they are effectively certain.", "Evaluation: science aims at reliability rather than absolute certainty."] },
    questions: [
      { type: "num", q: "What is the maximum length of the TOK essay, in words?", answer: "1 600", options: ["1 600", "4 000", "1 000", "2 500"], hints: ["Shorter than the EE.", "Sixteen hundred.", "1 600."], explain: "The TOK essay is up to 1 600 words." },
      { type: "mcq", q: "What is a counterclaim?", options: ["A point that challenges your claim", "A repeat of your claim", "Your conclusion", "A quotation"], answer: 0, hints: ["Counter means against.", "The other side.", "Challenges."], explain: "A counterclaim tests your claim from another angle." },
      { type: "mcq", q: "Which is the best example?", options: ["The revision of Newton's physics by Einstein's relativity", "'Imagine a scientist who…'", "'Everyone knows science is true'", "A dictionary definition of science"], answer: 0, hints: ["Real and specific.", "Not hypothetical.", "The first."], explain: "It is a real, specific example from the history of science." },
      { type: "mcq", q: "What should follow a claim and counterclaim?", options: ["An evaluation that weighs them", "A new topic", "The bibliography", "Nothing"], answer: 0, hints: ["Don't just list.", "Weigh them up.", "Evaluate."], explain: "Evaluation shows your judgement." },
      { type: "mcq", q: "Why explore two areas of knowledge?", options: ["To compare how knowledge works in different areas", "To make the essay longer", "Because one is not allowed", "To avoid examples"], answer: 0, hints: ["TOK compares.", "Different methods.", "Comparison."], explain: "Comparing areas reveals differences in how knowledge is made." }
    ],
    reflect: R("Claim and counterclaim", "Finding real examples", "Evaluating"),
    parent: "Your child built claims and counterclaims for a Theory of Knowledge essay.",
    teacher: "TOK essay: shows constructing claims and counterclaims supported by specific real-life examples and evaluating them across areas of knowledge.",
    done: "Claim, example, counterclaim, example, then evaluate." }
  );
}
