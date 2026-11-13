"use strict";

// ---------- IB Middle Years Programme lessons for the new app only. Original content. ----------
// Grade 9 = MYP year 4, Grade 10 = MYP year 5. Each lesson opens with a statement of inquiry, key concept and global context.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const IB = { curriculum: "IB" };
  const MA = { ...IB, subject: "Mathematics", domain: "Logical and Analytical Thinking" };
  const LL = { ...IB, subject: "Language and Literature", domain: "Communication and Expression" };
  const SC = { ...IB, subject: "Sciences", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" };
  const SOI = (statement, concept, context) => ({ h: "Statement of inquiry", say: `Statement of inquiry: ${statement} Key concept: ${concept}. Global context: ${context}.`,
    html: P(`<b>Statement of inquiry:</b> ${statement}`) + P(`Key concept: <b>${concept}</b> · Global context: <b>${context}</b>`) });
  const READ = html => ({ h: "Read the text", say: "Read the text, or press Read aloud to hear it part by part.", html });
  const VIEW = `<div class="passage-text"><p><b>Version 1</b></p>
<p>I hate Saturdays at the stall. Ma says smile, so I smile, but my feet ache and every customer wants change for a R200 note. When Thabo from school walks past, I duck behind the tomatoes.</p>
<p><b>Version 2</b></p>
<p>Every Saturday, Naledi helped her mother at the vegetable stall. She smiled at the customers and counted their change carefully. When a boy from her class walked past, she suddenly became very interested in the tomatoes.</p></div>`;
  const AD = `<div class="passage-text"><p><b>FRESHA bottled water</b> <span class="muted">(a made-up advert)</span></p>
<p><b>Pure. Natural. You.</b></p>
<p>Drawn from ancient mountain springs, FRESHA is the choice of champions. 9 out of 10 athletes we asked prefer it. Why settle for ordinary when you could be extraordinary?</p>
<p><i>Now in new 100% recycled bottles.*</i></p>
<p class="muted">*Cap and label not included.</p></div>`;
  const PASS = `<div class="passage-text"><p><b>Pass</b> <span class="muted">(a 2to.iQ poem, set in 1970s South Africa)</span></p>
<p>My father kept a small brown book<br>closer than his wallet, closer than his name.<br>Each morning he touched his pocket twice,<br>the way you check a wound.</p>
<p>Today I carry nothing but my phone,<br>and walk wherever the road allows.<br>Some mornings I still touch my pocket twice,<br>and do not know whose habit that is.</p></div>`;
  const SPEECH = `<div class="passage-text"><p><b>From a learner's speech to the school governing body</b> <span class="muted">(a 2to.iQ text)</span></p>
<p>I have been a learner here for nine years, and I have served on the learner council for three. Last winter, 140 of our learners walked more than five kilometres to school, in the dark. One of them was my little sister. She told me she counts her steps so she won't feel afraid. A school bus would cost less per learner than the new sports scoreboard. Surely our learners' safety matters more than our scores.</p></div>`;

  PLATFORM_UNITS.push(
  // ===================== MYP YEAR 4 (GRADE 9) =====================
  { ...MA, id: "ib9-linear-models", grade: 9, title: "Linear models", topic: "Algebra: modelling", category: "Problem Solving",
    caps: "IB MYP Mathematics, year 4: Algebra (linear functions as models). Key concept: Relationships. Global context: Globalization and sustainability.",
    intention: "Today I am using straight-line equations to model real situations.", prompt: "How could you predict next month's water bill?",
    lesson: [
      SOI("Modelling relationships between quantities helps us make sustainable choices.", "Relationships", "Globalization and sustainability"),
      { h: "A linear model", say: "Many costs have a fixed part and a part that grows at a steady rate. A water bill of 50 dollars a month plus 2 dollars per kilolitre is C equals 2k plus 50.", html: P("C = 2k + 50: <b>2</b> is the rate, <b>50</b> is the fixed cost") },
      { h: "Questioning the model", say: "Use the model to predict, then ask whether it is realistic. Many cities charge more per kilolitre for heavy users, so a straight line may stop fitting.", html: P("Every model has <b>limits</b>.") }
    ],
    example: { q: "Using C = 2k + 50, what do 15 kilolitres cost?", steps: ["Substitute k = 15: C = 2(15) + 50.", "= 30 + 50.", "= $80."] },
    questions: [
      { type: "num", q: "Using C = 2k + 50, find the cost of 10 kL, in dollars.", answer: "70", options: ["70", "52", "120", "20"], hints: ["Substitute k = 10.", "2 × 10 + 50.", "20 + 50."], explain: "2 × 10 + 50 = $70." },
      { type: "mcq", q: "In C = 2k + 50, what does 50 represent?", options: ["The fixed monthly cost", "The cost per kilolitre", "The number of kilolitres", "The total bill"], answer: 0, hints: ["It doesn't depend on k.", "You pay it even with no water.", "Fixed cost."], explain: "50 is paid whatever you use: the fixed cost." },
      { type: "num", q: "A taxi charges $3 plus $1.50 per km. What does a 6 km trip cost, in dollars?", answer: "12", options: ["12", "9", "4.50", "18"], hints: ["1.50 × 6 = 9.", "Add the fixed $3.", "9 + 3."], explain: "1.50 × 6 + 3 = $12." },
      { type: "mcq", q: "A gym charges $20 to join and $15 per month. Which equation models the cost for m months?", options: ["C = 15m + 20", "C = 20m + 15", "C = 35m", "C = 15 + 20"], answer: 0, hints: ["The rate is per month.", "The joining fee is fixed.", "15m + 20."], explain: "Rate $15 per month, fixed $20: C = 15m + 20." },
      { type: "mcq", q: "A city charges more per kilolitre above 20 kL. What does this mean for the straight-line model?", options: ["It stops fitting above 20 kL", "It still fits perfectly", "The fixed cost disappears", "Water becomes free"], answer: 0, hints: ["The rate changes.", "A straight line has one rate.", "It stops fitting."], explain: "The rate changes above 20 kL, so one straight line no longer fits." }
    ],
    reflect: R("Finding the rate and the fixed part", "Substituting values", "Questioning the model"),
    parent: "Your child used straight-line equations to model costs, and judged where a model stops working.",
    teacher: "Criterion D (applying mathematics in real-life contexts): constructs and uses linear models, interprets parameters and evaluates a model's limits.",
    done: "Rate × amount + fixed cost. Then ask: is the model realistic?" },

  { ...MA, id: "ib9-similarity", grade: 9, title: "Similar shapes and scale", topic: "Geometry: similarity", category: "Pattern Thinking",
    caps: "IB MYP Mathematics, year 4: Geometry (similarity and scale factors). Key concept: Form. Global context: Personal and cultural expression.",
    intention: "Today I am using scale factors with similar shapes and models.", prompt: "How do architects show a building before it is built?",
    lesson: [
      SOI("The form of an object can be scaled while keeping its proportions. This lets artists and architects plan their work.", "Form", "Personal and cultural expression"),
      { h: "Similar shapes", say: "Two shapes are similar if one is an enlargement of the other. The angles are the same. Every length is multiplied by the same scale factor.", html: P("Scale factor = new length ÷ original length") },
      { h: "Scale models", say: "Architects build scale models. In a 1 to 50 model, every real length is 50 times the model length.", html: P("Model 1 : 50 → 4 cm on the model = 200 cm = <b>2 m</b> real") }
    ],
    example: { q: "A photo 10 cm wide is enlarged to 25 cm wide. It was 8 cm high. Find the new height.", steps: ["Scale factor = 25 ÷ 10 = 2.5.", "New height = 8 × 2.5.", "= 20 cm."] },
    questions: [
      { type: "num", q: "A rectangle 4 cm by 6 cm is enlarged by scale factor 3. How long is the 6 cm side now, in cm?", answer: "18", options: ["18", "9", "12", "24"], hints: ["Multiply by the scale factor.", "6 × 3.", "18."], explain: "6 × 3 = 18 cm." },
      { type: "num", q: "A 5 cm side becomes 15 cm. What is the scale factor?", answer: "3", options: ["3", "10", "1/3", "75"], hints: ["New ÷ original.", "15 ÷ 5.", "3."], explain: "15 ÷ 5 = 3." },
      { type: "mcq", q: "Two triangles are similar. Which must be true?", options: ["Their angles are equal", "Their sides are equal", "Their areas are equal", "They are both right-angled"], answer: 0, hints: ["Similar means the same shape.", "Sizes can differ.", "Angles stay the same."], explain: "Similar shapes have equal angles; lengths are in proportion." },
      { type: "num", q: "A model is 1 : 50. A wall is 6 cm long on the model. How long is it really, in metres?", answer: "3", options: ["3", "300", "0.12", "30"], hints: ["6 × 50 = 300 cm.", "100 cm = 1 m.", "300 ÷ 100."], explain: "300 cm = 3 m." },
      { type: "mcq", q: "A sculpture is enlarged by scale factor 2. What happens to its angles?", options: ["They stay the same", "They double", "They halve", "They become right angles"], answer: 0, hints: ["Enlarging changes size, not shape.", "Angles describe shape.", "They stay the same."], explain: "Angles don't change in an enlargement." }
    ],
    reflect: R("New ÷ original", "Thinking about real models", "Remembering angles stay the same"),
    parent: "Your child worked with similar shapes, scale factors and scale models.",
    teacher: "Criterion A (knowing and understanding): identifies similar figures and applies scale factors to lengths and models.",
    done: "Similar: the same angles, and lengths × the same scale factor." },

  { ...LL, id: "ib9-ll-perspective", grade: 9, title: "Point of view", topic: "Analysing narrative", category: "Flexible Thinking",
    caps: "IB MYP Language and Literature, year 4: Criterion A, Analysing (narrative point of view and its effect). Key concept: Perspective. Global context: Identities and relationships.",
    intention: "Today I am analysing how point of view changes a story.", prompt: "How would your day sound told by someone else?",
    passage: VIEW,
    lesson: [
      SOI("The perspective a writer chooses shapes how readers understand a character's identity.", "Perspective", "Identities and relationships"),
      READ(VIEW),
      { h: "First and third person", say: "Version 1 is in the first person: the narrator says I, and we hear her private thoughts. Version 2 is in the third person: the narrator says she, and we watch from outside.", html: chainRow(["First person: I, my", "Third person: she, he, they"]) },
      { h: "The effect of the choice", say: "First person feels close and honest: we know she hates Saturdays. Third person gives distance: we have to infer her feelings from what she does, such as hiding behind the tomatoes.", html: P("Ask: <b>what do we know, and how do we know it?</b>") }
    ],
    example: { q: "What does 'she suddenly became very interested in the tomatoes' suggest?", steps: ["She is not really interested in tomatoes.", "She is avoiding the boy from her class.", "The narrator hints at her embarrassment with gentle humour."] },
    questions: [
      { type: "mcq", q: "Which version is written in the first person?", options: ["Version 1", "Version 2", "Both", "Neither"], answer: 0, hints: ["Look for 'I'.", "'I hate Saturdays…'", "Version 1."], explain: "Version 1 uses 'I'." },
      { type: "mcq", q: "What do we learn directly in Version 1 that we must infer in Version 2?", options: ["That she dislikes working at the stall", "That she works on Saturdays", "That a boy walks past", "That she sells vegetables"], answer: 0, hints: ["Which feeling is stated in Version 1?", "'I hate Saturdays.'", "Her dislike."], explain: "Version 1 states her dislike; Version 2 never does." },
      { type: "mcq", q: "Why might a writer choose the first person?", options: ["To let readers share the character's private thoughts", "To give an outside view", "To describe many characters equally", "To avoid feelings"], answer: 0, hints: ["Whose voice do we hear?", "The character's own.", "Private thoughts."], explain: "First person lets us inside the narrator's head." },
      { type: "mcq", q: "What is the effect of 'I duck behind the tomatoes'?", options: ["It shows her embarrassment directly, with humour", "It shows she is hungry", "It describes the weather", "It shows she is proud"], answer: 0, hints: ["Why would she hide?", "Someone from school is there.", "Embarrassment."], explain: "Hiding shows her embarrassment in a funny, honest way." },
      { type: "mcq", q: "Which pronoun shows third-person narration?", options: ["She", "I", "My", "We"], answer: 0, hints: ["Third person is outside the character.", "Not I or we.", "She."], explain: "'She' shows third person." }
    ],
    reflect: R("Comparing the two versions", "Asking how we know", "Looking at pronouns"),
    parent: "Your child analysed how telling a story as 'I' or 'she' changes what readers know.",
    teacher: "Criterion A: analyses how narrative point of view shapes characterisation and the reader's response.",
    done: "Point of view decides what we know and how close we feel." },

  { ...LL, id: "ib9-ll-advert", grade: 9, title: "Analysing an advertisement", topic: "Analysing media texts", category: "Reflection",
    caps: "IB MYP Language and Literature, year 4: Criterion A, Analysing (persuasive techniques and audience in media texts). Key concept: Communication. Global context: Globalization and sustainability.",
    intention: "Today I am analysing how an advert persuades, and questioning its claims.", prompt: "Which advert have you seen that you didn't believe?",
    passage: AD,
    lesson: [
      SOI("Advertisers communicate with carefully chosen audiences, and critical readers question the claims they make.", "Communication", "Globalization and sustainability"),
      READ(AD),
      { h: "Techniques", say: "Adverts use many techniques. They use short slogans, statistics and rhetorical questions. They appeal to who the reader is, or link the product with nature or success.", html: chainRow(["Slogan", "Statistic", "Rhetorical question", "Association"]) },
      { h: "Reading critically", say: "Ask who made the advert, who it is for, and what it leaves out. Small print often limits a big claim.", html: P("Check the <b>small print</b> and the <b>sample</b>.") }
    ],
    example: { q: "Analyse '9 out of 10 athletes we asked prefer it'.", steps: ["It is a statistic, which sounds scientific.", "'We asked' means the company chose whom to ask, and we don't know how many.", "It persuades by linking the water with athletes, but the evidence is weak."] },
    questions: [
      { type: "mcq", q: "Who is the target audience?", options: ["People who want to feel healthy and successful", "Young children", "Farmers buying equipment", "People who dislike water"], answer: 0, hints: ["Look at 'champions' and 'extraordinary'.", "Who wants to feel like that?", "Healthy, ambitious people."], explain: "The advert appeals to people who want health and success." },
      { type: "mcq", q: "'Why settle for ordinary when you could be extraordinary?' is…", options: ["a rhetorical question", "a statistic", "a fact", "small print"], answer: 0, hints: ["It is a question.", "It doesn't expect an answer.", "Rhetorical."], explain: "It is a question asked for effect." },
      { type: "mcq", q: "What does the small print reveal?", options: ["The 100% recycled claim isn't true of the whole bottle", "The water is free", "The athletes are famous", "The springs are new"], answer: 0, hints: ["Read the line with *.", "Cap and label not included.", "So not all of it is recycled."], explain: "The cap and label aren't recycled, so the claim is limited." },
      { type: "mcq", q: "Why is '9 out of 10 athletes we asked' weak evidence?", options: ["We don't know how many were asked or how they were chosen", "Athletes don't drink water", "Statistics are always lies", "It is too long"], answer: 0, hints: ["Who chose the athletes?", "How many?", "We don't know."], explain: "The sample size and selection are unknown." },
      { type: "mcq", q: "'Pure. Natural. You.' links the product with…", options: ["the reader's identity", "a price", "a competitor", "a recipe"], answer: 0, hints: ["The last word is 'You'.", "It talks about the reader.", "Identity."], explain: "It suggests the water is part of who you are." }
    ],
    reflect: R("Naming the techniques", "Reading the small print", "Asking who the advert is for"),
    parent: "Your child analysed how an advert persuades and questioned its claims.",
    teacher: "Criterion A: analyses persuasive techniques, audience and purpose, and evaluates the reliability of claims in media texts.",
    done: "Name the technique, find the audience, and question the claim." },

  { ...SC, id: "ib9-sci-fair-test", grade: 9, title: "Designing a fair test", topic: "Inquiring and designing",
    caps: "IB MYP Sciences, year 4: Criterion B, Inquiring and designing (hypotheses, variables and fair testing). Key concept: Relationships. Global context: Scientific and technical innovation.",
    intention: "Today I am planning a fair scientific investigation.", prompt: "How could you test which washing powder works best?",
    lesson: [
      SOI("Scientists test relationships between variables by changing one thing at a time.", "Relationships", "Scientific and technical innovation"),
      { h: "Variables", say: "The independent variable is what you change. The dependent variable is what you measure. Control variables are kept the same, so the test is fair.", html: chainRow(["Change: independent", "Measure: dependent", "Keep the same: controls"]) },
      { h: "Hypothesis", say: "A hypothesis predicts the relationship and gives a scientific reason. For example: if the water is warmer, then sugar will dissolve faster, because the particles move faster.", html: P("<b>If</b> … <b>then</b> … <b>because</b> …") },
      { h: "Reliable results", say: "Repeat each trial at least three times and calculate a mean, so one odd result doesn't mislead you.", html: P("Repeat, then find the <b>mean</b>.") }
    ],
    example: { q: "Plan: does the amount of light affect how tall bean plants grow?", steps: ["Independent: hours of light each day.", "Dependent: plant height after two weeks.", "Controls: the same water, soil, pot size and type of bean."] },
    questions: [
      { type: "mcq", q: "You test how ramp height affects a toy car's speed. What is the independent variable?", options: ["Ramp height", "Car speed", "The car's mass", "The floor surface"], answer: 0, hints: ["What do you change on purpose?", "The ramp.", "Its height."], explain: "You change the ramp height." },
      { type: "mcq", q: "In the same test, what is the dependent variable?", options: ["Car speed", "Ramp height", "The ramp's length", "The car's colour"], answer: 0, hints: ["What do you measure?", "How fast the car goes.", "Speed."], explain: "You measure the car's speed." },
      { type: "mcq", q: "Why must control variables stay the same?", options: ["So any change is caused only by the independent variable", "To make the test faster", "Because they are expensive", "So the results look bigger"], answer: 0, hints: ["Think about fairness.", "Only one thing should change.", "To know the cause."], explain: "Keeping controls the same means you know what caused the change." },
      { type: "mcq", q: "Which is the best hypothesis?", options: ["If the water is warmer, then the sugar will dissolve faster, because the particles move faster.", "Sugar dissolves.", "Warm water is nice.", "I think it will work."], answer: 0, hints: ["If … then … because.", "It needs a reason.", "The first one."], explain: "It predicts a relationship and gives a scientific reason." },
      { type: "mcq", q: "Why repeat each trial three times?", options: ["To spot odd results and make the data more reliable", "To use up materials", "Because three is lucky", "To change the variables"], answer: 0, hints: ["One result could be a mistake.", "Repeats show patterns.", "Reliability."], explain: "Repeats reveal odd results and make the mean more reliable." }
    ],
    reflect: R("Naming the three kinds of variable", "If, then, because", "Planning repeats"),
    parent: "Your child planned a fair investigation with a hypothesis and controlled variables.",
    teacher: "Criterion B: formulates testable hypotheses with scientific reasoning, identifies variables and designs a fair, repeatable method.",
    done: "Change one thing, measure one thing, keep the rest the same, and repeat." },

  { ...SC, id: "ib9-sci-ecosystems", grade: 9, title: "Energy in ecosystems", topic: "Biology: ecosystems",
    caps: "IB MYP Sciences, year 4: Biology (food chains and webs; energy transfer between trophic levels). Key concept: Systems. Global context: Globalization and sustainability.",
    intention: "Today I am tracing how energy flows through an ecosystem.", prompt: "What would happen if all the bees disappeared?",
    lesson: [
      SOI("Ecosystems are systems in which energy flows and matter cycles; human actions can upset their balance.", "Systems", "Globalization and sustainability"),
      { h: "Food chains", say: "A food chain shows what eats what. Energy flows from producers, such as grass, to consumers, such as a springbok and then a lion.", html: chainRow(["Grass (producer)", "Springbok", "Lion"]) },
      { h: "Energy is lost", say: "Only about 10 percent of the energy at one level passes to the next. The rest is used for living or lost as heat. That is why food chains are short.", html: P("1 000 kJ in grass → about 100 kJ in springbok → about 10 kJ in lion") },
      { h: "Upsetting the balance", say: "Removing one species affects others in the food web. If lions are removed, springbok numbers may grow and they may overgraze the grass.", html: P("Every link <b>matters</b>.") }
    ],
    example: { q: "Grass stores 5 000 kJ. Using the 10% rule, about how much reaches the springbok?", steps: ["About 10% passes to the next level.", "10% of 5 000 = 500.", "About 500 kJ reaches the springbok."] },
    questions: [
      { type: "mcq", q: "What is the producer in grass → springbok → lion?", options: ["Grass", "Springbok", "Lion", "The sun"], answer: 0, hints: ["Producers make their own food.", "Using sunlight.", "Grass."], explain: "Grass makes food by photosynthesis." },
      { type: "num", q: "A producer stores 2 000 kJ. Using the 10% rule, about how much passes to the primary consumer, in kJ?", answer: "200", options: ["200", "20", "1 800", "2 000"], hints: ["10% passes on.", "10% of 2 000.", "200."], explain: "10% of 2 000 = 200 kJ." },
      { type: "mcq", q: "Where does most of the energy at each level go?", options: ["It is used for living or lost as heat", "It is stored for ever", "It goes back to the sun", "It turns into soil"], answer: 0, hints: ["Animals move and keep warm.", "That uses energy.", "Lost as heat."], explain: "Most is used in life processes and lost as heat." },
      { type: "mcq", q: "Lions are removed from an area. What might happen first?", options: ["The springbok population increases", "The grass grows taller", "Nothing changes", "The sun gets hotter"], answer: 0, hints: ["Lions eat springbok.", "Fewer predators…", "…more springbok."], explain: "Without predators, springbok numbers rise." },
      { type: "mcq", q: "Why are food chains rarely longer than four or five levels?", options: ["Too little energy is left at the top", "Animals don't like long chains", "Producers stop growing", "There are no more animals"], answer: 0, hints: ["About 90% is lost at each step.", "Very little reaches the top.", "Too little energy."], explain: "So much energy is lost that little remains for higher levels." }
    ],
    reflect: R("Following the arrows", "The 10% rule", "Predicting changes"),
    parent: "Your child traced how energy flows through food chains, and what happens when the balance is upset.",
    teacher: "Criterion A: explains energy flow in ecosystems, applies the 10% rule and predicts the effects of disturbance in a food web.",
    done: "Energy flows up the chain, but about 90% is lost at each step." },

  // ===================== MYP YEAR 5 (GRADE 10) =====================
  { ...MA, id: "ib10-exponential", grade: 10, title: "Exponential growth and decay", topic: "Algebra: exponential models", category: "Pattern Thinking",
    caps: "IB MYP Mathematics, year 5 (extended): Algebra (exponential functions as models of growth and decay). Key concept: Change. Global context: Globalization and sustainability.",
    intention: "Today I am modelling growth and decay with exponential functions.", prompt: "Why do savings grow faster the longer you leave them?",
    lesson: [
      SOI("Exponential models describe change that speeds up or slows down. Examples are population growth and how medicines leave the body.", "Change", "Globalization and sustainability"),
      { h: "Growth by a percentage", say: "When something grows by the same percentage each period, multiply by the same factor each time. Growing 10 percent a year means multiplying by 1.1.", html: P("y = a × bⁿ, with b = 1.1 for 10% growth") },
      { h: "Decay", say: "When something decreases by a percentage, the factor is less than 1. Losing 20 percent each hour means multiplying by 0.8.", html: P("Decay: b = 1 − rate, for example <b>0.8</b>") },
      { h: "Linear or exponential?", say: "Linear change adds the same amount each time. Exponential change multiplies by the same factor each time, so it eventually grows much faster.", html: chainRow(["Linear: + the same amount", "Exponential: × the same factor"]) }
    ],
    example: { q: "A town of 10 000 people grows by 5% a year. Estimate its population after 2 years.", steps: ["Factor = 1.05.", "10 000 × 1.05² = 10 000 × 1.1025.", "= 11 025 people."] },
    questions: [
      { type: "mcq", q: "What factor represents 10% growth per year?", options: ["1.1", "0.1", "0.9", "10"], answer: 0, hints: ["Keep 100% and add 10%.", "110%.", "1.1."], explain: "100% + 10% = 110% = 1.1." },
      { type: "mcq", q: "What factor represents 20% decay per hour?", options: ["0.8", "1.2", "0.2", "20"], answer: 0, hints: ["You keep 80%.", "100% − 20%.", "0.8."], explain: "100% − 20% = 80% = 0.8." },
      { type: "num", q: "A 400 mg dose of medicine halves every 6 hours. How much is left after 12 hours, in mg?", answer: "100", options: ["100", "200", "0", "50"], hints: ["12 hours is two halvings.", "400 → 200 → …", "100."], explain: "400 → 200 → 100 mg." },
      { type: "num", q: "$1 000 grows by 10% a year. How much is there after 2 years, in dollars?", answer: "1 210", options: ["1 210", "1 200", "1 100", "1 020"], hints: ["Multiply by 1.1 twice.", "1 000 × 1.1 = 1 100.", "1 100 × 1.1."], explain: "1 000 × 1.1² = $1 210." },
      { type: "mcq", q: "Which sequence shows exponential growth?", options: ["2, 4, 8, 16", "2, 4, 6, 8", "2, 3, 4, 5", "16, 12, 8, 4"], answer: 0, hints: ["Look for multiplying.", "Each term × 2.", "2, 4, 8, 16."], explain: "Each term is multiplied by 2." }
    ],
    reflect: R("Finding the factor", "Comparing linear and exponential", "The medicine example"),
    parent: "Your child modelled things that grow or shrink by a percentage, such as savings and medicine doses.",
    teacher: "Criteria A and D: models growth and decay with exponential functions, distinguishes linear from exponential change and applies models in context.",
    done: "Exponential: multiply by the same factor. Above 1 grows, below 1 decays." },

  { ...MA, id: "ib10-trig-heights", grade: 10, title: "Measuring heights with trigonometry", topic: "Geometry and trigonometry", category: "Problem Solving",
    caps: "IB MYP Mathematics, year 5: Geometry and trigonometry (right-angled trigonometry; angles of elevation). Key concept: Relationships. Global context: Orientation in space and time.",
    intention: "Today I am using trigonometry to measure heights I can't reach.", prompt: "How could you find the height of your school without climbing it?",
    lesson: [
      SOI("Relationships between angles and lengths let us measure what we cannot reach.", "Relationships", "Orientation in space and time"),
      { h: "SOH CAH TOA", say: "In a right-angled triangle, sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, and tangent is opposite over adjacent.", html: chainRow(["sin = O/H", "cos = A/H", "tan = O/A"]) },
      { h: "Angle of elevation", say: "The angle of elevation is the angle you look up from the horizontal. If you know how far you are from a tree and the angle to its top, tangent gives the height.", html: P("height = distance × tan(angle)") },
      { h: "Adding eye height", say: "Your eyes are above the ground, so add your eye height to the answer.", html: P("Total height = distance × tan(angle) + eye height") }
    ],
    example: { q: "You stand 20 m from a building. The angle of elevation to the top is 45°, and your eyes are 1.5 m high. Find its height. (tan 45° = 1)", steps: ["Height above your eyes = 20 × tan 45° = 20 × 1 = 20 m.", "Add your eye height: 20 + 1.5.", "The building is 21.5 m tall."] },
    questions: [
      { type: "mcq", q: "Which ratio uses the opposite and adjacent sides?", options: ["tan", "sin", "cos", "None"], answer: 0, hints: ["TOA.", "Tangent = opposite ÷ adjacent.", "tan."], explain: "tan = opposite ÷ adjacent." },
      { type: "num", q: "You stand 10 m from a tree. The angle of elevation is 45° (tan 45° = 1). How tall is the tree above your eye level, in metres?", answer: "10", options: ["10", "45", "1", "20"], hints: ["height = distance × tan(angle).", "10 × 1.", "10."], explain: "10 × 1 = 10 m." },
      { type: "num", q: "Distance 30 m, angle of elevation with tan = 0.5, eye height 1.6 m. What is the total height, in metres?", answer: "16.6", options: ["16.6", "15", "31.6", "13.4"], hints: ["30 × 0.5 = 15.", "Add the eye height.", "15 + 1.6."], explain: "30 × 0.5 + 1.6 = 16.6 m." },
      { type: "mcq", q: "What is an angle of elevation?", options: ["The angle looking up from the horizontal", "The angle looking down", "The angle at the top of the object", "The angle of the ground"], answer: 0, hints: ["Elevation means height.", "You look up.", "From the horizontal."], explain: "It is measured up from the horizontal." },
      { type: "mcq", q: "In a right-angled triangle, the hypotenuse is…", options: ["the longest side, opposite the right angle", "the shortest side", "next to the angle you are using", "always vertical"], answer: 0, hints: ["Find the right angle.", "Look across from it.", "The longest side."], explain: "The hypotenuse is opposite the right angle and is the longest side." }
    ],
    reflect: R("SOH CAH TOA", "Drawing the triangle", "Adding eye height"),
    parent: "Your child used trigonometry to measure heights without climbing.",
    teacher: "Criteria A and D: applies right-angled trigonometry and angles of elevation to indirect measurement, including adjusting for eye height.",
    done: "height = distance × tan(angle), plus your eye height." },

  { ...MA, id: "ib10-compare-data", grade: 10, title: "Is it fair? Comparing data", topic: "Statistics and probability", category: "Reflection",
    caps: "IB MYP Mathematics, year 5: Statistics and probability (comparing distributions; sampling and bias). Key concept: Relationships. Global context: Fairness and development.",
    intention: "Today I am comparing data sets fairly and checking for bias.", prompt: "How would you show that something at school is unfair?",
    lesson: [
      SOI("Comparing data sets fairly helps communities make decisions about fairness and development.", "Relationships", "Fairness and development"),
      { h: "Centre and spread", say: "To compare two groups, compare a measure of centre, such as the median. Also compare a measure of spread, such as the interquartile range.", html: chainRow(["Centre: median or mean", "Spread: range or IQR"]) },
      { h: "Sampling and bias", say: "A sample must represent the population. Asking only people at one shop, or only people online, can bias the results.", html: P("Ask: <b>who was left out?</b>") },
      { h: "Drawing conclusions", say: "Write conclusions that refer to the data, and say how certain you can be. Small samples give weaker conclusions.", html: P("'Based on this sample, it is likely that…'") }
    ],
    example: { q: "School A's median travel time is 35 minutes (IQR 20). School B's is 20 minutes (IQR 5). Compare them.", steps: ["School A's learners travel longer: a median of 35 against 20 minutes.", "School A's times are much more spread out: an IQR of 20 against 5.", "School A's learners travel further, and their journeys vary more."] },
    questions: [
      { type: "mcq", q: "Which pair compares both centre and spread?", options: ["Median and IQR", "Mean and median", "Range and IQR", "Mode and median"], answer: 0, hints: ["You need one of each.", "Median is centre.", "IQR is spread."], explain: "The median measures centre; the IQR measures spread." },
      { type: "mcq", q: "A survey about public transport asks only car owners. What is the problem?", options: ["The sample is biased", "The sample is too random", "There is no problem", "The questions are too short"], answer: 0, hints: ["Who uses public transport?", "They weren't asked.", "Bias."], explain: "Leaving out transport users biases the results." },
      { type: "num", q: "Group A: median 60, IQR 10. Group B: median 72, IQR 10. How much higher is B's median?", answer: "12", options: ["12", "10", "2", "132"], hints: ["Compare the medians.", "72 − 60.", "12."], explain: "72 − 60 = 12." },
      { type: "mcq", q: "Which conclusion is most appropriate from a sample of 20 learners?", options: ["'This sample suggests…, but a larger sample would be more reliable.'", "'This proves it for every school in the world.'", "'The data is useless.'", "'I was right all along.'"], answer: 0, hints: ["20 is a small sample.", "Be careful with claims.", "Suggests, not proves."], explain: "A small sample supports a tentative conclusion." },
      { type: "mcq", q: "Two groups have the same median, but Group A has a much larger IQR. What does this mean?", options: ["Group A's data is more spread out", "Group A is better", "Group B has more data", "Nothing"], answer: 0, hints: ["IQR measures spread.", "Larger IQR…", "…more spread."], explain: "A larger IQR means more variation in the middle half." }
    ],
    reflect: R("Comparing centre and spread", "Looking for bias", "Writing careful conclusions"),
    parent: "Your child compared sets of data fairly and checked surveys for bias.",
    teacher: "Criteria A and D: compares distributions using centre and spread, identifies sampling bias and draws justified, appropriately tentative conclusions.",
    done: "Compare centre and spread, check the sample, and say how sure you are." },

  { ...LL, id: "ib10-ll-context", grade: 10, title: "Text and context", topic: "Analysing poetry in context", category: "Reflection",
    caps: "IB MYP Language and Literature, year 5: Criterion A, Analysing (how context shapes the creation and reception of a text). Key concept: Connections. Global context: Orientation in space and time.",
    intention: "Today I am exploring how history shapes the meaning of a poem.", prompt: "What habits have you picked up from your family?",
    passage: PASS,
    lesson: [
      SOI("Texts connect to the times and places in which they are written and read. Knowing the context deepens our understanding.", "Connections", "Orientation in space and time"),
      READ(PASS),
      { h: "What context means", say: "Context is the time, place and situation of a text. Under apartheid, pass laws forced Black South Africans to carry a pass book. The police could arrest anyone found without one.", html: P("The 'small brown book' is a <b>pass book</b>.") },
      { h: "Then and now", say: "The poem connects two times. The father's fear lives on as a habit in the child, who is free to walk wherever the road allows.", html: chainRow(["Father: pass book, fear", "Child: freedom, an inherited habit"]) }
    ],
    example: { q: "Why does the father touch his pocket 'the way you check a wound'?", steps: ["You check a wound because it hurts and you worry about it.", "The pass book was a constant source of danger and pain.", "The simile shows that carrying the pass was a daily injury."] },
    questions: [
      { type: "mcq", q: "What is the 'small brown book'?", options: ["A pass book under apartheid", "A diary", "A school report", "A bank book"], answer: 0, hints: ["The poem is set in the 1970s.", "Think about the pass laws.", "A pass book."], explain: "It is the pass book Black South Africans were forced to carry." },
      { type: "mcq", q: "Why did the father keep it 'closer than his name'?", options: ["Without it he could be arrested", "It had his favourite poems", "It was valuable to sell", "He liked the colour"], answer: 0, hints: ["What happened to people without a pass?", "Police could arrest them.", "Arrest."], explain: "Being found without it could mean arrest." },
      { type: "mcq", q: "What does the child's habit of touching their pocket suggest?", options: ["The past still affects the present", "The child has lost their phone", "The child is cold", "Nothing important"], answer: 0, hints: ["Whose habit was it first?", "The father's.", "The past lives on."], explain: "The father's fear has been passed down as a habit." },
      { type: "mcq", q: "Which phrase contrasts most with the father's life?", options: ["'walk wherever the road allows'", "'small brown book'", "'touched his pocket twice'", "'closer than his wallet'"], answer: 0, hints: ["The father's movement was controlled.", "Which phrase shows freedom?", "Walking anywhere."], explain: "Freedom of movement contrasts with the pass laws." },
      { type: "mcq", q: "Why does knowing the context help readers?", options: ["It explains the book and the fear behind the habit", "It tells us the poet's age", "It makes the poem shorter", "It isn't useful"], answer: 0, hints: ["Without context, what is the book?", "Context explains it.", "And the fear."], explain: "Context reveals what the book is and why it was feared." }
    ],
    reflect: R("Learning the history", "Comparing the two stanzas", "Unpacking the simile"),
    parent: "Your child explored how South African history shapes the meaning of a poem.",
    teacher: "Criterion A: analyses how historical and cultural context shapes meaning, and explains connections between past and present in a text.",
    done: "Ask when and where a text comes from: context changes what it means." },

  { ...LL, id: "ib10-ll-rhetoric", grade: 10, title: "Rhetoric: ethos, pathos, logos", topic: "Analysing speeches", category: "Communication",
    caps: "IB MYP Language and Literature, year 5: Criteria A and D, Analysing and Using language (rhetorical appeals in speeches). Key concept: Communication. Global context: Fairness and development.",
    intention: "Today I am analysing how speakers persuade with ethos, pathos and logos.", prompt: "What would you ask your school to change, and how would you convince them?",
    passage: SPEECH,
    lesson: [
      SOI("Speakers use rhetorical appeals to persuade audiences to act for fairness.", "Communication", "Fairness and development"),
      READ(SPEECH),
      { h: "Three appeals", say: "Ethos builds trust in the speaker. Pathos appeals to emotion. Logos appeals to logic and evidence.", html: chainRow(["Ethos: trust", "Pathos: emotion", "Logos: logic"]) },
      { h: "Balance", say: "Strong speeches combine all three. Too much emotion can seem manipulative; too much data can feel cold.", html: P("Look for <b>all three</b> working together.") }
    ],
    example: { q: "Which appeal is 'I have served on the learner council for three years'?", steps: ["It tells us about the speaker.", "It shows experience and responsibility.", "It builds trust: ethos."] },
    questions: [
      { type: "mcq", q: "'She counts her steps so she won't feel afraid' is mainly…", options: ["pathos", "logos", "ethos", "none of these"], answer: 0, hints: ["How does it make you feel?", "It is about fear and a little sister.", "Emotion."], explain: "It appeals to the audience's emotions." },
      { type: "mcq", q: "'A school bus would cost less per learner than the new scoreboard' is mainly…", options: ["logos", "pathos", "ethos", "none of these"], answer: 0, hints: ["It compares costs.", "That is a reasoned argument.", "Logic."], explain: "It uses a logical cost comparison." },
      { type: "mcq", q: "'140 of our learners walked more than five kilometres' appeals to…", options: ["logic, using a statistic", "trust in the speaker", "humour", "fear of the audience"], answer: 0, hints: ["It is a number.", "Evidence.", "Logos."], explain: "A statistic is logical evidence." },
      { type: "mcq", q: "What is the purpose of the final sentence?", options: ["To appeal clearly to the audience's values", "To introduce the speaker", "To give a statistic", "To change the topic"], answer: 0, hints: ["'Surely…'", "It asks them to agree.", "Their values."], explain: "It challenges the audience to act on their values." },
      { type: "mcq", q: "Why might a speech that uses only pathos be weaker?", options: ["It can seem manipulative without evidence", "Emotions are not allowed", "It is always too short", "Audiences never feel emotions"], answer: 0, hints: ["Feelings without reasons…", "…may not convince.", "Manipulative."], explain: "Without evidence, emotion alone can seem manipulative." }
    ],
    reflect: R("Naming each appeal", "Finding examples in the speech", "Thinking about balance"),
    parent: "Your child analysed how a speaker persuades using trust, emotion and logic.",
    teacher: "Criteria A and D: identifies and evaluates rhetorical appeals and their combined effect on an audience.",
    done: "Ethos builds trust, pathos moves feelings, logos gives reasons." },

  { ...LL, id: "ib10-ll-essay", grade: 10, title: "Organising an analytical essay", topic: "Organising analysis", category: "Planning and Organisation",
    caps: "IB MYP Language and Literature, year 5: Criterion B, Organising (structuring an analytical response with a thesis and developed paragraphs). Key concept: Communication. Global context: Personal and cultural expression.",
    intention: "Today I am organising an analytical essay.", prompt: "What makes an essay easy to follow?",
    lesson: [
      SOI("Clear organisation helps writers communicate their interpretation persuasively.", "Communication", "Personal and cultural expression"),
      { h: "The thesis", say: "An analytical essay begins with a thesis: your interpretation of the text, which the essay will prove. It should be arguable, not just a fact.", html: P("<b>Fact:</b> The poem is about a pass book.") + P("<b>Thesis:</b> The poem shows how the trauma of the pass laws is inherited by the next generation.") },
      { h: "Analytical paragraphs", say: "Each paragraph makes a point about the text. It includes a short quotation and analyses the language. Then it links back to the thesis.", html: chainRow(["Point", "Quotation", "Analysis", "Link"]) },
      { h: "Linking and concluding", say: "Use transitions to guide the reader, such as furthermore, in contrast and as a result. End with a conclusion that shows why your thesis matters, not just a repeat.", html: P("Transitions: <b>furthermore</b>, <b>in contrast</b>, <b>as a result</b>") }
    ],
    example: { q: "Turn 'The father is scared' into an analytical sentence.", steps: ["Add evidence: he touches his pocket “the way you check a wound”.", "Analyse: the simile links the pass book to pain.", "“The simile ‘the way you check a wound’ suggests the pass book is a constant injury, not simply a document.”"] },
    questions: [
      { type: "mcq", q: "Which is an arguable thesis?", options: ["The poem shows how fear can outlive the law that caused it.", "The poem has two stanzas.", "The poem is about a book.", "Poems are interesting."], answer: 0, hints: ["A thesis is an interpretation.", "Someone could disagree with it.", "The first one."], explain: "It is an interpretation that needs proving." },
      { type: "mcq", q: "What comes after the quotation in an analytical paragraph?", options: ["Analysis of the language", "A new point", "The conclusion", "Another thesis"], answer: 0, hints: ["Point, quotation, …", "Explain the words.", "Analysis."], explain: "After the quotation, analyse its language." },
      { type: "mcq", q: "Which transition shows contrast?", options: ["In contrast", "Furthermore", "As a result", "Similarly"], answer: 0, hints: ["Contrast shows difference.", "Not adding or causing.", "In contrast."], explain: "'In contrast' signals a difference." },
      { type: "mcq", q: "What should a conclusion do?", options: ["Show why the thesis matters", "Introduce a new quotation", "Repeat the introduction word for word", "Apologise"], answer: 0, hints: ["Not just a repeat.", "So what?", "Significance."], explain: "A conclusion shows the significance of the argument." },
      { type: "mcq", q: "Why embed short quotations rather than long ones?", options: ["So the analysis focuses on precise words", "Long quotations are banned", "To fill space", "Short quotations don't need analysis"], answer: 0, hints: ["Analysis looks closely.", "At particular words.", "Precise."], explain: "Short quotations keep the focus on precise language." }
    ],
    reflect: R("Writing an arguable thesis", "Point, quotation, analysis, link", "Using transitions"),
    parent: "Your child practised organising an analytical essay with a clear thesis and paragraphs.",
    teacher: "Criterion B: organises an analytical response with an arguable thesis, structured paragraphs, embedded evidence and purposeful transitions.",
    done: "Arguable thesis, point-quote-analyse-link paragraphs, and a conclusion that matters." },

  { ...SC, id: "ib10-sci-rates", grade: 10, title: "Rates of reaction", topic: "Chemistry: reaction rates",
    caps: "IB MYP Sciences, year 5: Chemistry (factors affecting rate of reaction; collision theory). Key concept: Change. Global context: Scientific and technical innovation.",
    intention: "Today I am explaining what makes reactions faster or slower.", prompt: "Why do we keep food in the fridge?",
    lesson: [
      SOI("Understanding what changes the rate of reactions lets engineers make processes faster, safer and cleaner.", "Change", "Scientific and technical innovation"),
      { h: "Collision theory", say: "Particles react when they collide with enough energy. More frequent or more energetic collisions mean a faster reaction.", html: P("Faster rate = <b>more successful collisions</b> each second") },
      { h: "Factors", say: "Increasing temperature, concentration or surface area increases the rate. A catalyst speeds up a reaction without being used up.", html: chainRow(["Temperature", "Concentration", "Surface area", "Catalyst"]) },
      { h: "Measuring rate", say: "Rate can be measured by timing how much gas forms, or how quickly mass is lost.", html: P("rate = amount of change ÷ time") }
    ],
    example: { q: "Why does powdered chalk react faster with acid than a lump of chalk?", steps: ["Powder has a much larger surface area.", "More particles are exposed to the acid.", "More collisions each second, so a faster reaction."] },
    questions: [
      { type: "mcq", q: "According to collision theory, what must happen for particles to react?", options: ["They must collide with enough energy", "They must be cold", "They must be the same colour", "They must stop moving"], answer: 0, hints: ["Collision theory.", "They must hit each other…", "…hard enough."], explain: "Particles must collide with enough energy." },
      { type: "mcq", q: "What happens to the rate when temperature increases?", options: ["It increases", "It decreases", "It stays the same", "The reaction stops"], answer: 0, hints: ["Hotter particles move faster.", "More collisions.", "Faster."], explain: "Faster particles collide more often and with more energy." },
      { type: "mcq", q: "What does a catalyst do?", options: ["Speeds up a reaction without being used up", "Slows it down", "Becomes a product", "Raises the temperature"], answer: 0, hints: ["Enzymes are catalysts.", "Not used up.", "Speeds it up."], explain: "A catalyst speeds up a reaction and is not used up." },
      { type: "num", q: "A reaction produces 60 cm³ of gas in 30 s. What is the average rate, in cm³/s?", answer: "2", options: ["2", "90", "1800", "0.5"], hints: ["rate = amount ÷ time.", "60 ÷ 30.", "2."], explain: "60 ÷ 30 = 2 cm³/s." },
      { type: "mcq", q: "Why do kitchens chop vegetables into small pieces to cook them quickly?", options: ["Smaller pieces have more surface area", "Big pieces are heavier", "Chopping adds energy", "Vegetables need oxygen"], answer: 0, hints: ["Think of the chalk example.", "More surface exposed.", "Surface area."], explain: "Small pieces have more surface area, so heat reaches more of the food." }
    ],
    reflect: R("Picturing collisions", "Linking each factor to collisions", "Calculating rate"),
    parent: "Your child explained what makes chemical reactions faster or slower.",
    teacher: "Criteria A and B: explains rate using collision theory, predicts the effect of variables and calculates rate from data.",
    done: "More successful collisions each second means a faster reaction." },

  { ...SC, id: "ib10-sci-inheritance", grade: 10, title: "Inheritance", topic: "Biology: genetics",
    caps: "IB MYP Sciences, year 5: Biology (genes, alleles, dominant and recessive inheritance; Punnett squares). Key concept: Relationships. Global context: Identities and relationships.",
    intention: "Today I am predicting how traits are inherited.", prompt: "Which of your features came from your family?",
    lesson: [
      SOI("The relationships between genes and the traits they produce help explain both family resemblance and human variety.", "Relationships", "Identities and relationships"),
      { h: "Genes and alleles", say: "Genes are sections of DNA that code for traits. Different versions of a gene are called alleles. You inherit one allele from each parent.", html: chainRow(["DNA", "Gene", "Allele"]) },
      { h: "Dominant and recessive", say: "A dominant allele shows its effect even with only one copy. A recessive allele shows only if both copies are recessive. We write dominant alleles with a capital letter and recessive ones with a small letter.", html: P("Bb: the dominant trait shows · bb: the recessive trait shows") },
      { h: "Punnett squares", say: "A Punnett square shows the possible combinations from two parents. Two Bb parents give BB, Bb, Bb and bb: a 1 in 4 chance of the recessive trait.", html: P("Bb × Bb → BB, Bb, Bb, bb → <b>3 : 1</b>") }
    ],
    example: { q: "A Bb parent and a bb parent have a child. What is the chance the child shows the recessive trait?", steps: ["Bb gives B or b; bb gives only b.", "Combinations: Bb, Bb, bb, bb.", "2 out of 4 are bb: a 50% chance."] },
    questions: [
      { type: "mcq", q: "What is an allele?", options: ["A version of a gene", "A whole chromosome", "A type of cell", "A protein"], answer: 0, hints: ["Genes can come in versions.", "Each version is…", "…an allele."], explain: "An allele is a version of a gene." },
      { type: "mcq", q: "Which genotype shows the recessive trait?", options: ["bb", "Bb", "BB", "B"], answer: 0, hints: ["Recessive needs two copies.", "Two small letters.", "bb."], explain: "Only bb shows the recessive trait." },
      { type: "mcq", q: "How many alleles of each gene do you inherit from each parent?", options: ["One", "Two", "None", "Four"], answer: 0, hints: ["You have two in total.", "One from each parent.", "One."], explain: "One from each parent, two in total." },
      { type: "num", q: "Two Bb parents have a child. What is the percentage chance that the child is bb? (Type the number only.)", answer: "25", options: ["25", "50", "75", "0"], hints: ["BB, Bb, Bb, bb.", "1 out of 4.", "25%."], explain: "1 in 4 = 25%." },
      { type: "mcq", q: "BB × bb. What genotype will all the children have?", options: ["Bb", "BB", "bb", "A mix of all three"], answer: 0, hints: ["One parent can only give B.", "The other can only give b.", "Bb."], explain: "Every child gets B from one parent and b from the other." }
    ],
    reflect: R("Capital and small letters", "Drawing the Punnett square", "Turning results into percentages"),
    parent: "Your child predicted how traits are passed from parents to children.",
    teacher: "Criterion A: explains inheritance with genes and alleles, and uses Punnett squares to predict genotypes and probabilities.",
    done: "One allele from each parent. Dominant shows with one copy; recessive needs two." },

  { ...SC, id: "ib10-sci-newton", grade: 10, title: "Newton's laws of motion", topic: "Physics: forces",
    caps: "IB MYP Sciences, year 5: Physics (forces; Newton's three laws; F = ma). Key concept: Relationships. Global context: Orientation in space and time.",
    intention: "Today I am explaining motion with Newton's three laws.", prompt: "Why do you lurch forward when a taxi brakes?",
    lesson: [
      SOI("Relationships between force, mass and motion explain how everything moves, from minibus taxis to rockets.", "Relationships", "Orientation in space and time"),
      { h: "The first law", say: "An object stays still, or keeps moving at a steady speed in a straight line. This changes only when an unbalanced force acts on it. That is why passengers lurch forward when a taxi brakes.", html: P("No unbalanced force: <b>no change</b> in motion") },
      { h: "The second law", say: "Force equals mass times acceleration. The bigger the mass, the more force you need for the same acceleration.", html: P("F = m × a") },
      { h: "The third law", say: "For every force, there is an equal and opposite force on the other object. A rocket pushes gas down, and the gas pushes the rocket up.", html: P("Action and reaction: <b>equal and opposite</b>") }
    ],
    example: { q: "A 1 000 kg car accelerates at 2 m/s². What resultant force is needed?", steps: ["F = m × a.", "F = 1 000 × 2.", "F = 2 000 N."] },
    questions: [
      { type: "num", q: "What force is needed to accelerate a 50 kg trolley at 3 m/s², in newtons?", answer: "150", options: ["150", "53", "16.7", "47"], hints: ["F = m × a.", "50 × 3.", "150."], explain: "50 × 3 = 150 N." },
      { type: "num", q: "A 10 N force acts on a 2 kg mass. What is its acceleration, in m/s²?", answer: "5", options: ["5", "20", "12", "0.2"], hints: ["a = F ÷ m.", "10 ÷ 2.", "5."], explain: "10 ÷ 2 = 5 m/s²." },
      { type: "mcq", q: "Why do passengers lurch forward when a taxi brakes suddenly?", options: ["Their bodies keep moving forward (the first law)", "The taxi pushes them", "Gravity increases", "The seats move backwards"], answer: 0, hints: ["The taxi stops, but…", "…your body keeps going.", "The first law."], explain: "Their bodies keep moving until a force (a seatbelt) stops them." },
      { type: "mcq", q: "A swimmer pushes the water backwards. What happens?", options: ["The water pushes the swimmer forwards", "Nothing", "The water pushes the swimmer down", "The swimmer stops"], answer: 0, hints: ["The third law.", "Equal and opposite.", "Forwards."], explain: "The water pushes back on the swimmer with an equal, opposite force." },
      { type: "mcq", q: "Which law is F = ma?", options: ["Newton's second law", "Newton's first law", "Newton's third law", "The law of gravity"], answer: 0, hints: ["It links force, mass and acceleration.", "Not the first or the third.", "The second."], explain: "F = ma is Newton's second law." }
    ],
    reflect: R("Everyday examples", "Using F = ma", "Spotting force pairs"),
    parent: "Your child used Newton's laws to explain everyday motion.",
    teacher: "Criterion A: applies Newton's three laws to explain everyday motion and uses F = ma quantitatively.",
    done: "Forces change motion; F = ma; every force has an equal, opposite partner." }
  );
}
