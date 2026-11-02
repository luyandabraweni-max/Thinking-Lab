"use strict";

// ---------- Learn units: Grade 12 (CAPS FET). Original content. ----------
const NOVEL_G12 = `<div class="passage-text"><p><b>From: The Year of Small Rains</b> <span class="muted">(a 2to.iQ novel extract)</span></p>
<p>The letter from the university arrived on the same day the borehole dried up. Nosipho held it in one hand and the empty bucket in the other, and for a moment she could not decide which mattered more.</p>
<p>Her grandmother was sitting on the stoep, shelling peas into a chipped enamel bowl. She did not look up. "So," she said. "You are leaving us."</p>
<p>"I haven't even opened it, Makhulu."</p>
<p>"You don't need to. I can see it in your shoulders." The old woman split another pod with her thumbnail. "Your mother had the same shoulders. Like a bird before it flies."</p>
<p>Nosipho put the bucket down. Somewhere beyond the dry fields, a hadeda cried out, harsh and certain. She tore open the envelope.</p></div>`;
const UNITS_G12 = [
  // ===================== GRADE 12 MATHEMATICS =====================
  { id: "g12-sequences", grade: 12, subject: "Mathematics", title: "Arithmetic and geometric sequences", topic: "Number patterns, sequences and series", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 12 Mathematics, Term 1: Number patterns, sequences and series (arithmetic and geometric sequences; general term; sum of series; sigma notation)",
    intention: "Today I am finding the general term of arithmetic and geometric sequences.", prompt: "How do you tell if a sequence is arithmetic or geometric?",
    lesson: [
      { h: "Arithmetic sequences", say: "An arithmetic sequence adds the same number each time, called the common difference, d. The general term is T n equals a plus n minus one, times d.", html: chainRow(["3, 7, 11, 15 …", "d = 4", "Tₙ = a + (n − 1)d"]) + P("a is the first term.") },
      { h: "Geometric sequences", say: "A geometric sequence multiplies by the same number each time, called the common ratio, r. The general term is T n equals a times r to the power n minus one.", html: chainRow(["2, 6, 18, 54 …", "r = 3", "Tₙ = a·rⁿ⁻¹"]) },
      { h: "Sums", say: "The sum of the first n terms of an arithmetic series is n over two, times two a plus n minus one d. For a geometric series it is a times r to the n minus one, over r minus one.", html: chainRow(["Sₙ = n/2 [2a + (n − 1)d]", "Sₙ = a(rⁿ − 1)/(r − 1)"]) + P("These are on the <b>formula sheet</b>.") }
    ],
    example: { q: "Find the 20th term of 5, 8, 11, 14 …", steps: ["Arithmetic: a = 5, d = 3.", "T₂₀ = 5 + (20 − 1)(3).", "= 5 + 57 = 62."] },
    questions: [
      { type: "mcq", q: "Is 4, 12, 36, 108 … arithmetic or geometric?", options: ["Geometric", "Arithmetic", "Neither"], answer: 0, hints: ["Check differences: 8, 24, 72.", "Check ratios: 3, 3, 3.", "Constant ratio."], explain: "The ratio is constant (3), so it is geometric." },
      { type: "num", q: "Find T₁₀ for 2, 7, 12, 17 …", answer: "47", options: ["47", "52", "50", "45"], hints: ["a = 2, d = 5.", "T₁₀ = 2 + 9 × 5.", "2 + 45."], explain: "T₁₀ = 47." },
      { type: "num", q: "Find T₆ for 3, 6, 12, 24 …", answer: "96", options: ["96", "48", "192", "36"], hints: ["a = 3, r = 2.", "T₆ = 3 × 2⁵.", "3 × 32."], explain: "T₆ = 96." },
      { type: "num", q: "Find the sum of the first 10 terms of 1, 3, 5, 7 …", answer: "100", options: ["100", "19", "55", "110"], hints: ["a = 1, d = 2.", "S₁₀ = 10/2 [2 + 9 × 2].", "5 × 20."], explain: "S₁₀ = 100." },
      { type: "mcq", q: "What is the common difference of 20, 16, 12, 8 …?", options: ["−4", "4", "−8", "0,8"], answer: 0, hints: ["T₂ − T₁.", "16 − 20.", "−4."], explain: "d = −4." }
    ],
    reflect: { q: "What helped you most?", options: ["Checking differences and ratios", "The formula sheet", "Writing out a, d or r", "Not sure"] },
    parent: "Your child worked with arithmetic and geometric sequences and series.",
    teacher: "Shows identifying sequence type, finding general terms and calculating sums of series.",
    done: "Arithmetic adds a constant difference; geometric multiplies by a constant ratio." },

  { id: "g12-calculus", grade: 12, subject: "Mathematics", title: "Introduction to differentiation", topic: "Differential calculus", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 12 Mathematics, Term 2: Differential calculus (average gradient; derivative from first principles; rules of differentiation; equation of a tangent; cubic graphs; optimisation)",
    intention: "Today I am finding derivatives and understanding what they mean.", prompt: "What does a derivative tell you about a graph?",
    lesson: [
      { h: "What a derivative is", say: "The derivative tells you the gradient of a curve at any point, which is the instantaneous rate of change. For a straight line the gradient is constant. For a curve it changes.", html: chainRow(["Gradient of a curve", "=", "rate of change"]) + P("Written f′(x) or dy/dx.") },
      { h: "The power rule", say: "To differentiate x to the n, multiply by n and reduce the power by one. The derivative of x cubed is three x squared. The derivative of a constant is zero.", html: chainRow(["d/dx (xⁿ) = nxⁿ⁻¹", "d/dx (x³) = 3x²", "d/dx (5) = 0"]) },
      { h: "Using it", say: "At a turning point, the gradient is zero. So set the derivative equal to zero to find maximum and minimum points. This is used in optimisation.", html: chainRow(["f′(x) = 0", "→", "turning point"]) + P("Businesses use this to find <b>maximum profit</b> or <b>minimum cost</b>.") }
    ],
    example: { q: "Find f′(x) if f(x) = 4x³ − 2x² + 7.", steps: ["4x³ → 12x².", "−2x² → −4x.", "7 → 0. So f′(x) = 12x² − 4x."] },
    questions: [
      { type: "mcq", q: "Differentiate: f(x) = x⁵", options: ["5x⁴", "x⁴", "5x⁵", "4x⁵"], answer: 0, hints: ["Multiply by the power.", "Reduce the power by 1.", "5x⁴."], explain: "f′(x) = 5x⁴." },
      { type: "mcq", q: "Differentiate: f(x) = 3x² + 6x", options: ["6x + 6", "6x² + 6", "3x + 6", "6x"], answer: 0, hints: ["3x² → 6x.", "6x → 6.", "6x + 6."], explain: "f′(x) = 6x + 6." },
      { type: "mcq", q: "What is the derivative of a constant, like 9?", options: ["0", "9", "1", "9x"], answer: 0, hints: ["A constant does not change.", "Its rate of change is…", "Zero."], explain: "The derivative of a constant is 0." },
      { type: "num", q: "f(x) = x² − 4x. At what x-value is the turning point?", answer: "2", options: ["2", "4", "−2", "0"], hints: ["f′(x) = 2x − 4.", "Set it to zero.", "2x = 4."], explain: "x = 2." },
      { type: "mcq", q: "What does f′(x) represent?", options: ["The gradient of f at x", "The area under f", "The y-intercept", "The maximum value"], answer: 0, hints: ["Rate of change.", "Steepness.", "Gradient."], explain: "f′(x) is the gradient of the curve at x." }
    ],
    reflect: { q: "What helped you most?", options: ["The power rule", "Thinking of gradient", "Setting f′(x) = 0", "Not sure"] },
    parent: "Your child started differential calculus: finding derivatives and turning points.",
    teacher: "Shows interpreting the derivative as gradient, applying the power rule and finding turning points.",
    done: "The derivative gives the gradient. Set it to zero to find turning points." },

  { id: "g12-annuities", grade: 12, subject: "Mathematics", title: "Loans and savings plans", topic: "Finance: annuities", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 12 Mathematics, Term 1: Finance, growth and decay (future value and present value annuities; loans and bond repayments; sinking funds)",
    intention: "Today I am understanding how regular payments build savings and repay loans.", prompt: "Why does a longer loan cost more in total?",
    lesson: [
      { h: "Future value", say: "If you save the same amount regularly, interest makes it grow. The future value formula is F equals x times one plus i to the n, minus one, all over i.", html: chainRow(["F = x[(1 + i)ⁿ − 1] / i"]) + P("x = regular payment, i = interest rate per period, n = number of payments.") },
      { h: "Present value: loans", say: "A loan's present value is how much you borrow today. The formula is P equals x times one minus one plus i to the minus n, all over i. You solve it to find the monthly payment x.", html: chainRow(["P = x[1 − (1 + i)⁻ⁿ] / i"]) + P("Home loans, called <b>bonds</b>, work this way.") },
      { h: "The real cost", say: "The longer the loan, the more interest you pay in total, even if each payment is smaller. Compare the total paid, not only the monthly instalment.", html: chainRow(["Total paid = x × n"]) + P("Interest rate per month = annual rate ÷ 12.") }
    ],
    example: { q: "You repay R3 000 a month for 60 months. How much do you pay in total?", steps: ["Total = payment × number of payments.", "R3 000 × 60.", "R180 000."] },
    questions: [
      { type: "mcq", q: "Which formula is for saving regular amounts?", options: ["Future value", "Present value", "Simple interest", "Depreciation"], answer: 0, hints: ["Building up savings.", "The value in the future.", "Future value."], explain: "Regular savings use the future value annuity formula." },
      { type: "mcq", q: "An annual interest rate of 12% compounded monthly. What is i per month?", options: ["0,01", "0,12", "0,0012", "1,2"], answer: 0, hints: ["Divide by 12.", "12% ÷ 12 = 1%.", "As a decimal."], explain: "i = 0,12 ÷ 12 = 0,01." },
      { type: "num", q: "R2 500 per month for 72 months. Total paid?", answer: "R180 000", options: ["R180 000", "R30 000", "R2 572", "R18 000"], hints: ["Payment × months.", "2 500 × 72.", "R180 000."], explain: "R2 500 × 72 = R180 000." },
      { type: "mcq", q: "Why does a 30-year bond cost more in total than a 20-year bond for the same house?", options: ["Interest is charged for longer", "The house is bigger", "Banks charge less", "It doesn't"], answer: 0, hints: ["More months.", "More interest periods.", "Interest for longer."], explain: "Interest accumulates over more years." },
      { type: "mcq", q: "What is the present value of a loan?", options: ["The amount borrowed today", "The total repaid", "The interest only", "The final payment"], answer: 0, hints: ["Present means now.", "What you receive.", "The amount borrowed."], explain: "It is the amount borrowed now." }
    ],
    reflect: { q: "What helped you most?", options: ["Matching formula to situation", "Converting the rate", "Comparing totals", "Not sure"] },
    parent: "Your child learned how regular savings grow and how loan repayments work.",
    teacher: "Shows distinguishing future and present value annuities, converting rates and evaluating total loan cost.",
    done: "Future value builds savings; present value works out loan payments. Always compare the total cost." },

  // ===================== GRADE 12 ENGLISH HOME LANGUAGE =====================
  { id: "g12-novel", grade: 12, subject: "English Home Language", title: "Novel extract: The Year of Small Rains", topic: "Character, symbol and theme", domain: "Communication and Expression", category: "Reflection",
    caps: "CAPS Grade 12 English Home Language: Literature (novel: characterisation, symbolism, setting, theme; contextual questions and literary essay)",
    intention: "Today I am analysing character, symbolism and theme in a novel extract.", prompt: "What do you think Nosipho should choose?",
    passage: NOVEL_G12,
    lesson: [
      { h: "Read the extract", say: "Read the extract, or press Read aloud to hear it part by part.", html: NOVEL_G12 },
      { h: "Symbolism", say: "A symbol is an object that stands for an idea. The letter represents opportunity and the future. The empty bucket and dried borehole represent hardship and the needs of home.", html: chainRow(["Letter: the future", "Empty bucket: hardship at home", "Bird: freedom, leaving"]) + P("Holding both shows Nosipho's <b>conflict</b>.") },
      { h: "Characterisation and theme", say: "Makhulu does not look up, which suggests she is hiding her feelings. Her comparison to a bird before it flies shows she understands and accepts that Nosipho will leave. Themes include sacrifice, family, and the pull between home and ambition.", html: chainRow(["Sacrifice", "Family", "Home vs ambition"]) }
    ],
    example: { q: "What is the effect of the borehole drying up on the same day the letter arrives?", steps: ["The two events happen together.", "Opportunity arrives just as home needs her most.", "It sharpens Nosipho's dilemma and creates tension."] },
    questions: [
      { type: "mcq", q: "What does the empty bucket symbolise?", options: ["Hardship and the needs of home", "Wealth", "University", "A holiday"], answer: 0, hints: ["The borehole dried up.", "What does the family lack?", "Hardship."], explain: "It represents hardship and the needs of home." },
      { type: "mcq", q: "Why does Makhulu not look up?", options: ["She may be hiding her emotions", "She is blind", "She is angry at the peas", "She is asleep"], answer: 0, hints: ["She is facing a painful moment.", "Avoiding eye contact.", "Hiding feelings."], explain: "Not looking up suggests she is hiding her feelings." },
      { type: "mcq", q: "Like a bird before it flies is an example of …", options: ["Simile", "Metaphor", "Personification", "Onomatopoeia"], answer: 0, hints: ["Look for like or as.", "Like a bird.", "Simile."], explain: "It uses like, so it is a simile." },
      { type: "mcq", q: "Which theme is most clearly shown?", options: ["Tension between home and ambition", "Sport", "Science fiction", "Crime"], answer: 0, hints: ["The letter versus the bucket.", "Leaving versus staying.", "Home and ambition."], explain: "The extract explores home versus ambition." },
      { type: "mcq", q: "What does a hadeda cried out, harsh and certain suggest about Nosipho's decision?", options: ["It mirrors a firm, perhaps painful, decision", "It means she will stay", "It is random detail", "It means it is raining"], answer: 0, hints: ["Certain.", "Right before she opens the letter.", "A decision."], explain: "The harsh, certain cry mirrors her decision." }
    ],
    reflect: { q: "How did you analyse the extract?", options: ["Finding symbols", "Studying the characters", "Thinking about the theme", "Not sure"] },
    parent: "Your child analysed a novel extract for character, symbolism and theme.",
    teacher: "Shows interpreting symbolism, indirect characterisation, figurative language and theme.",
    done: "Symbols, characters and setting work together to build a theme." },

  { id: "g12-comprehension", grade: 12, subject: "English Home Language", title: "Exam comprehension skills", topic: "Answering comprehension questions", domain: "Communication and Expression", category: "Planning and Organisation",
    caps: "CAPS Grade 12 English Home Language: Reading and Viewing (comprehension: literal, inferential, evaluative and appreciative questions; quoting; own words)",
    intention: "Today I am learning how to answer different types of comprehension questions.", prompt: "Which type of question do you find hardest?",
    lesson: [
      { h: "Question levels", say: "Literal questions ask for facts found in the text. Inferential questions ask you to read between the lines. Evaluative questions ask for your judgement, with reasons.", html: chainRow(["Literal: find it", "Inferential: work it out", "Evaluative: judge it"]) },
      { h: "Read the instruction", say: "Look at the key word in the question. Quote means copy exact words in quotation marks. In your own words means do not copy. Explain means give a reason.", html: chainRow(["Quote", "Own words", "Explain", "Discuss"]) + P("Check the <b>mark allocation</b>: 2 marks usually needs 2 points.") },
      { h: "Answer well", say: "Answer in full sentences. Do not repeat the question. For evaluative questions, say whether you agree or not, then justify with evidence from the text.", html: chainRow(["Answer", "Evidence", "Reason"]) }
    ],
    example: { q: "Question: Explain what Makhulu means by I can see it in your shoulders. (2 marks)", steps: ["Explain needs a reason. 2 marks needs two points.", "Point 1: Makhulu reads Nosipho's body language.", "Point 2: Nosipho's posture shows she is ready and eager to leave."] },
    questions: [
      { type: "mcq", q: "What type of question is: Where was Makhulu sitting?", options: ["Literal", "Inferential", "Evaluative", "Appreciative"], answer: 0, hints: ["Is the answer directly in the text?", "On the stoep.", "Literal."], explain: "The answer is stated directly." },
      { type: "mcq", q: "Quote a phrase that shows the setting is dry. What should you do?", options: ["Copy exact words in quotation marks", "Write it in your own words", "Explain the setting", "Give your opinion"], answer: 0, hints: ["Quote means exact words.", "Use quotation marks.", "Copy exactly."], explain: "Quote exact words from the text in quotation marks." },
      { type: "mcq", q: "A question is worth 3 marks. How many points should you make?", options: ["About 3", "1", "10", "None"], answer: 0, hints: ["Marks guide length.", "One mark per point.", "About 3."], explain: "Usually about one point per mark." },
      { type: "mcq", q: "Do you think Makhulu is a sympathetic character? What type of question is this?", options: ["Evaluative", "Literal", "Quote", "Multiple choice"], answer: 0, hints: ["It asks your judgement.", "You must justify it.", "Evaluative."], explain: "It asks for your judgement with reasons." },
      { type: "mcq", q: "Which is the best way to start an answer?", options: ["Answer directly in a full sentence", "Repeat the whole question", "Write yes only", "Draw a picture"], answer: 0, hints: ["Save time.", "Be direct.", "Answer directly."], explain: "Answer directly in a clear sentence." }
    ],
    reflect: { q: "What will you do in the exam?", options: ["Check the key word", "Use the mark allocation", "Quote correctly", "Justify my opinion"] },
    parent: "Your child practised answering literal, inferential and evaluative comprehension questions.",
    teacher: "Shows distinguishing question levels, responding to instruction words and using mark allocation.",
    done: "Read the instruction word, check the marks, and support answers with evidence." },

  { id: "g12-speech", grade: 12, subject: "English Home Language", title: "Formal speech and interviews", topic: "Listening and speaking", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade 12 English Home Language: Listening and Speaking (prepared formal speech; interview skills; body language; register)",
    intention: "Today I am preparing for a formal speech and a job or university interview.", prompt: "What makes a speaker confident?",
    lesson: [
      { h: "Structure a speech", say: "A good speech has a hook to grab attention, three clear points with examples, and a strong ending that the audience will remember.", html: chainRow(["Hook", "Point 1", "Point 2", "Point 3", "Memorable ending"]) + P("Use cue cards with keywords, not full sentences.") },
      { h: "Delivery", say: "Make eye contact, vary your pace and tone, pause for effect, stand still and use natural gestures. Practise out loud, not just in your head.", html: chainRow(["Eye contact", "Pace", "Pauses", "Posture"]) + P("Nerves are normal. <b>Breathe</b> slowly before you start.") },
      { h: "Interviews", say: "Research the organisation. Prepare answers to common questions, like tell me about yourself. Use examples from your life. Prepare a question to ask them at the end.", html: chainRow(["Research", "Prepare examples", "Dress appropriately", "Ask a question"]) + P("Use the <b>STAR</b> method: Situation, Task, Action, Result.") }
    ],
    example: { q: "Interview question: Tell me about a time you solved a problem. How could you answer using STAR?", steps: ["Situation and task: our school garden had no water during the drought.", "Action: I organised learners to collect grey water.", "Result: the garden survived and fed the school's nutrition programme."] },
    questions: [
      { type: "mcq", q: "What is a hook in a speech?", options: ["An opening that grabs attention", "The final sentence", "A cue card", "A question from the audience"], answer: 0, hints: ["It starts the speech.", "It catches interest.", "Grabs attention."], explain: "A hook grabs the audience's attention." },
      { type: "mcq", q: "What should cue cards contain?", options: ["Keywords", "The full speech word for word", "Nothing", "Jokes only"], answer: 0, hints: ["You should not read.", "Just reminders.", "Keywords."], explain: "Keywords keep you on track without reading." },
      { type: "mcq", q: "What does STAR stand for?", options: ["Situation, Task, Action, Result", "Start, Talk, Answer, Repeat", "Smile, Talk, Ask, Return", "Speak, Think, Act, Rest"], answer: 0, hints: ["An interview method.", "Telling a story about yourself.", "Situation, Task, Action, Result."], explain: "Situation, Task, Action, Result." },
      { type: "mcq", q: "Which is good delivery?", options: ["Making eye contact and pausing", "Reading fast without looking up", "Mumbling", "Pacing nervously"], answer: 0, hints: ["Connect with the audience.", "Pauses help.", "Eye contact."], explain: "Eye contact and pauses improve delivery." },
      { type: "mcq", q: "Why prepare a question for the interviewer?", options: ["It shows interest and preparation", "It wastes time", "It is rude", "It is not allowed"], answer: 0, hints: ["Shows you researched.", "Shows interest.", "Interest and preparation."], explain: "It shows genuine interest and preparation." }
    ],
    reflect: { q: "What will you practise?", options: ["My hook", "Eye contact", "STAR answers", "Calm breathing"] },
    parent: "Your child learned how to structure and deliver a speech and prepare for interviews.",
    teacher: "Shows speech structure, delivery techniques and interview preparation using STAR.",
    done: "Hook your audience, deliver with confidence, and use STAR in interviews." },

  // ===================== GRADE 12 LIFE SCIENCES =====================
  { id: "g12-dna", grade: 12, subject: "Life Sciences", title: "DNA and protein synthesis", topic: "DNA: the code of life", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 12 Life Sciences, Term 1: DNA, the code of life (structure of DNA and RNA; DNA replication; protein synthesis: transcription and translation; DNA profiling)",
    intention: "Today I am learning how DNA carries instructions to make proteins.", prompt: "Why does a change in DNA sometimes change a protein?",
    lesson: [
      { h: "Structure of DNA", say: "DNA is a double helix, like a twisted ladder. The sides are sugar and phosphate. The rungs are pairs of bases: adenine pairs with thymine, and guanine pairs with cytosine.", html: chainRow(["A–T", "G–C"]) + P("The order of bases is the <b>genetic code</b>.") },
      { h: "Transcription", say: "In transcription, a section of DNA, a gene, is copied into messenger RNA in the nucleus. RNA uses uracil instead of thymine.", html: chainRow(["DNA", "→ transcription →", "mRNA"]) + P("In RNA, A pairs with <b>U</b>.") },
      { h: "Translation", say: "In translation, the mRNA moves to a ribosome. Every three bases, called a codon, code for one amino acid. Transfer RNA brings the amino acids, which join to form a protein.", html: chainRow(["mRNA codons", "→ ribosome →", "protein"]) }
    ],
    example: { q: "A DNA strand reads TAC GGA. What is the mRNA?", steps: ["Pair each base: T→A, A→U, C→G, G→C.", "TAC → AUG. GGA → CCU.", "mRNA: AUG CCU."] },
    questions: [
      { type: "mcq", q: "In DNA, adenine pairs with …", options: ["Thymine", "Guanine", "Cytosine", "Uracil"], answer: 0, hints: ["A–T.", "Uracil is only in RNA.", "Thymine."], explain: "A pairs with T in DNA." },
      { type: "mcq", q: "Where does transcription happen?", options: ["In the nucleus", "In the ribosome", "In the cell wall", "Outside the cell"], answer: 0, hints: ["DNA stays here.", "Copying happens where DNA is.", "Nucleus."], explain: "Transcription happens in the nucleus." },
      { type: "mcq", q: "Which base replaces thymine in RNA?", options: ["Uracil", "Adenine", "Guanine", "Cytosine"], answer: 0, hints: ["U.", "Only in RNA.", "Uracil."], explain: "RNA uses uracil." },
      { type: "mcq", q: "What is a codon?", options: ["Three bases that code for one amino acid", "A whole gene", "A protein", "A chromosome"], answer: 0, hints: ["A triplet.", "On mRNA.", "Three bases."], explain: "A codon is three bases coding for one amino acid." },
      { type: "order", q: "Put protein synthesis in order.", items: ["DNA is transcribed to mRNA", "mRNA moves to the ribosome", "tRNA brings amino acids", "Amino acids join into a protein"], orderLabel: "first to last", hints: ["Copy first.", "Then move.", "Then build."], explain: "Transcription, move to ribosome, tRNA brings amino acids, protein forms." }
    ],
    reflect: { q: "What helped you most?", options: ["Base-pairing rules", "The DNA → RNA → protein flow", "Working an example", "Not sure"] },
    parent: "Your child learned how DNA is copied into RNA and used to make proteins.",
    teacher: "Shows DNA structure, base pairing, transcription and translation.",
    done: "DNA is transcribed to mRNA, which is translated into protein." },

  { id: "g12-genetics", grade: 12, subject: "Life Sciences", title: "Genetics and inheritance", topic: "Monohybrid crosses", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 12 Life Sciences, Term 2: Genetics and inheritance (genes, alleles, genotype, phenotype; dominance; monohybrid crosses; Punnett squares; blood groups)",
    intention: "Today I am using Punnett squares to predict inheritance.", prompt: "Why can two brown-eyed parents have a blue-eyed child?",
    lesson: [
      { h: "Key terms", say: "Genes come in versions called alleles. You inherit one allele from each parent. The genotype is the alleles you have. The phenotype is the trait you see.", html: chainRow(["Allele", "Genotype: Bb", "Phenotype: brown eyes"]) },
      { h: "Dominant and recessive", say: "A dominant allele shows even if there is only one copy. A recessive allele only shows if there are two copies. Capital letter for dominant, small letter for recessive.", html: chainRow(["BB: brown", "Bb: brown", "bb: blue"]) + P("<b>Homozygous</b>: two the same. <b>Heterozygous</b>: two different.") },
      { h: "Punnett squares", say: "A Punnett square shows possible offspring. If two Bb parents have children, there is a one in four chance of bb.", html: `<div class="passage-text"><p>&nbsp;&nbsp;&nbsp;&nbsp;B&nbsp;&nbsp;&nbsp;b</p><p>B&nbsp;&nbsp;BB&nbsp;Bb</p><p>b&nbsp;&nbsp;Bb&nbsp;&nbsp;bb</p></div>` + P("Ratio: 3 brown : 1 blue.") }
    ],
    example: { q: "A Tt plant (tall) is crossed with a tt plant (short). What fraction of offspring will be short?", steps: ["Tt gives T or t. tt gives t only.", "Offspring: Tt, Tt, tt, tt.", "Half are tt, so 1/2 are short."] },
    questions: [
      { type: "mcq", q: "What is a phenotype?", options: ["The trait you can see", "The alleles you have", "A type of cell", "A chromosome"], answer: 0, hints: ["Observable.", "Like eye colour.", "Visible trait."], explain: "The phenotype is the observable trait." },
      { type: "mcq", q: "Which genotype is homozygous recessive?", options: ["aa", "AA", "Aa", "aA"], answer: 0, hints: ["Two the same.", "Both lowercase.", "aa."], explain: "aa is homozygous recessive." },
      { type: "mcq", q: "Two Bb parents. What is the chance of a bb child?", options: ["1/4", "1/2", "3/4", "0"], answer: 0, hints: ["Draw the Punnett square.", "BB, Bb, Bb, bb.", "One out of four."], explain: "1/4 chance of bb." },
      { type: "mcq", q: "Bb has brown eyes. What does this tell you?", options: ["Brown is dominant", "Blue is dominant", "Both show equally", "Nothing"], answer: 0, hints: ["B shows over b.", "Capital letter.", "Brown is dominant."], explain: "Only one B is needed, so brown is dominant." },
      { type: "mcq", q: "Crossing AA with aa gives offspring that are all …", options: ["Aa", "AA", "aa", "Half AA, half aa"], answer: 0, hints: ["AA gives A. aa gives a.", "Every child gets one of each.", "Aa."], explain: "All offspring are Aa." }
    ],
    reflect: { q: "What helped you most?", options: ["The Punnett square", "Learning the terms", "Capital and small letters", "Not sure"] },
    parent: "Your child used Punnett squares to predict inherited traits.",
    teacher: "Shows using genetic terminology, distinguishing dominance, and solving monohybrid crosses with Punnett squares.",
    done: "Use a Punnett square to predict the chance of each genotype and phenotype." },

  { id: "g12-evolution", grade: 12, subject: "Life Sciences", title: "Evolution by natural selection", topic: "Evolution", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 12 Life Sciences, Term 2: Evolution by natural selection (variation; Darwin's theory; artificial selection; speciation; evidence for evolution; human evolution and the Cradle of Humankind)",
    intention: "Today I am learning how natural selection causes species to change over time.", prompt: "How does antibiotic resistance show natural selection?",
    lesson: [
      { h: "Variation", say: "Individuals in a population vary. Some variation is inherited, coming from mutations and sexual reproduction.", html: PICS("🐞🐞🐞", "Ladybirds with different patterns") + P("Without variation, selection cannot happen.") },
      { h: "Natural selection", say: "More offspring are born than can survive. Individuals with helpful traits survive and reproduce more. They pass these traits on. Over many generations, the population changes.", html: chainRow(["Variation", "Competition", "Survival of the fittest", "Inheritance", "Change over time"]) + P("Charles Darwin and Alfred Russel Wallace described this in the 1850s.") },
      { h: "Evidence and South Africa", say: "Evidence comes from fossils, comparing anatomy, and DNA. South Africa's Cradle of Humankind is a World Heritage Site with important hominin fossils, such as Mrs Ples and Little Foot.", html: chainRow(["Fossils", "Anatomy", "DNA"]) + P("The <b>Cradle of Humankind</b> is near Johannesburg.") }
    ],
    example: { q: "Why do some bacteria survive antibiotics?", steps: ["Some bacteria have a mutation that gives resistance.", "The antibiotic kills the others; the resistant ones survive and multiply.", "Over time, the population becomes resistant. This is natural selection."] },
    questions: [
      { type: "mcq", q: "What is needed for natural selection to happen?", options: ["Variation in a population", "All individuals being identical", "No competition", "No reproduction"], answer: 0, hints: ["Differences between individuals.", "Some traits help more than others.", "Variation."], explain: "Variation is essential." },
      { type: "mcq", q: "Who proposed the theory of natural selection?", options: ["Charles Darwin and Alfred Russel Wallace", "Isaac Newton", "Albert Einstein", "Gregor Mendel only"], answer: 0, hints: ["The 1850s.", "On the Origin of Species.", "Darwin and Wallace."], explain: "Darwin and Wallace proposed it." },
      { type: "mcq", q: "What is artificial selection?", options: ["Humans choosing which organisms breed", "Selection by weather", "Random mutation", "Extinction"], answer: 0, hints: ["Farmers and breeders.", "People choose.", "Humans select."], explain: "Humans choose which individuals reproduce." },
      { type: "mcq", q: "Where is the Cradle of Humankind?", options: ["Near Johannesburg, Gauteng", "Cape Town", "Durban", "Kimberley"], answer: 0, hints: ["Gauteng.", "Sterkfontein Caves.", "Near Johannesburg."], explain: "It is near Johannesburg." },
      { type: "order", q: "Put natural selection in order.", items: ["Variation exists", "Competition for survival", "Better-adapted individuals survive and reproduce", "Traits become more common"], orderLabel: "first to last", hints: ["Start with differences.", "Then struggle.", "Then inheritance."], explain: "Variation, competition, survival and reproduction, more common traits." }
    ],
    reflect: { q: "What helped you most?", options: ["The step-by-step process", "The bacteria example", "Fossil evidence", "Not sure"] },
    parent: "Your child learned how natural selection works and the evidence for evolution, including South Africa's Cradle of Humankind.",
    teacher: "Shows explaining natural selection, distinguishing artificial selection and identifying lines of evidence.",
    done: "Natural selection favours helpful traits, changing populations over many generations." },

  // ===================== GRADE 12 LIFE ORIENTATION =====================
  { id: "g12-exams", grade: 12, subject: "Life Orientation", title: "Exam writing strategies", topic: "Study skills: exam preparation", domain: "Creativity and Metacognition", category: "Planning and Organisation",
    caps: "CAPS Grade 12 Life Orientation: Study skills (exam writing skills; time management; managing exam stress)",
    intention: "Today I am planning how to prepare for and write final exams.", prompt: "Which strategy will help you most this exam season?",
    lesson: [
      { h: "Make a study timetable", say: "Work backwards from your exam dates. Give more time to harder subjects. Plan short sessions with breaks, and include rest days.", html: chainRow(["Exam dates", "Topics", "Daily plan", "Rest"]) + P("Use <b>past papers</b>: they show question styles and timing.") },
      { h: "In the exam", say: "Read the whole paper first. Plan your time using the marks. Start with questions you know to build confidence. Answer what is asked, and check your work at the end.", html: chainRow(["Read all", "Plan time", "Start strong", "Check"]) + P("About 1 minute per mark is a useful guide.") },
      { h: "Look after yourself", say: "Sleep matters more than late-night cramming. Eat regularly, drink water, move every day and take breaks. If you feel overwhelmed, talk to someone.", html: chainRow(["Sleep", "Eat", "Move", "Breaks", "Talk"]) }
    ],
    example: { q: "A paper is 150 marks in 3 hours. How much time for a 30-mark question?", steps: ["3 hours = 180 minutes for 150 marks.", "About 1,2 minutes per mark.", "30 marks ≈ 36 minutes."] },
    questions: [
      { type: "mcq", q: "Why use past papers?", options: ["To practise question styles and timing", "To memorise exact answers", "They are not useful", "To skip studying"], answer: 0, hints: ["Questions are similar in style.", "Practise under time.", "Styles and timing."], explain: "They help you practise style and timing." },
      { type: "mcq", q: "What should you do first in an exam?", options: ["Read through the whole paper", "Start at the hardest question", "Leave early", "Write your answers quickly without reading"], answer: 0, hints: ["Get an overview.", "Plan before answering.", "Read it all."], explain: "Reading the whole paper helps you plan." },
      { type: "mcq", q: "Which is better the night before an exam?", options: ["A good night's sleep", "Staying up all night", "Energy drinks only", "Skipping supper"], answer: 0, hints: ["The brain consolidates memory in sleep.", "Rested minds perform better.", "Sleep."], explain: "Sleep helps memory and focus." },
      { type: "num", q: "A 100-mark paper lasts 2 hours. About how many minutes for a 25-mark section?", answer: "30", options: ["30", "25", "50", "60"], hints: ["120 minutes for 100 marks.", "1,2 minutes per mark.", "25 × 1,2."], explain: "About 30 minutes." },
      { type: "mcq", q: "Why start with questions you know?", options: ["To build confidence and secure marks", "To finish early", "It is required", "To confuse the marker"], answer: 0, hints: ["Easy marks first.", "Calm nerves.", "Confidence and marks."], explain: "It builds confidence and secures marks." }
    ],
    reflect: { q: "Which strategy will you use?", options: ["A study timetable", "Past papers", "Time per mark", "Sleep and breaks"] },
    parent: "Your child planned exam preparation and strategies for writing exams. Support with a quiet space and regular sleep.",
    teacher: "Shows planning a study timetable, exam time management and self-care strategies.",
    done: "Plan your study, manage time in the exam, and look after yourself." },

  { id: "g12-afterschool", grade: 12, subject: "Life Orientation", title: "Life after school", topic: "Careers: unemployment, entrepreneurship and change", domain: "Inquiry and Systems Thinking", category: "Flexible Thinking",
    caps: "CAPS Grade 12 Life Orientation: Careers and career choices (reasons for unemployment; innovative solutions; entrepreneurship; coping with change and the transition after school)",
    intention: "Today I am planning for life after school, including if things do not go to plan.", prompt: "What is your plan A, and what is your plan B?",
    lesson: [
      { h: "Many paths", say: "After school you might study, work, do a learnership, volunteer, or start a business. Many people combine paths, and plans often change.", html: chainRow(["Study", "Work", "Learnership", "Volunteer", "Business"]) + P("Have a <b>plan A</b> and a <b>plan B</b>.") },
      { h: "Facing unemployment", say: "Youth unemployment in South Africa is very high. While searching, keep building skills: volunteer, do free online courses, take short courses and network. Register on government youth employment platforms.", html: chainRow(["Volunteer", "Learn online", "Network", "Register"]) + P("A gap is not wasted if you keep <b>growing</b>.") },
      { h: "Entrepreneurship", say: "An entrepreneur spots a need and creates a business to meet it. Start small, test your idea with real customers, keep records, and learn from mistakes.", html: chainRow(["Spot a need", "Test small", "Keep records", "Learn"]) + P("Many successful businesses started with very little money.") }
    ],
    example: { q: "Lwando did not get into university this year. What could he do?", steps: ["Find out why: marks, late application, or space.", "Plan B: apply to a TVET college, a learnership, or improve marks with a supplementary or rewrite.", "Meanwhile: volunteer, do a free course, and reapply on time next year."] },
    questions: [
      { type: "mcq", q: "What is a plan B?", options: ["A backup if plan A does not work", "A second university only", "A holiday", "Giving up"], answer: 0, hints: ["Backup.", "An alternative route.", "A backup plan."], explain: "Plan B is your backup." },
      { type: "mcq", q: "Which is a good use of time while job hunting?", options: ["Volunteering and learning new skills", "Staying in bed", "Avoiding everyone", "Doing nothing"], answer: 0, hints: ["Keep growing.", "Build your CV.", "Volunteer and learn."], explain: "Volunteering and learning build skills and contacts." },
      { type: "mcq", q: "What does an entrepreneur do?", options: ["Starts a business to meet a need", "Only works for others", "Only studies", "Avoids risk completely"], answer: 0, hints: ["Spots opportunities.", "Creates something.", "Starts a business."], explain: "Entrepreneurs create businesses to meet needs." },
      { type: "mcq", q: "What is networking?", options: ["Building relationships that can lead to opportunities", "Fixing computers", "Using only social media", "Applying online only"], answer: 0, hints: ["People you know.", "Contacts and connections.", "Relationships."], explain: "Networking means building helpful connections." },
      { type: "mcq", q: "Why test a business idea small first?", options: ["To learn cheaply before investing more", "To fail on purpose", "It is required by law", "To avoid customers"], answer: 0, hints: ["Less risk.", "Learn what works.", "Test cheaply."], explain: "Testing small reduces risk and teaches you quickly." }
    ],
    reflect: { q: "What will your next step be?", options: ["Write plan A and B", "Register for opportunities", "Start a small business idea", "Volunteer"] },
    parent: "Your child planned for life after school, including backup plans and entrepreneurship.",
    teacher: "Shows awareness of post-school pathways, strategies for unemployment, and entrepreneurial thinking.",
    done: "Have a plan A and a plan B, keep building skills, and consider starting something." },

  { id: "g12-citizen", grade: 12, subject: "Life Orientation", title: "Responsible citizenship", topic: "Democracy and human rights: voting and participation", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "CAPS Grade 12 Life Orientation: Democracy and human rights (responsible citizenship; participation in civic life; voting; the role of the IEC)",
    intention: "Today I am learning how to take part in democracy as an adult citizen.", prompt: "Why might some young people not vote, and what could change that?",
    lesson: [
      { h: "Voting", say: "South African citizens can register to vote from age 16 and vote from age 18. The Electoral Commission of South Africa, the IEC, runs elections and keeps them free and fair.", html: chainRow(["Register from 16", "Vote from 18", "IEC"]) + P("You need your <b>ID</b> to register and vote.") },
      { h: "Beyond voting", say: "Citizens also take part through ward committees, public participation in municipal plans, petitions, peaceful protest, and community organisations.", html: chainRow(["Ward committees", "Municipal plans", "Petitions", "Peaceful protest"]) + P("Your <b>ward councillor</b> represents your area in the municipality.") },
      { h: "Responsibilities", say: "Responsible citizens obey the law, pay taxes when they earn, respect others' rights, and stay informed.", html: chainRow(["Obey the law", "Pay taxes", "Respect rights", "Stay informed"]) }
    ],
    example: { q: "Thabo, 18, is unhappy that his street has no lights. What can he do?", steps: ["Contact his ward councillor and report it to the municipality.", "Attend a ward committee meeting or comment on the municipal plan.", "Make sure he is registered so he can vote in the next local election."] },
    questions: [
      { type: "mcq", q: "From what age can you vote in South Africa?", options: ["18", "16", "21", "25"], answer: 0, hints: ["You can register earlier.", "But vote at…", "18."], explain: "You can vote from 18." },
      { type: "mcq", q: "Who runs elections in South Africa?", options: ["The IEC", "The SAPS", "SARS", "The SABC"], answer: 0, hints: ["Electoral Commission.", "Independent.", "IEC."], explain: "The Electoral Commission (IEC) runs elections." },
      { type: "mcq", q: "Who represents your area in the municipality?", options: ["Your ward councillor", "The President", "A school principal", "A judge"], answer: 0, hints: ["Local government.", "A ward.", "Ward councillor."], explain: "Your ward councillor represents your ward." },
      { type: "mcq", q: "Which is a peaceful way to participate?", options: ["Signing a petition", "Damaging property", "Threatening officials", "Spreading false news"], answer: 0, hints: ["Legal and non-violent.", "Collecting signatures.", "A petition."], explain: "A petition is a peaceful form of participation." },
      { type: "mcq", q: "Which is a citizen's responsibility?", options: ["Respecting other people's rights", "Ignoring the law", "Avoiding all taxes", "Only caring about yourself"], answer: 0, hints: ["Rights come with duties.", "Others have rights too.", "Respect."], explain: "Respecting others' rights is a key responsibility." }
    ],
    reflect: { q: "How will you take part?", options: ["Register to vote", "Contact my councillor", "Join a community group", "Stay informed"] },
    parent: "Your child learned how citizens take part in democracy, including registering to vote.",
    teacher: "Shows knowledge of voting rights, the IEC, local government participation and civic responsibilities.",
    done: "Register, vote, and take part in your community's decisions." }
];
const WORDS_G12 = {
  "g12-sequences": { words: [["➕", "Common difference", "the amount added each time"], ["✖️", "Common ratio", "the number multiplied each time"]] },
  "g12-calculus": { words: [["📈", "Derivative", "the gradient of a curve at a point"], ["🔄", "Turning point", "where the graph changes direction"]] },
  "g12-annuities": { words: [["💰", "Annuity", "a series of equal payments"], ["🏠", "Bond", "a home loan"]] },
  "g12-novel": { words: [["🔣", "Symbol", "an object that stands for an idea"], ["👵", "Makhulu", "isiXhosa for grandmother"], ["🏡", "Stoep", "a veranda"], ["🐦", "Hadeda", "a large, noisy South African ibis"]] },
  "g12-comprehension": { words: [["🔍", "Inferential", "reading between the lines"], ["⚖️", "Evaluative", "giving your judgement with reasons"]] },
  "g12-speech": { words: [["🪝", "Hook", "an opening that grabs attention"], ["⭐", "STAR", "Situation, Task, Action, Result"]] },
  "g12-dna": { words: [["🧬", "Double helix", "the twisted-ladder shape of DNA"], ["📝", "Transcription", "copying DNA into mRNA"], ["🔤", "Codon", "three bases that code for an amino acid"]] },
  "g12-genetics": { words: [["🧬", "Allele", "a version of a gene"], ["🔡", "Genotype", "the alleles you have"], ["👁️", "Phenotype", "the trait you can see"]] },
  "g12-evolution": { words: [["🦕", "Fossil", "remains of ancient life preserved in rock"], ["🧭", "Natural selection", "better-adapted individuals survive and reproduce more"]] },
  "g12-exams": { words: [["📅", "Study timetable", "a plan of what to study and when"], ["📄", "Past paper", "a previous exam used for practice"]] },
  "g12-afterschool": { words: [["💡", "Entrepreneur", "someone who starts a business to meet a need"], ["🤝", "Networking", "building helpful connections"]] },
  "g12-citizen": { words: [["🗳️", "IEC", "the Electoral Commission of South Africa"], ["🏘️", "Ward councillor", "the person who represents your area in the municipality"]] }
};
Object.assign(WORDS, WORDS_G12);
