"use strict";

// ---------- IB Primary Years Programme (Grades 1 to 6), for the new app only. Original content. ----------
// Each lesson opens with a central idea, a key concept and a learner profile attribute. Each grade's inquiry lesson
// follows one of the six transdisciplinary themes.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const IB = { curriculum: "IB" };
  const MA = { ...IB, subject: "Mathematics", domain: "Logical and Analytical Thinking" };
  const LA = { ...IB, subject: "Language", domain: "Communication and Expression" };
  const BIG = t => `<p style="font-size:2rem;margin:0">${t}</p>`;
  const IDEA = (idea, concept, profile, theme) => ({ h: theme ? `Theme: ${theme}` : "Central idea",
    say: `${theme ? `Our theme is ${theme}. ` : ""}Central idea: ${idea} Key concept: ${concept}. Today we are ${profile.toLowerCase()}.`,
    html: P(`<b>Central idea:</b> ${idea}`) + P(`Key concept: <b>${concept}</b> · Learner profile: <b>${profile}</b>`) });
  const pyp = (subject, focus, theme) => `IB PYP ${subject}${theme ? `, transdisciplinary theme '${theme}'` : ""}: ${focus}`;

  PLATFORM_UNITS.push(
  // ===================== GRADE 1 =====================
  { ...MA, id: "pyp1-measure", grade: 1, title: "Longer and shorter", topic: "Measurement", category: "Pattern Thinking",
    caps: pyp("Mathematics", "measurement (comparing and ordering lengths; non-standard units)"),
    intention: "Today I am comparing how long things are.", prompt: "Who is the tallest person in your family?",
    lesson: [
      IDEA("We compare and measure things to describe our world.", "Form", "Inquirers"),
      { h: "Longer and shorter", say: "Put two things side by side, starting at the same line. The one that goes further is longer.", html: BIG("✏️<br>🖍️") + P("The pencil is <b>longer</b> than the crayon.") },
      { h: "Measuring with hands", say: "We can measure with hand spans or paper clips. The table is 6 hand spans long.", html: P("Table: 🖐️🖐️🖐️🖐️🖐️🖐️ = <b>6 hand spans</b>") }
    ],
    example: { q: "A book is 4 paper clips long. A pencil is 6 paper clips long. Which is longer?", steps: ["Compare the numbers: 4 and 6.", "6 is more than 4.", "The pencil is longer."] },
    questions: [
      { type: "mcq", q: "Which is longer?", pics: ["🐍", "🐛"], options: ["The snake", "The caterpillar"], answer: 0, hints: ["Which stretches further?", "Snakes are long.", "The snake."], explain: "The snake is longer." },
      { type: "mcq", q: "Why do we line things up at the same start?", options: ["So the comparison is fair", "To make them look nice", "Because it is faster", "It doesn't matter"], answer: 0, hints: ["If one starts further ahead…", "…it might look longer.", "Fair."], explain: "Starting at the same line makes the comparison fair." },
      { type: "num", q: "A desk is 5 hand spans. A rug is 9 hand spans. How many more hand spans is the rug?", answer: "4", options: ["4", "14", "5", "9"], hints: ["Find the difference.", "9 − 5.", "4."], explain: "9 − 5 = 4 hand spans." },
      { type: "order", q: "Put them in order, shortest first.", items: ["Ant", "Cat", "Giraffe"], orderLabel: "shortest to longest", hints: ["Which is tiny?", "Which is in the middle?", "Which is very tall?"], explain: "Ant, cat, giraffe." }
    ],
    reflect: R("Lining things up", "Counting hand spans"),
    parent: "Your child compared and measured lengths using hands and paper clips.",
    teacher: "Shows comparing and ordering lengths and measuring with non-standard units (inquirer).",
    done: "Line things up to compare. Count units to measure." },

  { ...LA, id: "pyp1-story", grade: 1, title: "Beginning, middle and end", topic: "Reading and storytelling", category: "Creativity",
    caps: pyp("Language", "reading and oral language (story structure: beginning, middle and end)"),
    intention: "Today I am finding the beginning, middle and end of a story.", prompt: "What is your favourite story?",
    lesson: [
      IDEA("Stories help us share ideas and feelings.", "Form", "Communicators"),
      { h: "Every story has three parts", say: "The beginning tells us who and where. The middle has a problem. The end tells us how it was solved.", html: chainRow(["Beginning: who and where", "Middle: a problem", "End: solved"]) },
      { h: "A little story", say: "Lindi planted a seed. The seed did not grow because there was no rain. Lindi watered it every day, and it grew into a sunflower.", html: BIG("🌱 🌧️ 🌻") }
    ],
    example: { q: "What is the problem in Lindi's story?", steps: ["Look at the middle.", "The seed did not grow.", "There was no rain."] },
    questions: [
      { type: "mcq", q: "How does Lindi's story begin?", pics: ["🌱", "🌻", "🌧️"], options: ["Lindi plants a seed", "A sunflower grows", "It rains"], answer: 0, hints: ["What happens first?", "Before the problem.", "She plants a seed."], explain: "The story begins when Lindi plants a seed." },
      { type: "mcq", q: "How does the story end?", pics: ["🌻", "🌱", "☀️"], options: ["It grows into a sunflower", "She plants a seed", "The sun shines"], answer: 0, hints: ["What happens last?", "After she waters it.", "A sunflower."], explain: "It ends when the seed grows into a sunflower." },
      { type: "order", q: "Put the story in order.", items: ["Lindi planted a seed", "It did not grow", "She watered it every day", "It grew into a sunflower"], orderLabel: "first to last", hints: ["Start with planting.", "Then the problem.", "Watering comes before growing."], explain: "Plant, problem, water, grow." },
      { type: "mcq", q: "What does the middle of a story usually have?", options: ["A problem", "The title", "The end", "Nothing"], answer: 0, hints: ["Something goes wrong.", "In the middle.", "A problem."], explain: "The middle usually has a problem." }
    ],
    reflect: R("The pictures", "Retelling the story"),
    parent: "Your child found the beginning, middle and end of a story.",
    teacher: "Shows identifying story structure and sequencing events (communicator).",
    done: "Beginning, middle with a problem, and an end that solves it." },

  { ...IB, subject: "Personal, Social and Physical Education", id: "pyp1-healthy", grade: 1, title: "Keeping my body healthy", topic: "Who we are: health", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: pyp("PSPE", "healthy choices: food, sleep, exercise and hygiene", "Who we are"),
    intention: "Today I am finding out what my body needs to be healthy.", prompt: "What do you do to feel strong and well?",
    lesson: [
      IDEA("The choices we make help our bodies stay healthy.", "Responsibility", "Balanced", "Who we are"),
      { h: "What my body needs", say: "My body needs healthy food, water, sleep and exercise to grow strong.", html: BIG("🍎 💧 😴 🏃") },
      { h: "Every day", say: "Playing outside, eating fruit and vegetables, and washing my hands help me stay healthy.", html: chainRow(["Play", "Eat well", "Wash hands", "Sleep"]) }
    ],
    example: { q: "Is an apple or a packet of sweets a healthier snack?", steps: ["An apple has vitamins and fibre.", "Sweets have lots of sugar.", "The apple is healthier."] },
    questions: [
      { type: "mcq", q: "Which is a healthy snack?", pics: ["🍌", "🍭", "🍟"], options: ["A banana", "A lollipop", "Chips"], answer: 0, hints: ["Which grows on a plant?", "Fruit.", "A banana."], explain: "Fruit is a healthy snack." },
      { type: "mcq", q: "What does your body need every night?", pics: ["😴", "📱", "🍬"], options: ["Sleep", "A phone", "Sweets"], answer: 0, hints: ["At night we…", "…rest.", "Sleep."], explain: "Sleep helps your body grow and rest." },
      { type: "mcq", q: "Which keeps your body strong?", pics: ["🏃", "📺", "🛋️"], options: ["Running and playing", "Watching TV all day", "Sitting all day"], answer: 0, hints: ["Move your body.", "Exercise.", "Running."], explain: "Exercise keeps you strong." },
      { type: "mcq", q: "What should you drink most?", pics: ["💧", "🥤", "🧋"], options: ["Water", "Fizzy drinks", "Sweet tea"], answer: 0, hints: ["It has no sugar.", "From the tap.", "Water."], explain: "Water is the best drink." }
    ],
    reflect: R("The pictures", "Thinking about my day"),
    parent: "Your child explored food, sleep and exercise choices that keep them healthy.",
    teacher: "Who we are: shows identifying healthy choices and taking responsibility for wellbeing (balanced).",
    done: "Healthy food, water, sleep and play keep me strong." },

  // ===================== GRADE 2 =====================
  { ...MA, id: "pyp2-data", grade: 2, title: "Pictographs", topic: "Data handling", category: "Inquiry and Exploration",
    caps: pyp("Mathematics", "data handling (collecting data; tally charts; pictographs)"),
    intention: "Today I am showing information in a pictograph.", prompt: "What is the favourite fruit in your class?",
    lesson: [
      IDEA("We collect and show information to answer questions.", "Function", "Inquirers"),
      { h: "Tally marks", say: "We use tally marks to count. Four lines, then a fifth line across, make a group of 5.", html: P("𝍸 = 5") },
      { h: "Pictographs", say: "A pictograph uses pictures to show numbers. Each picture stands for one vote.", html: P("🍎 🍎 🍎 🍎 Apples: 4") + P("🍌 🍌 Bananas: 2") + P("🍊 🍊 🍊 Oranges: 3") }
    ],
    example: { q: "Which fruit is the most popular in the pictograph?", steps: ["Count the pictures for each fruit.", "Apples 4, bananas 2, oranges 3.", "Apples are the most popular."] },
    questions: [
      { type: "mcq", q: "Apples 4, bananas 2, oranges 3. Which is least popular?", pics: ["🍌", "🍎", "🍊"], options: ["Bananas", "Apples", "Oranges"], answer: 0, hints: ["Find the smallest number.", "2 is smallest.", "Bananas."], explain: "Bananas have the fewest votes: 2." },
      { type: "num", q: "Apples 4, bananas 2, oranges 3. How many children voted altogether?", answer: "9", options: ["9", "4", "7", "10"], hints: ["Add all the votes.", "4 + 2 + 3.", "9."], explain: "4 + 2 + 3 = 9." },
      { type: "num", q: "How many more children chose apples than bananas?", answer: "2", options: ["2", "6", "4", "1"], hints: ["Apples 4, bananas 2.", "4 − 2.", "2."], explain: "4 − 2 = 2." },
      { type: "num", q: "How many does a full tally group stand for?", answer: "5", options: ["5", "4", "10", "1"], hints: ["Four lines and one across.", "Count them.", "5."], explain: "A tally group stands for 5." }
    ],
    reflect: R("Counting the pictures", "Using tally marks"),
    parent: "Your child collected votes and showed them in a pictograph.",
    teacher: "Shows collecting data with tallies, representing it in a pictograph and answering comparison questions (inquirer).",
    done: "Count with tallies, show with pictures, then compare." },

  { ...LA, id: "pyp2-describe", grade: 2, title: "Describing words", topic: "Writing: description", category: "Creativity",
    caps: pyp("Language", "writing (using adjectives and the senses to describe)"),
    intention: "Today I am using describing words to paint a picture.", prompt: "How would you describe your favourite place?",
    lesson: [
      IDEA("Describing words help readers picture what we imagine.", "Perspective", "Communicators"),
      { h: "Describing words", say: "Describing words tell us more about a thing. A dog becomes a fluffy brown dog.", html: P("a dog → a <b>fluffy brown</b> dog") },
      { h: "Use your senses", say: "Describe how something looks, sounds, smells, feels and tastes. The crunchy, sweet apple.", html: chainRow(["Looks", "Sounds", "Smells", "Feels", "Tastes"]) }
    ],
    example: { q: "Make this more interesting: 'I ate a mango.'", steps: ["How did it taste? Sweet.", "How did it feel? Juicy.", "'I ate a sweet, juicy mango.'"] },
    questions: [
      { type: "mcq", q: "Which is a describing word?", options: ["soft", "run", "cat", "and"], answer: 0, hints: ["It tells you more about a thing.", "How it feels.", "Soft."], explain: "'Soft' describes how something feels." },
      { type: "mcq", q: "Which sense does 'crunchy' use?", pics: ["👂", "👃", "👁️"], options: ["Hearing (and taste)", "Smell", "Sight"], answer: 0, hints: ["You hear a crunch.", "When you bite.", "Hearing."], explain: "You hear the crunch as you bite." },
      { type: "mcq", q: "Which sentence paints the best picture?", options: ["The tiny, shivering puppy hid under the bed.", "The puppy hid.", "There was a puppy.", "Puppy."], answer: 0, hints: ["Which has describing words?", "Tiny, shivering.", "The first."], explain: "'Tiny' and 'shivering' help us picture the puppy." },
      { type: "mcq", q: "Which word describes the smell of bread baking?", options: ["warm", "loud", "blue", "fast"], answer: 0, hints: ["Bread smells cosy.", "Fresh from the oven.", "Warm."], explain: "'Warm' fits the smell of fresh bread." }
    ],
    reflect: R("Using my senses", "Adding describing words"),
    parent: "Your child used describing words and the senses in their writing.",
    teacher: "Shows using adjectives and sensory language to enrich description (communicator).",
    done: "Use describing words and your senses to paint a picture." },

  { ...IB, subject: "Social Studies", id: "pyp2-then-now", grade: 2, title: "Then and now", topic: "Where we are in place and time", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: pyp("Social studies", "how daily life has changed over time; asking older people about the past", "Where we are in place and time"),
    intention: "Today I am finding out how life has changed over time.", prompt: "What was life like when your grandparents were children?",
    lesson: [
      IDEA("Daily life changes over time, and we can learn about the past by asking questions.", "Change", "Inquirers", "Where we are in place and time"),
      { h: "Then and now", say: "Long ago, people cooked on wood fires and listened to the radio. Now many people use electric stoves and watch videos on phones.", html: chainRow(["Then: wood fire, radio", "Now: stove, phone"]) },
      { h: "Asking questions", say: "We can learn about the past by asking older people: What games did you play? How did you get to school?", html: P("Ask: <b>What was it like when you were young?</b>") }
    ],
    example: { q: "Gogo walked 5 km to school. Many children now take a taxi or bus. What has changed?", steps: ["Then: walking long distances.", "Now: transport is easier to find.", "How children travel to school has changed."] },
    questions: [
      { type: "mcq", q: "Which belongs to long ago?", pics: ["📻", "📱", "💻"], options: ["An old radio", "A smartphone", "A laptop"], answer: 0, hints: ["Which is the oldest?", "People listened to it.", "The radio."], explain: "Radios were common long before phones." },
      { type: "mcq", q: "How can we find out about the past?", options: ["Ask older people", "Guess", "Ignore it", "Only watch cartoons"], answer: 0, hints: ["Someone who was there.", "Grandparents.", "Ask them."], explain: "Asking older people helps us learn about the past." },
      { type: "mcq", q: "Which is a good question for Gogo?", options: ["'What games did you play as a child?'", "'Why are you old?'", "'Can I have sweets?'", "'Where is the TV?'"], answer: 0, hints: ["It is about the past.", "And polite.", "The first."], explain: "It asks politely about her childhood." },
      { type: "mcq", q: "What is something that has stayed the same?", options: ["Families eat meals together", "Everyone has a phone", "People cook on wood fires", "Nobody walks"], answer: 0, hints: ["Then and now.", "Something people still do.", "Eating together."], explain: "Families eating together hasn't changed." }
    ],
    reflect: R("Comparing then and now", "Asking good questions"),
    parent: "Your child explored how life has changed since their grandparents were young.",
    teacher: "Where we are in place and time: shows comparing past and present and formulating questions about the past (inquirer).",
    done: "Life changes over time. Ask questions to learn about the past." },

  // ===================== GRADE 3 =====================
  { ...MA, id: "pyp3-shapes", grade: 3, title: "2D shapes around us", topic: "Shape and space", category: "Pattern Thinking",
    caps: pyp("Mathematics", "shape and space (properties of 2D shapes; sides and corners)"),
    intention: "Today I am describing shapes by their sides and corners.", prompt: "What shapes can you see in your classroom?",
    lesson: [
      IDEA("Shapes have properties that help us describe and use them.", "Form", "Thinkers"),
      { h: "Sides and corners", say: "A triangle has 3 sides and 3 corners. A square has 4 equal sides and 4 corners. A circle has no corners.", html: chainRow(["△ 3 sides", "□ 4 sides", "○ 0 corners"]) },
      { h: "Shapes in our world", say: "Shapes are everywhere. A road sign might be a triangle. A window might be a rectangle. A clock is a circle.", html: BIG("⚠️ 🪟 🕐") }
    ],
    example: { q: "A shape has 5 sides. What is it called?", steps: ["Count the sides: 5.", "A 5-sided shape is a pentagon.", "It also has 5 corners."] },
    questions: [
      { type: "num", q: "How many sides does a triangle have?", answer: "3", options: ["3", "4", "5", "0"], hints: ["Tri means three.", "Count them.", "3."], explain: "A triangle has 3 sides." },
      { type: "mcq", q: "Which shape has no corners?", pics: ["⭕", "🔺", "⬛"], options: ["Circle", "Triangle", "Square"], answer: 0, hints: ["It is round.", "No points.", "Circle."], explain: "A circle has no corners." },
      { type: "num", q: "How many sides does a hexagon have?", answer: "6", options: ["6", "5", "8", "4"], hints: ["Like a honeycomb cell.", "Hex means six.", "6."], explain: "A hexagon has 6 sides." },
      { type: "mcq", q: "What makes a square different from other rectangles?", options: ["All 4 sides are equal", "It has 3 sides", "It is round", "It has no corners"], answer: 0, hints: ["Both have 4 sides.", "A square's sides are…", "…all equal."], explain: "A square has 4 equal sides." }
    ],
    reflect: R("Counting sides and corners", "Finding shapes around me"),
    parent: "Your child described shapes by their sides and corners.",
    teacher: "Shows identifying and describing 2D shapes by their properties (thinker).",
    done: "Describe shapes by counting their sides and corners." },

  { ...LA, id: "pyp3-poem", grade: 3, title: "Patterns in poems", topic: "Reading: poetry", category: "Creativity",
    caps: pyp("Language", "reading and writing poetry (rhythm, repetition and rhyme)"),
    intention: "Today I am finding patterns in a poem.", prompt: "Do you know a song you can clap along to?",
    lesson: [
      IDEA("Poets use patterns of sound to express ideas and feelings.", "Form", "Communicators"),
      { h: "A poem", say: "Rain on the roof, tap tap tap. Rain on the road, slap slap slap. Rain on my nose, I laugh, I clap!", html: P("Rain on the roof, tap tap tap.<br>Rain on the road, slap slap slap.<br>Rain on my nose, I laugh, I clap!") },
      { h: "Repetition and rhyme", say: "The poem repeats 'Rain on the'. Tap, slap and clap rhyme. Patterns make poems fun to say aloud.", html: chainRow(["Repetition: Rain on the…", "Rhyme: tap, slap, clap"]) }
    ],
    example: { q: "Which words rhyme in the poem?", steps: ["Look at the ends of the lines.", "Tap, slap, clap.", "They all end in 'ap'."] },
    questions: [
      { type: "mcq", q: "Which words are repeated at the start of each line?", options: ["Rain on the", "I laugh", "Tap tap", "My nose"], answer: 0, hints: ["Look at how each line starts.", "The same three words.", "Rain on the."], explain: "Each line begins with 'Rain on the'." },
      { type: "mcq", q: "Which word rhymes with 'tap'?", options: ["clap", "rain", "roof", "nose"], answer: 0, hints: ["Same ending sound.", "-ap.", "Clap."], explain: "Tap and clap both end in 'ap'." },
      { type: "mcq", q: "What sound does the rain make on the roof?", options: ["tap tap tap", "slap slap slap", "boom", "whoosh"], answer: 0, hints: ["Read the first line.", "On the roof.", "Tap tap tap."], explain: "On the roof it goes tap tap tap." },
      { type: "mcq", q: "How does the speaker feel at the end?", options: ["Happy", "Scared", "Angry", "Bored"], answer: 0, hints: ["Look at the last line.", "I laugh, I clap.", "Happy."], explain: "Laughing and clapping show happiness." }
    ],
    reflect: R("Saying it aloud", "Clapping the rhythm", "Finding the rhymes"),
    parent: "Your child found repetition and rhyme in a poem.",
    teacher: "Shows identifying repetition, rhyme and onomatopoeia in poetry and inferring mood (communicator).",
    done: "Poems use patterns: repetition, rhythm and rhyme." },

  { ...IB, subject: "Arts", id: "pyp3-symbols", grade: 3, title: "Patterns and symbols in art", topic: "How we express ourselves", domain: "Creativity and Metacognition", category: "Creativity",
    caps: pyp("Arts", "how cultures express ideas through patterns, colours and symbols", "How we express ourselves"),
    intention: "Today I am exploring how patterns and symbols share meaning.", prompt: "Which patterns or colours are special in your family?",
    lesson: [
      IDEA("People use patterns, colours and symbols to express who they are.", "Perspective", "Open-minded", "How we express ourselves"),
      { h: "Patterns with meaning", say: "Many cultures paint or bead patterns that carry meaning. Ndebele house paintings use bold shapes and colours, and beadwork colours can share messages.", html: BIG("🔺🔷🔺🔷") + P("Bold repeating shapes and colours") },
      { h: "Making my own", say: "You can design a pattern that tells people about you. Choose a colour you love and a shape that is special to you. Repeat them to make a pattern.", html: chainRow(["Choose colours", "Choose shapes", "Repeat"]) }
    ],
    example: { q: "Continue the pattern: red, blue, red, blue, …", steps: ["Look at what repeats.", "Red, then blue.", "The next colour is red."] },
    questions: [
      { type: "mcq", q: "What comes next? 🔺🔷🔺🔷", pics: ["🔺", "🔷", "⭐"], options: ["Triangle", "Diamond", "Star"], answer: 0, hints: ["Triangle, diamond, triangle, diamond…", "It repeats.", "Triangle."], explain: "The pattern repeats triangle, diamond." },
      { type: "mcq", q: "Why might people use special colours in beadwork?", options: ["To share messages and show who they are", "Because they ran out of other colours", "To make it heavier", "For no reason"], answer: 0, hints: ["Colours can have meaning.", "They express identity.", "Messages."], explain: "Colours and patterns can carry meaning." },
      { type: "mcq", q: "What is a pattern?", options: ["Something that repeats in a regular way", "A single dot", "A messy scribble", "A blank page"], answer: 0, hints: ["Look for repeating.", "In order.", "Repeats regularly."], explain: "A pattern repeats in a regular way." },
      { type: "mcq", q: "Which shows being open-minded about art from another culture?", options: ["Asking what the patterns mean", "Saying it is strange", "Ignoring it", "Laughing at it"], answer: 0, hints: ["Open-minded means curious and respectful.", "Ask questions.", "The first."], explain: "Asking about meaning shows respect and curiosity." }
    ],
    reflect: R("Continuing patterns", "Learning what symbols mean", "Designing my own"),
    parent: "Your child explored how patterns and colours in art share meaning.",
    teacher: "How we express ourselves: shows recognising patterns and symbols in cultural art forms and creating a personal pattern (open-minded).",
    done: "Patterns, colours and symbols can say who we are." },

  // ===================== GRADE 4 =====================
  { ...MA, id: "pyp4-fractions", grade: 4, title: "Fractions of a whole", topic: "Number: fractions", category: "Pattern Thinking",
    caps: pyp("Mathematics", "number (fractions as equal parts of a whole and of a set)"),
    intention: "Today I am finding fractions of shapes and groups.", prompt: "How would you share a pizza fairly among four friends?",
    lesson: [
      IDEA("Fractions help us share things fairly.", "Function", "Principled"),
      { h: "Equal parts", say: "A fraction is part of a whole that is split into equal parts. A pizza cut into 4 equal slices: each slice is one quarter.", html: BIG("🍕") + P("4 equal parts: each is <b>1/4</b>") },
      { h: "Fractions of a group", say: "To find a fraction of a group, divide by the bottom number. One third of 12 sweets is 12 divided by 3, which is 4.", html: P("1/3 of 12 = 12 ÷ 3 = <b>4</b>") }
    ],
    example: { q: "What is 2/5 of 20?", steps: ["Find 1/5: 20 ÷ 5 = 4.", "2/5 is two of those.", "2 × 4 = 8."] },
    questions: [
      { type: "mcq", q: "A cake is cut into 8 equal pieces. What fraction is one piece?", options: ["1/8", "1/4", "8", "1/2"], answer: 0, hints: ["8 equal parts.", "One of them.", "1/8."], explain: "One of 8 equal parts is 1/8." },
      { type: "num", q: "What is 1/4 of 16?", answer: "4", options: ["4", "12", "8", "64"], hints: ["Divide by 4.", "16 ÷ 4.", "4."], explain: "16 ÷ 4 = 4." },
      { type: "num", q: "What is 3/4 of 12?", answer: "9", options: ["9", "3", "4", "16"], hints: ["1/4 of 12 = 3.", "Three of those.", "3 × 3."], explain: "3 × 3 = 9." },
      { type: "mcq", q: "Why must the parts be equal?", options: ["So the sharing is fair", "To make more pieces", "Because it looks nice", "It doesn't matter"], answer: 0, hints: ["Fractions mean equal parts.", "Fair shares.", "Fairness."], explain: "Fractions only work when the parts are equal." }
    ],
    reflect: R("Drawing equal parts", "Dividing by the bottom number"),
    parent: "Your child found fractions of shapes and groups.",
    teacher: "Shows understanding fractions as equal parts and finding unit and non-unit fractions of sets (principled: fair sharing).",
    done: "Fractions are equal parts. Divide by the bottom number, multiply by the top." },

  { ...LA, id: "pyp4-persuade", grade: 4, title: "Persuasive posters", topic: "Writing: persuasion", category: "Communication",
    caps: pyp("Language", "writing and visual language (persuasive posters: slogans, images and reasons)"),
    intention: "Today I am designing a poster that persuades.", prompt: "Which poster has made you want to do something?",
    lesson: [
      IDEA("We can use words and images to persuade others to act.", "Causation", "Communicators"),
      { h: "A strong slogan", say: "A slogan is short and catchy: Turn it off! Save power!", html: P("<b>Turn it off! Save power!</b>") },
      { h: "Images and reasons", say: "A good poster has a clear picture, a reason, and tells people exactly what to do.", html: chainRow(["Slogan", "Picture", "Reason", "What to do"]) }
    ],
    example: { q: "Write a slogan for a poster about picking up litter.", steps: ["Keep it short.", "Make it catchy.", "'Bin it, don't drop it!'"] },
    questions: [
      { type: "mcq", q: "Which is the best slogan?", options: ["Bin it, don't drop it!", "Litter exists in many places around the school grounds.", "Hello.", "Rubbish."], answer: 0, hints: ["Short and catchy.", "Tells you what to do.", "The first."], explain: "It is short, catchy and tells people what to do." },
      { type: "mcq", q: "What should a persuasive poster tell people?", options: ["Exactly what to do", "A long story", "Nothing", "Only the date"], answer: 0, hints: ["Persuade means get them to act.", "An action.", "What to do."], explain: "It should give a clear action." },
      { type: "mcq", q: "Why add a picture?", options: ["To catch people's attention quickly", "To fill space", "Because words are banned", "To confuse people"], answer: 0, hints: ["People walk past posters.", "Pictures are quick to see.", "Attention."], explain: "Pictures catch attention fast." },
      { type: "mcq", q: "Which reason best persuades people to save water?", options: ["'Every drop we save helps our town in a drought.'", "'Water is wet.'", "'I like water.'", "'Taps are metal.'"], answer: 0, hints: ["It explains why it matters.", "A real reason.", "The first."], explain: "It gives a real reason that matters." }
    ],
    reflect: R("Making a catchy slogan", "Choosing a picture", "Giving a reason"),
    parent: "Your child designed a persuasive poster with a slogan, image and reason.",
    teacher: "Shows combining slogans, images and reasons to persuade an audience to act (communicator).",
    done: "Catchy slogan, clear picture, a reason, and what to do." },

  { ...IB, subject: "Science", id: "pyp4-machines", grade: 4, title: "Simple machines", topic: "How the world works", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: pyp("Science", "simple machines (levers, wheels, ramps) make work easier", "How the world works"),
    intention: "Today I am finding out how simple machines make work easier.", prompt: "How would you lift something too heavy to carry?",
    lesson: [
      IDEA("People use simple machines to make work easier.", "Function", "Thinkers", "How the world works"),
      { h: "Levers", say: "A lever is a bar that turns on a point called a fulcrum. A see-saw and a bottle opener are levers.", html: chainRow(["See-saw", "Bottle opener", "Wheelbarrow"]) },
      { h: "Ramps and wheels", say: "A ramp lets you push something up gradually instead of lifting it straight up. Wheels make it easier to move heavy loads.", html: chainRow(["Ramp: less effort", "Wheel: rolls the load"]) }
    ],
    example: { q: "Why is a wheelbarrow easier than carrying bricks?", steps: ["The wheel rolls, so you don't drag the load.", "The handles act as a lever.", "Together they make the load feel lighter to move."] },
    questions: [
      { type: "mcq", q: "Which is a lever?", pics: ["🎢", "🪜", "🧱"], options: ["A see-saw", "A ladder", "A brick"], answer: 0, hints: ["It turns on a point.", "Up and down.", "See-saw."], explain: "A see-saw turns on a fulcrum." },
      { type: "mcq", q: "What is a fulcrum?", options: ["The point a lever turns on", "A type of wheel", "A heavy load", "A ramp"], answer: 0, hints: ["The middle of a see-saw.", "Where it balances.", "The turning point."], explain: "The fulcrum is the turning point of a lever." },
      { type: "mcq", q: "Why use a ramp to load a heavy box onto a truck?", options: ["It takes less effort than lifting straight up", "It is faster to climb", "Boxes like ramps", "It makes the box lighter"], answer: 0, hints: ["Push gradually.", "Instead of lifting.", "Less effort."], explain: "A ramp spreads the effort over a longer distance." },
      { type: "mcq", q: "What do wheels help with?", options: ["Moving heavy loads more easily", "Making things heavier", "Stopping things", "Lifting straight up"], answer: 0, hints: ["They roll.", "Less dragging.", "Moving loads."], explain: "Wheels roll, making loads easier to move." }
    ],
    reflect: R("Finding machines at home", "Thinking about effort"),
    parent: "Your child explored how levers, ramps and wheels make work easier.",
    teacher: "How the world works: shows identifying simple machines and explaining how they reduce effort (thinker).",
    done: "Levers, ramps and wheels make work easier." },

  // ===================== GRADE 5 =====================
  { ...MA, id: "pyp5-area-perimeter", grade: 5, title: "Area and perimeter", topic: "Measurement", category: "Problem Solving",
    caps: pyp("Mathematics", "measurement (perimeter and area of rectangles)"),
    intention: "Today I am finding the perimeter and area of rectangles.", prompt: "How much fencing would a school garden need?",
    lesson: [
      IDEA("Measuring space helps us plan and build.", "Function", "Thinkers"),
      { h: "Perimeter", say: "Perimeter is the distance all the way around a shape. Add up all the sides. A rectangle 5 metres by 3 metres has a perimeter of 16 metres.", html: P("5 + 3 + 5 + 3 = <b>16 m</b>") },
      { h: "Area", say: "Area is the space inside a shape, measured in squares. Multiply length by width: 5 times 3 is 15 square metres.", html: P("5 × 3 = <b>15 m²</b>") }
    ],
    example: { q: "A garden bed is 6 m long and 2 m wide. Find the perimeter and area.", steps: ["Perimeter: 6 + 2 + 6 + 2 = 16 m.", "Area: 6 × 2 = 12 m².", "Fencing needs 16 m; soil covers 12 m²."] },
    questions: [
      { type: "num", q: "Find the perimeter of a rectangle 4 m by 2 m, in metres.", answer: "12", options: ["12", "8", "6", "16"], hints: ["Add all four sides.", "4 + 2 + 4 + 2.", "12."], explain: "4 + 2 + 4 + 2 = 12 m." },
      { type: "num", q: "Find the area of a rectangle 7 cm by 3 cm, in cm².", answer: "21", options: ["21", "20", "10", "14"], hints: ["Length × width.", "7 × 3.", "21."], explain: "7 × 3 = 21 cm²." },
      { type: "mcq", q: "You want to put a fence around a field. What do you need?", options: ["The perimeter", "The area", "The weight", "The height"], answer: 0, hints: ["A fence goes around.", "Distance around.", "Perimeter."], explain: "A fence goes around, so you need the perimeter." },
      { type: "mcq", q: "You want to cover a floor with tiles. What do you need?", options: ["The area", "The perimeter", "The temperature", "The time"], answer: 0, hints: ["Tiles cover the inside.", "Space inside.", "Area."], explain: "Tiles cover the space inside: the area." }
    ],
    reflect: R("Around or inside?", "Adding sides", "Multiplying length by width"),
    parent: "Your child worked out the perimeter and area of rectangles.",
    teacher: "Shows calculating perimeter and area of rectangles and choosing the right measure for a task (thinker).",
    done: "Perimeter: around. Area: inside (length × width)." },

  { ...LA, id: "pyp5-news", grade: 5, title: "Writing a news report", topic: "Writing: recounts", category: "Planning and Organisation",
    caps: pyp("Language", "writing (news reports: headline, the five Ws, and order of importance)"),
    intention: "Today I am writing a news report.", prompt: "What news happened at school this week?",
    lesson: [
      IDEA("News reports tell people what happened, clearly and fairly.", "Responsibility", "Principled"),
      { h: "The five Ws", say: "A news report answers who, what, where, when and why in the first paragraph.", html: chainRow(["Who?", "What?", "Where?", "When?", "Why?"]) },
      { h: "Headline and order", say: "A headline is short and grabs attention. The most important facts come first, then the details. A good reporter checks facts and stays fair.", html: P("<b>Learners Clean Up Riverbank</b>") }
    ],
    example: { q: "Write a first sentence for a report about a school clean-up.", steps: ["Who: Grade 5 learners. What: cleaned the river. Where: Mngeni River.", "When: on Friday. Why: to protect wildlife.", "'On Friday, Grade 5 learners cleaned the banks of the Mngeni River to protect wildlife.'"] },
    questions: [
      { type: "mcq", q: "What is a headline?", options: ["A short title that grabs attention", "The last sentence", "A picture", "The writer's name"], answer: 0, hints: ["It is at the top.", "Short and bold.", "A title."], explain: "A headline is a short, attention-grabbing title." },
      { type: "mcq", q: "Which question is NOT one of the five Ws?", options: ["Which colour?", "Who?", "Where?", "Why?"], answer: 0, hints: ["Who, what, where, when, why.", "Which one is missing?", "Which colour?"], explain: "The five Ws are who, what, where, when and why." },
      { type: "mcq", q: "What comes first in a news report?", options: ["The most important facts", "The smallest details", "The writer's opinion", "A joke"], answer: 0, hints: ["Readers may stop early.", "Give them the key facts.", "Most important."], explain: "The most important facts come first." },
      { type: "mcq", q: "Why should a reporter check their facts?", options: ["So the report is true and fair", "To make it longer", "Because it is fun", "It doesn't matter"], answer: 0, hints: ["People trust the news.", "It must be true.", "True and fair."], explain: "Reporters are responsible for telling the truth." }
    ],
    reflect: R("The five Ws", "Writing a headline", "Checking facts"),
    parent: "Your child wrote a news report answering who, what, where, when and why.",
    teacher: "Shows structuring a news report with headline and five Ws, and recognising the responsibility to report accurately (principled).",
    done: "Headline, the five Ws first, then details. Check your facts." },

  { ...IB, subject: "Social Studies", id: "pyp5-trade", grade: 5, title: "How communities share and trade", topic: "How we organise ourselves", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: pyp("Social studies", "how communities organise trade, money and services", "How we organise ourselves"),
    intention: "Today I am finding out how communities trade and share.", prompt: "Where does the bread in your shop come from?",
    lesson: [
      IDEA("Communities organise trade and services so people can meet their needs.", "Connection", "Thinkers", "How we organise ourselves"),
      { h: "Needs and wants", say: "Needs are things we must have, like food, water and shelter. Wants are things we would like, like toys.", html: chainRow(["Needs: food, water, shelter", "Wants: toys, games"]) },
      { h: "Swapping and money", say: "Long ago, people swapped goods, called bartering. Today we usually use money, which makes trade easier. Shops, farms and transport are connected.", html: chainRow(["Farm grows wheat", "Bakery makes bread", "Truck delivers", "Shop sells"]) }
    ],
    example: { q: "Why is money easier than swapping?", steps: ["Swapping only works if both people want what the other has.", "Money can be used to buy anything.", "So money makes trade easier."] },
    questions: [
      { type: "mcq", q: "Which is a need?", pics: ["💧", "🎮", "🧸"], options: ["Water", "A game", "A teddy"], answer: 0, hints: ["We can't live without it.", "We drink it.", "Water."], explain: "Water is a need." },
      { type: "mcq", q: "What is bartering?", options: ["Swapping goods without money", "Saving money", "Building a shop", "Growing food"], answer: 0, hints: ["Long ago.", "Swapping.", "Without money."], explain: "Bartering is swapping goods directly." },
      { type: "order", q: "Put bread's journey in order.", items: ["Farm grows wheat", "Bakery makes bread", "Truck delivers it", "Shop sells it"], orderLabel: "first to last", hints: ["Wheat comes first.", "Bread is made from wheat.", "It is sold last."], explain: "Farm, bakery, truck, shop." },
      { type: "mcq", q: "What would happen if the trucks stopped running?", options: ["Shops would run out of bread", "Nothing", "Farms would close at once", "Bread would be cheaper"], answer: 0, hints: ["The bread can't reach the shop.", "Everything is connected.", "Empty shelves."], explain: "Without delivery, shops can't get bread." }
    ],
    reflect: R("Needs and wants", "Following the bread's journey", "Seeing connections"),
    parent: "Your child explored how communities trade and how goods reach shops.",
    teacher: "How we organise ourselves: shows distinguishing needs and wants and explaining connections in a supply chain (thinker).",
    done: "Communities are connected: farms, bakeries, transport and shops." },

  // ===================== GRADE 6 =====================
  { ...MA, id: "pyp6-averages", grade: 6, title: "Averages", topic: "Data handling", category: "Inquiry and Exploration",
    caps: pyp("Mathematics", "data handling (mean, median, mode and range)"),
    intention: "Today I am finding averages to describe data.", prompt: "How would you describe the 'typical' learner in your class?",
    lesson: [
      IDEA("Averages help us describe and compare groups of data.", "Perspective", "Thinkers"),
      { h: "Three averages", say: "The mean adds all the values and divides by how many. The median is the middle value when they are in order. The mode is the most common value.", html: chainRow(["Mean: add ÷ count", "Median: middle", "Mode: most common"]) },
      { h: "Range", say: "The range shows how spread out the data is: the highest minus the lowest.", html: P("Range = highest − lowest") }
    ],
    example: { q: "Find the mean of 4, 6, 8.", steps: ["Add: 4 + 6 + 8 = 18.", "There are 3 values.", "18 ÷ 3 = 6."] },
    questions: [
      { type: "num", q: "Find the mean of 2, 4, 6, 8.", answer: "5", options: ["5", "20", "4", "6"], hints: ["Add: 20.", "4 values.", "20 ÷ 4."], explain: "20 ÷ 4 = 5." },
      { type: "num", q: "Find the median of 3, 9, 5.", answer: "5", options: ["5", "9", "3", "17"], hints: ["Put them in order: 3, 5, 9.", "The middle value.", "5."], explain: "In order: 3, 5, 9. The median is 5." },
      { type: "num", q: "Find the mode of 2, 3, 3, 7, 3, 5.", answer: "3", options: ["3", "2", "7", "5"], hints: ["Most common.", "3 appears three times.", "3."], explain: "3 appears most often." },
      { type: "num", q: "Find the range of 12, 4, 9, 15.", answer: "11", options: ["11", "15", "4", "40"], hints: ["Highest − lowest.", "15 − 4.", "11."], explain: "15 − 4 = 11." }
    ],
    reflect: R("Putting data in order", "Knowing which average is which"),
    parent: "Your child found the mean, median, mode and range of data.",
    teacher: "Shows calculating and interpreting mean, median, mode and range (thinker).",
    done: "Mean, median and mode describe the centre; range describes the spread." },

  { ...LA, id: "pyp6-perspectives", grade: 6, title: "One event, two perspectives", topic: "Reading and writing: perspective", category: "Flexible Thinking",
    caps: pyp("Language", "reading and writing (perspective and point of view; writing as a character)"),
    intention: "Today I am retelling an event from a different perspective.", prompt: "Have you ever disagreed with a friend about what happened?",
    lesson: [
      IDEA("The same event can be seen in different ways, depending on who tells it.", "Perspective", "Open-minded"),
      { h: "Two tellings", say: "Zola says: I kicked the ball and accidentally broke the window. I felt terrible. Mr Pillay says: A ball came crashing through my window while I was reading. I got such a fright!", html: P("<b>Zola:</b> I felt terrible.") + P("<b>Mr Pillay:</b> I got such a fright!") },
      { h: "Why they differ", say: "Each person knows different things and feels differently. Zola knows it was an accident. Mr Pillay only sees a broken window.", html: P("Different knowledge → different <b>perspective</b>") }
    ],
    example: { q: "How might the window repairer tell the story?", steps: ["Think about what they see and care about.", "A job to do; glass to measure.", "'I was called to fix a window broken by a soccer ball. It took an hour.'"] },
    questions: [
      { type: "mcq", q: "How does Zola feel?", options: ["Sorry", "Proud", "Bored", "Excited"], answer: 0, hints: ["'I felt terrible.'", "It was an accident.", "Sorry."], explain: "Zola feels terrible and sorry." },
      { type: "mcq", q: "Why does Mr Pillay get a fright?", options: ["He didn't know a ball was coming", "He dislikes soccer", "He saw Zola kick it", "He was expecting it"], answer: 0, hints: ["He was reading.", "It was sudden.", "A surprise."], explain: "He didn't expect it, so it frightened him." },
      { type: "mcq", q: "What does Zola know that Mr Pillay doesn't?", options: ["It was an accident", "The window is broken", "It is a ball", "It is Saturday"], answer: 0, hints: ["Mr Pillay only sees the result.", "Zola knows the cause.", "An accident."], explain: "Zola knows it wasn't on purpose." },
      { type: "mcq", q: "Which shows being open-minded?", options: ["Listening to both sides before deciding", "Only believing your friend", "Refusing to listen", "Deciding straight away"], answer: 0, hints: ["Open-minded means considering others.", "Both sides.", "Listen first."], explain: "Hearing both perspectives is open-minded." }
    ],
    reflect: R("Comparing the two tellings", "Thinking about what each person knows"),
    parent: "Your child retold an event from different people's points of view.",
    teacher: "Shows recognising how perspective shapes a recount and writing from another character's point of view (open-minded).",
    done: "Who tells the story changes what we know and feel." },

  { ...IB, subject: "Science", id: "pyp6-water", grade: 6, title: "Water: who gets it?", topic: "Sharing the planet", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: pyp("Science and social studies", "access to clean water; the water cycle; conservation and fairness", "Sharing the planet"),
    intention: "Today I am inquiring into how we share water fairly.", prompt: "How much water do you think your family uses each day?",
    lesson: [
      IDEA("Water is a shared resource, and how we use it affects other people and living things.", "Responsibility", "Caring", "Sharing the planet"),
      { h: "The water cycle", say: "The sun heats water, which evaporates. It cools into clouds, falls as rain, and flows back to rivers and the sea. The same water goes round and round.", html: chainRow(["Evaporation", "Condensation", "Rain", "Rivers and sea"]) },
      { h: "Not everyone has enough", say: "Some communities have taps at home; others walk far to fetch water. During droughts, everyone must save water so there is enough to share.", html: P("Save water: short showers, fix leaks, collect rainwater.") }
    ],
    example: { q: "A leaking tap wastes 20 litres a day. How much is that in a week?", steps: ["7 days in a week.", "20 × 7.", "140 litres wasted."] },
    questions: [
      { type: "mcq", q: "What happens during evaporation?", options: ["Water is heated and turns into vapour", "Rain falls", "Water freezes", "Clouds disappear"], answer: 0, hints: ["The sun heats water.", "It rises.", "Vapour."], explain: "Heated water evaporates into vapour." },
      { type: "num", q: "A leaking tap wastes 15 litres a day. How much in 4 days, in litres?", answer: "60", options: ["60", "19", "11", "45"], hints: ["15 × 4.", "Count in fifteens.", "60."], explain: "15 × 4 = 60 litres." },
      { type: "mcq", q: "Which action saves water?", options: ["Fixing a leaking tap", "Leaving the tap running", "Washing the car every day", "Long showers"], answer: 0, hints: ["Stop the waste.", "Leaks waste water.", "Fix it."], explain: "Fixing leaks stops water being wasted." },
      { type: "mcq", q: "Why should we save water even if we have plenty at home?", options: ["Water is shared, so our use affects others", "Water is free", "Saving is boring", "It doesn't matter"], answer: 0, hints: ["Rivers and dams are shared.", "Other people need it.", "Shared."], explain: "Water comes from shared sources, so our choices affect others." }
    ],
    reflect: R("Following the water cycle", "Calculating water waste", "Thinking about others"),
    parent: "Your child inquired into how water is shared and how to save it.",
    teacher: "Sharing the planet: shows describing the water cycle, calculating waste and reasoning about fair access (caring).",
    done: "Water is shared. Our choices affect other people and living things." }
  );
}
