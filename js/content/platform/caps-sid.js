"use strict";

// ---------- CAPS for Learners with Severe Intellectual Disability (LSID), for the new app only. Original content. ----------
// Foundation Phase (Grades R to 3): functional Language, Maths and Life Skills in very small steps, with pictures.
// Work readiness (ages 14 to 18): practical lessons shown at any level from Grade 7 to Grade 12 (upTo).
// Based on the DBE's draft CAPS for SID (Grades R to 5): content at reduced depth, taught at a functional level.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const SID = { curriculum: "CAPS-SID", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation" };
  const WORK = { ...SID, subject: "Life and work skills", grade: 7, upTo: 12 };
  const BIG = t => `<p style="font-size:2rem;margin:0">${t}</p>`;
  const caps = (subject, focus) => `CAPS for Learners with Severe Intellectual Disability (draft): ${subject} (${focus})`;
  PLATFORM_UNITS.push(
  // ===================== FOUNDATION PHASE =====================
  { ...SID, id: "sid0-count", grade: 0, subject: "Mathematics", title: "Counting to 3", topic: "Counting", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: caps("Mathematics", "functional numeracy: counting objects to 3"),
    intention: "Today I am counting to 3.", prompt: "What can you count at home?",
    lesson: [
      { h: "One, two, three", say: "Let's count. One. Two. Three.", html: BIG("🍎 🍎 🍎") + P("1, 2, 3") },
      { h: "Touch and count", say: "Touch each thing once as you count. One apple. Two apples. Three apples.", html: chainRow(["🍎 1", "🍎 2", "🍎 3"]) },
      { h: "How many?", say: "The last number you say tells you how many. Three apples.", html: P("The last number tells <b>how many</b>.") }
    ],
    example: { q: "How many balls? ⚽ ⚽", steps: ["Touch the first ball: one.", "Touch the next ball: two.", "There are 2 balls."] },
    questions: [
      { type: "mcq", q: "How many stars? ⭐ ⭐ ⭐", pics: ["3️⃣", "1️⃣", "2️⃣"], options: ["3", "1", "2"], answer: 0, hints: ["Touch each star.", "One, two, three.", "3."], explain: "There are 3 stars." },
      { type: "mcq", q: "How many cups? ☕", pics: ["1️⃣", "3️⃣", "2️⃣"], options: ["1", "3", "2"], answer: 0, hints: ["Touch the cup.", "One.", "1."], explain: "There is 1 cup." },
      { type: "mcq", q: "Which picture shows 2 dogs?", pics: ["🐶🐶", "🐶", "🐶🐶🐶"], options: ["Two dogs", "One dog", "Three dogs"], answer: 0, hints: ["Count the dogs in each picture.", "One, two.", "Two dogs."], explain: "🐶🐶 shows 2 dogs." }
    ],
    reflect: R("Touching each one", "Saying the numbers aloud"),
    parent: "Your child counted up to 3 things, touching each one.",
    teacher: "Shows one-to-one correspondence and counting to 3 with concrete pictures (functional numeracy).",
    done: "Touch each one and count. The last number tells how many." },

  { ...SID, id: "sid0-colours", grade: 0, subject: "Life Skills", title: "My colours", topic: "Beginning knowledge: colours",
    caps: caps("Life Skills", "beginning knowledge: recognising and matching colours"),
    intention: "Today I am finding red, yellow and blue.", prompt: "What is your favourite colour?",
    lesson: [
      { h: "Red, yellow, blue", say: "This is red, like a tomato. This is yellow, like the sun. This is blue, like the sky.", html: BIG("🔴 🟡 🔵") + chainRow(["red", "yellow", "blue"]) },
      { h: "Colours around me", say: "Look around you. Can you find something red? Something yellow? Something blue?", html: BIG("🍅 🍌 💧") },
      { h: "The same colour", say: "Things can be the same colour. A tomato and a fire engine are both red.", html: BIG("🍅 🚒") + P("Both are <b>red</b>.") }
    ],
    example: { q: "What colour is the sun? ☀️", steps: ["Look at the sun.", "It is bright.", "The sun is yellow."] },
    questions: [
      { type: "mcq", q: "Which one is red?", pics: ["🔴", "🟡", "🔵"], options: ["Red", "Yellow", "Blue"], answer: 0, hints: ["Red is like a tomato.", "🍅", "The first one."], explain: "🔴 is red." },
      { type: "mcq", q: "What colour is a banana? 🍌", pics: ["🟡", "🔴", "🔵"], options: ["Yellow", "Red", "Blue"], answer: 0, hints: ["Look at the banana.", "Like the sun.", "Yellow."], explain: "A banana is yellow." },
      { type: "mcq", q: "Which colour is the sky?", pics: ["🔵", "🔴", "🟡"], options: ["Blue", "Red", "Yellow"], answer: 0, hints: ["Look up outside.", "Like water.", "Blue."], explain: "The sky is blue." }
    ],
    reflect: R("Looking at the pictures", "Finding colours around me"),
    parent: "Your child named and matched red, yellow and blue.",
    teacher: "Shows recognising, naming and matching three colours (Life Skills: beginning knowledge).",
    done: "Red, yellow and blue are all around us." },

  { ...SID, id: "sid1-hello", grade: 1, subject: "English Home Language", title: "Saying hello", topic: "Listening and speaking: greetings", domain: "Communication and Expression", category: "Communication",
    caps: caps("Home Language", "listening and speaking: greetings in everyday situations"),
    intention: "Today I am learning to say hello and goodbye.", prompt: "Who do you say hello to every day?",
    lesson: [
      { h: "Hello and goodbye", say: "When we meet someone, we say hello. When we leave, we say goodbye.", html: chainRow(["👋 Hello", "👋 Goodbye"]) },
      { h: "Look and smile", say: "When you say hello, look at the person and smile. You can wave too.", html: BIG("😊 👋") },
      { h: "My name", say: "You can say: Hello, my name is. Then say your name.", html: P("<b>Hello, my name is ___.</b>") }
    ],
    example: { q: "Gogo comes to visit. What do you say?", steps: ["Gogo has just arrived.", "We are meeting her.", "We say: Hello, Gogo!"] },
    questions: [
      { type: "mcq", q: "Your teacher arrives in the morning. What do you say?", pics: ["👋", "😴", "🍎"], options: ["Hello", "Goodnight", "Apple"], answer: 0, hints: ["You are meeting your teacher.", "We greet people we meet.", "Hello."], explain: "We say hello when we meet someone." },
      { type: "mcq", q: "Your friend is going home. What do you say?", pics: ["👋", "🎂", "🐶"], options: ["Goodbye", "Happy birthday", "Dog"], answer: 0, hints: ["Your friend is leaving.", "What do we say when someone leaves?", "Goodbye."], explain: "We say goodbye when someone leaves." },
      { type: "order", q: "Put it in order.", items: ["Look at the person", "Smile", "Say hello"], orderLabel: "first to last", hints: ["First we look.", "Then we smile.", "Then we say hello."], explain: "Look, smile, say hello." }
    ],
    reflect: R("Practising with someone", "The pictures"),
    parent: "Your child practised greeting people: hello, goodbye and saying their name.",
    teacher: "Shows using greetings in context with eye contact and gesture (functional listening and speaking).",
    done: "Look, smile, and say hello." },

  { ...SID, id: "sid1-teeth", grade: 1, subject: "Life Skills", title: "Brushing my teeth", topic: "Personal and social well-being: hygiene",
    caps: caps("Life Skills", "personal and social well-being: personal hygiene routines"),
    intention: "Today I am learning how to brush my teeth.", prompt: "When do you brush your teeth?",
    lesson: [
      { h: "Why we brush", say: "We brush our teeth to keep them clean and strong. We brush in the morning and at night.", html: chainRow(["☀️ morning", "🌙 night"]) },
      { h: "What I need", say: "You need a toothbrush, toothpaste and water. Use a little toothpaste, the size of a pea.", html: P("Toothbrush · toothpaste · 💧 water") },
      { h: "How to brush", say: "Wet the brush. Put on toothpaste. Brush every tooth, front and back. Spit and rinse.", html: chainRow(["Wet", "Toothpaste", "Brush", "Spit"]) }
    ],
    example: { q: "It is bedtime. What do you do before you sleep?", steps: ["It is night.", "We brush our teeth at night.", "Brush your teeth, then sleep."] },
    questions: [
      { type: "mcq", q: "When do we brush our teeth?", pics: ["🌙", "🏫", "⚽"], options: ["At night, before bed", "Only at school", "When playing soccer"], answer: 0, hints: ["Morning and…", "…night.", "Before bed."], explain: "We brush in the morning and at night." },
      { type: "mcq", q: "What do we brush our teeth with?", pics: ["🪥", "🍴", "🖍️"], options: ["A toothbrush", "A fork", "A crayon"], answer: 0, hints: ["It has soft bristles.", "Not for eating or drawing.", "A toothbrush."], explain: "We use a toothbrush." },
      { type: "order", q: "Put the steps in order.", items: ["Wet the brush", "Put on toothpaste", "Brush every tooth", "Spit and rinse"], orderLabel: "first to last", hints: ["First we wet the brush.", "Toothpaste comes next.", "Spit and rinse comes last."], explain: "Wet, toothpaste, brush, spit and rinse." }
    ],
    reflect: R("Doing the steps in order", "Practising at home"),
    parent: "Your child learnt when and how to brush their teeth.",
    teacher: "Shows sequencing a personal hygiene routine (personal and social well-being).",
    done: "Brush in the morning and at night, every tooth." },

  { ...SID, id: "sid2-coins", grade: 2, subject: "Mathematics", title: "Coins I can use", topic: "Money", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: caps("Mathematics", "functional numeracy: recognising rand coins and paying"),
    intention: "Today I am learning R1, R2 and R5 coins.", prompt: "What would you like to buy at the shop?",
    lesson: [
      { h: "Rand coins", say: "In South Africa we use rand. These are coins: one rand, two rand and five rand.", html: chainRow(["R1", "R2", "R5"]) },
      { h: "Which is worth more?", say: "Five rand is worth more than two rand. Two rand is worth more than one rand.", html: P("<b>R5</b> buys the most.") },
      { h: "Paying", say: "To pay two rand, you can give one R2 coin, or two R1 coins.", html: P("R1 + R1 = <b>R2</b>") }
    ],
    example: { q: "A sweet costs R2. You have R1 and R1. Can you buy it?", steps: ["Count your money: R1 and R1.", "R1 + R1 = R2.", "Yes, you can buy the sweet."] },
    questions: [
      { type: "mcq", q: "Which coin is worth the most?", options: ["R5", "R2", "R1"], answer: 0, hints: ["Look at the numbers.", "Which number is biggest?", "5."], explain: "R5 is worth the most." },
      { type: "mcq", q: "Two R1 coins make…", options: ["R2", "R5", "R1"], answer: 0, hints: ["R1 and R1.", "1 + 1.", "R2."], explain: "R1 + R1 = R2." },
      { type: "mcq", q: "An apple costs R5. Which coin pays for it?", options: ["One R5 coin", "One R1 coin", "One R2 coin"], answer: 0, hints: ["The apple costs R5.", "Which coin is R5?", "The R5 coin."], explain: "One R5 coin pays R5." }
    ],
    reflect: R("Looking at the numbers on coins", "Adding coins together"),
    parent: "Your child recognised R1, R2 and R5 and used them to pay.",
    teacher: "Shows recognising South African coins, comparing their value and making simple amounts (functional numeracy: money).",
    done: "R5 is worth the most. R1 + R1 = R2." },

  { ...SID, id: "sid2-feelings", grade: 2, subject: "Life Skills", title: "How I feel", topic: "Personal and social well-being: feelings", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: caps("Life Skills", "personal and social well-being: naming and managing feelings"),
    intention: "Today I am naming my feelings.", prompt: "How do you feel today?",
    lesson: [
      { h: "Feelings", say: "Everyone has feelings. We can feel happy, sad, angry or scared.", html: chainRow(["😊 happy", "😢 sad", "😠 angry", "😨 scared"]) },
      { h: "My body tells me", say: "When I am angry, my face gets hot and my hands make fists. When I am sad, I might cry.", html: P("Notice your <b>body</b>.") },
      { h: "What I can do", say: "When I have a big feeling, I can breathe slowly, ask for a hug, or tell a grown-up.", html: chainRow(["Breathe slowly", "Ask for a hug", "Tell a grown-up"]) }
    ],
    example: { q: "Sipho's tower fell down. His hands are fists and his face is red. How does he feel?", steps: ["Look at the clues: fists and a red face.", "These are clues for angry.", "Sipho feels angry. He can breathe slowly."] },
    questions: [
      { type: "mcq", q: "Which face is happy?", pics: ["😊", "😢", "😠"], options: ["Happy", "Sad", "Angry"], answer: 0, hints: ["Look for a smile.", "Happy faces smile.", "The first one."], explain: "😊 is happy." },
      { type: "mcq", q: "Thandi lost her toy and is crying. How does she feel?", pics: ["😢", "😊", "😴"], options: ["Sad", "Happy", "Sleepy"], answer: 0, hints: ["She is crying.", "Crying can mean…", "…sad."], explain: "Thandi feels sad." },
      { type: "mcq", q: "You feel very angry. What can you do?", pics: ["🌬️", "👊", "🏃"], options: ["Breathe slowly", "Hit someone", "Run away from everyone"], answer: 0, hints: ["Choose something safe.", "Something that calms you.", "Breathe slowly."], explain: "Breathing slowly helps the angry feeling get smaller." }
    ],
    reflect: R("The faces", "Thinking about my body"),
    parent: "Your child named feelings and practised a safe way to calm down.",
    teacher: "Shows naming four basic emotions, recognising body cues and choosing a calming strategy (personal and social well-being).",
    done: "I can name my feelings and ask for help." },

  { ...SID, id: "sid3-signs", grade: 3, subject: "English Home Language", title: "Signs I need to know", topic: "Reading: functional signs", domain: "Communication and Expression", category: "Communication",
    caps: caps("Home Language", "functional reading: everyday sign words and symbols"),
    intention: "Today I am reading important signs.", prompt: "What signs do you see on the way to school?",
    lesson: [
      { h: "Signs help us", say: "Signs tell us important things. Some signs have words. Some signs have pictures.", html: BIG("🚻 🛑 🚪") },
      { h: "Important words", say: "Stop means do not go. Toilet shows where the bathroom is. Exit shows the way out.", html: chainRow(["STOP", "TOILET", "EXIT"]) },
      { h: "Danger", say: "Danger means stay away. If you see a danger sign, do not touch, and tell a grown-up.", html: P("⚠️ <b>DANGER</b>: stay away.") }
    ],
    example: { q: "You need the bathroom at the shops. Which sign do you look for?", steps: ["You need the bathroom.", "The bathroom sign says TOILET.", "Look for the TOILET sign 🚻."] },
    questions: [
      { type: "mcq", q: "What does STOP mean?", pics: ["🛑", "🏃", "🎉"], options: ["Do not go", "Run fast", "Party"], answer: 0, hints: ["The sign is red.", "It tells you not to move.", "Do not go."], explain: "STOP means do not go." },
      { type: "mcq", q: "Which sign shows the way out?", pics: ["🚪", "🍔", "🛏️"], options: ["EXIT", "FOOD", "BED"], answer: 0, hints: ["Out of a building.", "Through a door.", "EXIT."], explain: "EXIT shows the way out." },
      { type: "mcq", q: "You see a ⚠️ DANGER sign. What do you do?", pics: ["🙅", "👉", "🧗"], options: ["Stay away and tell a grown-up", "Touch it", "Climb on it"], answer: 0, hints: ["Danger means it can hurt you.", "Stay away.", "Tell a grown-up."], explain: "Stay away and tell a grown-up." },
      { type: "mcq", q: "Where is the bathroom?", pics: ["🚻", "🛑", "⚠️"], options: ["TOILET", "STOP", "DANGER"], answer: 0, hints: ["Which sign is for the bathroom?", "It shows people.", "TOILET."], explain: "The TOILET sign shows the bathroom." }
    ],
    reflect: R("The pictures on the signs", "Saying the words aloud"),
    parent: "Your child read signs that keep them safe: STOP, TOILET, EXIT and DANGER.",
    teacher: "Shows reading and responding to common functional sign words and symbols (functional reading).",
    done: "STOP, TOILET, EXIT and DANGER keep me safe." },

  { ...SID, id: "sid3-day", grade: 3, subject: "Mathematics", title: "Morning, afternoon and night", topic: "Time: my day", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: caps("Mathematics", "functional numeracy: time and daily routines"),
    intention: "Today I am putting my day in order.", prompt: "What do you do every morning?",
    lesson: [
      { h: "Parts of the day", say: "A day has a morning, an afternoon and a night. The sun comes up in the morning. It is dark at night.", html: chainRow(["🌅 morning", "☀️ afternoon", "🌙 night"]) },
      { h: "What I do", say: "In the morning I wake up and eat breakfast. In the afternoon I play. At night I sleep.", html: chainRow(["Breakfast", "Play", "Sleep"]) },
      { h: "Before and after", say: "Breakfast comes before lunch. Supper comes after lunch.", html: chainRow(["Breakfast", "Lunch", "Supper"]) }
    ],
    example: { q: "Do you eat breakfast in the morning or at night?", steps: ["Breakfast is the first meal.", "We eat it when we wake up.", "Breakfast is in the morning."] },
    questions: [
      { type: "mcq", q: "When do we sleep?", pics: ["🌙", "🌅", "☀️"], options: ["At night", "In the morning", "In the afternoon"], answer: 0, hints: ["It is dark.", "The moon is out.", "Night."], explain: "We sleep at night." },
      { type: "mcq", q: "When do we eat breakfast?", pics: ["🌅", "🌙", "☀️"], options: ["In the morning", "At night", "In the afternoon"], answer: 0, hints: ["It is the first meal.", "After we wake up.", "Morning."], explain: "Breakfast is in the morning." },
      { type: "order", q: "Put the meals in order.", items: ["Breakfast", "Lunch", "Supper"], orderLabel: "first to last", hints: ["Which meal is first?", "Breakfast, then…", "…lunch, then supper."], explain: "Breakfast, lunch, supper." }
    ],
    reflect: R("Thinking about my own day", "The pictures"),
    parent: "Your child put the parts of the day and daily routines in order.",
    teacher: "Shows sequencing daily routines and using morning, afternoon and night (time, functional numeracy).",
    done: "Morning, afternoon, night: my day has an order." },

  // ===================== WORK READINESS (AGES 14 TO 18) =====================
  { ...WORK, id: "sidw-taxi", title: "Taking a taxi safely", topic: "Getting around",
    caps: caps("Life and work skills", "independence: travelling safely by minibus taxi"),
    intention: "Today I am learning to take a taxi safely.", prompt: "Where would you like to travel on your own?",
    lesson: [
      { h: "Before you go", say: "Know where you are going. Have the right money ready. Tell someone at home where you are going.", html: chainRow(["Know the place", "Money ready", "Tell someone"]) },
      { h: "In the taxi", say: "Pass your money to the front. Tell the driver where you want to get off. Keep your bag on your lap.", html: P("When you want to get off, say: <b>Short left, please.</b>") },
      { h: "Staying safe", say: "Sit near other people. If you feel unsafe, get off at a busy place and phone someone you trust.", html: P("Feel unsafe? Get off somewhere <b>busy</b> and phone home.") }
    ],
    example: { q: "You want to get off at the next corner. What do you say?", steps: ["The driver needs to know.", "Use the taxi words.", "Say: Short left, please."] },
    questions: [
      { type: "mcq", q: "What should you have ready before the taxi comes?", pics: ["💰", "🍦", "🎮"], options: ["The right money", "An ice cream", "A game"], answer: 0, hints: ["You must pay.", "Have it in your hand.", "The right money."], explain: "Have the right money ready to pay." },
      { type: "mcq", q: "How do you tell the driver you want to get off?", pics: ["🗣️", "🤫", "😴"], options: ["Say 'Short left, please'", "Say nothing", "Fall asleep"], answer: 0, hints: ["The driver must hear you.", "Use the taxi words.", "Short left."], explain: "Say 'Short left, please' before your stop." },
      { type: "mcq", q: "You feel unsafe in a taxi. What do you do?", pics: ["📞", "🙈", "🏃"], options: ["Get off at a busy place and phone someone", "Close your eyes", "Jump out while it moves"], answer: 0, hints: ["Choose the safe way.", "Somewhere with people.", "Then phone someone."], explain: "Get off safely where there are people, and phone someone you trust." },
      { type: "order", q: "Put the trip in order.", items: ["Tell someone where you are going", "Get the right money ready", "Pay the driver", "Say 'Short left' at your stop"], orderLabel: "first to last", hints: ["Start at home.", "Money before paying.", "Getting off is last."], explain: "Tell someone, get money ready, pay, then say 'Short left'." }
    ],
    reflect: R("Practising the words", "Planning before I go"),
    parent: "Your child practised planning and taking a taxi safely.",
    teacher: "Shows planning a journey, using taxi etiquette and applying personal safety strategies (independence and community access).",
    done: "Plan, have money ready, say 'Short left', and stay safe." },

  { ...WORK, id: "sidw-budget", title: "Shopping with R50", topic: "Money", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: caps("Life and work skills", "functional numeracy: shopping within a budget and checking change"),
    intention: "Today I am shopping with a budget.", prompt: "What do you buy at the shop most often?",
    lesson: [
      { h: "Make a list", say: "Before shopping, write or draw a list of what you need.", html: BIG("🍞 🥛 🍌") + P("bread · milk · bananas") },
      { h: "Add the prices", say: "Look at the price of each thing. Add them up. Make sure the total is not more than your money.", html: P("Bread R18 + milk R20 = <b>R38</b>") },
      { h: "Check your change", say: "If you pay with R50 and spend R38, you get R12 change. Count your change before you leave.", html: P("R50 − R38 = <b>R12</b> change") }
    ],
    example: { q: "You have R50. Bread is R18 and milk is R20. Can you buy both?", steps: ["Add: R18 + R20 = R38.", "R38 is less than R50.", "Yes. You get R12 change."] },
    questions: [
      { type: "num", q: "Bread costs R18 and milk costs R20. What is the total, in rand?", answer: "38", options: ["38", "28", "48", "2"], hints: ["Add the prices.", "18 + 20.", "38."], explain: "R18 + R20 = R38." },
      { type: "mcq", q: "You have R50. Can you buy things that cost R38 in total?", options: ["Yes", "No"], answer: 0, hints: ["Is R38 more or less than R50?", "Less.", "Yes."], explain: "R38 is less than R50, so yes." },
      { type: "num", q: "You pay R50 for things that cost R38. How much change do you get, in rand?", answer: "12", options: ["12", "22", "38", "88"], hints: ["Change = money paid − cost.", "50 − 38.", "12."], explain: "R50 − R38 = R12." },
      { type: "mcq", q: "What should you do before you leave the till?", pics: ["🪙", "🏃", "📱"], options: ["Count your change", "Run out", "Play on your phone"], answer: 0, hints: ["Check your money.", "Is the change right?", "Count it."], explain: "Count your change to check it is right." }
    ],
    reflect: R("Making a list", "Adding the prices", "Checking my change"),
    parent: "Your child practised shopping with R50: adding prices and checking change.",
    teacher: "Shows planning purchases, adding prices, staying within a budget and checking change (functional numeracy: money).",
    done: "Make a list, add the prices, and check your change." },

  { ...WORK, id: "sidw-instructions", title: "Following instructions at work", topic: "Work readiness", domain: "Communication and Expression",
    caps: caps("Life and work skills", "work readiness: following multi-step instructions"),
    intention: "Today I am learning to follow instructions at work.", prompt: "What is hard about following instructions?",
    lesson: [
      { h: "Listen carefully", say: "At work, your supervisor gives instructions. Look at them, listen to all the words, and wait until they finish.", html: chainRow(["Look", "Listen", "Wait"]) },
      { h: "One step at a time", say: "Do the steps in order. If there are many steps, ask for them one at a time, or ask for a picture list.", html: P("Ask: <b>Can you show me, please?</b>") },
      { h: "Check and ask", say: "If you are not sure, ask. It is good to ask. When you finish, say: I am done. What next?", html: P("Say: <b>I am done. What next?</b>") }
    ],
    example: { q: "Your supervisor says: 'Fold the towels, then put them on the shelf.' What do you do first?", steps: ["There are two steps.", "The first step is to fold the towels.", "Fold the towels first, then put them on the shelf."] },
    questions: [
      { type: "mcq", q: "Your supervisor is talking. What do you do?", pics: ["👀", "📱", "🚶"], options: ["Look and listen", "Play on your phone", "Walk away"], answer: 0, hints: ["Pay attention.", "Eyes and ears.", "Look and listen."], explain: "Look at your supervisor and listen to every word." },
      { type: "mcq", q: "You do not understand the instruction. What do you do?", pics: ["🙋", "🤷", "😴"], options: ["Ask a question", "Guess", "Go to sleep"], answer: 0, hints: ["It is good to ask.", "Don't guess.", "Ask."], explain: "Ask, so you do the job right." },
      { type: "order", q: "'Sweep the floor, then empty the bin, then wash your hands.' Put the steps in order.", items: ["Sweep the floor", "Empty the bin", "Wash your hands"], orderLabel: "first to last", hints: ["Listen to the order.", "Sweep comes first.", "Wash your hands last."], explain: "Sweep, empty the bin, wash your hands." },
      { type: "mcq", q: "You have finished your task. What do you say?", pics: ["🗣️", "🤐", "🏠"], options: ["'I am done. What next?'", "Nothing", "Go home without telling anyone"], answer: 0, hints: ["Your supervisor needs to know.", "Tell them.", "What next?"], explain: "Tell your supervisor and ask what is next." }
    ],
    reflect: R("Doing one step at a time", "Asking questions"),
    parent: "Your child practised listening to and following instructions at work.",
    teacher: "Shows attending to, sequencing and clarifying multi-step workplace instructions (work readiness).",
    done: "Look, listen, do it in order, and ask when you're not sure." },

  { ...WORK, id: "sidw-customers", title: "Greeting customers", topic: "Work readiness: customer service", domain: "Communication and Expression", category: "Communication",
    caps: caps("Life and work skills", "work readiness: communicating politely with customers"),
    intention: "Today I am learning to greet and help customers.", prompt: "How do you like to be greeted in a shop?",
    lesson: [
      { h: "First impressions", say: "When a customer comes in, look at them, smile and greet them. Say: Good morning, how can I help you?", html: P("<b>Good morning, how can I help you?</b>") },
      { h: "Being polite", say: "Use please and thank you. Speak clearly, not too loud and not too soft.", html: chainRow(["Please", "Thank you", "Clear voice"]) },
      { h: "When you can't help", say: "If you don't know the answer, say: Let me call someone to help you. Then find your supervisor.", html: P("<b>Let me call someone to help you.</b>") }
    ],
    example: { q: "A customer asks where the bread is, but you don't know. What do you say?", steps: ["You don't know the answer.", "Don't guess or ignore them.", "Say: Let me call someone to help you."] },
    questions: [
      { type: "mcq", q: "A customer walks in. What do you do first?", pics: ["😊", "🙈", "📱"], options: ["Smile and greet them", "Hide", "Look at your phone"], answer: 0, hints: ["Make them feel welcome.", "Look and smile.", "Greet them."], explain: "Smile and greet the customer." },
      { type: "mcq", q: "Which greeting is best at nine o'clock in the morning?", options: ["'Good morning, how can I help you?'", "'Good night!'", "'What do you want?'"], answer: 0, hints: ["It is morning.", "Be polite.", "Good morning."], explain: "'Good morning, how can I help you?' is polite and right for the time." },
      { type: "mcq", q: "You can't answer a customer's question. What do you say?", options: ["'Let me call someone to help you.'", "'I don't know. Go away.'", "Say nothing"], answer: 0, hints: ["Stay polite.", "Find someone who knows.", "Call someone."], explain: "Politely get someone who can help." },
      { type: "mcq", q: "A customer says thank you. What do you say?", pics: ["😊", "😠", "🤐"], options: ["'You're welcome.'", "'Whatever.'", "Nothing"], answer: 0, hints: ["Be polite back.", "A friendly answer.", "You're welcome."], explain: "Say 'You're welcome.'" }
    ],
    reflect: R("Practising the words", "Role-playing with someone"),
    parent: "Your child practised greeting and helping customers politely.",
    teacher: "Shows using polite greetings, appropriate volume and help-seeking scripts in customer service (work readiness: communication).",
    done: "Smile, greet, be polite, and call someone if you can't help." },

  { ...WORK, id: "sidw-safety", title: "Safety signs at work", topic: "Work readiness: health and safety", category: "Problem Solving",
    caps: caps("Life and work skills", "work readiness: safety signs, protective clothing and reporting hazards"),
    intention: "Today I am learning to stay safe at work.", prompt: "What safety signs have you seen?",
    lesson: [
      { h: "Safety colours", say: "At work, signs use colours. Red means stop or fire. Yellow means be careful. Green means safe, like the way out. Blue means you must do something, like wear gloves.", html: chainRow(["🔴 stop or fire", "🟡 be careful", "🟢 safe", "🔵 must do"]) },
      { h: "Protective clothing", say: "Some jobs need gloves, a mask or safety shoes. They protect your body. Always wear them when the sign says so.", html: BIG("🧤 😷 🥾") + P("gloves · mask · safety shoes") },
      { h: "If something goes wrong", say: "If you see a spill, a fire or someone hurt, do not try to fix it alone. Tell your supervisor straight away.", html: P("<b>Tell your supervisor straight away.</b>") }
    ],
    example: { q: "You see a blue sign with gloves on it. What does it mean?", steps: ["Blue signs tell you what you must do.", "The picture shows gloves.", "You must wear gloves here."] },
    questions: [
      { type: "mcq", q: "Which colour means safe, like the way out?", pics: ["🟢", "🔴", "🟡"], options: ["Green", "Red", "Yellow"], answer: 0, hints: ["Think of the exit sign.", "It is like 'go'.", "Green."], explain: "Green means safe." },
      { type: "mcq", q: "A sign shows a mask. What must you do?", pics: ["😷", "🍔", "🎧"], options: ["Wear a mask", "Eat lunch", "Listen to music"], answer: 0, hints: ["The sign shows what to wear.", "A mask.", "Wear it."], explain: "Wear a mask where the sign says so." },
      { type: "mcq", q: "You see water spilled on the floor. What do you do?", pics: ["🗣️", "🏃", "🙈"], options: ["Tell your supervisor", "Run through it", "Ignore it"], answer: 0, hints: ["Someone could slip.", "Don't ignore it.", "Tell someone."], explain: "Tell your supervisor so nobody slips." },
      { type: "mcq", q: "What does a yellow sign usually mean?", pics: ["🟡", "🟢", "🔵"], options: ["Be careful", "The safe way out", "Free food"], answer: 0, hints: ["Yellow is a warning colour.", "Watch out.", "Be careful."], explain: "Yellow signs warn you to be careful." }
    ],
    reflect: R("Learning the colours", "Knowing who to tell"),
    parent: "Your child learnt safety sign colours and what to do if something goes wrong at work.",
    teacher: "Shows interpreting safety sign colours and symbols, using protective equipment and reporting hazards (work readiness: health and safety).",
    done: "Know the colours, wear your protection, and report problems." },

  { ...WORK, id: "sidw-cleaning", title: "Cleaning a workspace", topic: "Work readiness: practical skills",
    caps: caps("Life and work skills", "work readiness: following a cleaning routine safely"),
    intention: "Today I am learning to clean a workspace in the right order.", prompt: "What jobs do you do at home?",
    lesson: [
      { h: "Get ready", say: "Before cleaning, put on gloves and get your cloth, spray and bin bag.", html: chainRow(["Gloves", "Cloth", "Spray", "Bin bag"]) },
      { h: "Top to bottom", say: "Clean from the top to the bottom, so dirt falls down to the floor. Wipe the tables before you sweep the floor.", html: chainRow(["Shelves", "Tables", "Floor"]) },
      { h: "Finish well", say: "Put rubbish in the bin, put the cleaning things away, take off your gloves, and wash your hands.", html: chainRow(["Rubbish in the bin", "Pack away", "Wash hands"]) }
    ],
    example: { q: "Should you sweep the floor before or after wiping the table?", steps: ["Crumbs from the table fall on the floor.", "If you sweep first, the floor gets dirty again.", "Wipe the table first, then sweep."] },
    questions: [
      { type: "order", q: "Put the cleaning steps in order.", items: ["Put on gloves", "Wipe the table", "Sweep the floor", "Wash your hands"], orderLabel: "first to last", hints: ["Gloves go on first.", "Top to bottom.", "Wash your hands last."], explain: "Gloves, table, floor, wash hands." },
      { type: "mcq", q: "What do you put on before using cleaning spray?", pics: ["🧤", "🧢", "🕶️"], options: ["Gloves", "A cap", "Sunglasses"], answer: 0, hints: ["Protect your hands.", "Spray can hurt skin.", "Gloves."], explain: "Gloves protect your hands from the spray." },
      { type: "mcq", q: "Why do we clean from top to bottom?", options: ["Dirt falls down, so we clean the floor last", "It is faster to climb", "The floor is always clean", "It doesn't matter"], answer: 0, hints: ["Where does dirt go?", "It falls down.", "Floor last."], explain: "Dirt falls, so the floor is cleaned last." }
    ],
    reflect: R("Doing it top to bottom", "Remembering the gloves"),
    parent: "Your child learnt a cleaning routine done safely and in the right order.",
    teacher: "Shows sequencing a cleaning routine, using protective equipment and applying top-to-bottom logic (work readiness: practical skills).",
    done: "Gloves on, top to bottom, pack away and wash your hands." },

  { ...WORK, id: "sidw-help", title: "Asking for help", topic: "Self-advocacy", domain: "Communication and Expression", category: "Communication",
    caps: caps("Life and work skills", "self-advocacy: asking for help at work and at home"),
    intention: "Today I am learning how to ask for help.", prompt: "Who do you ask when you need help?",
    lesson: [
      { h: "Everyone needs help", say: "Asking for help is a strength. Workers ask for help every day.", html: P("Asking for help is <b>smart</b>.") },
      { h: "Who to ask", say: "At work, ask your supervisor or a colleague you trust. At home, ask a family member.", html: chainRow(["Supervisor", "Colleague", "Family"]) },
      { h: "What to say", say: "Say what you need clearly: Excuse me, can you help me, please? I don't know how to do this.", html: P("<b>Excuse me, can you help me, please?</b>") }
    ],
    example: { q: "The printer is jammed and you don't know how to fix it. What do you do?", steps: ["You don't know how to fix it.", "Don't force it or leave it.", "Say: Excuse me, can you help me with the printer, please?"] },
    questions: [
      { type: "mcq", q: "You are stuck on a task. What do you do?", pics: ["🙋", "😤", "🚪"], options: ["Ask for help", "Get angry", "Leave"], answer: 0, hints: ["Asking is smart.", "Find someone.", "Ask for help."], explain: "Ask for help." },
      { type: "mcq", q: "Who can you ask for help at work?", pics: ["👷", "🐶", "📺"], options: ["Your supervisor", "A dog", "The TV"], answer: 0, hints: ["A person at work.", "The one in charge.", "Your supervisor."], explain: "Ask your supervisor or a colleague." },
      { type: "mcq", q: "Which is the best way to ask?", options: ["'Excuse me, can you help me, please?'", "'Do this for me!'", "Shout 'help' loudly"], answer: 0, hints: ["Be polite.", "Say please.", "The first one."], explain: "A polite, clear question works best." }
    ],
    reflect: R("Knowing who to ask", "Practising the words"),
    parent: "Your child practised asking for help clearly and politely.",
    teacher: "Shows recognising when help is needed, identifying appropriate people and using a polite help-seeking script (self-advocacy).",
    done: "It is smart to ask: 'Excuse me, can you help me, please?'" },

  { ...WORK, id: "sidw-time", title: "Being on time", topic: "Work readiness: time", domain: "Logical and Analytical Thinking",
    caps: caps("Life and work skills", "work readiness: reading digital time and planning to arrive on time"),
    intention: "Today I am learning to plan so I arrive on time.", prompt: "What makes it hard to be on time?",
    lesson: [
      { h: "Why time matters", say: "At work, you must arrive on time. If you are late, other people have to wait.", html: P("Work starts at <b>8:00</b>.") },
      { h: "Reading the clock", say: "On a digital clock, the first number is the hour. 7:30 means half past seven.", html: chainRow(["7:00 seven o'clock", "7:30 half past seven", "8:00 eight o'clock"]) },
      { h: "Planning to arrive", say: "Find out how long the trip takes, then leave early. If the trip takes 30 minutes and work starts at 8:00, leave by 7:30 or a bit earlier. If you will be late, phone your supervisor.", html: P("Start 8:00 − trip 30 minutes = leave by <b>7:30</b>") + P("Running late? <b>Phone your supervisor.</b>") }
    ],
    example: { q: "Work starts at 9:00. The taxi takes 30 minutes. When should you leave?", steps: ["Work starts at 9:00.", "The trip takes 30 minutes.", "Leave by 8:30, or a bit earlier to be safe."] },
    questions: [
      { type: "mcq", q: "What time does 7:30 show?", options: ["Half past seven", "Seven o'clock", "Three o'clock", "Half past three"], answer: 0, hints: ["The first number is the hour: 7.", "30 minutes is half an hour.", "Half past seven."], explain: "7:30 is half past seven." },
      { type: "mcq", q: "Work starts at 8:00. The trip takes 30 minutes. When should you leave?", options: ["By 7:30", "At 8:00", "At 8:30", "At 9:00"], answer: 0, hints: ["Leave before work starts.", "30 minutes before 8:00.", "7:30."], explain: "30 minutes before 8:00 is 7:30." },
      { type: "mcq", q: "The taxi is late and you will be late for work. What do you do?", pics: ["📞", "🙈", "🏠"], options: ["Phone your supervisor", "Say nothing", "Go home"], answer: 0, hints: ["Your supervisor should know.", "Tell them.", "Phone them."], explain: "Phone your supervisor to tell them." }
    ],
    reflect: R("Reading the clock", "Working out when to leave"),
    parent: "Your child practised reading the time and planning to arrive at work on time.",
    teacher: "Shows reading digital time, calculating departure times and communicating lateness (work readiness: time management).",
    done: "Know the start time, leave early, and phone if you'll be late." }
  );
}
