"use strict";

// ---------- Cambridge Primary (Stages 1 to 6 = Grades 1 to 6), for the new app only. Original content. ----------
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const M = { subject: "Mathematics", curriculum: "Cambridge", domain: "Logical and Analytical Thinking" };
  const E = { subject: "English", curriculum: "Cambridge", domain: "Communication and Expression" };
  const S = { subject: "Science", curriculum: "Cambridge", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" };
  const BIG = t => `<p style="font-size:2rem;margin:0">${t}</p>`;
  const cm = (stage, focus) => `Cambridge Primary Mathematics (0096), Stage ${stage}: ${focus}`;
  const ce = (stage, focus) => `Cambridge Primary English (0058), Stage ${stage}: ${focus}`;
  const cs = (stage, focus) => `Cambridge Primary Science (0097), Stage ${stage}: ${focus}`;

  PLATFORM_UNITS.push(
  // ===================== STAGE 1 (GRADE 1) =====================
  { ...M, id: "camp1-bonds", grade: 1, title: "Number bonds to 10", topic: "Number: addition", category: "Pattern Thinking",
    caps: cm(1, "Number (pairs of numbers that make 10)"),
    intention: "Today I am finding pairs of numbers that make 10.", prompt: "How many fingers do you have altogether?",
    lesson: [
      { h: "Ten fingers", say: "You have ten fingers. If you hold up 7 fingers, 3 are down. 7 and 3 make 10.", html: BIG("🖐️🖐️") + P("7 + 3 = 10") },
      { h: "All the pairs", say: "These pairs all make 10: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5.", html: chainRow(["1 + 9", "2 + 8", "3 + 7", "4 + 6", "5 + 5"]) },
      { h: "Missing numbers", say: "If 6 plus something makes 10, count on from 6 to 10: 7, 8, 9, 10. That is 4.", html: P("6 + <b>4</b> = 10") }
    ],
    example: { q: "8 + ? = 10", steps: ["Start at 8.", "Count on: 9, 10.", "That is 2 more. 8 + 2 = 10."] },
    questions: [
      { type: "mcq", q: "3 + ? = 10", pics: ["7️⃣", "6️⃣", "3️⃣"], options: ["7", "6", "3"], answer: 0, hints: ["Count on from 3.", "4, 5, 6, 7, 8, 9, 10.", "7."], explain: "3 + 7 = 10." },
      { type: "mcq", q: "Which pair makes 10?", options: ["4 and 6", "4 and 5", "3 and 3", "2 and 9"], answer: 0, hints: ["Add each pair.", "4 + 6.", "10."], explain: "4 + 6 = 10." },
      { type: "num", q: "5 + ? = 10", answer: "5", options: ["5", "4", "6", "10"], hints: ["Double 5.", "5 and 5.", "5."], explain: "5 + 5 = 10." },
      { type: "num", q: "1 + ? = 10", answer: "9", options: ["9", "8", "10", "1"], hints: ["Count on from 1.", "Nine more steps.", "9."], explain: "1 + 9 = 10." }
    ],
    reflect: R("Using my fingers", "Counting on"),
    parent: "Your child found pairs of numbers that make 10.",
    teacher: "Shows recalling number bonds to 10 and finding missing addends by counting on.",
    done: "Pairs that make 10: 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5." },

  { ...E, id: "camp1-rhymes", grade: 1, title: "Rhyming words", topic: "Phonics: rhyme", category: "Pattern Thinking",
    caps: ce(1, "Reading (hearing and making rhymes)"),
    intention: "Today I am finding words that rhyme.", prompt: "Do you know a song with rhyming words?",
    lesson: [
      { h: "What is a rhyme?", say: "Words rhyme when they end with the same sound. Cat and hat rhyme. Dog and log rhyme.", html: BIG("🐱 🎩") + P("c<b>at</b>, h<b>at</b>") },
      { h: "Listen for the end", say: "Say the words aloud and listen to the end. Sun, run, fun. They all end in un.", html: chainRow(["sun", "run", "fun"]) },
      { h: "Make your own", say: "Change the first sound to make a new rhyme. From bed you can make red and fed.", html: P("b<b>ed</b> → r<b>ed</b> → f<b>ed</b>") }
    ],
    example: { q: "What rhymes with 'pig'?", steps: ["Pig ends with 'ig'.", "Change the first sound.", "Big, dig and wig all rhyme with pig."] },
    questions: [
      { type: "mcq", q: "Which word rhymes with 'cat'?", pics: ["🎩", "🐶", "☀️"], options: ["hat", "dog", "sun"], answer: 0, hints: ["Listen to the end sound.", "c-at.", "h-at."], explain: "Cat and hat both end in 'at'." },
      { type: "mcq", q: "Which word rhymes with 'sun'?", pics: ["🏃", "🌙", "🐟"], options: ["run", "moon", "fish"], answer: 0, hints: ["s-un.", "Which ends in 'un'?", "Run."], explain: "Sun and run both end in 'un'." },
      { type: "mcq", q: "Which word rhymes with 'log'?", pics: ["🐸", "🐄", "🚗"], options: ["frog", "cow", "car"], answer: 0, hints: ["l-og.", "Which ends in 'og'?", "Frog."], explain: "Log and frog both end in 'og'." },
      { type: "mcq", q: "Which two words rhyme?", options: ["bed and red", "bed and bat", "red and run", "sun and sit"], answer: 0, hints: ["Look at the ends.", "Same ending sound.", "-ed."], explain: "Bed and red both end in 'ed'." }
    ],
    reflect: R("Saying the words aloud", "Looking at the pictures"),
    parent: "Your child found and made rhyming words.",
    teacher: "Shows recognising and generating rhymes by identifying shared word endings.",
    done: "Rhyming words end with the same sound." },

  { ...S, id: "camp1-living", grade: 1, title: "Living and not living", topic: "Biology: living things",
    caps: cs(1, "Biology (sorting living and non-living things)"),
    intention: "Today I am sorting things into living and not living.", prompt: "Is a tree alive? How do you know?",
    lesson: [
      { h: "Living things", say: "Living things grow, need food and water, and can make new living things. Plants, animals and people are living.", html: BIG("🌳 🐕 👧") },
      { h: "Not living", say: "Things that are not living do not grow, eat or breathe. A rock, a chair and a ball are not living.", html: BIG("🪨 🪑 ⚽") },
      { h: "Was once alive", say: "Some things were alive once, like a wooden table that came from a tree, or a dry leaf.", html: BIG("🍂 🪵") }
    ],
    example: { q: "Is a dog living or not living?", steps: ["A dog eats and drinks.", "A dog grows and can have puppies.", "A dog is living."] },
    questions: [
      { type: "mcq", q: "Which one is living?", pics: ["🌻", "🪨", "🧸"], options: ["A sunflower", "A rock", "A teddy"], answer: 0, hints: ["Which one grows?", "It needs water.", "The sunflower."], explain: "A sunflower grows and needs water." },
      { type: "mcq", q: "Which one is NOT living?", pics: ["🚗", "🐦", "🐟"], options: ["A car", "A bird", "A fish"], answer: 0, hints: ["Which one doesn't eat?", "It doesn't grow.", "The car."], explain: "A car doesn't grow, eat or breathe." },
      { type: "mcq", q: "What do all living things need?", pics: ["💧", "📺", "🎮"], options: ["Water", "A TV", "Games"], answer: 0, hints: ["Plants and animals both need it.", "We drink it.", "Water."], explain: "All living things need water." },
      { type: "sort", q: "Sort them.", items: ["Tree", "Ball", "Cat", "Chair"], bins: ["Living", "Not living"], answer: [0, 1, 0, 1], hints: ["Which ones grow?", "Tree and cat grow.", "Ball and chair don't."], explain: "The tree and cat are living; the ball and chair are not." }
    ],
    reflect: R("Asking 'does it grow?'", "The pictures"),
    parent: "Your child sorted things into living and not living.",
    teacher: "Shows identifying characteristics of living things and classifying objects.",
    done: "Living things grow, need food and water, and make new living things." },

  // ===================== STAGE 2 (GRADE 2) =====================
  { ...M, id: "camp2-odd-even", grade: 2, title: "Odd and even numbers", topic: "Number: properties", category: "Pattern Thinking",
    caps: cm(2, "Number (recognising odd and even numbers)"),
    intention: "Today I am sorting numbers into odd and even.", prompt: "Can you share 7 sweets fairly between 2 friends?",
    lesson: [
      { h: "Even numbers", say: "An even number can be shared into two equal groups. 6 sweets make two groups of 3. Even numbers end in 0, 2, 4, 6 or 8.", html: BIG("🍬🍬🍬 | 🍬🍬🍬") + P("6 is <b>even</b>") },
      { h: "Odd numbers", say: "An odd number always has one left over. 7 sweets make two groups of 3, with 1 left over. Odd numbers end in 1, 3, 5, 7 or 9.", html: BIG("🍬🍬🍬 | 🍬🍬🍬 + 🍬") + P("7 is <b>odd</b>") },
      { h: "The last digit", say: "To check a big number, look at the last digit. 34 ends in 4, so it is even. 57 ends in 7, so it is odd.", html: chainRow(["34: even", "57: odd"]) }
    ],
    example: { q: "Is 18 odd or even?", steps: ["Look at the last digit: 8.", "8 is even.", "So 18 is even."] },
    questions: [
      { type: "mcq", q: "Is 9 odd or even?", options: ["Odd", "Even"], answer: 0, hints: ["Share 9 into two groups.", "4 and 4, with 1 left over.", "Odd."], explain: "9 has one left over, so it is odd." },
      { type: "mcq", q: "Which number is even?", options: ["12", "5", "11", "3"], answer: 0, hints: ["Look at the last digit.", "Even ends in 0, 2, 4, 6 or 8.", "12."], explain: "12 ends in 2, so it is even." },
      { type: "mcq", q: "Is 45 odd or even?", options: ["Odd", "Even"], answer: 0, hints: ["Look at the last digit.", "5.", "Odd."], explain: "45 ends in 5, so it is odd." },
      { type: "sort", q: "Sort the numbers.", items: ["4", "7", "10", "13"], bins: ["Even", "Odd"], answer: [0, 1, 0, 1], hints: ["Check each last digit.", "4 and 10 are even.", "7 and 13 are odd."], explain: "4 and 10 are even; 7 and 13 are odd." }
    ],
    reflect: R("Sharing into two groups", "Looking at the last digit"),
    parent: "Your child sorted numbers into odd and even.",
    teacher: "Shows recognising odd and even numbers by grouping and by the final digit.",
    done: "Even numbers share equally; odd numbers have one left over." },

  { ...E, id: "camp2-sentences", grade: 2, title: "Capital letters and full stops", topic: "Writing: punctuation", category: "Planning and Organisation",
    caps: ce(2, "Writing (using capital letters and full stops to mark sentences)"),
    intention: "Today I am starting and ending sentences correctly.", prompt: "How do you know where a sentence ends?",
    lesson: [
      { h: "Capital letters", say: "A sentence starts with a capital letter. Names of people and places also start with capital letters, like Thabo and Durban. The word I is always a capital.", html: P("<b>T</b>habo lives in <b>D</b>urban.") },
      { h: "Full stops", say: "A sentence ends with a full stop. It tells the reader to stop and take a breath.", html: P("The dog ran to the park<b>.</b>") },
      { h: "Questions", say: "A question ends with a question mark instead of a full stop.", html: P("Where is my hat<b>?</b>") }
    ],
    example: { q: "Fix: 'my friend lerato likes apples'", steps: ["Start with a capital: My.", "Lerato is a name, so it needs a capital: Lerato.", "End with a full stop: My friend Lerato likes apples."] },
    questions: [
      { type: "mcq", q: "Which sentence is correct?", options: ["The cat is sleeping.", "the cat is sleeping.", "The cat is sleeping", "the cat is sleeping"], answer: 0, hints: ["Check the start.", "Check the end.", "Capital and full stop."], explain: "It has a capital letter and a full stop." },
      { type: "mcq", q: "Which word needs a capital letter?", options: ["sipho", "dog", "ran", "big"], answer: 0, hints: ["Names need capitals.", "Which one is a name?", "Sipho."], explain: "Sipho is a name, so it needs a capital." },
      { type: "mcq", q: "What goes at the end of 'What is your name'?", options: ["?", ".", ",", "!"], answer: 0, hints: ["It is a question.", "It asks something.", "A question mark."], explain: "Questions end with a question mark." },
      { type: "mcq", q: "Which is written correctly?", options: ["I went to Cape Town.", "i went to cape town.", "I went to cape town.", "i went to Cape Town"], answer: 0, hints: ["'I' is always a capital.", "Places need capitals.", "And a full stop."], explain: "Capital I, capital place name and a full stop." }
    ],
    reflect: R("Checking the start", "Checking the end"),
    parent: "Your child practised capital letters, full stops and question marks.",
    teacher: "Shows demarcating sentences with capital letters and full stops, capitalising proper nouns and using question marks.",
    done: "Start with a capital letter; end with a full stop or question mark." },

  { ...S, id: "camp2-materials", grade: 2, title: "Materials and what they are like", topic: "Chemistry: materials",
    caps: cs(2, "Chemistry (naming materials and describing their properties)"),
    intention: "Today I am describing materials and choosing the right one for a job.", prompt: "Why are windows made of glass?",
    lesson: [
      { h: "Materials", say: "Everything is made of materials, like wood, metal, plastic, glass and fabric.", html: chainRow(["Wood", "Metal", "Plastic", "Glass", "Fabric"]) },
      { h: "Properties", say: "Materials have properties. Glass is see-through. Metal is strong and shiny. Fabric is soft and bendy.", html: chainRow(["Glass: see-through", "Metal: strong", "Fabric: soft"]) },
      { h: "The right job", say: "We choose materials that suit the job. A raincoat is made of waterproof plastic, not paper.", html: BIG("🧥 ☔") + P("Raincoat: <b>waterproof</b>") }
    ],
    example: { q: "Why are spoons often made of metal?", steps: ["A spoon must be strong.", "It must not break when we stir.", "Metal is strong, so it is a good choice."] },
    questions: [
      { type: "mcq", q: "Which material is see-through?", pics: ["🪟", "🪵", "🧱"], options: ["Glass", "Wood", "Brick"], answer: 0, hints: ["You can see through a window.", "Windows are made of…", "Glass."], explain: "Glass is see-through." },
      { type: "mcq", q: "What is the best material for a raincoat?", pics: ["🛍️", "📄", "🧶"], options: ["Plastic", "Paper", "Wool"], answer: 0, hints: ["It must keep you dry.", "Waterproof.", "Plastic."], explain: "Plastic is waterproof." },
      { type: "mcq", q: "Which word describes a soft blanket?", options: ["Soft", "Hard", "Shiny", "See-through"], answer: 0, hints: ["Touch a blanket.", "It feels gentle.", "Soft."], explain: "A blanket is soft." },
      { type: "mcq", q: "Why would paper be a bad material for a chair?", options: ["It isn't strong enough", "It is too shiny", "It is see-through", "It is too heavy"], answer: 0, hints: ["A chair holds your weight.", "Paper tears.", "Not strong."], explain: "Paper isn't strong enough to hold you up." }
    ],
    reflect: R("Naming the properties", "Matching materials to jobs"),
    parent: "Your child described materials and chose the right one for a job.",
    teacher: "Shows naming everyday materials, describing properties and relating properties to uses.",
    done: "Choose a material whose properties suit the job." },

  // ===================== STAGE 3 (GRADE 3) =====================
  { ...M, id: "camp3-time", grade: 3, title: "Telling the time", topic: "Measure: time", category: "Pattern Thinking",
    caps: cm(3, "Geometry and measure (reading time to the quarter hour and five minutes)"),
    intention: "Today I am reading the time on a clock.", prompt: "What time do you go to school?",
    lesson: [
      { h: "The two hands", say: "A clock has a short hand for the hours and a long hand for the minutes. When the long hand points to 12, it is o'clock.", html: P("Long hand on 12, short hand on 3: <b>3 o'clock</b>") },
      { h: "Half past and quarters", say: "When the long hand points to 6, it is half past. On the 3, it is quarter past. On the 9, it is quarter to the next hour.", html: chainRow(["On 3: quarter past", "On 6: half past", "On 9: quarter to"]) },
      { h: "Five-minute steps", say: "Each number on the clock is 5 minutes for the long hand. Pointing to 4 means 20 minutes past.", html: P("Long hand on 4: 4 × 5 = <b>20 minutes past</b>") }
    ],
    example: { q: "The short hand is just past 7 and the long hand is on 6. What time is it?", steps: ["The long hand on 6 means half past.", "The short hand has passed 7.", "It is half past 7."] },
    questions: [
      { type: "mcq", q: "The long hand is on 12 and the short hand is on 5. What time is it?", options: ["5 o'clock", "12 o'clock", "Half past 5", "Quarter past 12"], answer: 0, hints: ["Long hand on 12 means o'clock.", "The short hand shows the hour.", "5 o'clock."], explain: "It is 5 o'clock." },
      { type: "mcq", q: "Where is the long hand at half past?", options: ["On 6", "On 12", "On 3", "On 9"], answer: 0, hints: ["Half way round.", "Opposite the 12.", "On 6."], explain: "At half past, the long hand points to 6." },
      { type: "mcq", q: "The long hand is on 3. What does that mean?", options: ["Quarter past", "Quarter to", "Half past", "O'clock"], answer: 0, hints: ["A quarter of the way round.", "Past the hour.", "Quarter past."], explain: "On 3, it is quarter past." },
      { type: "num", q: "The long hand points to 4. How many minutes past the hour is it?", answer: "20", options: ["20", "4", "40", "15"], hints: ["Each number is 5 minutes.", "4 × 5.", "20."], explain: "4 × 5 = 20 minutes past." }
    ],
    reflect: R("Knowing which hand is which", "Counting in fives"),
    parent: "Your child read the time on a clock to the quarter hour and five minutes.",
    teacher: "Shows reading analogue time to o'clock, half past, quarter past and to, and in five-minute intervals.",
    done: "Long hand for minutes (count in fives); short hand for hours." },

  { ...E, id: "camp3-word-classes", grade: 3, title: "Nouns, verbs and adjectives", topic: "Grammar: word classes", category: "Pattern Thinking",
    caps: ce(3, "Writing (identifying and using nouns, verbs and adjectives)"),
    intention: "Today I am finding nouns, verbs and adjectives.", prompt: "Can you describe your favourite animal in three words?",
    lesson: [
      { h: "Nouns", say: "A noun is a naming word for a person, place or thing. Teacher, school and ball are nouns.", html: chainRow(["teacher", "school", "ball"]) },
      { h: "Verbs", say: "A verb is a doing word. Run, eat and sing are verbs.", html: chainRow(["run", "eat", "sing"]) },
      { h: "Adjectives", say: "An adjective describes a noun. In the big red bus, big and red are adjectives.", html: P("the <b>big</b>, <b>red</b> bus") }
    ],
    example: { q: "Find the noun, verb and adjective in 'The happy dog barked.'", steps: ["Noun (a thing): dog.", "Verb (doing word): barked.", "Adjective (describes the dog): happy."] },
    questions: [
      { type: "mcq", q: "Which word is a noun?", options: ["table", "jump", "quickly", "blue"], answer: 0, hints: ["A naming word.", "A thing.", "Table."], explain: "Table names a thing." },
      { type: "mcq", q: "Which word is a verb?", options: ["swim", "fish", "wet", "pond"], answer: 0, hints: ["A doing word.", "Something you do.", "Swim."], explain: "Swim is something you do." },
      { type: "mcq", q: "Which word is an adjective in 'a tall tree'?", options: ["tall", "tree", "a", "none"], answer: 0, hints: ["It describes the tree.", "What kind of tree?", "Tall."], explain: "Tall describes the tree." },
      { type: "sort", q: "Sort the words.", items: ["cat", "run", "school", "eat"], bins: ["Noun", "Verb"], answer: [0, 1, 0, 1], hints: ["Naming or doing?", "Cat and school are things.", "Run and eat are actions."], explain: "Cat and school are nouns; run and eat are verbs." }
    ],
    reflect: R("Asking 'is it a thing or an action?'", "Finding describing words"),
    parent: "Your child found nouns, verbs and adjectives in sentences.",
    teacher: "Shows identifying and classifying nouns, verbs and adjectives in context.",
    done: "Nouns name, verbs do, adjectives describe." },

  { ...S, id: "camp3-forces", grade: 3, title: "Pushes and pulls", topic: "Physics: forces",
    caps: cs(3, "Physics (forces as pushes and pulls; how forces change movement)"),
    intention: "Today I am finding out how pushes and pulls make things move.", prompt: "How do you open a door?",
    lesson: [
      { h: "Forces", say: "A force is a push or a pull. You push a trolley. You pull a door handle.", html: chainRow(["Push: a trolley", "Pull: a door"]) },
      { h: "What forces do", say: "Forces can make things start moving, stop, speed up, slow down or change direction. A kick makes a ball move.", html: chainRow(["Start", "Stop", "Speed up", "Slow down", "Change direction"]) },
      { h: "Bigger force", say: "A bigger force makes a bigger change. A hard kick sends the ball further than a gentle kick.", html: P("Bigger push → <b>bigger change</b>") }
    ],
    example: { q: "Is opening a drawer a push or a pull?", steps: ["You hold the handle.", "You move it towards you.", "It is a pull."] },
    questions: [
      { type: "mcq", q: "Kicking a ball is a…", pics: ["👉", "👈"], options: ["Push", "Pull"], answer: 0, hints: ["Your foot moves the ball away.", "Away from you.", "Push."], explain: "Kicking pushes the ball away." },
      { type: "mcq", q: "Opening a drawer is a…", pics: ["👈", "👉"], options: ["Pull", "Push"], answer: 0, hints: ["You move it towards you.", "Towards you.", "Pull."], explain: "You pull a drawer towards you." },
      { type: "mcq", q: "What can a force do?", options: ["Make something stop", "Make something invisible", "Change its colour", "Make it sing"], answer: 0, hints: ["Forces change movement.", "Start, stop…", "Stop."], explain: "Forces can start, stop or change movement." },
      { type: "mcq", q: "Which kick sends the ball furthest?", options: ["A hard kick", "A gentle kick", "No kick", "They are all the same"], answer: 0, hints: ["More force…", "…bigger change.", "Hard kick."], explain: "A bigger force makes a bigger change." }
    ],
    reflect: R("Acting out pushes and pulls", "Thinking about kicks"),
    parent: "Your child learnt how pushes and pulls make things move.",
    teacher: "Shows identifying forces as pushes and pulls and describing their effects on movement.",
    done: "A force is a push or a pull. Bigger forces make bigger changes." },

  // ===================== STAGE 4 (GRADE 4) =====================
  { ...M, id: "camp4-arrays", grade: 4, title: "Multiplication with arrays", topic: "Number: multiplication", category: "Pattern Thinking",
    caps: cm(4, "Number (multiplication facts; arrays; commutativity)"),
    intention: "Today I am using arrays to understand multiplication.", prompt: "How could you count the eggs in a tray quickly?",
    lesson: [
      { h: "Arrays", say: "An array is objects in rows and columns. 3 rows of 4 is 3 times 4, which is 12.", html: BIG("🍎🍎🍎🍎<br>🍎🍎🍎🍎<br>🍎🍎🍎🍎") + P("3 × 4 = <b>12</b>") },
      { h: "Turn it around", say: "Turn the array on its side: 4 rows of 3. It is still 12. Multiplication works in any order.", html: P("3 × 4 = 4 × 3 = 12") },
      { h: "Using facts you know", say: "If you know 5 times 6 is 30, then 6 times 6 is one more 6: 36.", html: P("5 × 6 = 30 → 6 × 6 = 30 + 6 = <b>36</b>") }
    ],
    example: { q: "An egg tray has 5 rows of 6 eggs. How many eggs?", steps: ["5 rows of 6.", "5 × 6.", "30 eggs."] },
    questions: [
      { type: "num", q: "4 rows of 5 chairs. How many chairs?", answer: "20", options: ["20", "9", "45", "25"], hints: ["4 × 5.", "Count in fives four times.", "20."], explain: "4 × 5 = 20." },
      { type: "num", q: "What is 7 × 3?", answer: "21", options: ["21", "10", "24", "18"], hints: ["Count in threes seven times.", "3, 6, 9, 12, 15, 18, 21.", "21."], explain: "7 × 3 = 21." },
      { type: "mcq", q: "Which is the same as 6 × 8?", options: ["8 × 6", "6 + 8", "68", "6 × 6"], answer: 0, hints: ["Turn the array around.", "Same answer.", "8 × 6."], explain: "Multiplication works in any order." },
      { type: "num", q: "You know 10 × 7 = 70. What is 9 × 7?", answer: "63", options: ["63", "77", "70", "16"], hints: ["9 × 7 is one 7 less.", "70 − 7.", "63."], explain: "70 − 7 = 63." }
    ],
    reflect: R("Drawing arrays", "Turning them around", "Using facts I know"),
    parent: "Your child used arrays to multiply and to work out new facts.",
    teacher: "Shows representing multiplication as arrays, using commutativity and deriving facts from known facts.",
    done: "Rows × columns. Turn it around: same answer." },

  { ...E, id: "camp4-instructions", grade: 4, title: "Writing instructions", topic: "Writing: non-fiction", category: "Planning and Organisation",
    caps: ce(4, "Writing (instructional texts: imperative verbs, numbered steps and sequencing words)"),
    intention: "Today I am writing clear instructions.", prompt: "Could you explain how to make a sandwich?",
    lesson: [
      { h: "What instructions need", say: "Instructions have a title, a list of what you need, and numbered steps in order.", html: chainRow(["Title", "You will need", "Numbered steps"]) },
      { h: "Bossy verbs", say: "Each step starts with a command verb, sometimes called a bossy verb: cut, mix, pour, spread.", html: P("<b>Spread</b> the butter. <b>Add</b> the cheese.") },
      { h: "Order words", say: "Order words help the reader follow along: first, next, then, finally.", html: chainRow(["First", "Next", "Then", "Finally"]) }
    ],
    example: { q: "Write the first step for making tea.", steps: ["Think about what happens first.", "Start with a command verb.", "'1. Boil the water.'"] },
    questions: [
      { type: "mcq", q: "Which is a command verb?", options: ["Mix", "Happy", "Kitchen", "Slowly"], answer: 0, hints: ["It tells you to do something.", "An action.", "Mix."], explain: "'Mix' tells the reader what to do." },
      { type: "mcq", q: "Which instruction is clearest?", options: ["Pour the milk into the glass.", "The milk is nice.", "Milk.", "I like milk in glasses."], answer: 0, hints: ["It tells you exactly what to do.", "Starts with a command verb.", "The first."], explain: "It is a clear command." },
      { type: "order", q: "Put the steps for a sandwich in order.", items: ["Take two slices of bread", "Spread the butter", "Add the filling", "Put the slices together"], orderLabel: "first to last", hints: ["Start with the bread.", "Butter before filling.", "Close it last."], explain: "Bread, butter, filling, close." },
      { type: "mcq", q: "Why are instruction steps numbered?", options: ["So the reader follows the right order", "To make them longer", "Because numbers are pretty", "So you can skip steps"], answer: 0, hints: ["Order matters.", "Step 1, then step 2.", "The right order."], explain: "Numbers show the order to follow." }
    ],
    reflect: R("Starting with a command verb", "Putting steps in order"),
    parent: "Your child wrote clear, step-by-step instructions.",
    teacher: "Shows structuring instructional texts with imperative verbs, numbered steps and sequencing connectives.",
    done: "Title, what you need, then numbered steps starting with command verbs." },

  { ...S, id: "camp4-states", grade: 4, title: "Solids, liquids and gases", topic: "Chemistry: states of matter",
    caps: cs(4, "Chemistry (solids, liquids and gases; melting and freezing)"),
    intention: "Today I am sorting things into solids, liquids and gases.", prompt: "What happens to an ice block on a hot day?",
    lesson: [
      { h: "Solids", say: "Solids keep their shape. A stone, a book and ice are solids.", html: BIG("🪨 📕 🧊") },
      { h: "Liquids and gases", say: "Liquids flow and take the shape of their container, like water and juice. Gases spread out to fill any space, like the air in a balloon.", html: chainRow(["Liquid: flows", "Gas: spreads out"]) },
      { h: "Changing state", say: "Heating can melt a solid into a liquid. Cooling can freeze a liquid into a solid. Ice melts into water; water freezes into ice.", html: chainRow(["Ice", "melts", "Water", "freezes", "Ice"]) }
    ],
    example: { q: "Is honey a solid, a liquid or a gas?", steps: ["Honey flows, slowly.", "It takes the shape of the jar.", "Honey is a liquid."] },
    questions: [
      { type: "mcq", q: "Which is a solid?", pics: ["🪨", "💧", "💨"], options: ["A stone", "Water", "Air"], answer: 0, hints: ["It keeps its shape.", "You can hold it.", "A stone."], explain: "A stone keeps its shape." },
      { type: "mcq", q: "Which is a gas?", pics: ["🎈", "🧃", "🧊"], options: ["Air in a balloon", "Juice", "Ice"], answer: 0, hints: ["It spreads out.", "You can't see it.", "Air."], explain: "Air is a gas." },
      { type: "mcq", q: "What happens to ice when it is heated?", options: ["It melts", "It freezes", "It becomes a stone", "Nothing"], answer: 0, hints: ["Think of a hot day.", "It turns into water.", "Melts."], explain: "Heat melts ice into water." },
      { type: "sort", q: "Sort them.", items: ["Milk", "Brick", "Juice", "Spoon"], bins: ["Solid", "Liquid"], answer: [1, 0, 1, 0], hints: ["Does it flow?", "Milk and juice flow.", "Brick and spoon keep their shape."], explain: "Milk and juice are liquids; the brick and spoon are solids." }
    ],
    reflect: R("Asking 'does it flow?'", "Thinking about ice"),
    parent: "Your child sorted materials into solids, liquids and gases.",
    teacher: "Shows classifying materials by state and describing melting and freezing.",
    done: "Solids keep their shape, liquids flow, gases spread out." },

  // ===================== STAGE 5 (GRADE 5) =====================
  { ...M, id: "camp5-fdp", grade: 5, title: "Fractions, decimals and percentages", topic: "Number: equivalence", category: "Flexible Thinking",
    caps: cm(5, "Number (equivalence of simple fractions, decimals and percentages)"),
    intention: "Today I am matching fractions, decimals and percentages.", prompt: "What does 50% off mean in a shop?",
    lesson: [
      { h: "Three ways to say it", say: "One half can be written as a fraction, a half, as a decimal, 0.5, or as a percentage, 50 percent. They all mean the same amount.", html: chainRow(["1/2", "0.5", "50%"]) },
      { h: "Key facts", say: "A quarter is 0.25, or 25 percent. Three quarters is 0.75, or 75 percent. One tenth is 0.1, or 10 percent.", html: chainRow(["1/4 = 0.25 = 25%", "3/4 = 0.75 = 75%", "1/10 = 0.1 = 10%"]) },
      { h: "Per cent means out of 100", say: "Per cent means out of 100. 30 percent means 30 out of 100, which is 0.3.", html: P("30% = 30/100 = <b>0.3</b>") }
    ],
    example: { q: "Write 2/5 as a percentage.", steps: ["Make the bottom 100: multiply top and bottom by 20.", "2/5 = 40/100.", "40/100 = 40%."] },
    questions: [
      { type: "mcq", q: "Which is the same as 1/2?", options: ["50%", "25%", "12%", "0.2"], answer: 0, hints: ["Half of 100.", "50.", "50%."], explain: "1/2 = 50%." },
      { type: "mcq", q: "Write 0.25 as a fraction.", options: ["1/4", "1/2", "2/5", "1/25"], answer: 0, hints: ["0.25 is 25 hundredths.", "25 out of 100.", "1/4."], explain: "0.25 = 25/100 = 1/4." },
      { type: "num", q: "Write 70% as a decimal.", answer: "0.7", options: ["0.7", "7", "0.07", "70"], hints: ["70 out of 100.", "70 ÷ 100.", "0.7."], explain: "70 ÷ 100 = 0.7." },
      { type: "num", q: "Write 3/10 as a percentage. (Type the number only.)", answer: "30", options: ["30", "3", "10", "0.3"], hints: ["Multiply top and bottom by 10.", "30/100.", "30%."], explain: "3/10 = 30/100 = 30%." }
    ],
    reflect: R("Remembering key facts", "Thinking 'out of 100'"),
    parent: "Your child matched fractions, decimals and percentages.",
    teacher: "Shows recognising equivalent fractions, decimals and percentages, including tenths, quarters and halves.",
    done: "Per cent means out of 100: 1/2 = 0.5 = 50%." },

  { ...E, id: "camp5-fact-opinion", grade: 5, title: "Fact and opinion", topic: "Reading: non-fiction", category: "Flexible Thinking",
    caps: ce(5, "Reading (distinguishing between fact and opinion)"),
    intention: "Today I am telling facts from opinions.", prompt: "Is 'pizza is the best food' a fact?",
    lesson: [
      { h: "Facts", say: "A fact can be checked and proved true. For example: the Orange River is the longest river in South Africa.", html: P("Fact: <b>can be proved</b>.") },
      { h: "Opinions", say: "An opinion is what someone thinks or feels. People can disagree. For example: the Orange River is the most beautiful river.", html: P("Opinion: <b>what someone thinks</b>.") },
      { h: "Clue words", say: "Opinion words include best, worst, beautiful, I think and should.", html: chainRow(["best", "worst", "I think", "should"]) }
    ],
    example: { q: "Fact or opinion: 'Cheetahs can run faster than lions.'", steps: ["Can it be checked?", "Yes, by measuring their speeds.", "It is a fact."] },
    questions: [
      { type: "mcq", q: "'There are seven days in a week.' Is this a fact or an opinion?", options: ["Fact", "Opinion"], answer: 0, hints: ["Can it be checked?", "Yes, on a calendar.", "Fact."], explain: "It can be checked, so it is a fact." },
      { type: "mcq", q: "'Saturday is the best day of the week.' Is this a fact or an opinion?", options: ["Opinion", "Fact"], answer: 0, hints: ["Look for 'best'.", "People could disagree.", "Opinion."], explain: "'Best' shows an opinion." },
      { type: "mcq", q: "Which word often signals an opinion?", options: ["beautiful", "seven", "river", "measured"], answer: 0, hints: ["It is a judgement.", "People see it differently.", "Beautiful."], explain: "'Beautiful' is a judgement." },
      { type: "sort", q: "Sort the sentences.", items: ["Water boils at 100 °C.", "Maths is boring.", "Durban is in KwaZulu-Natal.", "Cats are better than dogs."], bins: ["Fact", "Opinion"], answer: [0, 1, 0, 1], hints: ["Can it be checked?", "Boiling point and Durban can be checked.", "The others are feelings."], explain: "The boiling point and Durban's location are facts; the others are opinions." }
    ],
    reflect: R("Asking 'can it be checked?'", "Spotting opinion words"),
    parent: "Your child learnt to tell facts from opinions.",
    teacher: "Shows distinguishing fact from opinion and recognising evaluative language.",
    done: "A fact can be checked. An opinion is what someone thinks." },

  { ...S, id: "camp5-sound", grade: 5, title: "Sound and vibrations", topic: "Physics: sound",
    caps: cs(5, "Physics (sound is made by vibrations; pitch and loudness)"),
    intention: "Today I am finding out how sounds are made and changed.", prompt: "Put your hand on your throat and hum. What do you feel?",
    lesson: [
      { h: "Vibrations", say: "Sound is made when something vibrates, moving quickly back and forth. When you hum, your vocal cords vibrate.", html: P("Sound comes from <b>vibrations</b>.") },
      { h: "Loudness", say: "Bigger vibrations make louder sounds. Hitting a drum harder makes it louder.", html: P("Bigger vibrations → <b>louder</b>") },
      { h: "Pitch", say: "Pitch is how high or low a sound is. Faster vibrations make a higher pitch. A short, tight string gives a higher note than a long, loose one.", html: chainRow(["Fast vibration: high pitch", "Slow vibration: low pitch"]) }
    ],
    example: { q: "How can you make a guitar string play a higher note?", steps: ["A higher note needs faster vibrations.", "Shorten the string by pressing it, or tighten it.", "The string vibrates faster, so the pitch is higher."] },
    questions: [
      { type: "mcq", q: "What makes a sound?", options: ["Vibrations", "Light", "Colours", "Smells"], answer: 0, hints: ["Feel your throat when you hum.", "It shakes.", "Vibrations."], explain: "Sounds come from vibrations." },
      { type: "mcq", q: "How do you make a drum louder?", options: ["Hit it harder", "Hit it softer", "Paint it", "Make it smaller"], answer: 0, hints: ["Bigger vibrations.", "More force.", "Harder."], explain: "Hitting harder makes bigger vibrations." },
      { type: "mcq", q: "Which string makes the higher note?", options: ["A short, tight string", "A long, loose string", "They are the same", "Neither makes a sound"], answer: 0, hints: ["Higher pitch = faster vibration.", "Short and tight vibrate faster.", "Short, tight."], explain: "Short, tight strings vibrate faster: higher pitch." },
      { type: "mcq", q: "What is pitch?", options: ["How high or low a sound is", "How loud a sound is", "How far sound goes", "The colour of sound"], answer: 0, hints: ["Not loudness.", "High or low.", "Pitch."], explain: "Pitch is how high or low a sound is." }
    ],
    reflect: R("Feeling the vibration", "Loudness versus pitch"),
    parent: "Your child learnt how sounds are made and how pitch and loudness change.",
    teacher: "Shows explaining sound as vibration and relating vibration size and speed to loudness and pitch.",
    done: "Bigger vibrations: louder. Faster vibrations: higher pitch." },

  // ===================== STAGE 6 (GRADE 6) =====================
  { ...M, id: "camp6-ratio", grade: 6, title: "Ratio and proportion", topic: "Number: ratio", category: "Problem Solving",
    caps: cm(6, "Number (simple ratio and direct proportion)"),
    intention: "Today I am using ratios to share and scale.", prompt: "How would you mix juice so it tastes the same in a bigger jug?",
    lesson: [
      { h: "What a ratio is", say: "A ratio compares amounts. If a juice uses 1 cup of concentrate to 4 cups of water, the ratio is 1 to 4.", html: P("concentrate : water = <b>1 : 4</b>") },
      { h: "Scaling up", say: "To make more, multiply both parts by the same number. 1 to 4 becomes 3 to 12 for three times as much.", html: P("1 : 4 → × 3 → <b>3 : 12</b>") },
      { h: "Sharing in a ratio", say: "To share 20 sweets in the ratio 2 to 3, add the parts: 5. Each part is 20 divided by 5, which is 4. So 8 and 12.", html: P("2 + 3 = 5 parts → 20 ÷ 5 = 4 → <b>8 and 12</b>") }
    ],
    example: { q: "A recipe uses 2 eggs for 6 pancakes. How many eggs for 18 pancakes?", steps: ["18 is 3 times 6.", "Multiply the eggs by 3.", "2 × 3 = 6 eggs."] },
    questions: [
      { type: "num", q: "Juice is 1 cup of concentrate to 4 cups of water. How many cups of water for 2 cups of concentrate?", answer: "8", options: ["8", "6", "5", "4"], hints: ["Double the ratio.", "2 : 8.", "8."], explain: "1 : 4 doubled is 2 : 8." },
      { type: "num", q: "Share 30 marbles in the ratio 1 : 2. How many are in the bigger share?", answer: "20", options: ["20", "10", "15", "60"], hints: ["1 + 2 = 3 parts.", "30 ÷ 3 = 10.", "2 × 10."], explain: "Shares are 10 and 20." },
      { type: "num", q: "3 pens cost $6. How much do 5 pens cost, in dollars?", answer: "10", options: ["10", "11", "15", "8"], hints: ["Find one pen first.", "$6 ÷ 3 = $2.", "5 × $2."], explain: "One pen is $2, so 5 cost $10." },
      { type: "mcq", q: "Which ratio is the same as 2 : 3?", options: ["4 : 6", "3 : 2", "2 : 5", "4 : 5"], answer: 0, hints: ["Multiply both parts by the same number.", "× 2.", "4 : 6."], explain: "2 : 3 × 2 = 4 : 6." }
    ],
    reflect: R("Adding the parts", "Finding one part first", "Scaling both sides"),
    parent: "Your child used ratios to share amounts and scale recipes.",
    teacher: "Shows using ratio notation, scaling ratios, sharing in a given ratio and solving direct proportion problems.",
    done: "Scale both parts equally. To share, add the parts and find one part first." },

  { ...E, id: "camp6-formal", grade: 6, title: "Formal and informal language", topic: "Writing: register", category: "Communication",
    caps: ce(6, "Writing (choosing formal or informal language for audience and purpose)"),
    intention: "Today I am choosing formal or informal language.", prompt: "Would you talk to your principal the way you talk to your friends?",
    lesson: [
      { h: "Informal language", say: "Informal language is relaxed, for friends and family. It can use short forms like can't and everyday words.", html: P("'Hey! Can't wait to see you on Saturday!'") },
      { h: "Formal language", say: "Formal language is polite and careful, for people we don't know well or for official purposes. It avoids slang and uses full forms.", html: P("'Dear Mrs Mokoena, I am writing to ask whether…'") },
      { h: "Choosing", say: "Ask: who is reading, and why? A letter to a newspaper needs formal language; a text to your cousin can be informal.", html: chainRow(["Who is reading?", "Why?", "Formal or informal?"]) }
    ],
    example: { q: "Make this formal: 'Hey, can we get more books for the library?'", steps: ["Use a polite greeting.", "Avoid 'hey' and short forms.", "'Dear Principal, I would like to ask whether the library could have more books.'"] },
    questions: [
      { type: "mcq", q: "Which is formal?", options: ["Thank you for your letter.", "Thanks, mate!", "Cheers for that!", "Cool, got it."], answer: 0, hints: ["Polite and full.", "No slang.", "The first."], explain: "'Thank you for your letter' is formal." },
      { type: "mcq", q: "Which situation needs formal language?", options: ["A letter to the mayor", "A message to your brother", "A chat with friends", "A birthday card to your best friend"], answer: 0, hints: ["Someone you don't know well.", "Official.", "The mayor."], explain: "Writing to the mayor needs formal language." },
      { type: "mcq", q: "Which word is informal?", options: ["awesome", "sincerely", "request", "therefore"], answer: 0, hints: ["Everyday or slang?", "Friends say it.", "Awesome."], explain: "'Awesome' is informal." },
      { type: "mcq", q: "What is the formal version of 'can't'?", options: ["cannot", "cant", "can'tt", "can not't"], answer: 0, hints: ["Write the full form.", "No apostrophe.", "Cannot."], explain: "'Cannot' is the full, formal form." }
    ],
    reflect: R("Thinking about the reader", "Spotting slang and short forms"),
    parent: "Your child practised choosing formal or informal language.",
    teacher: "Shows adapting register to audience and purpose, using formal vocabulary and full forms where appropriate.",
    done: "Think about who is reading: formal for official, informal for friends." },

  { ...S, id: "camp6-circuits", grade: 6, title: "Circuits, conductors and insulators", topic: "Physics: electricity",
    caps: cs(6, "Physics (simple circuits; conductors and insulators; switches)"),
    intention: "Today I am building circuits and testing materials.", prompt: "Why are electrical wires covered in plastic?",
    lesson: [
      { h: "A complete circuit", say: "A bulb lights when there is a complete loop. The loop goes from the cell, through the wires and bulb, and back to the cell. A gap stops the current.", html: chainRow(["Cell", "Wire", "Bulb", "Wire", "back to cell"]) },
      { h: "Switches", say: "A switch makes or breaks the circuit. When it is open, there is a gap and the bulb goes off.", html: chainRow(["Switch closed: bulb on", "Switch open: bulb off"]) },
      { h: "Conductors and insulators", say: "Conductors let electricity flow, like metals. Insulators don't, like plastic, rubber and wood. Wires are metal inside and plastic outside, to keep us safe.", html: chainRow(["Conductors: copper, steel", "Insulators: plastic, rubber, wood"]) }
    ],
    example: { q: "A bulb doesn't light. One wire isn't touching the cell. Why?", steps: ["The circuit has a gap.", "Electricity can't flow around a broken loop.", "Connect the wire to complete the circuit."] },
    questions: [
      { type: "mcq", q: "What does a bulb need to light up?", options: ["A complete circuit", "A gap in the circuit", "Only one wire", "Water"], answer: 0, hints: ["Electricity flows in a loop.", "No gaps.", "Complete."], explain: "The circuit must be a complete loop." },
      { type: "mcq", q: "Which material is a conductor?", options: ["Copper", "Plastic", "Rubber", "Wood"], answer: 0, hints: ["Metals conduct.", "Wires are made of it.", "Copper."], explain: "Copper is a metal conductor." },
      { type: "mcq", q: "Why are wires covered in plastic?", options: ["Plastic is an insulator, so it keeps us safe", "Plastic makes the bulb brighter", "Plastic is a conductor", "For decoration only"], answer: 0, hints: ["Plastic doesn't let electricity through.", "It protects us.", "Insulator."], explain: "The plastic insulates, so we don't get a shock." },
      { type: "mcq", q: "What happens when you open a switch?", options: ["The bulb goes off", "The bulb gets brighter", "Nothing", "The cell charges"], answer: 0, hints: ["Open means a gap.", "The circuit breaks.", "Off."], explain: "An open switch breaks the circuit." }
    ],
    reflect: R("Tracing the loop", "Testing materials", "How switches work"),
    parent: "Your child built circuits in theory and sorted conductors from insulators.",
    teacher: "Shows identifying complete circuits, explaining switches and classifying conductors and insulators.",
    done: "A complete loop lights the bulb. Metals conduct; plastic insulates." }
  );
}
