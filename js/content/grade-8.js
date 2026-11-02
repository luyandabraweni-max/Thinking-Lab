"use strict";

// ---------- Learn units: Grade 8 (CAPS Senior Phase). Original content. ----------
const POEM_TOWNSHIP = `<div class="passage-text"><p><b>Morning in Our Street</b> <span class="muted">(a 2to.iQ poem)</span></p>
<p>Before the sun has rubbed its eyes,<br>the taxis hoot their sharp goodbyes;<br>a rooster shouts from someone's yard,<br>the pavement, cold and grey and hard.</p>
<p>Mama Thandi lights her stove,<br>the vetkoek dance in oil and rise;<br>the smell runs down the street to find<br>each sleepy child with hungry eyes.</p>
<p>And we, in blue and grey and green,<br>a river flowing to the school,<br>are pebbles carried, side by side,<br>still sleepy, laughing, breaking rules.</p></div>`;
const tri = (a, b, c) => `<svg width="170" height="130" viewBox="0 0 170 130" role="img" aria-label="Right-angled triangle with sides ${a}, ${b} and hypotenuse ${c}"><polygon points="20,110 150,110 20,20" fill="var(--brand-soft)" stroke="var(--ink)" stroke-width="2"/><rect x="20" y="96" width="14" height="14" fill="none" stroke="var(--ink)"/><text x="85" y="126" font-size="13" text-anchor="middle" fill="var(--ink)">${b}</text><text x="8" y="70" font-size="13" text-anchor="middle" fill="var(--ink)">${a}</text><text x="98" y="58" font-size="13" text-anchor="middle" fill="var(--ink)">${c}</text></svg>`;
const UNITS_G8 = [
  // ===================== GRADE 8 MATHEMATICS =====================
  { id: "g8-algebra", grade: 8, subject: "Mathematics", title: "Algebraic expressions", topic: "Like terms and expanding brackets", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 8 Mathematics, Term 2: Algebraic expressions (like terms; add, subtract, multiply and divide expressions; expand using the distributive law)",
    intention: "Today I am simplifying expressions and expanding brackets.", prompt: "How did you decide which terms were like terms?",
    lesson: [
      { h: "Like terms", say: "Like terms have the same letter and the same exponent. Three x and five x are like terms. Three x and five y are not.", html: chainRow(["3x + 5x = 8x", "3x + 5y stays"]) + P("Only add or subtract <b>like terms</b>.") },
      { h: "Simplifying", say: "To simplify four a plus three b minus a plus two b, group like terms. Four a minus a is three a. Three b plus two b is five b. The answer is three a plus five b.", html: chainRow(["4a − a = 3a", "3b + 2b = 5b", "3a + 5b"]) + P("Group, then combine.") },
      { h: "Expanding brackets", say: "To expand three times x plus four in brackets, multiply each term inside by three. Three x plus twelve.", html: chainRow(["3(x + 4)", "= 3x + 12"]) + P("The <b>distributive law</b>: multiply <b>every</b> term inside.") }
    ],
    example: { q: "Simplify 2(x + 5) + 3x.", steps: ["Expand: 2x + 10.", "Add 3x: 2x + 10 + 3x.", "Combine like terms: 5x + 10."] },
    questions: [
      { type: "mcq", q: "Which are like terms?", options: ["7y and −2y", "7y and 7x", "y and y²", "3 and 3a"], answer: 0, hints: ["Same letter, same exponent.", "y and y² are different.", "7y and −2y."], explain: "7y and −2y have the same variable and exponent." },
      { type: "mcq", q: "Simplify: 6m + 2n − 4m", options: ["2m + 2n", "4mn", "10m + 2n", "2m − 2n"], answer: 0, hints: ["Combine the m terms.", "6m − 4m.", "The n term stays."], explain: "6m − 4m = 2m, so 2m + 2n." },
      { type: "mcq", q: "Expand: 5(2a − 3)", options: ["10a − 15", "10a − 3", "7a − 8", "10a + 15"], answer: 0, hints: ["Multiply each term by 5.", "5 × 2a and 5 × −3.", "10a − 15."], explain: "5 × 2a = 10a and 5 × (−3) = −15." },
      { type: "mcq", q: "Expand: x(x + 6)", options: ["x² + 6x", "2x + 6", "x² + 6", "x + 6x"], answer: 0, hints: ["Multiply each term by x.", "x × x = x².", "x × 6 = 6x."], explain: "x(x + 6) = x² + 6x." },
      { type: "mcq", q: "Simplify: 3(p + 2) − p", options: ["2p + 6", "3p + 2", "2p + 2", "4p + 6"], answer: 0, hints: ["Expand first: 3p + 6.", "Then subtract p.", "2p + 6."], explain: "3p + 6 − p = 2p + 6." }
    ],
    reflect: { q: "What helped you?", options: ["Circling like terms", "Expanding step by step", "Checking signs", "Not sure"] },
    parent: "Your child simplified algebraic expressions and expanded brackets.",
    teacher: "Shows identifying like terms, simplifying expressions and applying the distributive law, including with a variable outside the bracket.",
    done: "Combine like terms and multiply every term inside the brackets." },

  { id: "g8-pythagoras", grade: 8, subject: "Mathematics", title: "The Theorem of Pythagoras", topic: "Right-angled triangles", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 8 Mathematics, Term 3: Theorem of Pythagoras (determine whether a triangle is right-angled; calculate missing lengths)",
    intention: "Today I am using Pythagoras to find a missing side.", prompt: "How do you know which side is the hypotenuse?",
    lesson: [
      { h: "The hypotenuse", say: "In a right-angled triangle, the longest side is opposite the right angle. It is called the hypotenuse.", html: tri("a", "b", "c") + P("<b>c</b> is the <b>hypotenuse</b>, opposite the square corner.") },
      { h: "The theorem", say: "The square of the hypotenuse equals the sum of the squares of the other two sides. c squared equals a squared plus b squared.", html: chainRow(["c² = a² + b²"]) + P("This only works for <b>right-angled</b> triangles.") },
      { h: "Using it", say: "If the two shorter sides are three and four, then c squared is nine plus sixteen, which is twenty-five. So c is five.", html: tri("3", "4", "5") + chainRow(["3² + 4² = 9 + 16 = 25", "c = √25 = 5"]) }
    ],
    example: { q: "A ladder leans against a wall. Its foot is 6 m from the wall and it reaches 8 m up. How long is the ladder?", steps: ["The wall and ground make a right angle. The ladder is the hypotenuse.", "c² = 6² + 8² = 36 + 64 = 100.", "c = √100 = 10 m."] },
    questions: [
      { type: "num", q: "The two shorter sides are 5 cm and 12 cm. How long is the hypotenuse?", html: tri("5", "12", "?"), answer: "13", options: ["13", "17", "169", "7"], hints: ["c² = 5² + 12².", "25 + 144 = 169.", "√169."], explain: "c² = 169, so c = 13 cm." },
      { type: "mcq", q: "Which side is the hypotenuse?", options: ["The side opposite the right angle", "The shortest side", "Any side", "The bottom side"], answer: 0, hints: ["It is the longest side.", "Look across from the square corner.", "Opposite the right angle."], explain: "The hypotenuse is opposite the right angle." },
      { type: "mcq", q: "Is a triangle with sides 6, 8 and 10 right-angled?", options: ["Yes", "No"], fixed: true, answer: 0, hints: ["Check: 6² + 8² = ?", "36 + 64 = 100.", "10² = 100."], explain: "6² + 8² = 100 = 10², so yes." },
      { type: "num", q: "The hypotenuse is 10 and one side is 6. Find the other side.", answer: "8", options: ["8", "4", "16", "64"], hints: ["a² = c² − b².", "100 − 36 = 64.", "√64."], explain: "a² = 100 − 36 = 64, so a = 8." },
      { type: "mcq", q: "Is a triangle with sides 4, 5 and 6 right-angled?", options: ["No", "Yes"], fixed: true, answer: 0, hints: ["Check: 4² + 5² = ?", "16 + 25 = 41.", "6² = 36. They are not equal."], explain: "41 ≠ 36, so it is not right-angled." }
    ],
    reflect: { q: "What helped you most?", options: ["Drawing the triangle", "Finding the hypotenuse first", "Writing c² = a² + b²", "Not sure"] },
    parent: "Your child used the Theorem of Pythagoras to find missing sides of right-angled triangles.",
    teacher: "Shows identifying the hypotenuse, applying the theorem to find a missing side and testing whether a triangle is right-angled.",
    done: "In a right-angled triangle, c² = a² + b²." },

  { id: "g8-interest", grade: 8, subject: "Mathematics", title: "Simple and compound interest", topic: "Financial mathematics", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 8 Mathematics, Term 1: Financial mathematics (profit, loss, discount, VAT; simple and compound interest; hire purchase)",
    intention: "Today I am calculating interest on savings and loans.", prompt: "Would you rather save with simple or compound interest? Why?",
    lesson: [
      { h: "Simple interest", say: "Simple interest is paid only on the amount you start with. R1 000 at ten percent simple interest earns R100 every year.", html: chainRow(["Year 1: +R100", "Year 2: +R100", "Year 3: +R100"]) + P("Simple interest = principal × rate × time.") },
      { h: "Compound interest", say: "Compound interest is paid on the amount plus the interest already earned. R1 000 at ten percent becomes R1 100, then R1 210, then R1 331.", html: chainRow(["R1 000", "R1 100", "R1 210", "R1 331"]) + P("Interest earns <b>interest</b>. It grows faster over time.") },
      { h: "Borrowing costs money", say: "When you borrow, interest works against you. Buying on credit or hire purchase can cost much more than the cash price.", html: PICS("💳 📈", "Card and rising graph") + P("Compare the <b>total cost</b>, not just the monthly payment.") }
    ],
    example: { q: "You invest R2 000 at 5% simple interest for 3 years. How much interest do you earn?", steps: ["5% of R2 000 is R100 per year.", "For 3 years: 3 × R100.", "R300 interest."] },
    questions: [
      { type: "num", q: "R500 at 10% simple interest for 2 years. How much interest?", answer: "R100", options: ["R100", "R50", "R105", "R600"], hints: ["10% of R500 is R50.", "For 2 years.", "2 × R50."], explain: "R50 × 2 = R100." },
      { type: "num", q: "R1 000 at 10% compound interest. How much after 2 years?", answer: "R1 210", options: ["R1 210", "R1 200", "R1 100", "R1 020"], hints: ["Year 1: R1 000 + R100.", "Year 2: 10% of R1 100 is R110.", "R1 100 + R110."], explain: "R1 000 → R1 100 → R1 210." },
      { type: "mcq", q: "Why does compound interest grow faster?", options: ["You earn interest on your interest", "The rate goes up each year", "The bank adds a bonus", "It doesn't"], answer: 0, hints: ["Look at year 2.", "Interest is worked out on the new total.", "Interest on interest."], explain: "Each year's interest is added to the amount, so you earn interest on interest." },
      { type: "mcq", q: "A TV costs R4 000 cash, or R250 a month for 24 months. How much more does credit cost?", options: ["R2 000", "R250", "R6 000", "R1 000"], answer: 0, hints: ["Total credit cost: 24 × R250.", "That is R6 000.", "R6 000 − R4 000."], explain: "R6 000 − R4 000 = R2 000 extra." },
      { type: "num", q: "What is 15% VAT on R200?", answer: "R30", options: ["R30", "R15", "R230", "R3"], hints: ["10% is R20.", "5% is R10.", "R20 + R10."], explain: "15% of R200 = R30." }
    ],
    reflect: { q: "What helped you most?", options: ["Working year by year", "Finding 10% first", "Comparing totals", "Not sure"] },
    parent: "Your child calculated simple and compound interest and compared the cost of credit with cash.",
    teacher: "Shows calculating simple and compound interest, VAT and the total cost of credit.",
    done: "Compound interest grows on itself. Borrowing adds to the cost." },

  // ===================== GRADE 8 ENGLISH HOME LANGUAGE =====================
  { id: "g8-poetry", grade: 8, subject: "English Home Language", title: "Poem: Morning in Our Street", topic: "Imagery, tone and mood", domain: "Communication and Expression", category: "Creativity",
    caps: "CAPS Grade 8 English Home Language: Literature (poetry: imagery, figures of speech, rhyme, tone and mood)",
    intention: "Today I am analysing imagery, tone and mood in a poem.", prompt: "Which line created the clearest picture for you?",
    passage: POEM_TOWNSHIP,
    lesson: [
      { h: "Read the poem", say: "Read the poem, or press Read aloud to hear it part by part.", html: POEM_TOWNSHIP },
      { h: "Imagery", say: "Imagery is language that appeals to the senses. The smell runs down the street appeals to smell. The taxis hoot appeals to sound.", html: chainRow(["Sight", "Sound", "Smell", "Touch", "Taste"]) + P("<b>Imagery</b> helps us see, hear and smell the street.") },
      { h: "Tone and mood", say: "Tone is the poet's attitude. Here it is warm and fond. Mood is the feeling the reader gets: cosy, lively and familiar.", html: chainRow(["Tone: the writer's attitude", "Mood: the reader's feeling"]) + P("The children as <b>a river</b> and <b>pebbles</b> is an extended metaphor.") }
    ],
    example: { q: "What figure of speech is: Before the sun has rubbed its eyes?", steps: ["Can the sun rub its eyes?", "No, that is a human action.", "It is personification, showing it is very early morning."] },
    questions: [
      { type: "mcq", q: "Which sense does the vetkoek dance in oil mostly appeal to?", options: ["Sight", "Touch", "Taste only", "None"], answer: 0, hints: ["We picture the vetkoek moving.", "Dancing is something we see.", "Sight."], explain: "We picture the vetkoek moving in the oil." },
      { type: "mcq", q: "What is the tone of the poem?", options: ["Warm and fond", "Angry", "Fearful", "Bored"], answer: 0, hints: ["How does the poet feel about the street?", "The details are loving.", "Warm and fond."], explain: "The poet describes the street with warmth and affection." },
      { type: "mcq", q: "The children are a river flowing to the school. What does this suggest?", options: ["They move together in a steady stream", "They are wet", "They are swimming", "They are lost"], answer: 0, hints: ["How does a river move?", "Steadily, all in one direction.", "Moving together."], explain: "Like a river, the children flow together towards school." },
      { type: "mcq", q: "Which words rhyme in stanza 1?", options: ["eyes and goodbyes", "taxis and yard", "sun and hard", "rooster and street"], answer: 0, hints: ["Look at the line endings.", "Eyes …", "Goodbyes."], explain: "Eyes and goodbyes rhyme; yard and hard rhyme." },
      { type: "mcq", q: "What does in blue and grey and green describe?", options: ["The school uniforms", "The sky", "The vetkoek", "The taxis"], answer: 0, hints: ["Who is flowing to school?", "What do learners wear?", "School uniforms."], explain: "The colours describe different school uniforms." }
    ],
    reflect: { q: "How did you understand the poem best?", options: ["Reading it myself", "Listening to it", "Picturing the street", "Not sure"] },
    parent: "Your child analysed a poem's imagery, tone, mood and figures of speech.",
    teacher: "Shows identifying sensory imagery, personification, extended metaphor, rhyme scheme, tone and mood.",
    done: "Imagery, tone and mood bring a poem to life." },

  { id: "g8-voice", grade: 8, subject: "English Home Language", title: "Active and passive voice", topic: "Voice", domain: "Communication and Expression", category: "Flexible Thinking",
    caps: "CAPS Grade 8 English Home Language: Language Structures and Conventions (active and passive voice; subject and object; tense)",
    intention: "Today I am changing sentences between active and passive voice.", prompt: "When might a writer choose the passive voice?",
    lesson: [
      { h: "Active voice", say: "In the active voice, the subject does the action. The dog chased the cat. The dog is doing the chasing.", html: `<div class="passage-text"><p><b>The dog</b> chased the cat.</p></div>` + P("Subject → verb → object.") },
      { h: "Passive voice", say: "In the passive voice, the object becomes the subject, and the action is done to it. The cat was chased by the dog.", html: `<div class="passage-text"><p><b>The cat</b> was chased by the dog.</p></div>` + P("Passive uses a form of <b>to be</b> plus the past participle.") },
      { h: "Keep the tense", say: "Keep the same tense. Active: Thandi writes the report. Passive: The report is written by Thandi. Active: She wrote it. Passive: It was written by her.", html: chainRow(["writes → is written", "wrote → was written", "will write → will be written"]) + P("The passive is useful when the doer is <b>unknown</b> or <b>unimportant</b>.") }
    ],
    example: { q: "Change to passive: The learners planted the trees.", steps: ["The object is the trees. It becomes the subject.", "Planted is past tense, so use were planted.", "The trees were planted by the learners."] },
    questions: [
      { type: "mcq", q: "Which sentence is in the passive voice?", options: ["The window was broken by the ball.", "The ball broke the window.", "The boy kicked the ball.", "The ball flies."], answer: 0, hints: ["Look for was or were plus a past participle.", "The action is done to the subject.", "The window was broken."], explain: "The window was broken by the ball. is passive." },
      { type: "mcq", q: "Change to passive: The chef cooks the meal.", options: ["The meal is cooked by the chef.", "The meal was cooked by the chef.", "The chef is cooked by the meal.", "The meal cooks the chef."], answer: 0, hints: ["Cooks is present tense.", "Use is cooked.", "The meal is cooked by the chef."], explain: "Present tense active → is cooked." },
      { type: "mcq", q: "Change to active: The song was sung by the choir.", options: ["The choir sang the song.", "The choir sings the song.", "The song sang the choir.", "The choir was singing."], answer: 0, hints: ["Who did the action?", "The choir.", "Was sung is past, so sang."], explain: "The choir sang the song." },
      { type: "mcq", q: "Why might a news report say: The bank was robbed last night?", options: ["The robber is unknown", "To be rude", "It is shorter", "Banks prefer it"], answer: 0, hints: ["Who robbed it?", "Nobody knows yet.", "The doer is unknown."], explain: "The passive works when we do not know who did it." },
      { type: "mcq", q: "Change to passive: They will announce the results.", options: ["The results will be announced.", "The results were announced.", "The results are announced.", "The results will announce."], answer: 0, hints: ["Will announce is future.", "Use will be plus the past participle.", "Will be announced."], explain: "Future active → will be announced." }
    ],
    reflect: { q: "What helped you?", options: ["Finding the subject and object", "Keeping the tense", "Asking who did it", "Not sure"] },
    parent: "Your child changed sentences between active and passive voice.",
    teacher: "Shows converting between active and passive voice across tenses and explaining when the passive is used.",
    done: "Active: the subject acts. Passive: the action is done to the subject." },

  { id: "g8-persuasive", grade: 8, subject: "English Home Language", title: "Persuasive language", topic: "Persuasive techniques and bias", domain: "Communication and Expression", category: "Reflection",
    caps: "CAPS Grade 8 English Home Language: Reading and Viewing, Listening and Speaking (persuasive texts and advertisements; emotive language; fact and opinion; bias)",
    intention: "Today I am spotting persuasive techniques in adverts and speeches.", prompt: "Which technique works on you most often?",
    lesson: [
      { h: "Emotive language", say: "Emotive words make us feel strongly. Desperate, heroic, shocking. They push us towards a feeling, not just a fact.", html: chainRow(["desperate", "amazing", "shocking", "heroic"]) + P("<b>Emotive language</b> targets feelings.") },
      { h: "Common techniques", say: "Advertisers use the bandwagon effect, everyone is buying it. Testimonials from famous people. Statistics. And rhetorical questions, like don't you deserve the best?", html: chainRow(["Bandwagon", "Testimonial", "Statistics", "Rhetorical question"]) + P("Ask: <b>who</b> benefits if I believe this?") },
      { h: "Fact, opinion and bias", say: "A fact can be checked. An opinion is a belief. Bias is when a text only shows one side.", html: chainRow(["Fact: can be proven", "Opinion: a belief", "Bias: one-sided"]) + P("Good readers <b>question</b> what they read.") }
    ],
    example: { q: "An advert says: 9 out of 10 dentists choose Brite toothpaste! Which technique is this?", steps: ["It uses a number to sound convincing.", "It also uses experts.", "Statistics and expert testimonial. Ask: which dentists, and who paid for the survey?"] },
    questions: [
      { type: "mcq", q: "Join millions of happy customers! Which technique is this?", options: ["Bandwagon", "Statistics", "Rhetorical question", "Fact"], answer: 0, hints: ["It says everyone is doing it.", "Join the crowd.", "Bandwagon."], explain: "It suggests everyone is buying it: bandwagon." },
      { type: "mcq", q: "Which is a fact?", options: ["The stadium has 94 000 seats.", "This is the best stadium in Africa.", "Everyone loves this stadium.", "The stadium is beautiful."], answer: 0, hints: ["A fact can be checked.", "Numbers can be counted.", "94 000 seats."], explain: "The number of seats can be checked." },
      { type: "mcq", q: "Why would you want to miss out? What is this?", options: ["A rhetorical question", "A statistic", "A fact", "A testimonial"], answer: 0, hints: ["Does it expect an answer?", "It is asked for effect.", "Rhetorical question."], explain: "It is asked to persuade, not for an answer." },
      { type: "mcq", q: "A report about a mine only interviews the mine owner. What is the problem?", options: ["It is biased", "It is too long", "It uses statistics", "Nothing"], answer: 0, hints: ["Whose views are missing?", "Workers, community, environment.", "It is one-sided."], explain: "Only one side is shown, so it is biased." },
      { type: "sort", q: "Fact or opinion?", items: ["Water boils at 100 °C at sea level", "Winter is the worst season", "Cape Town is in the Western Cape", "Maths is boring"], bins: ["Fact", "Opinion"], answer: [0, 1, 0, 1], hints: ["Can it be checked?", "Worst and boring are feelings.", "The others can be proven."], explain: "Boiling point and location are facts. Worst and boring are opinions." }
    ],
    reflect: { q: "Which technique will you watch for?", options: ["Emotive language", "Bandwagon", "Statistics", "Bias"] },
    parent: "Your child learned to spot persuasive techniques, tell fact from opinion and recognise bias.",
    teacher: "Shows identifying persuasive techniques, distinguishing fact from opinion and recognising bias.",
    done: "Question persuasive texts: check the facts and look for bias." },

  // ===================== GRADE 8 NATURAL SCIENCES =====================
  { id: "g8-photosynthesis", grade: 8, subject: "Natural Sciences", title: "Photosynthesis and respiration", topic: "How plants and animals use energy", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 8 Natural Sciences, Term 1 Life and Living: Photosynthesis and respiration (word equations; the role of light, carbon dioxide, water, glucose and oxygen)",
    intention: "Today I am comparing photosynthesis and respiration.", prompt: "Why do animals depend on plants?",
    lesson: [
      { h: "Photosynthesis", say: "Plants make food by photosynthesis. Carbon dioxide plus water, with light energy, makes glucose and oxygen.", html: chainRow(["carbon dioxide + water", "→ light →", "glucose + oxygen"]) + P("It happens in <b>chloroplasts</b>, which contain green <b>chlorophyll</b>.") },
      { h: "Respiration", say: "All living things release energy from food by respiration. Glucose plus oxygen makes carbon dioxide, water and energy.", html: chainRow(["glucose + oxygen", "→", "carbon dioxide + water + energy"]) + P("Respiration happens in <b>every</b> living cell, day and night.") },
      { h: "A cycle", say: "Photosynthesis and respiration are opposites. Plants give out oxygen that animals breathe in. Animals give out carbon dioxide that plants use.", html: PICS("🌿 ⇄ 🐄", "Plants and animals exchange gases") + P("They keep oxygen and carbon dioxide in <b>balance</b>.") }
    ],
    example: { q: "Do plants respire at night?", steps: ["Respiration happens in all living cells.", "It does not need light.", "Yes, plants respire day and night. They only photosynthesise in light."] },
    questions: [
      { type: "mcq", q: "What do plants need for photosynthesis?", options: ["Carbon dioxide, water and light", "Oxygen and glucose", "Soil and darkness", "Only water"], answer: 0, hints: ["Look at the left side of the equation.", "Plus an energy source.", "CO₂, water and light."], explain: "Carbon dioxide, water and light energy." },
      { type: "mcq", q: "What gas do plants release during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Methane"], answer: 0, hints: ["The gas we breathe in.", "Look at the products.", "Oxygen."], explain: "Plants release oxygen." },
      { type: "mcq", q: "What is the purpose of respiration?", options: ["To release energy from food", "To make food", "To make oxygen", "To grow roots"], answer: 0, hints: ["What do cells need to work?", "Energy.", "Release energy."], explain: "Respiration releases energy from glucose." },
      { type: "mcq", q: "Where in the plant cell does photosynthesis happen?", options: ["Chloroplasts", "The cell wall", "The vacuole", "The roots only"], answer: 0, hints: ["They contain chlorophyll.", "They are green.", "Chloroplasts."], explain: "Photosynthesis happens in chloroplasts." },
      { type: "sort", q: "Which process uses each?", items: ["Light energy", "Releases energy", "Makes glucose", "Uses glucose"], bins: ["Photosynthesis", "Respiration"], answer: [0, 1, 0, 1], hints: ["Photosynthesis makes food using light.", "Respiration breaks food down.", "Match each."], explain: "Photosynthesis uses light and makes glucose. Respiration uses glucose and releases energy." }
    ],
    reflect: { q: "What helped you most?", options: ["The word equations", "Seeing them as opposites", "Thinking of a real plant", "Not sure"] },
    parent: "Your child compared photosynthesis and respiration using word equations.",
    teacher: "Shows writing word equations for photosynthesis and respiration and explaining their interdependence.",
    done: "Plants make food by photosynthesis. All living things release energy by respiration." },

  { id: "g8-atoms", grade: 8, subject: "Natural Sciences", title: "Atoms, elements and compounds", topic: "The particle model of matter", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 8 Natural Sciences, Term 2 Matter and Materials: Atoms (structure of the atom; elements and the Periodic Table; compounds; the particle model)",
    intention: "Today I am learning what atoms are and how they make elements and compounds.", prompt: "How can just over 100 elements make everything around us?",
    lesson: [
      { h: "The atom", say: "Everything is made of atoms. An atom has a nucleus with protons and neutrons, and electrons moving around it.", html: PICS("⚛️", "An atom") + chainRow(["Protons +", "Neutrons 0", "Electrons −"]) + P("Atoms are far too small to see, even with an ordinary microscope.") },
      { h: "Elements", say: "An element is made of only one kind of atom. Oxygen, iron and carbon are elements. They are listed on the Periodic Table with symbols, like O, Fe and C.", html: chainRow(["O oxygen", "Fe iron", "C carbon", "Na sodium"]) + P("There are 118 known <b>elements</b>.") },
      { h: "Compounds", say: "A compound forms when two or more elements join chemically. Water is H two O: two hydrogen atoms and one oxygen atom.", html: chainRow(["H₂O water", "CO₂ carbon dioxide", "NaCl table salt"]) + P("A <b>compound</b> has new properties, different from its elements.") }
    ],
    example: { q: "Is table salt, NaCl, an element or a compound?", steps: ["Look at the symbols: Na and Cl.", "There are two different elements, joined.", "It is a compound."] },
    questions: [
      { type: "mcq", q: "What is in the nucleus of an atom?", options: ["Protons and neutrons", "Only electrons", "Water", "Nothing"], answer: 0, hints: ["The centre of the atom.", "Electrons move around outside.", "Protons and neutrons."], explain: "The nucleus contains protons and neutrons." },
      { type: "mcq", q: "Which is an element?", options: ["Iron (Fe)", "Water (H₂O)", "Salt (NaCl)", "Carbon dioxide (CO₂)"], answer: 0, hints: ["One kind of atom.", "Only one symbol.", "Fe."], explain: "Iron is made of only iron atoms." },
      { type: "mcq", q: "How many atoms are in one molecule of H₂O?", options: ["3", "2", "1", "4"], answer: 0, hints: ["H₂ means two hydrogen.", "Plus one oxygen.", "2 + 1."], explain: "Two hydrogen atoms and one oxygen atom: 3." },
      { type: "mcq", q: "What charge does an electron have?", options: ["Negative", "Positive", "None", "It changes"], answer: 0, hints: ["Protons are positive.", "Neutrons are neutral.", "Negative."], explain: "Electrons have a negative charge." },
      { type: "sort", q: "Element or compound?", items: ["Oxygen (O₂)", "Carbon dioxide (CO₂)", "Gold (Au)", "Water (H₂O)"], bins: ["Element", "Compound"], answer: [0, 1, 0, 1], hints: ["How many different symbols?", "O₂ and Au have one kind.", "CO₂ and H₂O have two kinds."], explain: "O₂ and Au are elements. CO₂ and H₂O are compounds." }
    ],
    reflect: { q: "What helped you most?", options: ["Counting the symbols", "Picturing the atom", "Real examples like water", "Not sure"] },
    parent: "Your child learned about atoms and how elements combine to make compounds.",
    teacher: "Shows knowledge of subatomic particles, chemical symbols and distinguishing elements from compounds.",
    done: "Atoms make elements. Elements join to make compounds." },

  { id: "g8-circuits", grade: 8, subject: "Natural Sciences", title: "Electric circuits", topic: "Energy transfer in electrical systems", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 8 Natural Sciences, Term 3 Energy and Change: Energy transfer in electrical systems (components of circuits; series and parallel; effects of current; circuit diagrams)",
    intention: "Today I am learning how electric circuits work.", prompt: "Why are the lights in a house wired in parallel?",
    lesson: [
      { h: "A complete circuit", say: "Electricity only flows in a complete, closed loop. A circuit needs a source of energy, such as a cell, conductors such as wires, and a device such as a bulb.", html: chainRow(["Cell", "Wire", "Switch", "Bulb", "Wire"]) + P("Open the <b>switch</b> and the loop is broken.") },
      { h: "Series circuits", say: "In a series circuit, components are in one loop. If one bulb breaks, all the bulbs go out. More bulbs in series make each bulb dimmer.", html: PICS("🔋 → 💡 → 💡 ↩", "Series") + P("<b>Series</b>: one path.") },
      { h: "Parallel circuits", say: "In a parallel circuit, each component has its own branch. If one bulb breaks, the others stay on.", html: PICS("🔋 ⇉ 💡 💡", "Parallel") + P("<b>Parallel</b>: several paths. Houses are wired in parallel.") }
    ],
    example: { q: "Two bulbs are in series. One blows. What happens?", steps: ["Series has only one path.", "A blown bulb breaks the loop.", "Both bulbs go out."] },
    questions: [
      { type: "mcq", q: "What does a switch do?", options: ["Opens or closes the circuit", "Stores energy", "Makes light", "Measures current"], answer: 0, hints: ["It breaks or completes the loop.", "On and off.", "Opens or closes."], explain: "A switch opens or closes the circuit." },
      { type: "mcq", q: "Which material is a good conductor?", options: ["Copper", "Plastic", "Rubber", "Wood"], answer: 0, hints: ["Wires are made of it.", "It is a metal.", "Copper."], explain: "Copper conducts electricity well." },
      { type: "mcq", q: "In a parallel circuit, one bulb blows. What happens to the others?", options: ["They stay on", "They all go out", "They get dimmer", "They explode"], answer: 0, hints: ["Each bulb has its own path.", "The other paths are still complete.", "They stay on."], explain: "Other branches remain complete, so the bulbs stay on." },
      { type: "mcq", q: "What happens when you add more bulbs in series?", options: ["Each bulb gets dimmer", "Each bulb gets brighter", "Nothing changes", "The cell lasts forever"], answer: 0, hints: ["The energy is shared along one path.", "More resistance.", "Dimmer."], explain: "Bulbs in series share the energy, so each is dimmer." },
      { type: "mcq", q: "Why is it dangerous to touch a plug with wet hands?", options: ["Water conducts electricity", "Water is cold", "Plugs are sharp", "It is not dangerous"], answer: 0, hints: ["Impure water carries current.", "Current could pass through you.", "Water conducts."], explain: "Water can conduct electricity through your body." }
    ],
    reflect: { q: "What helped you most?", options: ["Picturing the loop", "Comparing series and parallel", "Thinking of my house", "Not sure"] },
    parent: "Your child learned about complete circuits, series and parallel circuits, and electrical safety.",
    teacher: "Shows understanding of circuit components, comparing series and parallel circuits, conductors and safety.",
    done: "Electricity needs a complete circuit. Parallel circuits keep other branches working." },

  // ===================== GRADE 8 LIFE ORIENTATION =====================
  { id: "g8-careers", grade: 8, subject: "Life Orientation", title: "Career fields", topic: "World of work", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade 8 Life Orientation: World of work (career fields; interests and abilities; subject choices for Grade 10; sources of career information)",
    intention: "Today I am matching my interests to career fields.", prompt: "Which career field fits you, and why?",
    lesson: [
      { h: "Career fields", say: "Careers can be grouped into fields, such as health, engineering and building, business, arts and design, agriculture, education and information technology.", html: chainRow(["Health", "Engineering", "Business", "Arts", "Agriculture", "IT"]) + P("Each field has jobs at <b>different levels</b> of study.") },
      { h: "Interests and abilities", say: "Think about what you enjoy and what you are good at. Do you like working with people, with your hands, with ideas or with data?", html: chainRow(["People", "Things", "Ideas", "Data"]) + P("Match <b>interests</b> and <b>abilities</b> to fields.") },
      { h: "Paths to a career", say: "There are many paths: university, a TVET college, a learnership or apprenticeship, or starting a business. Grade 9 subject choices can open or close some paths, so find out early.", html: chainRow(["University", "TVET college", "Learnership", "Own business"]) + P("Ask: what <b>subjects</b> does this career need?") }
    ],
    example: { q: "Ayanda loves fixing bikes and is good at Technology. Which field could suit her?", steps: ["She likes working with her hands and things.", "She is strong in Technology.", "Engineering and building, such as a mechanic or technician, could suit her."] },
    questions: [
      { type: "mcq", q: "Which career is in the health field?", options: ["Nurse", "Accountant", "Electrician", "Graphic designer"], answer: 0, hints: ["Who looks after sick people?", "Hospitals and clinics.", "Nurse."], explain: "Nursing is in the health field." },
      { type: "mcq", q: "Someone who loves organising data and numbers might enjoy …", options: ["Accounting or data analysis", "Acting", "Farming only", "Hairdressing"], answer: 0, hints: ["Data and numbers.", "Business or IT.", "Accounting or data analysis."], explain: "Accounting and data analysis work with numbers and data." },
      { type: "mcq", q: "Which is a path to a trade like plumbing?", options: ["TVET college or apprenticeship", "Only university", "No training needed", "A modelling agency"], answer: 0, hints: ["Trades are learned hands-on.", "Colleges and workplaces train people.", "TVET or apprenticeship."], explain: "Trades are usually learned at TVET colleges and through apprenticeships." },
      { type: "mcq", q: "Why are Grade 9 subject choices important?", options: ["They can open or close some career paths", "They are not important", "They only affect sport", "They decide your friends"], answer: 0, hints: ["Some careers need certain subjects.", "For example, engineering needs Mathematics.", "They affect paths."], explain: "Some careers need specific Grade 10 to 12 subjects." },
      { type: "sort", q: "Match interest to field.", items: ["Caring for the sick", "Designing logos", "Treating patients' teeth", "Painting murals"], bins: ["Health", "Arts and design"], answer: [0, 1, 0, 1], hints: ["Health is about the body.", "Arts is about creating.", "Match each."], explain: "Caring for the sick and dentistry are health. Logos and murals are arts and design." }
    ],
    reflect: { q: "Which way of working do you enjoy most?", options: ["With people", "With my hands", "With ideas", "With data"] },
    parent: "Your child explored career fields and how interests and subject choices link to careers. Talk together about what they enjoy.",
    teacher: "Shows knowledge of career fields, matching interests and abilities, and awareness of study pathways.",
    done: "Match your interests and abilities to career fields, and check which subjects you need." },

  { id: "g8-decisions", grade: 8, subject: "Life Orientation", title: "Making safe decisions", topic: "Risky situations and decision-making", domain: "Creativity and Metacognition", category: "Problem Solving",
    caps: "CAPS Grade 8 Life Orientation: Health, social and environmental responsibility (risky behaviour and situations; decision-making steps; where to get help)",
    intention: "Today I am using steps to make safe decisions.", prompt: "Who could you go to for help with a hard decision?",
    lesson: [
      { h: "Spotting risk", say: "A risky situation could lead to harm: being alone with someone you do not trust, getting into a car with a driver who has been drinking, or meeting an online stranger.", html: PICS("⚠️", "Warning") + P("Trust your <b>gut feeling</b>. If something feels wrong, it may be.") },
      { h: "Decision steps", say: "Use these steps. Stop. Think about the choices. Think about the consequences for you and others. Choose the safest option. Then reflect.", html: chainRow(["Stop", "Options", "Consequences", "Choose", "Reflect"]) + P("Taking a <b>moment</b> helps you avoid pressure.") },
      { h: "Getting help", say: "You do not have to decide alone. Talk to a trusted adult, a teacher or a counsellor. Childline South Africa is free on 116.", html: chainRow(["Trusted adult", "Teacher", "Counsellor", "Childline 116"]) + P("Asking for help is a <b>strength</b>.") }
    ],
    example: { q: "After a party, a friend's older brother offers Sizwe a lift, but he has been drinking. What should Sizwe do?", steps: ["Stop: this is risky.", "Options: accept, phone a parent, or get a lift with a sober adult.", "Choose: phone a parent or another trusted adult. His safety comes first."] },
    questions: [
      { type: "mcq", q: "What is the first step in making a safe decision?", options: ["Stop and think", "Do what friends do", "Decide quickly", "Ignore it"], answer: 0, hints: ["Slow down first.", "Before choosing.", "Stop."], explain: "Stopping gives you time to think." },
      { type: "mcq", q: "Someone you met online asks to meet you alone. What is safest?", options: ["Tell a trusted adult and do not go alone", "Go alone", "Keep it secret", "Send your address"], answer: 0, hints: ["You do not really know this person.", "Secrets keep you unsafe.", "Tell an adult."], explain: "Tell a trusted adult. Never meet an online stranger alone." },
      { type: "mcq", q: "What is the free number for Childline South Africa?", options: ["116", "10111", "112", "911"], answer: 0, hints: ["It is short.", "Three digits.", "116."], explain: "Childline South Africa is 116, free." },
      { type: "mcq", q: "Why think about consequences?", options: ["To see how a choice affects you and others", "To waste time", "To blame others", "It does not matter"], answer: 0, hints: ["What could happen next?", "To you and to others.", "To see the effects."], explain: "Consequences show how a choice affects you and others." },
      { type: "order", q: "Put the decision steps in order.", items: ["Stop", "List options", "Think about consequences", "Choose", "Reflect"], orderLabel: "first to last", hints: ["Stop first.", "Then think of choices and their results.", "Reflect last."], explain: "Stop, options, consequences, choose, reflect." }
    ],
    reflect: { q: "Which step is hardest for you?", options: ["Stopping", "Thinking of options", "Saying no to friends", "Asking for help"] },
    parent: "Your child practised decision-making steps and learned where to get help, including Childline on 116.",
    teacher: "Shows recognising risky situations, applying a decision-making model and identifying support services.",
    done: "Stop, think, choose the safest option, and ask for help." },

  { id: "g8-diversity", grade: 8, subject: "Life Orientation", title: "Diversity and prejudice", topic: "Social responsibility", domain: "Creativity and Metacognition", category: "Reflection",
    caps: "CAPS Grade 8 Life Orientation: Constitutional rights and responsibilities; Social and environmental responsibility (cultural diversity; stereotyping, prejudice and discrimination; respect)",
    intention: "Today I am learning how stereotypes and prejudice affect people.", prompt: "How can you include someone who is different from you?",
    lesson: [
      { h: "Diversity", say: "South Africa has 12 official languages and many cultures and beliefs. Diversity means a mix of different people. It makes communities richer.", html: PICS("🌍 🤝", "Many people") + P("South Africa is often called the <b>Rainbow Nation</b>.") },
      { h: "Stereotypes and prejudice", say: "A stereotype is a fixed idea about a whole group, like saying all boys are bad at cooking. Prejudice is judging someone before you know them.", html: chainRow(["Stereotype: a fixed idea", "Prejudice: judging early", "Discrimination: unfair treatment"]) + P("Stereotypes ignore that every person is <b>an individual</b>.") },
      { h: "Standing up", say: "You can challenge a stereotype by asking, is that true for everyone? You can include people, and report unfair treatment.", html: chainRow(["Question it", "Include others", "Report it"]) + P("The Constitution protects everyone from <b>unfair discrimination</b>.") }
    ],
    example: { q: "A classmate says: Girls can't be engineers. How could you respond?", steps: ["Notice it is a stereotype about a whole group.", "Ask: is that true for every girl?", "Share an example: many South African women are engineers."] },
    questions: [
      { type: "mcq", q: "How many official languages does South Africa have?", options: ["12", "11", "9", "2"], answer: 0, hints: ["South African Sign Language became official in 2023.", "Before that there were 11.", "12."], explain: "South Africa has 12 official languages, including South African Sign Language." },
      { type: "mcq", q: "Which is a stereotype?", options: ["All old people are bad with phones", "My gogo likes gardening", "Thabo plays soccer", "Some people speak isiZulu"], answer: 0, hints: ["A fixed idea about a whole group.", "All …", "The first one."], explain: "It judges a whole group." },
      { type: "mcq", q: "What is discrimination?", options: ["Treating someone unfairly because of their group", "Being kind to everyone", "Having an opinion", "Speaking two languages"], answer: 0, hints: ["It is an action.", "Unfair treatment.", "The first one."], explain: "Discrimination is unfair treatment because of who someone is." },
      { type: "mcq", q: "Which is a good way to challenge a stereotype?", options: ["Ask if it is true for everyone", "Laugh along", "Repeat it", "Ignore the person it hurts"], answer: 0, hints: ["Make people think.", "Question it.", "Ask if it is true for everyone."], explain: "Questioning it helps people think again." },
      { type: "sort", q: "Inclusive or exclusive?", items: ["Inviting a new learner to sit with you", "Mocking someone's accent", "Learning a greeting in a classmate's language", "Leaving someone out because of their religion"], bins: ["Inclusive", "Exclusive"], answer: [0, 1, 0, 1], hints: ["Which ones welcome people?", "Inviting and learning greetings include.", "Mocking and leaving out exclude."], explain: "Inviting and learning a greeting are inclusive." }
    ],
    reflect: { q: "What will you do?", options: ["Question stereotypes", "Include others", "Learn about other cultures", "Report unfair treatment"] },
    parent: "Your child explored diversity, stereotypes, prejudice and ways to be inclusive.",
    teacher: "Shows distinguishing stereotype, prejudice and discrimination, and strategies to challenge them.",
    done: "Every person is an individual. Question stereotypes and include others." }
];
const WORDS_G8 = {
  "g8-algebra": { words: [["🧩", "Like terms", "terms with the same letter and exponent"], ["📦", "Expand", "multiply out the brackets"]] },
  "g8-pythagoras": { words: [["📐", "Hypotenuse", "the longest side, opposite the right angle"], ["⊾", "Right angle", "a 90 degree angle"]] },
  "g8-interest": { words: [["🏦", "Principal", "the amount you start with"], ["📈", "Compound interest", "interest on the amount plus earlier interest"], ["🧾", "VAT", "a 15% tax added to most goods"]] },
  "g8-poetry": { words: [["🖼️", "Imagery", "words that appeal to the senses"], ["🎭", "Tone", "the writer's attitude"], ["🌤️", "Mood", "the feeling the reader gets"], ["🍩", "Vetkoek", "fried dough bread"]] },
  "g8-voice": { words: [["🏃", "Active voice", "the subject does the action"], ["🎯", "Passive voice", "the action is done to the subject"]] },
  "g8-persuasive": { words: [["❤️", "Emotive", "making you feel strongly"], ["🚌", "Bandwagon", "everyone is doing it, so you should too"], ["⚖️", "Bias", "showing only one side"]] },
  "g8-photosynthesis": { words: [["☀️", "Photosynthesis", "how plants make food using light"], ["🔥", "Respiration", "releasing energy from food"], ["🍃", "Chloroplast", "the part of a plant cell where photosynthesis happens"]] },
  "g8-atoms": { words: [["⚛️", "Atom", "the smallest unit of an element"], ["🧱", "Element", "made of one kind of atom"], ["🔗", "Compound", "two or more elements joined chemically"]] },
  "g8-circuits": { words: [["🔁", "Circuit", "a complete path for electricity"], ["➡️", "Series", "one path"], ["⇉", "Parallel", "several paths"]] },
  "g8-careers": { words: [["🗂️", "Career field", "a group of related jobs"], ["🛠️", "Apprenticeship", "learning a trade while working"]] },
  "g8-decisions": { words: [["⚠️", "Risk", "the chance of harm"], ["🔮", "Consequence", "what happens because of a choice"]] },
  "g8-diversity": { words: [["🏷️", "Stereotype", "a fixed idea about a whole group"], ["🚫", "Prejudice", "judging someone before you know them"], ["⚖️", "Discrimination", "unfair treatment"]] }
};
Object.assign(WORDS, WORDS_G8);
