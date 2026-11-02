"use strict";

// ---------- Learn units: Grade 3 (CAPS Foundation Phase). Original content. ----------
const TEXT_ANTS = `<div class="passage-text"><p><b>Amazing Ants</b></p>
<p><b>What is an insect?</b> An insect has six legs and three body parts: a head, a thorax and an abdomen. Ants are insects.</p>
<p><b>Living together</b> Ants live in big groups called colonies. One colony can have thousands of ants. Each colony has a queen, who lays the eggs.</p>
<p><b>Hard workers</b> Worker ants find food, look after the young ants and build the nest. They can carry things much heavier than their own bodies.</p>
<p><b>Talking without words</b> Ants leave a smell on the ground called a scent trail. Other ants follow the trail to find food.</p>
<p><b>Why ants matter</b> Ants help nature. They dig tunnels that let air and water into the soil, and they help to clean up dead plants and animals.</p></div>`;
const UNITS_G3 = [
  // ===================== GRADE 3 MATHEMATICS =====================
  { id: "g3-place", grade: 3, subject: "Mathematics", title: "Hundreds, tens and ones", topic: "Place value to 999", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 3 Mathematics: Numbers, Operations and Relationships (place value of 3-digit numbers; compare and order to 999; add and subtract to 999)",
    intention: "Today I am learning what each digit is worth in a 3-digit number.", prompt: "How did knowing the hundreds help you?",
    lesson: [
      { h: "Three places", say: "The number 365 has 3 hundreds, 6 tens and 5 ones. That is 300 and 60 and 5.", html: chainRow(["300", "+ 60", "+ 5", "= 365"]) + P("Each <b>place</b> has a value: <b>hundreds</b>, <b>tens</b> and <b>ones</b>.") },
      { h: "Zero holds a place", say: "In 407, there are no tens. The zero holds the tens place, so the 4 is still worth 400.", html: chainRow(["400", "+ 0", "+ 7", "= 407"]) + P("<b>Zero</b> is a place holder.") },
      { h: "Comparing numbers", say: "To compare 529 and 592, look at the hundreds first. They are the same. Then look at the tens. 9 tens is more than 2 tens, so 592 is bigger.", html: chainRow(["529", "<", "592"]) + P("Compare <b>hundreds</b> first, then <b>tens</b>, then <b>ones</b>.") }
    ],
    example: { q: "What is the value of the 8 in 283?", steps: ["Find the place of the 8.", "The 8 is in the tens place.", "Its value is 80."] },
    questions: [
      { type: "mcq", q: "What is the value of the 7 in 742?", options: ["700", "70", "7"], answer: 0, hints: ["Which place is the 7 in?", "It is the first of three digits.", "That is the hundreds place."], explain: "The 7 is in the hundreds place, so it is worth 700." },
      { type: "mcq", q: "Which number is 6 hundreds, 0 tens and 3 ones?", options: ["603", "630", "63"], answer: 0, hints: ["Write the hundreds first.", "There are no tens, so write 0.", "6, 0, 3."], explain: "600 + 0 + 3 = 603." },
      { type: "mcq", q: "Which number is bigger?", options: ["815", "851"], fixed: true, answer: 1, hints: ["The hundreds are the same.", "Compare the tens.", "5 tens is more than 1 ten."], explain: "851 is bigger because 5 tens is more than 1 ten." },
      { type: "num", q: "What is 324 plus 152?", answer: "476", options: ["476", "466", "172", "486"], hints: ["Add the hundreds: 300 + 100.", "Add the tens: 20 + 50. Add the ones: 4 + 2.", "400 + 70 + 6."], explain: "324 + 152 = 476." },
      { type: "num", q: "What is 10 more than 495?", answer: "505", options: ["505", "496", "595", "500"], hints: ["Add one ten.", "9 tens and 1 more ten makes 10 tens.", "10 tens is 1 hundred: 505."], explain: "495 + 10 = 505." },
      { type: "order", q: "Put the numbers in order, smallest first.", items: ["198", "389", "398", "910"], orderLabel: "smallest to biggest", hints: ["Look at the hundreds first.", "389 and 398 have the same hundreds.", "Compare their tens."], explain: "198, 389, 398, 910." }
    ],
    reflect: { q: "What helped you most?", options: ["Splitting into hundreds, tens and ones", "Comparing from the left", "Thinking about zero", "Not sure"] },
    parent: "Your child worked with hundreds, tens and ones and compared and added 3-digit numbers.",
    teacher: "Shows place value of 3-digit numbers, zero as a place holder, ordering to 999 and addition.",
    done: "Each digit has a value: hundreds, tens or ones." },

  { id: "g3-times", grade: 3, subject: "Mathematics", title: "Times tables and dividing", topic: "Multiplication and division by 2, 3, 4, 5 and 10", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 3 Mathematics: Numbers, Operations and Relationships (multiply and divide by 2, 3, 4, 5 and 10 to 100; grouping and sharing with remainders)",
    intention: "Today I am using times tables to multiply and divide.", prompt: "How did you use a times table to divide?",
    lesson: [
      { h: "Arrays", say: "An array is objects in rows and columns. Three rows of four is twelve. Three times four equals twelve.", html: PICS("🔵🔵🔵🔵<br>🔵🔵🔵🔵<br>🔵🔵🔵🔵", "3 rows of 4 dots") + P("3 rows of 4: <b>3 × 4 = 12</b>.") },
      { h: "Dividing is sharing", say: "Division is sharing into equal groups. Twelve shared into three groups is four. Twelve divided by three equals four.", html: chainRow(["12 ÷ 3 = 4", "because", "3 × 4 = 12"]) + P("<b>Division</b> undoes multiplication.") },
      { h: "Remainders", say: "Sometimes there are some left over. Seventeen divided by five is three, remainder two.", html: chainRow(["5 × 3 = 15", "17 − 15 = 2"]) + P("17 ÷ 5 = 3 <b>remainder 2</b>.") }
    ],
    example: { q: "28 learners sit in groups of 4. How many groups are there?", steps: ["Groups of 4 means divide by 4.", "Which 4 times table fact makes 28?", "4 × 7 = 28, so there are 7 groups."] },
    questions: [
      { type: "mcq", q: "What is 4 times 6?", options: ["24", "10", "20"], answer: 0, hints: ["6 groups of 4.", "Count in 4s six times.", "4, 8, 12, 16, 20, 24."], explain: "4 × 6 = 24." },
      { type: "mcq", q: "What is 30 divided by 3?", options: ["10", "3", "27"], answer: 0, hints: ["How many 3s make 30?", "3 × what = 30?", "3 × 10 = 30."], explain: "30 ÷ 3 = 10." },
      { type: "num", q: "A box holds 5 eggs. How many eggs are in 9 boxes?", answer: "45", options: ["45", "14", "40", "50"], hints: ["9 groups of 5.", "Count in 5s nine times.", "9 × 5 = 45."], explain: "9 × 5 = 45 eggs." },
      { type: "num", q: "Share 23 sweets among 4 children. How many does each child get?", answer: "5", options: ["5", "6", "4", "19"], hints: ["Which 4 times fact is close to 23?", "4 × 5 = 20 and 4 × 6 = 24.", "24 is too many, so each gets 5."], explain: "23 ÷ 4 = 5 remainder 3. Each child gets 5." },
      { type: "mcq", q: "Which is the same as 2 × 8?", options: ["8 × 2", "2 + 8", "8 − 2"], answer: 0, hints: ["You can swap the numbers when you multiply.", "2 groups of 8 is the same as 8 groups of 2.", "8 × 2."], explain: "2 × 8 = 8 × 2 = 16." }
    ],
    reflect: { q: "What helped you most?", options: ["Arrays", "Counting in groups", "Using a times fact I know", "Not sure"] },
    parent: "Your child multiplied and divided using the 2, 3, 4, 5 and 10 times tables, including remainders.",
    teacher: "Shows multiplication with arrays, division as the inverse of multiplication, and remainders.",
    done: "Times tables help you multiply and divide." },

  { id: "g3-fractions", grade: 3, subject: "Mathematics", title: "Fractions that are the same", topic: "Fractions and equivalence", domain: "Logical and Analytical Thinking", category: "Flexible Thinking",
    caps: "CAPS Grade 3 Mathematics: Numbers, Operations and Relationships (halves, thirds, quarters, fifths, sixths and eighths; unitary and non-unitary fractions; equivalence)",
    intention: "Today I am learning that different fractions can be the same amount.", prompt: "How could you show that two fractions are the same?",
    lesson: [
      { h: "More than one part", say: "Three quarters means three of four equal parts.", html: fracBar(4, 3, "Three of four equal parts shaded") + P("<b>3/4</b>: the bottom number shows <b>how many parts</b>, the top shows <b>how many we have</b>.") },
      { h: "The same amount", say: "One half and two quarters cover the same amount. They are equal.", html: fracBar(2, 1, "One half shaded") + fracBar(4, 2, "Two quarters shaded") + P("<b>1/2 = 2/4</b>. Same amount, different parts.") },
      { h: "Eighths", say: "Four eighths is also the same as one half.", html: fracBar(8, 4, "Four eighths shaded") + P("<b>1/2 = 2/4 = 4/8</b>.") }
    ],
    example: { q: "Kagiso ate 2 of 8 equal slices of bread. Lindi ate 1 of 4 equal slices of the same size loaf. Did they eat the same amount?", steps: ["2/8 means 2 of 8 parts.", "Two eighths fit into one quarter.", "Yes, 2/8 = 1/4, so they ate the same amount."] },
    questions: [
      { type: "mcq", q: "What fraction is shaded?", html: fracBar(5, 2), options: ["2/5", "2/3", "5/2"], answer: 0, hints: ["How many equal parts are there?", "There are 5 parts.", "2 are shaded."], explain: "2 of 5 parts are shaded: 2/5." },
      { type: "mcq", q: "Which fraction is the same as one half?", options: ["2/4", "1/4", "2/3"], answer: 0, hints: ["Half of 4 parts is …", "2 parts.", "2/4."], explain: "2/4 = 1/2." },
      { type: "mcq", q: "Which is bigger?", options: ["1/3", "1/6"], fixed: true, answer: 0, hints: ["More parts means smaller parts.", "Sixths are smaller than thirds.", "1/3 is bigger."], explain: "1/3 is bigger than 1/6." },
      { type: "num", q: "What is one third of 12?", answer: "4", options: ["4", "3", "9", "6"], hints: ["Share 12 into 3 equal groups.", "12 ÷ 3.", "3 × 4 = 12."], explain: "One third of 12 is 4." },
      { type: "order", q: "Put these in order from smallest to biggest.", items: ["1/8", "1/4", "1/2"], orderLabel: "smallest to biggest", hints: ["The top number is the same.", "The bigger the bottom number, the smaller the part.", "Eighths are smallest."], explain: "1/8, 1/4, 1/2." }
    ],
    reflect: { q: "What helped you with fractions?", options: ["The fraction bars", "Thinking about sharing food", "Dividing", "Not sure"] },
    parent: "Your child learned that fractions like 1/2, 2/4 and 4/8 are the same amount.",
    teacher: "Shows non-unitary fractions, equivalence of halves, quarters and eighths, and fractions of a group.",
    done: "Different fractions can show the same amount." },

  { id: "g3-measure", grade: 3, subject: "Mathematics", title: "Metres, kilograms and litres", topic: "Length, mass and capacity", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 3 Mathematics: Measurement (length in metres and centimetres; mass in kilograms and grams; capacity in litres and millilitres)",
    intention: "Today I am choosing the right unit to measure things.", prompt: "How did you choose the unit?",
    lesson: [
      { h: "Length", say: "We measure length in centimetres and metres. One metre is one hundred centimetres. A pencil is about fifteen centimetres long.", html: PICS("📏 ✏️ 🚪", "Ruler, pencil, door") + chainRow(["1 m = 100 cm"]) + P("Short things in <b>cm</b>, long things in <b>m</b>.") },
      { h: "Mass", say: "We measure how heavy something is in grams and kilograms. One kilogram is one thousand grams. A bag of sugar is about one kilogram.", html: PICS("⚖️ 🍬", "Scale and sweet") + chainRow(["1 kg = 1 000 g"]) + P("Light things in <b>g</b>, heavy things in <b>kg</b>.") },
      { h: "Capacity", say: "We measure how much liquid a container holds in millilitres and litres. One litre is one thousand millilitres. A teaspoon holds about five millilitres.", html: PICS("🥄 🧃 🪣", "Spoon, juice box, bucket") + chainRow(["1 l = 1 000 ml"]) + P("Small amounts in <b>ml</b>, big amounts in <b>l</b>.") }
    ],
    example: { q: "Which unit would you use to measure the length of a classroom?", steps: ["A classroom is long.", "Centimetres would be too small.", "Use metres."] },
    questions: [
      { type: "mcq", q: "Which unit would you use for the mass of a watermelon?", options: ["kilograms", "millilitres", "centimetres"], answer: 0, hints: ["Mass means how heavy.", "A watermelon is heavy.", "Kilograms."], explain: "A watermelon's mass is measured in kilograms." },
      { type: "mcq", q: "How many centimetres are in one metre?", options: ["100", "10", "1 000"], answer: 0, hints: ["Think of a metre stick.", "It has many small marks.", "100 cm."], explain: "1 m = 100 cm." },
      { type: "mcq", q: "About how much does a cup of tea hold?", options: ["250 ml", "250 l", "2 ml"], answer: 0, hints: ["A cup is small.", "Litres are big.", "250 ml."], explain: "A cup holds about 250 ml." },
      { type: "num", q: "A rope is 3 metres long. How many centimetres is that?", answer: "300", options: ["300", "30", "3", "103"], hints: ["1 metre is 100 cm.", "3 metres is 3 × 100.", "300 cm."], explain: "3 m = 300 cm." },
      { type: "sort", q: "Sort the units.", items: ["kg", "cm", "g", "m"], bins: ["Mass", "Length"], answer: [0, 1, 0, 1], hints: ["Grams and kilograms measure mass.", "Centimetres and metres measure length.", "Look at the letters."], explain: "kg and g measure mass. cm and m measure length." }
    ],
    reflect: { q: "What helped you choose units?", options: ["Thinking of real objects", "Knowing 1 m = 100 cm", "Asking: how long, how heavy or how much?", "Not sure"] },
    parent: "Your child chose units for length, mass and capacity. Look at labels on food packets together.",
    teacher: "Shows selecting standard units for length, mass and capacity and converting metres to centimetres.",
    done: "Use metres for length, kilograms for mass and litres for liquid." },

  // ===================== GRADE 3 ENGLISH HOME LANGUAGE =====================
  { id: "g3-read", grade: 3, subject: "English Home Language", title: "Information text: Amazing Ants", topic: "Reading for information", domain: "Communication and Expression", category: "Inquiry and Exploration",
    caps: "CAPS Grade 3 English Home Language: Reading and Viewing (read an information text; identify main idea and details; use headings)",
    intention: "Today I am reading an information text and finding facts.", prompt: "How did the headings help you?",
    passage: TEXT_ANTS,
    lesson: [
      { h: "Read the text", say: "Read the text, or press Read aloud to hear it part by part.", html: TEXT_ANTS },
      { h: "Headings", say: "An information text has headings. A heading tells you what that part is about.", html: chainRow(["What is an insect?", "Living together", "Hard workers"]) + P("Use <b>headings</b> to find information quickly.") },
      { h: "Main idea and details", say: "The main idea is what the whole text is about. This text is about how ants live and why they matter. Details are the small facts.", html: P("<b>Main idea</b>: ants live and work together, and they help nature.") + P("<b>Details</b>: six legs, a queen, scent trails.") }
    ],
    example: { q: "Under which heading would you find out how ants find food?", steps: ["Look for a heading about finding food.", "Talking without words is about scent trails.", "Ants follow scent trails to food."] },
    questions: [
      { type: "mcq", q: "How many legs does an insect have?", options: ["6", "8", "4"], answer: 0, hints: ["Look under What is an insect?", "Count the legs.", "Six."], explain: "Insects have six legs." },
      { type: "mcq", q: "What is a big group of ants called?", options: ["A colony", "A herd", "A flock"], answer: 0, hints: ["Look under Living together.", "It starts with c.", "A colony."], explain: "A group of ants is a colony." },
      { type: "mcq", q: "Who lays the eggs?", options: ["The queen", "The worker ants", "The soldiers"], answer: 0, hints: ["Look under Living together.", "Each colony has one.", "The queen."], explain: "The queen lays the eggs." },
      { type: "mcq", q: "What is the main idea of the text?", options: ["Ants live together and help nature", "Ants are scary", "Ants have long ears"], answer: 0, hints: ["What is the whole text about?", "Think about every heading.", "How ants live and why they matter."], explain: "The text is about how ants live together and help nature." },
      { type: "mcq", q: "How do ants help the soil?", options: ["They dig tunnels that let in air and water", "They eat the soil", "They make it hot"], answer: 0, hints: ["Look under Why ants matter.", "Tunnels.", "Air and water get in."], explain: "Ant tunnels let air and water into the soil." }
    ],
    reflect: { q: "What helped you find the facts?", options: ["The headings", "Reading it twice", "Listening to it", "Not sure"] },
    parent: "Your child read an information text about ants and found the main idea and details.",
    teacher: "Shows using headings to locate information, retrieving facts and identifying the main idea.",
    done: "Headings help you find facts in an information text." },

  { id: "g3-conj", grade: 3, subject: "English Home Language", title: "Joining sentences", topic: "Conjunctions and, but, because", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade 3 English Home Language: Language Structure and Use (conjunctions to form compound sentences; subject and verb)",
    intention: "Today I am joining two sentences with and, but and because.", prompt: "Which joining word fitted best, and why?",
    lesson: [
      { h: "And", say: "And joins two ideas that go together. I like soccer and I like netball.", html: `<div class="passage-text"><p>I like soccer <b>and</b> I like netball.</p></div>` + P("<b>And</b> adds another idea.") },
      { h: "But", say: "But joins two ideas that are different. I wanted to play outside, but it was raining.", html: `<div class="passage-text"><p>I wanted to play outside, <b>but</b> it was raining.</p></div>` + P("<b>But</b> shows something different or surprising.") },
      { h: "Because", say: "Because gives a reason. I wore a jersey because it was cold.", html: `<div class="passage-text"><p>I wore a jersey <b>because</b> it was cold.</p></div>` + P("<b>Because</b> tells us <b>why</b>.") }
    ],
    example: { q: "Join the sentences: I was hungry. I ate a sandwich.", steps: ["The second part happened for a reason.", "Why did I eat? I was hungry.", "I ate a sandwich because I was hungry."] },
    questions: [
      { type: "mcq", q: "I brushed my teeth … I went to bed.", options: ["and", "but", "because"], answer: 0, hints: ["Both things happened.", "One idea is added to the other.", "And."], explain: "I brushed my teeth and I went to bed." },
      { type: "mcq", q: "The shop was open, … it had no bread.", options: ["but", "and", "because"], answer: 0, hints: ["Is the second part a surprise?", "Open, but no bread.", "But."], explain: "The shop was open, but it had no bread." },
      { type: "mcq", q: "We stayed inside … it was storming.", options: ["because", "but", "and"], answer: 0, hints: ["Why did we stay inside?", "It gives a reason.", "Because."], explain: "We stayed inside because it was storming." },
      { type: "mcq", q: "Which word gives a reason?", options: ["because", "and", "but"], answer: 0, hints: ["A reason tells why.", "Which word answers why?", "Because."], explain: "Because gives a reason." },
      { type: "mcq", q: "In The girl kicked the ball, which word is the verb?", options: ["kicked", "girl", "ball"], answer: 0, hints: ["The verb is the action.", "What did the girl do?", "Kicked."], explain: "Kicked is the verb." }
    ],
    reflect: { q: "Which joining word is easiest for you?", options: ["and", "but", "because", "Not sure"] },
    parent: "Your child joined sentences using and, but and because.",
    teacher: "Shows forming compound sentences with conjunctions and identifying the verb.",
    done: "And adds, but shows a difference, because gives a reason." },

  { id: "g3-synant", grade: 3, subject: "English Home Language", title: "Same and opposite", topic: "Synonyms and antonyms", domain: "Communication and Expression", category: "Flexible Thinking",
    caps: "CAPS Grade 3 English Home Language: Language Structure and Use (synonyms and antonyms; building vocabulary; using a dictionary)",
    intention: "Today I am finding words that mean the same and words that mean the opposite.", prompt: "Why do writers use different words that mean the same?",
    lesson: [
      { h: "Synonyms", say: "Synonyms are words that mean the same or nearly the same. Big and large are synonyms.", html: chainRow(["big = large", "happy = glad", "fast = quick"]) + P("<b>Synonyms</b> mean the same.") },
      { h: "Antonyms", say: "Antonyms are words that mean the opposite. Hot and cold are antonyms.", html: chainRow(["hot ↔ cold", "up ↔ down", "full ↔ empty"]) + P("<b>Antonyms</b> are opposites.") },
      { h: "Better words", say: "Using synonyms makes writing more interesting. Instead of saying nice again and again, try kind, lovely or delicious.", html: chainRow(["a nice friend → a kind friend", "a nice meal → a delicious meal"]) + P("Choose the <b>best</b> word.") }
    ],
    example: { q: "What is the opposite of brave?", steps: ["Brave means not afraid.", "The opposite is being afraid.", "The antonym is scared, or afraid."] },
    questions: [
      { type: "mcq", q: "Which word means the same as small?", options: ["little", "huge", "tall"], answer: 0, hints: ["Synonym means same.", "Small means not big.", "Little."], explain: "Small and little are synonyms." },
      { type: "mcq", q: "Which word is the opposite of early?", options: ["late", "soon", "first"], answer: 0, hints: ["Antonym means opposite.", "If you are not early, you are …", "Late."], explain: "Early and late are antonyms." },
      { type: "mcq", q: "Which word could replace said? Sam said loudly, Help!", options: ["shouted", "whispered", "laughed"], answer: 0, hints: ["He said it loudly.", "Which word means saying loudly?", "Shouted."], explain: "Shouted means said loudly." },
      { type: "sort", q: "Are these synonyms or antonyms?", items: ["begin, start", "open, close", "shut, closed", "wet, dry"], bins: ["Synonyms", "Antonyms"], answer: [0, 1, 0, 1], hints: ["Do they mean the same or the opposite?", "Begin and start mean the same.", "Open and close are opposites."], explain: "Begin, start and shut, closed are synonyms. Open, close and wet, dry are antonyms." },
      { type: "mcq", q: "Which is the opposite of quiet?", options: ["noisy", "silent", "calm"], answer: 0, hints: ["Quiet means not much sound.", "The opposite has lots of sound.", "Noisy."], explain: "Quiet and noisy are antonyms." }
    ],
    reflect: { q: "What helped you?", options: ["Thinking of opposites", "Using the word in a sentence", "Picturing the word", "Not sure"] },
    parent: "Your child learned synonyms (same meaning) and antonyms (opposites).",
    teacher: "Shows vocabulary knowledge through synonyms, antonyms and word choice in context.",
    done: "Synonyms mean the same. Antonyms are opposites." },

  { id: "g3-speech", grade: 3, subject: "English Home Language", title: "Talking marks and short words", topic: "Speech marks and contractions", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade 3 English Home Language: Language Structure and Use (inverted commas for direct speech; apostrophes in contractions)",
    intention: "Today I am learning to show what people say, and to shorten words with an apostrophe.", prompt: "How do speech marks help a reader?",
    lesson: [
      { h: "Speech marks", say: "Speech marks show the exact words someone says. They go around the spoken words.", html: `<div class="passage-text"><p><b>"</b>Let's go to the river,<b>"</b> said Mpho.</p></div>` + P("The spoken words go <b>inside</b> the speech marks.") },
      { h: "Who is speaking", say: "We often add said and the name of the speaker. The speaker can come before or after the speech.", html: `<div class="passage-text"><p>Gogo asked, "Have you eaten?"</p><p>"Yes, thank you," replied Ama.</p></div>` + P("Speech marks are also called <b>inverted commas</b>.") },
      { h: "Short words", say: "We can join two words and use an apostrophe for missing letters. Do not becomes don't. I am becomes I'm.", html: chainRow(["do not → don't", "I am → I'm", "it is → it's", "cannot → can't"]) + P("The <b>apostrophe</b> shows where letters are missing.") }
    ],
    example: { q: "Add speech marks: I lost my shoe said Tumi.", steps: ["What exact words did Tumi say?", "I lost my shoe.", "\"I lost my shoe,\" said Tumi."] },
    questions: [
      { type: "mcq", q: "Which sentence uses speech marks correctly?", options: ["\"Come here,\" said Dad.", "Come \"here, said\" Dad.", "\"Come here, said Dad.\""], answer: 0, hints: ["Only the spoken words go inside.", "What did Dad say?", "Come here."], explain: "\"Come here,\" said Dad. Only Dad's words are inside." },
      { type: "mcq", q: "What is the short way to write do not?", options: ["don't", "dont", "do'nt"], answer: 0, hints: ["The o in not is missing.", "Put the apostrophe where the letter is missing.", "Don't."], explain: "Do not becomes don't." },
      { type: "mcq", q: "What does it's mean?", options: ["it is", "it has not", "its own"], answer: 0, hints: ["The apostrophe shows a missing letter.", "It, apostrophe, s.", "It is."], explain: "It's means it is." },
      { type: "mcq", q: "\"Where are you going?\" asked Lerato. Who is speaking?", options: ["Lerato", "Nobody", "The reader"], answer: 0, hints: ["Look outside the speech marks.", "Who asked?", "Lerato."], explain: "Lerato is speaking." },
      { type: "mcq", q: "What is the long way to write we're?", options: ["we are", "we were", "were"], answer: 0, hints: ["The apostrophe hides a letter.", "We, are.", "We are."], explain: "We're means we are." }
    ],
    reflect: { q: "What helped you most?", options: ["Finding the spoken words", "Finding the missing letters", "Reading it out loud", "Not sure"] },
    parent: "Your child used speech marks for spoken words and apostrophes in short forms like don't and I'm.",
    teacher: "Shows punctuating direct speech with inverted commas and forming contractions with apostrophes.",
    done: "Speech marks show what people say. Apostrophes show missing letters." },

  // ===================== GRADE 3 LIFE SKILLS =====================
  { id: "g3-feelings", grade: 3, subject: "Life Skills", title: "Feelings and saying sorry", topic: "Feelings", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: "CAPS Grade 3 Life Skills, Personal and Social Well-being, Term 1: Feelings (things that make me happy or sad; anger, fear, worry, loneliness; good ways to express feelings; apologies)",
    intention: "Today I am learning to name feelings and to express them in good ways.", prompt: "What helps you when you have a big feeling?",
    lesson: [
      { h: "Naming feelings", say: "Happy, sad, angry, scared, worried and lonely are all feelings. Everyone has all kinds of feelings.", html: PICS("😊 😢 😠 😨 😟 😔", "Happy, sad, angry, scared, worried, lonely") + P("All feelings are <b>okay</b>. What we <b>do</b> with them matters.") },
      { h: "Good ways to show feelings", say: "When we feel angry, we can take deep breaths, count to ten, walk away or talk to someone. Hurting others is not okay.", html: chainRow(["Breathe slowly", "Count to 10", "Talk about it", "Ask for help"]) + P("Use <b>words</b>, not hands.") },
      { h: "Saying sorry", say: "A good apology says what you did, says sorry, and says how you will fix it. I am sorry I took your pencil. I will give it back.", html: `<div class="passage-text"><p>"I'm sorry I took your pencil. I'll give it back now."</p></div>` + P("A real apology <b>names</b> what happened and <b>fixes</b> it.") }
    ],
    example: { q: "Anele's tower was knocked over and he feels angry. What can he do?", steps: ["Notice the feeling: angry.", "Calm down: breathe slowly and count.", "Use words: tell the person how he feels, or ask a grown-up for help."] },
    questions: [
      { type: "mcq", q: "Your friend moves away. You miss her. How might you feel?", options: ["Sad or lonely", "Excited", "Angry at her"], answer: 0, hints: ["Missing someone.", "It is not a happy feeling.", "Sad or lonely."], explain: "Missing someone can make us sad or lonely." },
      { type: "mcq", q: "Which is a good way to calm down when angry?", options: ["Take deep breaths", "Throw things", "Shout at someone"], answer: 0, hints: ["Which one does not hurt anyone?", "Breathing slowly helps your body calm down.", "Take deep breaths."], explain: "Deep breaths help us calm down." },
      { type: "mcq", q: "Which is the best apology?", options: ["I'm sorry I pushed you. I'll be more careful.", "Sorry, whatever.", "It wasn't my fault."], answer: 0, hints: ["A good apology names what happened.", "It also says how to fix it.", "The first one."], explain: "A good apology names what happened and how to fix it." },
      { type: "mcq", q: "You are worried about a test. Who could you talk to?", options: ["A trusted grown-up", "Nobody", "Only your pet goldfish"], answer: 0, hints: ["Talking helps.", "Someone who can help you.", "A trusted grown-up."], explain: "Talking to a trusted grown-up can help with worries." },
      { type: "sort", q: "Sort into helpful and unhelpful.", items: ["Counting to ten", "Hitting", "Talking about it", "Breaking things"], bins: ["Helpful", "Unhelpful"], answer: [0, 1, 0, 1], hints: ["Which ones hurt nobody?", "Counting and talking are calm.", "Hitting and breaking things hurt."], explain: "Counting to ten and talking about it are helpful." }
    ],
    reflect: { q: "What helps you calm down?", options: ["Breathing slowly", "Counting", "Talking to someone", "Moving my body"] },
    parent: "Your child named feelings, practised calm ways to express them and learned how to say sorry well.",
    teacher: "Shows emotional vocabulary, self-regulation strategies and the parts of a sincere apology.",
    done: "All feelings are okay. Show them in ways that do not hurt anyone." },

  { id: "g3-recycle", grade: 3, subject: "Life Skills", title: "Reduce, re-use, recycle", topic: "Recycling and waste", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 3 Life Skills, Beginning Knowledge, Term 2: Recycling (what happens to waste; re-using, recycling and reducing; compost; re-using water)",
    intention: "Today I am learning how to make less waste.", prompt: "What could your family re-use at home?",
    lesson: [
      { h: "Where waste goes", say: "Most rubbish goes to a landfill, a huge hole in the ground. Landfills fill up and can pollute the land and water.", html: PICS("🗑️ → 🚛 → 🏔️", "Bin, truck, landfill") + P("Less rubbish means smaller <b>landfills</b>.") },
      { h: "Reduce and re-use", say: "Reduce means use less. Take a cloth bag to the shop. Re-use means use things again. A jar can become a pencil holder.", html: chainRow(["Reduce: use less", "Re-use: use again"]) + PICS("👜 🫙✏️", "Cloth bag, jar with pencils") },
      { h: "Recycle and compost", say: "Recycle means making old things into new things. Paper, glass, tins and some plastics can be recycled. Fruit and vegetable peels can become compost for the garden.", html: chainRow(["Paper", "Glass", "Tins", "Plastic"]) + PICS("🍌🥕 → 🌱", "Peels become compost") + P("<b>Compost</b> feeds the soil.") }
    ],
    example: { q: "After school, Musa has an empty plastic bottle. What could he do with it?", steps: ["Can he use it again? Yes, he can refill it with water.", "When it is worn out, put it in the recycling.", "He should not throw it on the ground."] },
    questions: [
      { type: "mcq", q: "Which is an example of reducing?", options: ["Taking a cloth bag to the shop", "Buying lots of plastic bags", "Throwing food away"], answer: 0, hints: ["Reduce means use less.", "A cloth bag can be used many times.", "Taking a cloth bag."], explain: "A cloth bag means fewer plastic bags." },
      { type: "mcq", q: "What can fruit peels become?", options: ["Compost", "Glass", "Plastic"], answer: 0, hints: ["Peels rot.", "Rotting food feeds the soil.", "Compost."], explain: "Peels can become compost." },
      { type: "mcq", q: "Where does most rubbish end up?", options: ["A landfill", "The moon", "The sky"], answer: 0, hints: ["A big hole in the ground.", "Rubbish trucks take it there.", "A landfill."], explain: "Most rubbish goes to a landfill." },
      { type: "sort", q: "Can it be recycled?", items: ["Newspaper", "Used tissue", "Glass jar", "Old food"], bins: ["Recycle", "Not recyclable"], answer: [0, 1, 0, 1], hints: ["Paper and glass can be recycled.", "Used tissues are dirty.", "Old food can go into compost, not recycling."], explain: "Newspaper and glass jars can be recycled." },
      { type: "mcq", q: "Which is re-using water?", options: ["Using bath water for the garden", "Leaving the tap running", "Washing a clean car"], answer: 0, hints: ["Re-use means use again.", "The water is used twice.", "Bath water for the garden."], explain: "Using bath water on the garden re-uses it." }
    ],
    reflect: { q: "Which will you try?", options: ["Reduce", "Re-use", "Recycle", "Compost"] },
    parent: "Your child learned to reduce, re-use and recycle, and how peels can become compost.",
    teacher: "Shows understanding of waste, landfill, the three Rs, composting and water re-use.",
    done: "Reduce, re-use and recycle to make less waste." },

  { id: "g3-lifecycle", grade: 3, subject: "Life Skills", title: "Life cycles", topic: "Frog, butterfly and chicken", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 3 Life Skills, Beginning Knowledge, Term 2: Life cycles (mammal, insect, amphibian and bird); Insects",
    intention: "Today I am learning how animals grow and change in a life cycle.", prompt: "How is a frog's life cycle different from a dog's?",
    lesson: [
      { h: "A life cycle", say: "A life cycle shows how a living thing is born, grows, and has young of its own. Then the cycle starts again.", html: chainRow(["Born", "Grows", "Adult", "Has young"]) + P("A <b>cycle</b> goes round and round.") },
      { h: "Butterfly", say: "A butterfly lays an egg. A caterpillar hatches. The caterpillar makes a pupa. A butterfly comes out.", html: PICS("🥚 → 🐛 → 🫘 → 🦋", "Egg, caterpillar, pupa, butterfly") + P("Egg, <b>caterpillar</b>, <b>pupa</b>, butterfly.") },
      { h: "Frog and chicken", say: "A frog lays eggs in water. A tadpole hatches, grows legs and becomes a frog. A chicken lays an egg, a chick hatches and grows into a hen or a rooster.", html: PICS("🥚 → 🐟 → 🐸", "Egg, tadpole, frog") + PICS("🥚 → 🐣 → 🐔", "Egg, chick, hen") }
    ],
    example: { q: "What comes after the caterpillar in a butterfly's life cycle?", steps: ["Remember the order: egg, caterpillar, …", "The caterpillar wraps itself up.", "Next comes the pupa."] },
    questions: [
      { type: "order", q: "Put the butterfly life cycle in order.", items: ["Egg", "Caterpillar", "Pupa", "Butterfly"], orderLabel: "first to last", hints: ["It starts small.", "Then something that eats leaves.", "The butterfly comes last."], explain: "Egg, caterpillar, pupa, butterfly." },
      { type: "mcq", q: "What is a baby frog called?", options: ["A tadpole", "A chick", "A puppy"], answer: 0, hints: ["It lives in water.", "It has a tail and no legs at first.", "A tadpole."], explain: "A baby frog is a tadpole." },
      { type: "mcq", q: "What hatches from a chicken egg?", pics: ["🐣", "🐛", "🐸"], options: ["A chick", "A caterpillar", "A frog"], answer: 0, hints: ["It is a baby bird.", "It is fluffy and yellow.", "A chick."], explain: "A chick hatches from a chicken egg." },
      { type: "mcq", q: "How many legs does an insect have?", options: ["6", "4", "8"], answer: 0, hints: ["Butterflies and ants are insects.", "More than four.", "Six."], explain: "All insects have six legs." },
      { type: "mcq", q: "A puppy is born alive, not from an egg. Which animal is this like?", options: ["A dog, a mammal", "A frog", "A chicken"], answer: 0, hints: ["Frogs and chickens lay eggs.", "Mammals are born alive.", "A dog."], explain: "Dogs are mammals. Puppies are born alive." }
    ],
    reflect: { q: "Which life cycle did you like most?", options: ["Butterfly", "Frog", "Chicken", "Dog"] },
    parent: "Your child learned the life cycles of a butterfly, frog and chicken.",
    teacher: "Shows sequencing life cycle stages for an insect, amphibian and bird, and comparing with mammals.",
    done: "Living things grow and change in a life cycle." },

  { id: "g3-safety", grade: 3, subject: "Life Skills", title: "Danger signs and safe places", topic: "Public safety", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 3 Life Skills, Personal and Social Well-being, Term 3: Public Safety (dangerous places to play; dangers of electricity; poisonous and flammable substances; warning signs)",
    intention: "Today I am learning to spot danger signs and choose safe places to play.", prompt: "Where is a safe place to play near you?",
    lesson: [
      { h: "Dangerous places", say: "Railway lines, roads, rubbish dumps, building sites and deep water are dangerous places to play.", html: PICS("🚆 🛣️ 🏗️ 🌊", "Railway, road, building site, water") + P("Play in <b>safe</b> places like a park or a yard, with a grown-up nearby.") },
      { h: "Electricity", say: "Electricity can kill. Never touch fallen wires, climb electricity poles or play near substations.", html: PICS("⚡ 🚫", "Electricity danger") + P("Stay far from <b>fallen wires</b>. Tell a grown-up.") },
      { h: "Warning signs", say: "Warning signs tell us about danger. A skull means poison. A flame means it can catch fire. A lightning bolt means electricity.", html: PICS("☠️ 🔥 ⚡", "Poison, flammable, electricity signs") + P("<b>Learn the signs</b>. Do not touch.") }
    ],
    example: { q: "Some children want to play soccer next to the railway line. What should they do?", steps: ["A railway line is dangerous.", "Trains are fast and cannot stop quickly.", "They should play at the park or a safe field instead."] },
    questions: [
      { type: "mcq", q: "Which is the safest place to play?", options: ["A park", "A building site", "A railway line"], answer: 0, hints: ["Which one has no machines or trains?", "Parks are made for playing.", "A park."], explain: "A park is a safe place to play." },
      { type: "mcq", q: "You see a fallen electric wire. What should you do?", options: ["Stay away and tell a grown-up", "Pick it up", "Jump over it"], answer: 0, hints: ["Electricity can kill.", "Do not touch.", "Stay away and tell a grown-up."], explain: "Stay away and tell a grown-up." },
      { type: "mcq", q: "What does a skull sign on a bottle mean?", pics: ["☠️"], options: ["Poison", "Sweets", "Water"], answer: 0, hints: ["It is a warning.", "It can make you very sick.", "Poison."], explain: "A skull means poison." },
      { type: "mcq", q: "What does a flame sign mean?", options: ["It can catch fire", "It is cold", "It is food"], answer: 0, hints: ["A flame is fire.", "Keep it away from heat.", "It can catch fire."], explain: "A flame sign means flammable: it can catch fire." },
      { type: "sort", q: "Sort into safe and dangerous places.", items: ["School playground", "Rubbish dump", "Backyard", "Busy road"], bins: ["Safe", "Dangerous"], answer: [0, 1, 0, 1], hints: ["Where could you get hurt?", "Dumps and roads are dangerous.", "Playgrounds and yards are safer."], explain: "Playgrounds and backyards are safer places to play." }
    ],
    reflect: { q: "What will you remember?", options: ["Play in safe places", "Stay away from wires", "Know the warning signs", "Not sure"] },
    parent: "Your child learned about dangerous places to play, electricity and warning signs.",
    teacher: "Shows identification of unsafe play areas, electricity dangers and common hazard symbols.",
    done: "Know the warning signs and play in safe places." }
];
const WORDS_G3 = {
  "g3-place": { words: [["💯", "Hundreds", "groups of one hundred"], ["0️⃣", "Place holder", "a zero that keeps a place empty"]] },
  "g3-times": { words: [["🔲", "Array", "objects in rows and columns"], ["➗", "Divide", "share into equal groups"], ["➕", "Remainder", "what is left over"]] },
  "g3-fractions": { words: [["🟰", "Equivalent", "worth the same amount"], ["🍰", "Eighth", "one of eight equal parts"]] },
  "g3-measure": { words: [["📏", "Length", "how long something is"], ["⚖️", "Mass", "how heavy something is"], ["🧃", "Capacity", "how much a container holds"]] },
  "g3-read": { words: [["🐜", "Colony", "a big group of ants that live together"], ["👃", "Scent trail", "a smell ants leave to show the way"], ["🐛", "Insect", "a small animal with six legs and three body parts"]] },
  "g3-conj": { words: [["🔗", "Conjunction", "a word that joins sentences, like and, but or because"]] },
  "g3-synant": { words: [["🟰", "Synonym", "a word that means the same"], ["↔️", "Antonym", "a word that means the opposite"]] },
  "g3-speech": { words: [["💬", "Speech marks", "marks around the exact words someone says"], ["✂️", "Apostrophe", "shows where letters are missing"]] },
  "g3-feelings": { words: [["😔", "Lonely", "sad because you feel alone"], ["🙏", "Apology", "saying sorry and fixing it"]] },
  "g3-recycle": { words: [["🏔️", "Landfill", "a huge hole where rubbish is buried"], ["♻️", "Recycle", "make old things into new things"], ["🌱", "Compost", "rotted plant waste that feeds soil"]] },
  "g3-lifecycle": { words: [["🔄", "Life cycle", "how a living thing is born, grows and has young"], ["🫘", "Pupa", "the stage where a caterpillar changes into a butterfly"], ["🐸", "Tadpole", "a baby frog"]] },
  "g3-safety": { words: [["☠️", "Poison", "something that makes you very sick"], ["🔥", "Flammable", "catches fire easily"]] }
};
Object.assign(WORDS, WORDS_G3);
