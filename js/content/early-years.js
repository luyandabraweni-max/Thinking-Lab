"use strict";

// ---------- Learn units: ages 3 to 6 (NCF birth to four ELDAs, and CAPS Grade R). Original content. ----------
const PICS = (e, label, sm) => `<p class="pics${sm ? " sm" : ""}" role="img" aria-label="${esc(label)}">${e}</p>`;
const REP = (e, n) => Array(n).fill(e).join(" ");
const NCF = "National Curriculum Framework for Children from Birth to Four (2015), ";
const PASS_LULU = `<div class="passage-text"><p><b>Lulu's Lost Hat</b> <span class="muted">(a 2to.iQ story)</span></p>
<p>Lulu had a red hat. She wore it every day.</p>
<p>One windy morning, the wind blew her hat away! It flew over the fence and into the garden.</p>
<p>Lulu looked under the bench. No hat. She looked behind the tree. No hat.</p>
<p>Then she heard a little bark. Her puppy, Kofi, ran to her with the red hat in his mouth.</p>
<p>"Thank you, Kofi!" said Lulu, and she gave him a big hug.</p></div>`;
const UNITS_EARLY = [
  // ===================== EARLY YEARS (ages 3 to 4): NCF ELDAs =====================
  { id: "ey-wash", grade: -1, subject: "Well-being", title: "Clean hands, healthy me", topic: "Keeping clean", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: NCF + "Early Learning and Development Area 1: Well-being (children are healthy and have a sense of good hygiene)",
    intention: "Today I am learning how to keep my hands clean.", prompt: "What do you do first?",
    lesson: [
      { h: "Germs are tiny", say: "Germs are so tiny that we cannot see them. Germs on our hands can make us sick.", html: PICS("🦠 👐", "Germs and hands") + P("<b>Germs</b> are so tiny that we cannot see them. Germs on our hands can make us sick.") },
      { h: "Wash with soap and water", say: "Wet your hands. Rub them with soap. Rinse them with water. Dry them on a clean towel.", html: PICS("💧 🧼 🚿 🧻", "Water, soap, rinse, towel") + `<ol class="plain"><li>Wet your hands.</li><li>Rub them with <b>soap</b>.</li><li>Rinse with water.</li><li>Dry them on a clean towel.</li></ol>` },
      { h: "When do we wash?", say: "We wash our hands before we eat, after we use the toilet, and after we play outside.", html: PICS("🍽️ 🚽 ⚽", "Eating, toilet, playing") + P("We wash our hands <b>before we eat</b>, <b>after the toilet</b> and <b>after playing outside</b>.") }
    ],
    example: { q: "Thando played in the sand. Now it is time to eat. What must he do first?", steps: ["Thando's hands touched the sand.", "There may be germs on his hands.", "He must wash his hands before he eats."] },
    questions: [
      { type: "mcq", q: "What do we use to wash our hands?", pics: ["🧼", "🖍️", "🧸"], options: ["Soap and water", "Crayons", "A teddy"], answer: 0, hints: ["It makes bubbles.", "We use it in the bathroom.", "Soap and water wash germs away."], explain: "Soap and water wash the germs off our hands." },
      { type: "mcq", q: "When must we wash our hands?", pics: ["🚽", "😴", "📺"], options: ["After the toilet", "When we sleep", "When we watch TV"], answer: 0, hints: ["Think about the bathroom.", "Germs come from the toilet.", "We always wash after the toilet."], explain: "We wash our hands after the toilet, so we do not spread germs." },
      { type: "order", q: "Put the hand washing steps in order.", items: ["Wet your hands", "Rub with soap", "Rinse with water", "Dry your hands"], orderLabel: "first to last", hints: ["What do you do first?", "The soap comes after the water.", "Drying comes last."], explain: "Wet, soap, rinse, dry." },
      { type: "mcq", q: "Lebo is going to eat an apple. What should she do first?", pics: ["👐", "🏃", "🐶"], options: ["Wash her hands", "Run outside", "Pat the dog"], answer: 0, hints: ["She is going to eat.", "Before eating, we make our hands clean.", "Washing comes before eating."], explain: "Lebo washes her hands before she eats." },
      { type: "mcq", q: "Can we see germs?", pics: ["🙈", "👀"], options: ["No, they are too tiny", "Yes, they are big"], fixed: true, answer: 0, hints: ["Germs are very, very small.", "Can you see them on your hands?", "They are too small to see."], explain: "Germs are too tiny to see. That is why we wash even when our hands look clean." }
    ],
    reflect: { q: "What will you remember?", options: ["Use soap", "Wash before eating", "Wash after the toilet", "Not sure"] },
    parent: "Your child learned the steps for washing hands and when to wash them.",
    teacher: "Shows whether the child can sequence a familiar self-care routine and link it to everyday moments.",
    done: "Clean hands help everyone stay healthy." },

  { id: "ey-safe", grade: -1, subject: "Well-being", title: "Safe or not safe?", topic: "Staying safe", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: NCF + "Early Learning and Development Area 1: Well-being (children build a sense of safety and security; identify dangerous objects and situations)",
    intention: "Today I am learning which things are safe to touch.", prompt: "How do you know it is not safe?",
    lesson: [
      { h: "Some things can hurt us", say: "Some things can hurt us. Hot things, sharp things and medicine are not for playing.", html: PICS("🔥 🔪 💊", "Fire, knife, medicine") + P("Some things can <b>hurt</b> us: hot things, sharp things and medicine. They are <b>not for playing</b>.") },
      { h: "Ask a grown-up", say: "If you see something that is not safe, do not touch it. Tell a grown-up.", html: PICS("✋ 🧑", "Stop hand and a grown-up") + P("If you see something that is not safe, <b>stop</b>. Do not touch it. <b>Tell a grown-up</b>.") },
      { h: "Know your name", say: "If you get lost, stay where you are and tell a safe grown-up your name.", html: PICS("🧒 💬 👮", "Child talking to a police officer") + P("If you get lost, <b>stay where you are</b>. Tell a safe grown-up, like a police officer or a teacher, <b>your name</b>.") }
    ],
    example: { q: "Sipho sees a box of matches on the table. What should he do?", steps: ["Matches can make fire.", "Fire is hot and can hurt.", "Sipho should not touch them. He should tell a grown-up."] },
    questions: [
      { type: "mcq", q: "Which one is safe to play with?", pics: ["⚽", "🔪", "🔥"], options: ["A ball", "A knife", "Fire"], answer: 0, hints: ["Which one can hurt you?", "Knives are sharp and fire is hot.", "We play with a ball."], explain: "A ball is safe to play with. Knives and fire can hurt us." },
      { type: "mcq", q: "You see pills on the floor. What do you do?", pics: ["🧑", "👄", "🙈"], options: ["Tell a grown-up", "Eat them", "Hide them"], answer: 0, hints: ["Pills are medicine.", "Medicine can make us sick if it is not for us.", "A grown-up will know what to do."], explain: "Medicine is only for grown-ups to give. Tell a grown-up." },
      { type: "sort", q: "Sort these into safe and not safe to touch.", items: ["Teddy", "Hot pot", "Book", "Scissors"], bins: ["Safe", "Not safe"], answer: [0, 1, 0, 1], hints: ["Can it hurt you?", "A hot pot burns and scissors are sharp.", "Teddy and book are safe."], explain: "A teddy and a book are safe. A hot pot and scissors can hurt us." },
      { type: "mcq", q: "You are lost at the shops. What should you do?", pics: ["🧍", "🏃", "🚗"], options: ["Stay and tell a safe grown-up", "Run away", "Get into a car"], answer: 0, hints: ["Running makes it harder to find you.", "Who can help you?", "Stay where you are and ask a shop worker or police officer."], explain: "Stay where you are and tell a safe grown-up your name." },
      { type: "mcq", q: "Why do we not touch the stove?", pics: ["🔥", "🧊"], options: ["It is hot", "It is cold"], fixed: true, answer: 0, hints: ["We cook food on the stove.", "Cooking needs heat.", "It is hot and can burn."], explain: "The stove is hot. It can burn us." }
    ],
    reflect: { q: "What helps you stay safe?", options: ["Stop and do not touch", "Tell a grown-up", "Know my name", "Not sure"] },
    parent: "Your child talked about dangerous objects and what to do when lost. You could practise saying their full name and your phone number together.",
    teacher: "Shows whether the child can tell safe from unsafe objects and names a help-seeking action.",
    done: "When something is not safe, stop and tell a grown-up." },

  { id: "ey-me", grade: -1, subject: "Identity and Belonging", title: "All about me", topic: "Me and what I can do", domain: "Creativity and Metacognition", category: "Reflection",
    caps: NCF + "Early Learning and Development Area 2: Identity and Belonging (children are aware of themselves as capable and confident learners; celebrating differences)",
    intention: "Today I am thinking about me and the things I can do.", prompt: "What can you do now that you could not do before?",
    lesson: [
      { h: "I am special", say: "There is only one you. Your name, your face and the things you like make you special.", html: PICS("🧒 ⭐", "A child and a star") + P("There is only <b>one you</b>. Your name, your face and the things you like make you <b>special</b>.") },
      { h: "I can do things", say: "You can do so many things. You can jump, sing, draw and help.", html: PICS("🦘 🎤 🖍️ 🤝", "Jump, sing, draw, help") + P("You <b>can</b> do so many things: jump, sing, draw and help. Every day you learn something new.") },
      { h: "We are all different", say: "People are different. Some are tall, some are short. We all belong.", html: PICS("🧍🏾 🧍🏻 🧑🏽‍🦽 🧍🏿", "Different people") + P("People are <b>different</b>. Some are tall and some are short. Some walk and some use a wheelchair. <b>We all belong.</b>") }
    ],
    example: { q: "Amahle says, \"I can put on my shoes by myself!\" How does she feel?", steps: ["Amahle learned to do something new.", "She did it by herself.", "She feels proud."] },
    questions: [
      { type: "mcq", q: "Which one is something you can do with your feet?", pics: ["🦘", "👏", "👂"], options: ["Jump", "Clap", "Listen"], answer: 0, hints: ["Feet are at the bottom of your legs.", "We clap with hands and listen with ears.", "We jump with our feet."], explain: "We jump with our feet." },
      { type: "mcq", q: "Zola wears glasses and Ben does not. What is true?", pics: ["🤝", "🚫"], options: ["They can both be friends", "They cannot play together"], fixed: true, answer: 0, hints: ["Being different is fine.", "Glasses help Zola to see.", "Different people can be friends."], explain: "People can be different and still be friends." },
      { type: "mcq", q: "You learned to ride a bike. How might you feel?", pics: ["😊", "😢", "😠"], options: ["Proud", "Sad", "Cross"], answer: 0, hints: ["You learned something new.", "It was hard, but you did it.", "Doing something hard feels good."], explain: "We feel proud when we learn to do something new." },
      { type: "mcq", q: "Which is the same for all children?", pics: ["❤️", "👟", "🎨"], options: ["We all have feelings", "We all wear the same shoes", "We all like the same colour"], answer: 0, hints: ["Shoes and colours are different for different people.", "Everyone feels happy or sad sometimes.", "All people have feelings."], explain: "Everyone has feelings, even though we like different things." },
      { type: "mcq", q: "What makes you special?", pics: ["🌟", "🌑"], options: ["There is only one me", "Nothing"], fixed: true, answer: 0, hints: ["Think about your name and face.", "Is there another child exactly like you?", "There is only one you."], explain: "There is only one you. That makes you special." }
    ],
    reflect: { q: "What do you like most about you?", options: ["What I can do", "What I like", "How I help", "Not sure"] },
    parent: "Your child talked about what makes them special and how people are different. Ask them what new thing they learned to do this week.",
    teacher: "Shows whether the child names their own abilities and accepts differences between people.",
    done: "You are special, and so is everyone else." },

  { id: "ey-turns", grade: -1, subject: "Identity and Belonging", title: "Taking turns and sharing", topic: "Playing with others", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: NCF + "Early Learning and Development Area 2: Identity and Belonging (children build strong relationships; take turns, share and follow simple rules)",
    intention: "Today I am learning how to take turns and share.", prompt: "How did you feel when you waited?",
    lesson: [
      { h: "Taking turns", say: "Taking turns means one person goes, then the next person goes. Everyone gets a chance.", html: PICS("🧒 ➡️ 👧 ➡️ 🧒", "One child, then another") + P("<b>Taking turns</b> means one person goes, then the next. <b>Everyone</b> gets a chance.") },
      { h: "Sharing", say: "Sharing means letting others use things too. We can share toys, crayons and snacks.", html: PICS("🧸 🖍️ 🍊", "Toys, crayons, snacks") + P("<b>Sharing</b> means letting others use things too.") },
      { h: "Waiting is hard", say: "Waiting can be hard. You can take a deep breath and count to five while you wait.", html: PICS("😮‍💨 1 2 3 4 5", "Breathe and count to five") + P("Waiting can be <b>hard</b>. Take a deep breath and count to five.") }
    ],
    example: { q: "Two children want the same swing. What can they do?", steps: ["There is only one swing.", "They can take turns.", "One child swings first. Then the other child has a turn."] },
    questions: [
      { type: "mcq", q: "Your friend has no crayons. What can you do?", pics: ["🖍️", "🙅", "🏃"], options: ["Share your crayons", "Say no", "Run away"], answer: 0, hints: ["Your friend wants to draw too.", "You have crayons.", "You can let your friend use some."], explain: "Sharing your crayons means you can both draw." },
      { type: "mcq", q: "It is not your turn on the slide. What do you do?", pics: ["🧍", "👊", "😭"], options: ["Wait in the line", "Push", "Cry and shout"], answer: 0, hints: ["Everyone gets a turn.", "Pushing can hurt someone.", "Your turn will come if you wait."], explain: "We wait in the line. Our turn will come." },
      { type: "mcq", q: "What can help you while you wait?", pics: ["😮‍💨", "🦶"], options: ["Breathe and count", "Stamp your feet"], fixed: true, answer: 0, hints: ["Something that helps you feel calm.", "Breathing slowly calms our body.", "Breathe and count to five."], explain: "Breathing and counting help us feel calm while we wait." },
      { type: "mcq", q: "Nomsa shared her orange with you. What do you say?", pics: ["🙏", "🤐"], options: ["Thank you", "Nothing"], fixed: true, answer: 0, hints: ["Nomsa was kind.", "What do we say when someone is kind?", "We say thank you."], explain: "We say thank you when someone shares with us." },
      { type: "mcq", q: "Why do we take turns?", pics: ["😊", "😞"], options: ["So everyone gets a chance", "So only I can play"], fixed: true, answer: 0, hints: ["Think about your friends.", "Would it be fair if only one child played?", "Taking turns is fair."], explain: "Taking turns is fair. Everyone gets a chance to play." }
    ],
    reflect: { q: "What is easy for you?", options: ["Sharing", "Taking turns", "Waiting", "Not sure"] },
    parent: "Your child practised ideas about sharing, taking turns and waiting calmly.",
    teacher: "Shows whether the child can choose prosocial responses and a calming strategy for waiting.",
    done: "When we share and take turns, everyone can play." },

  { id: "ey-sounds", grade: -1, subject: "Communication", title: "Listen to the sounds", topic: "Listening", domain: "Communication and Expression", category: "Communication",
    caps: NCF + "Early Learning and Development Area 3: Communication (children listen to sounds and speech; identify a wide range of sounds; enjoy songs and rhymes)",
    intention: "Today I am learning to listen carefully.", prompt: "What sound did you hear?",
    lesson: [
      { h: "Our ears hear sounds", say: "We hear sounds with our ears. Some sounds are loud and some are soft.", html: PICS("👂 🔊 🔈", "Ears, loud and soft") + P("We hear sounds with our <b>ears</b>. Some sounds are <b>loud</b> and some are <b>soft</b>.") },
      { h: "Animal sounds", say: "A cow says moo. A dog says woof. A cat says meow. A duck says quack.", html: PICS("🐄 🐕 🐈 🦆", "Cow, dog, cat, duck") + P("A cow says <b>moo</b>. A dog says <b>woof</b>. A cat says <b>meow</b>. A duck says <b>quack</b>.") },
      { h: "Sounds around us", say: "Listen. Can you hear a car, a bird or people talking?", html: PICS("🚗 🐦 🗣️", "Car, bird, people talking") + P("Close your eyes and listen. What sounds can you hear around you?") }
    ],
    example: { q: "What says moo?", steps: ["Think of the animal sounds.", "A dog says woof and a cat says meow.", "A cow says moo."] },
    questions: [
      { type: "mcq", q: "Which animal says woof?", pics: ["🐕", "🐄", "🦆"], options: ["Dog", "Cow", "Duck"], answer: 0, hints: ["It is a pet.", "It barks.", "A dog says woof."], explain: "A dog says woof." },
      { type: "mcq", q: "Which animal says quack?", pics: ["🦆", "🐈", "🐑"], options: ["Duck", "Cat", "Sheep"], answer: 0, hints: ["It swims on a pond.", "It has a flat beak.", "A duck says quack."], explain: "A duck says quack." },
      { type: "mcq", q: "Which one makes a loud sound?", pics: ["🥁", "🪶"], options: ["Drum", "Feather"], fixed: true, answer: 0, hints: ["Which one do you bang?", "A feather is very quiet.", "A drum is loud."], explain: "A drum makes a loud sound. A feather is very quiet." },
      { type: "mcq", q: "What do we hear with?", pics: ["👂", "👃", "👄"], options: ["Ears", "Nose", "Mouth"], answer: 0, hints: ["We smell with our nose.", "We eat with our mouth.", "We hear with our ears."], explain: "We hear with our ears." },
      { type: "mcq", q: "A baby is sleeping. How should we talk?", pics: ["🤫", "📢"], options: ["Softly", "Loudly"], fixed: true, answer: 0, hints: ["We do not want to wake the baby.", "Loud sounds wake people up.", "We talk softly."], explain: "We talk softly so the baby can sleep." }
    ],
    reflect: { q: "Which sound do you like?", options: ["Animal sounds", "Music", "Quiet sounds", "Not sure"] },
    parent: "Your child listened for animal sounds and loud and soft sounds. Try a listening walk together.",
    teacher: "Shows whether the child matches sounds to sources and distinguishes loud from soft.",
    done: "Good listeners hear so many sounds." },

  { id: "ey-story", grade: -1, subject: "Communication", title: "Pictures tell a story", topic: "Reading pictures in order", domain: "Communication and Expression", category: "Planning and Organisation",
    caps: NCF + "Early Learning and Development Area 3: Communication (children make meaning by \"reading\" what they see; arrange pictures to form a story)",
    intention: "Today I am learning to tell a story from pictures.", prompt: "What happened first?",
    lesson: [
      { h: "Stories have an order", say: "A story has a beginning, a middle and an end. First, next, last.", html: PICS("1️⃣ 2️⃣ 3️⃣", "First, next, last") + P("A story happens in <b>order</b>: <b>first</b>, <b>next</b>, <b>last</b>.") },
      { h: "A seed grows", say: "First, we plant a seed. Next, it gets water and sun. Last, a flower grows.", html: PICS("🌰 ➡️ 💧☀️ ➡️ 🌻", "Seed, water and sun, flower") + P("<b>First</b> we plant a seed. <b>Next</b> it gets water and sun. <b>Last</b> a flower grows.") },
      { h: "Look at the pictures", say: "Pictures can tell us what is happening, even before we can read words.", html: PICS("📖 👀", "A book and eyes") + P("Pictures can tell us what is happening, even before we can read the words.") }
    ],
    example: { q: "A boy is getting ready for bed. What comes first: brushing teeth or sleeping?", steps: ["Think about bedtime.", "We brush our teeth before we get into bed.", "First we brush our teeth. Last we sleep."] },
    questions: [
      { type: "order", q: "Put the seed story in order.", items: ["Plant a seed", "Water it", "A flower grows"], orderLabel: "first to last", hints: ["What do we do first?", "The seed needs water to grow.", "The flower comes last."], explain: "Plant, water, then a flower grows." },
      { type: "order", q: "Put the egg story in order.", items: ["An egg", "The egg cracks", "A chick comes out"], orderLabel: "first to last", hints: ["What comes before the chick?", "The egg must crack first.", "The chick comes out last."], explain: "First an egg, next it cracks, last a chick comes out." },
      { type: "mcq", q: "What comes last when we eat a banana?", pics: ["🗑️", "🍌"], options: ["Put the peel in the bin", "Peel the banana"], fixed: true, answer: 0, hints: ["We peel it first.", "Then we eat it.", "The peel goes in the bin last."], explain: "We peel, eat, and last we put the peel in the bin." },
      { type: "order", q: "Put the morning in order.", items: ["Wake up", "Get dressed", "Go to school"], orderLabel: "first to last", hints: ["What happens when you are still in bed?", "You get dressed before you go out.", "School comes last."], explain: "Wake up, get dressed, then go to school." },
      { type: "mcq", q: "What helps us know what a story is about?", pics: ["🖼️", "🙉"], options: ["Looking at the pictures", "Closing the book"], fixed: true, answer: 0, hints: ["Books have pictures.", "Pictures show what is happening.", "Look at the pictures."], explain: "Pictures help us know what is happening in a story." }
    ],
    reflect: { q: "What helped you put things in order?", options: ["Thinking what comes first", "Looking at pictures", "Things I do every day", "Not sure"] },
    parent: "Your child put picture stories in order using first, next and last. Ask them to tell you about their day in order.",
    teacher: "Shows whether the child sequences familiar events and uses first, next and last.",
    done: "First, next, last. Now you can tell a story." },

  { id: "ey-count", grade: -1, subject: "Exploring Mathematics", title: "Counting to 5", topic: "Counting", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: NCF + "Early Learning and Development Area 4: Exploring Mathematics (children count and use number names in play)",
    intention: "Today I am learning to count to 5.", prompt: "How did you keep count?",
    lesson: [
      { h: "Counting", say: "One, two, three, four, five. We say one number for each thing we count.", html: PICS("1 2 3 4 5", "Numbers one to five") + P("<b>One, two, three, four, five.</b> We say <b>one number for each thing</b>.") },
      { h: "Touch and count", say: "Touch each apple as you count. One, two, three. There are 3 apples.", html: PICS(REP("🍎", 3), "3 apples") + P("Touch each apple as you count: one, two, <b>three</b>. There are <b>3</b> apples.") },
      { h: "The last number tells how many", say: "When we count 4 ducks, the last number we say is 4. So there are 4 ducks.", html: PICS(REP("🦆", 4), "4 ducks") + P("The <b>last number</b> we say tells us <b>how many</b>. There are <b>4</b> ducks.") }
    ],
    example: { q: "There are two balls on the grass. How many balls?", steps: ["Touch the first ball and say one.", "Touch the next ball and say two.", "There are 2 balls."] },
    questions: [
      { type: "mcq", q: "How many stars?", html: PICS(REP("⭐", 3), "3 stars"), options: ["3", "2", "5"], answer: 0, hints: ["Touch each star.", "One, two, …", "One, two, three."], explain: "One, two, three. There are 3 stars." },
      { type: "mcq", q: "How many fish?", html: PICS(REP("🐟", 5), "5 fish"), options: ["5", "4", "3"], answer: 0, hints: ["Count slowly.", "Say one number for each fish.", "One, two, three, four, five."], explain: "There are 5 fish." },
      { type: "mcq", q: "How many cars?", html: PICS("🚗", "1 car"), options: ["1", "2", "3"], answer: 0, hints: ["Look carefully.", "Is there more than one?", "There is just one."], explain: "There is 1 car." },
      { type: "mcq", q: "Which number comes after 3?", html: chainRow(["1", "2", "3", "?"]), options: ["4", "5", "2"], answer: 0, hints: ["Count: one, two, three, …", "What do you say next?", "After three comes four."], explain: "One, two, three, four. 4 comes after 3." },
      { type: "mcq", q: "Which has more?", pics: [REP("🍪", 4), REP("🍪", 2)], options: ["4 biscuits", "2 biscuits"], fixed: true, answer: 0, hints: ["Count each group.", "Which number is bigger?", "4 is more than 2."], explain: "4 biscuits is more than 2 biscuits." }
    ],
    reflect: { q: "How did you count?", options: ["Touching each one", "Saying the numbers", "Looking carefully", "Not sure"] },
    parent: "Your child counted groups up to 5. Count stairs, spoons or shoes together at home.",
    teacher: "Shows one-to-one correspondence and whether the child knows the last count gives the total.",
    done: "You can count to 5. Count things all around you!" },

  { id: "ey-shapes", grade: -1, subject: "Exploring Mathematics", title: "Circles, squares and triangles", topic: "Shapes and sorting", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: NCF + "Early Learning and Development Area 4: Exploring Mathematics (shapes and space; sorting by colour, size and shape)",
    intention: "Today I am learning the names of shapes.", prompt: "How did you know which shape it was?",
    lesson: [
      { h: "Circle", say: "A circle is round. It has no corners. A plate and a wheel are circles.", html: PICS("⚪ 🍽️ 🛞", "Circle, plate, wheel") + P("A <b>circle</b> is round. It has <b>no corners</b>.") },
      { h: "Square and triangle", say: "A square has 4 sides that are all the same. A triangle has 3 sides and 3 corners.", html: PICS("🟥 🔺", "Square and triangle") + P("A <b>square</b> has <b>4</b> sides, all the same. A <b>triangle</b> has <b>3</b> sides and 3 corners.") },
      { h: "Sorting", say: "We can sort things into groups. We can sort by shape, by colour or by size.", html: PICS("🔴🔴 🔵🔵", "Red group and blue group") + P("We can <b>sort</b> things into groups by <b>shape</b>, <b>colour</b> or <b>size</b>.") }
    ],
    example: { q: "A slice of watermelon has 3 sides. What shape is it like?", steps: ["Count the sides: 3.", "Which shape has 3 sides?", "A triangle has 3 sides."] },
    questions: [
      { type: "mcq", q: "Which shape is round?", pics: ["⚪", "🟥", "🔺"], options: ["Circle", "Square", "Triangle"], answer: 0, hints: ["Round means no corners.", "A square and a triangle have corners.", "A circle is round."], explain: "A circle is round with no corners." },
      { type: "mcq", q: "How many sides does a triangle have?", html: PICS("🔺", "A triangle"), options: ["3", "4", "0"], answer: 0, hints: ["Count the sides.", "Tri means three.", "A triangle has 3 sides."], explain: "A triangle has 3 sides." },
      { type: "mcq", q: "Which is shaped like a circle?", pics: ["🛞", "📘", "⛺"], options: ["A wheel", "A book", "A tent"], answer: 0, hints: ["Which one is round?", "Wheels roll.", "A wheel is a circle."], explain: "A wheel is round like a circle." },
      { type: "sort", q: "Sort by colour.", items: ["Red ball", "Blue car", "Red apple", "Blue cup"], bins: ["Red", "Blue"], answer: [0, 1, 0, 1], hints: ["Look at the colour word.", "Ball and apple are red.", "Car and cup are blue."], explain: "Red ball and red apple go together. Blue car and blue cup go together." },
      { type: "mcq", q: "Which is bigger?", pics: ["🐘", "🐭"], options: ["Elephant", "Mouse"], fixed: true, answer: 0, hints: ["Think about how big they are.", "A mouse is tiny.", "An elephant is huge."], explain: "An elephant is much bigger than a mouse." }
    ],
    reflect: { q: "Which shape do you like?", options: ["Circle", "Square", "Triangle", "Not sure"] },
    parent: "Your child named circles, squares and triangles and sorted by colour. Go on a shape hunt in your home.",
    teacher: "Shows whether the child names basic 2-D shapes by features and sorts by one attribute.",
    done: "Shapes are everywhere. Look for circles, squares and triangles!" },

  { id: "ey-colours", grade: -1, subject: "Creativity", title: "Colours all around", topic: "Colours and mixing", domain: "Creativity and Metacognition", category: "Creativity",
    caps: NCF + "Early Learning and Development Area 5: Creativity (children explore art materials, colour and making things)",
    intention: "Today I am learning about colours.", prompt: "What colour would you make?",
    lesson: [
      { h: "Colours we know", say: "Red, yellow, blue and green. Colours are all around us.", html: PICS("🟥 🟨 🟦 🟩", "Red, yellow, blue, green") + P("<b>Red, yellow, blue</b> and <b>green</b>. Colours are all around us.") },
      { h: "Mixing colours", say: "When we mix yellow and blue paint, we get green. Red and yellow make orange.", html: PICS("🟨 + 🟦 = 🟩", "Yellow and blue make green") + PICS("🟥 + 🟨 = 🟧", "Red and yellow make orange") + P("Mixing paint makes <b>new colours</b>.") },
      { h: "Colours in nature", say: "The sky is blue. Grass is green. The sun looks yellow.", html: PICS("🌤️ 🌿 🍊", "Sky, grass, orange") + P("The sky is <b>blue</b>. Grass is <b>green</b>. An orange is <b>orange</b>!") }
    ],
    example: { q: "Lindiwe mixes red and yellow paint. What colour does she get?", steps: ["She has red and yellow.", "Red and yellow mix together.", "She gets orange."] },
    questions: [
      { type: "mcq", q: "What colour is grass?", pics: ["🟩", "🟥", "🟦"], options: ["Green", "Red", "Blue"], answer: 0, hints: ["Look outside.", "Leaves are the same colour.", "Grass is green."], explain: "Grass is green." },
      { type: "mcq", q: "Yellow and blue make…", pics: ["🟩", "🟧", "🟪"], options: ["Green", "Orange", "Purple"], answer: 0, hints: ["Look at the mixing picture.", "Blue and yellow together.", "They make green."], explain: "Yellow and blue make green." },
      { type: "mcq", q: "What colour is a banana?", pics: ["🟨", "🟦", "⬛"], options: ["Yellow", "Blue", "Black"], answer: 0, hints: ["Think of a ripe banana.", "It is the same colour as the sun in pictures.", "A banana is yellow."], explain: "A ripe banana is yellow." },
      { type: "mcq", q: "Red and yellow make…", pics: ["🟧", "🟩"], options: ["Orange", "Green"], fixed: true, answer: 0, hints: ["Like the colour of an orange.", "Red and yellow together.", "They make orange."], explain: "Red and yellow make orange." },
      { type: "mcq", q: "What colour is the sky on a sunny day?", pics: ["🟦", "🟫"], options: ["Blue", "Brown"], fixed: true, answer: 0, hints: ["Look up on a sunny day.", "It is not the colour of soil.", "The sky is blue."], explain: "On a sunny day the sky is blue." }
    ],
    reflect: { q: "What would you like to paint?", options: ["Animals", "My family", "The sky", "Not sure"] },
    parent: "Your child named colours and learned that mixing colours makes new ones.",
    teacher: "Shows colour naming and early understanding of colour mixing.",
    done: "You can make new colours by mixing!" },

  { id: "ey-music", grade: -1, subject: "Creativity", title: "Loud and soft, fast and slow", topic: "Music and movement", domain: "Creativity and Metacognition", category: "Creativity",
    caps: NCF + "Early Learning and Development Area 5: Creativity (children explore music, rhythm and movement)",
    intention: "Today I am learning about music and moving.", prompt: "How does the music make you want to move?",
    lesson: [
      { h: "Loud and soft", say: "Music can be loud, like a big drum. Music can be soft, like a whisper.", html: PICS("🥁 🔊  🤫 🔈", "Loud drum, soft whisper") + P("Music can be <b>loud</b> or <b>soft</b>.") },
      { h: "Fast and slow", say: "Music can be fast, like a running cheetah, or slow, like a tortoise.", html: PICS("🐆 💨  🐢", "Fast cheetah, slow tortoise") + P("Music can be <b>fast</b> or <b>slow</b>.") },
      { h: "Move to the music", say: "When music is fast, we can move fast. When music is slow, we can move slowly.", html: PICS("💃 🕺", "Dancing") + P("We can <b>move</b> our bodies to music: fast, slow, big and small.") }
    ],
    example: { q: "The music is slow and soft. How can you move?", steps: ["Slow means not fast.", "Soft means gentle.", "You can sway slowly, like a tree in a soft wind."] },
    questions: [
      { type: "mcq", q: "Which animal is fast?", pics: ["🐆", "🐢", "🐌"], options: ["Cheetah", "Tortoise", "Snail"], answer: 0, hints: ["Which one runs?", "Tortoises and snails move slowly.", "A cheetah is very fast."], explain: "A cheetah is fast." },
      { type: "mcq", q: "Which sound is soft?", pics: ["🤫", "📢", "🥁"], options: ["A whisper", "A shout", "A big drum"], answer: 0, hints: ["Soft means quiet.", "Shouts and drums are loud.", "A whisper is soft."], explain: "A whisper is soft." },
      { type: "mcq", q: "The music is fast. How do you move?", pics: ["🏃", "🧘"], options: ["Quickly", "Very slowly"], fixed: true, answer: 0, hints: ["Match your body to the music.", "Fast music, fast feet.", "Move quickly."], explain: "Fast music, fast moves!" },
      { type: "mcq", q: "Which can make music?", pics: ["🥁", "🧦", "🥄"], options: ["A drum", "A sock", "A pillow"], answer: 0, hints: ["Which one makes a sound when you tap it?", "A sock is soft and quiet.", "You bang a drum."], explain: "A drum makes music when you tap it." },
      { type: "mcq", q: "A tortoise is…", pics: ["🐢", "⚡"], options: ["Slow", "Fast"], fixed: true, answer: 0, hints: ["Think of how a tortoise walks.", "It carries a heavy shell.", "A tortoise is slow."], explain: "A tortoise is slow." }
    ],
    reflect: { q: "What music do you like?", options: ["Fast music", "Slow music", "Loud music", "Soft music"] },
    parent: "Your child explored loud and soft, fast and slow in music. Dance together to different songs.",
    teacher: "Shows whether the child distinguishes dynamics and tempo and links them to movement.",
    done: "Music can be loud, soft, fast or slow. Keep moving!" },

  { id: "ey-animals", grade: -1, subject: "Knowledge and Understanding of the World", title: "Animals and their babies", topic: "Animals", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: NCF + "Early Learning and Development Area 6: Knowledge and Understanding of the World (children explore living things around them)",
    intention: "Today I am learning about animals and their babies.", prompt: "What did you notice about the baby animals?",
    lesson: [
      { h: "Baby animals", say: "Animals have babies. A baby cat is a kitten. A baby dog is a puppy.", html: PICS("🐈 🐱  🐕 🐶", "Cat and kitten, dog and puppy") + P("A baby cat is a <b>kitten</b>. A baby dog is a <b>puppy</b>.") },
      { h: "More baby animals", say: "A baby cow is a calf. A baby sheep is a lamb. A baby chicken is a chick.", html: PICS("🐄 🐑 🐔 🐣", "Cow, sheep, chicken, chick") + P("A baby cow is a <b>calf</b>. A baby sheep is a <b>lamb</b>. A baby chicken is a <b>chick</b>.") },
      { h: "Animals need care", say: "Animals need food, water and a safe place, just like we do.", html: PICS("🥣 💧 🏠", "Food, water, home") + P("Animals need <b>food</b>, <b>water</b> and a <b>safe place</b>.") }
    ],
    example: { q: "What is a baby chicken called?", steps: ["Chickens lay eggs.", "A baby comes out of the egg.", "It is called a chick."] },
    questions: [
      { type: "mcq", q: "What is a baby dog called?", pics: ["🐶", "🐱", "🐣"], options: ["Puppy", "Kitten", "Chick"], answer: 0, hints: ["It barks.", "A kitten is a baby cat.", "A baby dog is a puppy."], explain: "A baby dog is a puppy." },
      { type: "mcq", q: "What is a baby cat called?", pics: ["🐱", "🐑", "🐄"], options: ["Kitten", "Lamb", "Calf"], answer: 0, hints: ["It says meow.", "A lamb is a baby sheep.", "A baby cat is a kitten."], explain: "A baby cat is a kitten." },
      { type: "mcq", q: "Who is the lamb's mother?", pics: ["🐑", "🐄", "🐔"], options: ["Sheep", "Cow", "Chicken"], answer: 0, hints: ["A lamb has woolly hair.", "Which grown-up animal has wool?", "A lamb's mother is a sheep."], explain: "A lamb is a baby sheep." },
      { type: "mcq", q: "What do all animals need?", pics: ["💧", "📱"], options: ["Water", "A phone"], fixed: true, answer: 0, hints: ["Something living things drink.", "Animals do not use phones.", "All animals need water."], explain: "All animals need water to live." },
      { type: "mcq", q: "What comes out of an egg?", pics: ["🐣", "🐶"], options: ["A chick", "A puppy"], fixed: true, answer: 0, hints: ["Chickens lay eggs.", "Puppies are born from their mother dog.", "A chick comes out of an egg."], explain: "A chick hatches out of an egg." }
    ],
    reflect: { q: "Which baby animal do you like?", options: ["Puppy", "Kitten", "Chick", "Lamb"] },
    parent: "Your child matched animals to their babies and talked about what animals need.",
    teacher: "Shows vocabulary for young animals and awareness of basic needs of living things.",
    done: "Baby animals grow up, just like you." },

  { id: "ey-weather", grade: -1, subject: "Knowledge and Understanding of the World", title: "Sunny, rainy, windy", topic: "Weather", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: NCF + "Early Learning and Development Area 6: Knowledge and Understanding of the World (children explore the weather and their environment)",
    intention: "Today I am learning about the weather.", prompt: "What is the weather like today?",
    lesson: [
      { h: "Kinds of weather", say: "The weather can be sunny, rainy, windy or cold.", html: PICS("☀️ 🌧️ 💨 ❄️", "Sunny, rainy, windy, cold") + P("The weather can be <b>sunny</b>, <b>rainy</b>, <b>windy</b> or <b>cold</b>.") },
      { h: "What to wear", say: "When it is sunny, we wear a hat. When it rains, we wear a raincoat. When it is cold, we wear a jersey.", html: PICS("👒 🧥 🧶", "Hat, raincoat, jersey") + P("Sunny: a <b>hat</b>. Rainy: a <b>raincoat</b>. Cold: a warm <b>jersey</b>.") },
      { h: "Look at the sky", say: "Grey clouds can bring rain. A blue sky means it may be sunny.", html: PICS("☁️ 🌧️  🌤️", "Grey clouds and a sunny sky") + P("<b>Grey clouds</b> can bring rain. A <b>blue sky</b> may mean sun.") }
    ],
    example: { q: "It is raining. What should Kabelo take outside?", steps: ["Rain makes us wet.", "What keeps us dry?", "An umbrella or a raincoat."] },
    questions: [
      { type: "mcq", q: "It is sunny and hot. What do you wear?", pics: ["👒", "🧣", "🧤"], options: ["A sun hat", "A scarf", "Gloves"], answer: 0, hints: ["The sun is hot.", "Scarves and gloves keep us warm.", "A hat keeps the sun off your face."], explain: "A sun hat protects us from the sun." },
      { type: "mcq", q: "What keeps you dry in the rain?", pics: ["☂️", "🕶️", "🩳"], options: ["An umbrella", "Sunglasses", "Shorts"], answer: 0, hints: ["Rain falls from the sky.", "What do you hold above your head?", "An umbrella."], explain: "An umbrella keeps the rain off." },
      { type: "mcq", q: "The trees are moving and a hat blows away. What weather is it?", pics: ["💨", "☀️", "❄️"], options: ["Windy", "Sunny", "Snowy"], answer: 0, hints: ["Something is pushing the trees.", "We cannot see it, but we feel it.", "It is windy."], explain: "The wind moves the trees and blows hats away." },
      { type: "mcq", q: "It is very cold. What do you wear?", pics: ["🧶", "👙"], options: ["A warm jersey", "A swimming costume"], fixed: true, answer: 0, hints: ["Cold means we need to be warm.", "A costume is for swimming on hot days.", "A jersey keeps us warm."], explain: "A warm jersey keeps us warm on a cold day." },
      { type: "mcq", q: "What can grey clouds bring?", pics: ["🌧️", "🌈"], options: ["Rain", "Nothing ever"], fixed: true, answer: 0, hints: ["Look at the sky before it rains.", "The clouds go dark and grey.", "Grey clouds can bring rain."], explain: "Grey clouds often bring rain." }
    ],
    reflect: { q: "Which weather do you like?", options: ["Sunny", "Rainy", "Windy", "Cold"] },
    parent: "Your child talked about weather and what to wear. Look at the sky together each morning.",
    teacher: "Shows weather vocabulary and the link between weather and clothing choices.",
    done: "Look at the sky every day to see the weather." },

  // ===================== GRADE R: CAPS =====================
  { id: "gr-count", grade: 0, subject: "Mathematics", title: "Counting to 10", topic: "Count objects, more and less", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade R Mathematics: Numbers, Operations and Relationships (count objects to 10; number symbols 0 to 10; more than, less than, equal to)",
    intention: "Today I am practising counting to 10 and finding which group has more.", prompt: "How did you know which group had more?",
    lesson: [
      { h: "Count to 10", say: "One, two, three, four, five, six, seven, eight, nine, ten.", html: chainRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]) + P("Say one number for each thing you count.") },
      { h: "Zero means none", say: "Zero means there is nothing. If the plate is empty, there are zero biscuits.", html: PICS("🍽️", "An empty plate") + P("<b>0</b> means <b>none</b>. The plate is empty, so there are <b>zero</b> biscuits.") },
      { h: "More, less and the same", say: "Six sweets is more than four sweets. Four is less than six. Three and three are the same.", html: PICS(REP("🍬", 6), "6 sweets") + PICS(REP("🍬", 4), "4 sweets") + P("6 is <b>more than</b> 4. 4 is <b>less than</b> 6. 3 and 3 are <b>equal</b>, the same.") }
    ],
    example: { q: "Seven birds sit on a wire. Count them.", steps: ["Touch each bird and say a number.", "One, two, three, four, five, six, seven.", "There are 7 birds."] },
    questions: [
      { type: "mcq", q: "How many apples?", html: PICS(REP("🍎", 6), "6 apples"), options: ["6", "5", "8"], answer: 0, hints: ["Touch each apple.", "Count slowly.", "1, 2, 3, 4, 5, 6."], explain: "There are 6 apples." },
      { type: "mcq", q: "How many balloons?", html: PICS(REP("🎈", 9), "9 balloons"), options: ["9", "10", "7"], answer: 0, hints: ["Count each balloon once.", "Do not skip any.", "1, 2, 3, 4, 5, 6, 7, 8, 9."], explain: "There are 9 balloons." },
      { type: "mcq", q: "What number comes after 7?", html: chainRow(["5", "6", "7", "?"]), options: ["8", "6", "9"], answer: 0, hints: ["Count on from 7.", "Seven, …", "Seven, eight."], explain: "8 comes after 7." },
      { type: "mcq", q: "Which group has more?", pics: [REP("🐞", 8), REP("🐞", 5)], options: ["8 ladybirds", "5 ladybirds"], fixed: true, answer: 0, hints: ["Count each group.", "Which number is bigger?", "8 is more than 5."], explain: "8 is more than 5." },
      { type: "mcq", q: "How many cats are on the empty mat?", html: PICS("🟫", "An empty mat"), options: ["0", "1", "10"], answer: 0, hints: ["Look carefully at the mat.", "Is there any cat?", "None means zero."], explain: "There are no cats, so the answer is 0." },
      { type: "order", q: "Put the numbers in order, smallest first.", items: ["2", "5", "9"], orderLabel: "smallest to biggest", hints: ["Which number do you say first when you count?", "2 comes before 5.", "9 is the biggest."], explain: "2, 5, 9." }
    ],
    reflect: { q: "What helped you count?", options: ["Touching each one", "Saying numbers in order", "Comparing groups", "Not sure"] },
    parent: "Your child counted to 10, learned that zero means none, and compared groups.",
    teacher: "Shows counting to 10, recognising 0, and comparing quantities with more, less and equal.",
    done: "You can count to 10 and tell which group has more." },

  { id: "gr-patterns", grade: 0, subject: "Mathematics", title: "Copy and finish a pattern", topic: "Simple patterns", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade R Mathematics: Patterns, Functions and Algebra (copy and extend simple patterns using objects and drawings, such as colours and shapes)",
    intention: "Today I am practising finding what comes next in a pattern.", prompt: "What keeps repeating?",
    lesson: [
      { h: "A pattern repeats", say: "A pattern is something that repeats. Red, blue, red, blue. Red and blue repeat.", html: PICS("🔴 🔵 🔴 🔵 🔴 🔵", "Red, blue, red, blue, red, blue") + P("A <b>pattern</b> repeats again and again.") },
      { h: "Find the part that repeats", say: "In star, moon, moon, star, moon, moon, the part that repeats is star, moon, moon.", html: PICS("⭐ 🌙 🌙 ⭐ 🌙 🌙", "Star, moon, moon, star, moon, moon") + P("Find the <b>part that repeats</b>: ⭐ 🌙 🌙.") },
      { h: "Patterns we hear", say: "We can make patterns with sounds too. Clap, stamp, clap, stamp.", html: PICS("👏 🦶 👏 🦶", "Clap, stamp, clap, stamp") + P("Patterns can be <b>sounds</b> and <b>movements</b> too.") }
    ],
    example: { q: "What comes next? Apple, banana, apple, banana, apple, …", steps: ["The part that repeats is apple, banana.", "After apple comes banana.", "Next is banana."] },
    questions: [
      { type: "mcq", q: "What comes next?", html: PICS("🔴 🟡 🔴 🟡 🔴 ?", "Red, yellow, red, yellow, red, what next"), pics: ["🟡", "🔴", "🔵"], options: ["Yellow", "Red", "Blue"], answer: 0, hints: ["Red, yellow repeats.", "After red comes…", "Yellow."], explain: "Red, yellow, red, yellow, red, yellow." },
      { type: "mcq", q: "What comes next?", html: PICS("🐶 🐱 🐱 🐶 🐱 🐱 🐶 ?", "Dog, cat, cat, dog, cat, cat, dog, what next"), pics: ["🐱", "🐶"], options: ["Cat", "Dog"], fixed: true, answer: 0, hints: ["The part is dog, cat, cat.", "After dog comes…", "Cat."], explain: "Dog, cat, cat repeats, so cat comes next." },
      { type: "mcq", q: "What is missing?", html: PICS("⬛ ⬜ ⬛ ? ⬛ ⬜", "Black, white, black, missing, black, white"), pics: ["⬜", "⬛"], options: ["White", "Black"], fixed: true, answer: 0, hints: ["Black and white take turns.", "What comes after black?", "White."], explain: "Black, white, black, white." },
      { type: "mcq", q: "Clap, stamp, clap, stamp, clap … what next?", pics: ["🦶", "👏"], options: ["Stamp", "Clap"], fixed: true, answer: 0, hints: ["Clap and stamp take turns.", "The last one was clap.", "Stamp comes next."], explain: "After clap comes stamp." },
      { type: "mcq", q: "Which one is a pattern?", pics: ["🔺🔵🔺🔵🔺🔵", "🔺🔵🔵🟩🔺⭐"], options: ["Triangle, circle, triangle, circle", "Mixed up shapes"], fixed: true, answer: 0, hints: ["A pattern repeats.", "Does the same part come again?", "Triangle, circle repeats."], explain: "Triangle, circle, triangle, circle repeats, so it is a pattern." }
    ],
    reflect: { q: "How did you find the pattern?", options: ["Saying it out loud", "Finding the part that repeats", "Clapping it", "Not sure"] },
    parent: "Your child copied and continued colour, shape and sound patterns.",
    teacher: "Shows whether the child identifies the repeating unit and extends AB and ABB patterns.",
    done: "Patterns repeat. You can find them in clothes, songs and beads." },

  { id: "gr-shapes", grade: 0, subject: "Mathematics", title: "Ball shapes and box shapes", topic: "3-D objects and position", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade R Mathematics: Space and Shape (recognise and name ball shapes and box shapes; sort by whether they roll or slide; position: on top of, under, behind, next to)",
    intention: "Today I am practising which shapes roll and which shapes slide.", prompt: "How did you know if it would roll?",
    lesson: [
      { h: "Ball shapes roll", say: "A ball shape is round all over. It rolls. An orange and a soccer ball are ball shapes.", html: PICS("⚽ 🍊 🏀", "Soccer ball, orange, basketball") + P("A <b>ball shape</b> is round all over. It <b>rolls</b>.") },
      { h: "Box shapes slide", say: "A box shape has flat sides. It slides but does not roll. A cereal box is a box shape.", html: PICS("📦 🧊 🎁", "Box, ice cube, gift box") + P("A <b>box shape</b> has <b>flat sides</b>. It <b>slides</b>.") },
      { h: "Where is it?", say: "The cat is on top of the box. The ball is under the table. The dog is next to the tree.", html: PICS("🐈⬆️📦  ⚽⬇️", "Cat on top of box, ball under") + P("<b>On top of, under, behind, in front of, next to.</b> These words tell us where things are.") }
    ],
    example: { q: "Will a tin of beans roll?", steps: ["A tin has a round side.", "Round sides can roll.", "Yes. If it lies on its side, it rolls."] },
    questions: [
      { type: "mcq", q: "Which one rolls?", pics: ["⚽", "📦", "📘"], options: ["Ball", "Box", "Book"], answer: 0, hints: ["Which one is round all over?", "Boxes and books have flat sides.", "A ball rolls."], explain: "A ball is round, so it rolls." },
      { type: "mcq", q: "Which is a box shape?", pics: ["📦", "🍊", "🌍"], options: ["Gift box", "Orange", "Globe"], answer: 0, hints: ["Box shapes have flat sides.", "An orange and a globe are round.", "The gift box is a box shape."], explain: "A gift box has flat sides." },
      { type: "sort", q: "Sort these into roll and slide.", items: ["Ball", "Box", "Orange", "Brick"], bins: ["Rolls", "Slides"], answer: [0, 1, 0, 1], hints: ["Round things roll.", "Things with flat sides slide.", "Ball and orange roll."], explain: "Ball and orange roll. Box and brick slide." },
      { type: "mcq", q: "The bird is above the tree. Where is the bird?", pics: ["⬆️", "⬇️"], options: ["Above the tree", "Under the tree"], fixed: true, answer: 0, hints: ["Listen to the question.", "Above means higher up.", "Above the tree."], explain: "The bird is above the tree." },
      { type: "mcq", q: "You put your shoes under the bed. Where are they?", pics: ["🛏️⬇️👟", "🛏️⬆️👟"], options: ["Under the bed", "On top of the bed"], fixed: true, answer: 0, hints: ["Under means below.", "They are on the floor, lower than the bed.", "Under the bed."], explain: "The shoes are under the bed." }
    ],
    reflect: { q: "What helped you most?", options: ["Thinking about round sides", "Thinking about flat sides", "The position words", "Not sure"] },
    parent: "Your child sorted ball shapes and box shapes and used words like on top of and under.",
    teacher: "Shows recognition of ball and box shapes by rolling and sliding, and use of position language.",
    done: "Ball shapes roll and box shapes slide." },

  { id: "gr-measure", grade: 0, subject: "Mathematics", title: "Long or short, heavy or light", topic: "Comparing length, mass and capacity", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade R Mathematics: Measurement (informal comparison of length, mass and capacity: taller and shorter, heavy and light, full and empty)",
    intention: "Today I am practising comparing things by size, weight and how full they are.", prompt: "How did you compare them?",
    lesson: [
      { h: "Tall and short", say: "A giraffe is tall. A tortoise is short. Line them up to compare.", html: PICS("🦒 🐢", "Giraffe and tortoise") + P("A giraffe is <b>taller</b>. A tortoise is <b>shorter</b>.") },
      { h: "Heavy and light", say: "An elephant is heavy. A feather is light. Heavy things are hard to lift.", html: PICS("🐘 🪶", "Elephant and feather") + P("An elephant is <b>heavy</b>. A feather is <b>light</b>.") },
      { h: "Full and empty", say: "A full cup has lots of water. An empty cup has no water.", html: PICS("🥛 🥃", "Full glass and empty glass") + P("A <b>full</b> cup holds lots of water. An <b>empty</b> cup has none.") }
    ],
    example: { q: "Which is heavier, a watermelon or a grape?", steps: ["Imagine holding each one.", "A watermelon is big and hard to lift.", "The watermelon is heavier."] },
    questions: [
      { type: "mcq", q: "Which is taller?", pics: ["🦒", "🐁"], options: ["Giraffe", "Mouse"], fixed: true, answer: 0, hints: ["Which one reaches up high?", "A mouse is tiny.", "A giraffe is very tall."], explain: "A giraffe is taller than a mouse." },
      { type: "mcq", q: "Which is lighter?", pics: ["🪶", "🧱"], options: ["Feather", "Brick"], fixed: true, answer: 0, hints: ["Lighter means easier to lift.", "A brick is heavy.", "A feather is light."], explain: "A feather is lighter than a brick." },
      { type: "mcq", q: "Which bottle holds no water?", pics: ["🫙", "🍶"], options: ["The empty one", "The full one"], fixed: true, answer: 0, hints: ["No water means…", "Empty.", "The empty one."], explain: "An empty bottle has no water." },
      { type: "mcq", q: "Which is longer?", pics: ["🐍", "🐛"], options: ["Snake", "Caterpillar"], fixed: true, answer: 0, hints: ["Imagine them lying side by side.", "A caterpillar is small.", "A snake is longer."], explain: "A snake is longer than a caterpillar." },
      { type: "order", q: "Put these in order from shortest to tallest.", items: ["Ant", "Dog", "Giraffe"], orderLabel: "shortest to tallest", hints: ["Which is the tiniest?", "A dog is in the middle.", "A giraffe is the tallest."], explain: "Ant, dog, giraffe." }
    ],
    reflect: { q: "How did you compare?", options: ["Looking at size", "Imagining lifting", "Thinking about water", "Not sure"] },
    parent: "Your child compared tall and short, heavy and light, full and empty. Compare things at home while cooking or tidying.",
    teacher: "Shows use of comparative language for length, mass and capacity without units.",
    done: "Taller, heavier, fuller: you can compare things!" },

  { id: "gr-rhyme", grade: 0, subject: "English Home Language", title: "Words that rhyme", topic: "Rhyming words", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade R English Home Language: Phonological awareness (identify rhyming words; repeat rhymes and songs)",
    intention: "Today I am practising hearing words that rhyme.", prompt: "How did the words sound the same?",
    lesson: [
      { h: "Rhymes sound the same at the end", say: "Words that rhyme sound the same at the end. Cat and hat rhyme. They both end in at.", html: PICS("🐈 🎩", "Cat and hat") + P("<b>Cat</b> and <b>hat</b> rhyme. They both end in <b>-at</b>.") },
      { h: "More rhymes", say: "Bee and tree rhyme. Frog and log rhyme. Sun and bun rhyme.", html: PICS("🐝 🌳  🐸 🪵  ☀️ 🍞", "Bee and tree, frog and log, sun and bun") + P("Bee, tree. Frog, log. Sun, bun.") },
      { h: "Say it out loud", say: "Say the words out loud. Listen to the end of each word.", html: PICS("🗣️ 👂", "Say and listen") + P("Say the words out loud. <b>Listen to the end</b> of each word.") }
    ],
    example: { q: "Does dog rhyme with frog?", steps: ["Say dog. Say frog.", "Both end with og.", "Yes, dog and frog rhyme."] },
    questions: [
      { type: "mcq", q: "Which word rhymes with cat?", pics: ["🎩", "🐕", "🍎"], options: ["Hat", "Dog", "Apple"], answer: 0, hints: ["Cat ends with at.", "Which one ends with at too?", "Hat."], explain: "Cat and hat rhyme." },
      { type: "mcq", q: "Which word rhymes with bee?", pics: ["🌳", "🐄", "🚗"], options: ["Tree", "Cow", "Car"], answer: 0, hints: ["Bee ends with ee.", "Say each word.", "Tree ends with ee."], explain: "Bee and tree rhyme." },
      { type: "mcq", q: "Which word rhymes with sun?", pics: ["🍞", "🌙", "⭐"], options: ["Bun", "Moon", "Star"], answer: 0, hints: ["Sun ends with un.", "Which one ends with un?", "Bun."], explain: "Sun and bun rhyme." },
      { type: "mcq", q: "Do fish and dish rhyme?", pics: ["👍", "👎"], options: ["Yes", "No"], fixed: true, answer: 0, hints: ["Say fish. Say dish.", "Both end with ish.", "They rhyme."], explain: "Fish and dish both end in -ish, so they rhyme." },
      { type: "mcq", q: "Which word does not rhyme with log?", pics: ["🐸", "🐕", "🐈"], options: ["Frog", "Dog", "Cat"], answer: 2, hints: ["Log ends with og.", "Frog and dog end with og.", "Cat ends with at."], explain: "Cat does not rhyme with log. Frog and dog do." }
    ],
    reflect: { q: "What helped you hear rhymes?", options: ["Saying it out loud", "Listening to the end", "The pictures", "Not sure"] },
    parent: "Your child listened for rhyming words. Play a rhyming game: \"What rhymes with bed?\"",
    teacher: "Shows whether the child identifies rhyme by matching word endings.",
    done: "Rhyming words sound the same at the end." },

  { id: "gr-sounds", grade: 0, subject: "English Home Language", title: "First sounds", topic: "Initial sounds", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade R English Home Language: Phonics (recognise some initial consonants and vowels; recognise own name)",
    intention: "Today I am practising hearing the first sound in a word.", prompt: "Which sound did you hear first?",
    lesson: [
      { h: "Words start with a sound", say: "Every word starts with a sound. Ball starts with b. Sun starts with s.", html: PICS("⚽ ☀️", "Ball and sun") + P("<b>B</b>all starts with <b>b</b>. <b>S</b>un starts with <b>s</b>.") },
      { h: "Same first sound", say: "Mouse, moon and milk all start with m.", html: PICS("🐭 🌙 🥛", "Mouse, moon, milk") + P("<b>M</b>ouse, <b>m</b>oon and <b>m</b>ilk all start with <b>m</b>.") },
      { h: "Your name has a first sound", say: "Your name starts with a sound too. Thabo starts with t. Ayanda starts with a.", html: PICS("🧒 🔤", "A child and letters") + P("Your name starts with a sound too.") }
    ],
    example: { q: "What sound does dog start with?", steps: ["Say dog slowly: d … og.", "The first sound is d.", "Dog starts with d."] },
    questions: [
      { type: "mcq", q: "Which starts with the same sound as sun?", pics: ["🧦", "🐕", "🍎"], options: ["Sock", "Dog", "Apple"], answer: 0, hints: ["Sun starts with s.", "Say each word slowly.", "Sock starts with s."], explain: "Sun and sock both start with s." },
      { type: "mcq", q: "Which starts with b?", pics: ["⚽", "🐈", "🐟"], options: ["Ball", "Cat", "Fish"], answer: 0, hints: ["b, b, b.", "Say ball, cat, fish.", "Ball starts with b."], explain: "Ball starts with b." },
      { type: "mcq", q: "What is the first sound in milk?", pics: ["Ⓜ️", "🅿️"], options: ["m", "p"], fixed: true, answer: 0, hints: ["Say milk slowly.", "m … ilk.", "The first sound is m."], explain: "Milk starts with m." },
      { type: "mcq", q: "Which starts with the same sound as fish?", pics: ["🐸", "🐄", "🦁"], options: ["Frog", "Cow", "Lion"], answer: 0, hints: ["Fish starts with f.", "Say each word.", "Frog starts with f."], explain: "Fish and frog both start with f." },
      { type: "mcq", q: "Which word starts with a?", pics: ["🍎", "🍌", "🍊"], options: ["Apple", "Banana", "Orange"], answer: 0, hints: ["a, a, a.", "Say each fruit name slowly.", "Apple starts with a."], explain: "Apple starts with a." }
    ],
    reflect: { q: "How did you find the first sound?", options: ["Saying it slowly", "Looking at the picture", "Thinking of other words", "Not sure"] },
    parent: "Your child listened for first sounds in words. Play \"I spy something that starts with…\"",
    teacher: "Shows awareness of initial phonemes, a foundation for Grade 1 letter-sound work.",
    done: "Every word starts with a sound. Listen for it!" },

  { id: "gr-syllables", grade: 0, subject: "English Home Language", title: "Clap the parts of a word", topic: "Syllables", domain: "Communication and Expression", category: "Pattern Thinking",
    caps: "CAPS Grade R English Home Language: Phonological awareness (divide multisyllabic words into syllables, for example by clapping)",
    intention: "Today I am practising clapping the parts of words.", prompt: "How many claps did you hear?",
    lesson: [
      { h: "Words have parts", say: "Words have parts called syllables. We clap once for each part. Cat has one clap.", html: PICS("👏", "One clap") + P("Words have parts called <b>syllables</b>. <b>Cat</b> has one clap.") },
      { h: "Two and three claps", say: "Mon-key has two claps. E-le-phant has three claps.", html: PICS("🐒 👏👏  🐘 👏👏👏", "Monkey two claps, elephant three claps") + P("<b>Mon-key</b>: 2 claps. <b>El-e-phant</b>: 3 claps.") },
      { h: "Clap your name", say: "Clap your name. Si-pho has two claps. Nom-thu-li has three claps.", html: PICS("🧒 👏", "Clap your name") + P("Clap your name! <b>Si-pho</b>: 2. <b>Nom-thu-li</b>: 3.") }
    ],
    example: { q: "How many claps in banana?", steps: ["Say it slowly: ba-na-na.", "Clap for each part.", "Ba-na-na has 3 claps."] },
    questions: [
      { type: "mcq", q: "How many claps in dog?", pics: ["👏", "👏👏", "👏👏👏"], options: ["1", "2", "3"], answer: 0, hints: ["Say dog slowly.", "Is it one part or more?", "Dog has one part."], explain: "Dog has 1 syllable." },
      { type: "mcq", q: "How many claps in tiger?", pics: ["👏👏", "👏", "👏👏👏"], options: ["2", "1", "3"], answer: 0, hints: ["Say ti-ger.", "Clap each part.", "Ti-ger: 2."], explain: "Ti-ger has 2 syllables." },
      { type: "mcq", q: "How many claps in butterfly?", pics: ["👏👏👏", "👏👏", "👏"], options: ["3", "2", "1"], answer: 0, hints: ["Say but-ter-fly.", "Clap each part.", "But-ter-fly: 3."], explain: "But-ter-fly has 3 syllables." },
      { type: "mcq", q: "Which word has 2 claps?", pics: ["🐒", "🐈", "🐘"], options: ["Monkey", "Cat", "Elephant"], answer: 0, hints: ["Clap each word.", "Cat is 1 and elephant is 3.", "Mon-key is 2."], explain: "Mon-key has 2 claps." },
      { type: "order", q: "Put these in order: fewest claps first.", items: ["Sun", "Pencil", "Banana"], orderLabel: "fewest to most claps", hints: ["Clap each word.", "Sun is 1, pen-cil is 2.", "Ba-na-na is 3."], explain: "Sun (1), pen-cil (2), ba-na-na (3)." }
    ],
    reflect: { q: "What helped you count the parts?", options: ["Clapping", "Saying it slowly", "Touching my chin", "Not sure"] },
    parent: "Your child clapped the syllables in words. Clap family names together.",
    teacher: "Shows whether the child segments words into syllables, a phonological awareness skill.",
    done: "Clap, clap! Words have parts." },

  { id: "gr-story", grade: 0, subject: "English Home Language", title: "Story: Lulu's Lost Hat", topic: "Listening to a story", domain: "Communication and Expression", category: "Communication",
    caps: "CAPS Grade R English Home Language: Listening and speaking, and shared reading (listen to a story; answer simple questions; talk about the beginning, middle and end)",
    intention: "Today I am practising listening to a story and remembering what happened.", prompt: "What was your favourite part?",
    passage: PASS_LULU,
    lesson: [
      { h: "Listen to the story", say: "Listen to the story. You can press Read aloud to hear it.", html: PASS_LULU },
      { h: "Beginning, middle, end", say: "Stories have a beginning, a middle and an end. At the beginning we meet the characters.", html: PICS("1️⃣ 2️⃣ 3️⃣", "Beginning, middle, end") + P("A story has a <b>beginning</b>, a <b>middle</b> and an <b>end</b>.") },
      { h: "Who is in the story?", say: "The people and animals in a story are called characters. Lulu and Kofi are the characters.", html: PICS("👧 🐶", "Lulu and Kofi") + P("The people and animals in a story are the <b>characters</b>: Lulu and Kofi.") }
    ],
    example: { q: "What colour was Lulu's hat?", steps: ["Think back to the beginning of the story.", "Lulu had a hat that she wore every day.", "Her hat was red."] },
    questions: [
      { type: "mcq", q: "What made Lulu's hat fly away?", pics: ["💨", "🌧️", "🐶"], options: ["The wind", "The rain", "The puppy"], answer: 0, hints: ["It was a windy morning.", "Something blew the hat.", "The wind."], explain: "The wind blew Lulu's hat away." },
      { type: "mcq", q: "Who found the hat?", pics: ["🐶", "👩", "🐈"], options: ["Kofi the puppy", "Mum", "A cat"], answer: 0, hints: ["Lulu heard a bark.", "Who barks?", "Kofi the puppy."], explain: "Kofi the puppy found the hat." },
      { type: "order", q: "Put the story in order.", items: ["The wind blew the hat away", "Lulu looked for the hat", "Kofi brought the hat back"], orderLabel: "beginning to end", hints: ["What happened first?", "Then Lulu searched.", "Kofi found it at the end."], explain: "The hat blew away, Lulu looked, then Kofi brought it back." },
      { type: "mcq", q: "Where did Lulu look first?", pics: ["🪑", "🌳"], options: ["Under the bench", "Behind the tree"], fixed: true, answer: 0, hints: ["Listen to the middle of the story again.", "She looked in two places.", "She looked under the bench first."], explain: "She looked under the bench first, then behind the tree." },
      { type: "mcq", q: "How did Lulu feel at the end?", pics: ["😊", "😢"], options: ["Happy", "Sad"], fixed: true, answer: 0, hints: ["She got her hat back.", "She gave Kofi a hug.", "She felt happy."], explain: "Lulu was happy. She hugged Kofi and said thank you." }
    ],
    reflect: { q: "What helped you remember?", options: ["The pictures in my head", "Listening again", "Thinking about order", "Not sure"] },
    parent: "Your child listened to a story and retold what happened. Ask them to tell it back to you.",
    teacher: "Shows listening comprehension, recall of detail and sequencing of story events.",
    done: "Good listeners remember stories. Well done!" },

  { id: "gr-body", grade: 0, subject: "Life Skills", title: "My body belongs to me", topic: "My body", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: "CAPS Grade R Life Skills (Personal and Social Well-being), Term 1: My body (body parts and what they do; who may touch my body; keeping my body healthy)",
    intention: "Today I am learning about my body and keeping it safe.", prompt: "Who are your trusted grown-ups?",
    lesson: [
      { h: "Parts of my body", say: "I have a head, two arms, two hands, two legs and two feet.", html: PICS("🙂 💪 ✋ 🦵 🦶", "Head, arm, hand, leg, foot") + P("I have a <b>head</b>, two <b>arms</b>, two <b>hands</b>, two <b>legs</b> and two <b>feet</b>.") },
      { h: "What my body does", say: "I see with my eyes. I hear with my ears. I smell with my nose. I taste with my tongue. I feel with my skin.", html: PICS("👀 👂 👃 👅 ✋", "Eyes, ears, nose, tongue, hand") + P("I <b>see</b>, <b>hear</b>, <b>smell</b>, <b>taste</b> and <b>feel</b>.") },
      { h: "My body is mine", say: "My body belongs to me. The parts my swimming costume covers are private. If a touch feels wrong, I say no, I go away and I tell a trusted grown-up.", html: PICS("🙅 🏃 🗣️", "Say no, go away, tell") + P("My body <b>belongs to me</b>. Private parts are the parts my swimming costume covers.") + P("If a touch feels wrong: <b>say no</b>, <b>go away</b>, <b>tell a trusted grown-up</b>.") }
    ],
    example: { q: "What do we use to smell a flower?", steps: ["Think about the parts of your face.", "We see with eyes and hear with ears.", "We smell with our nose."] },
    questions: [
      { type: "mcq", q: "What do we see with?", pics: ["👀", "👂", "👃"], options: ["Eyes", "Ears", "Nose"], answer: 0, hints: ["Close them and you cannot see.", "Ears are for hearing.", "Eyes."], explain: "We see with our eyes." },
      { type: "mcq", q: "How many hands do you have?", pics: ["✋✋", "✋", "✋✋✋"], options: ["2", "1", "3"], answer: 0, hints: ["Hold them up.", "Count them.", "One, two."], explain: "We have 2 hands." },
      { type: "mcq", q: "Who does your body belong to?", pics: ["🙋", "👥"], options: ["Me", "Everyone"], fixed: true, answer: 0, hints: ["It is your body.", "You choose who hugs you.", "It belongs to you."], explain: "Your body belongs to you." },
      { type: "mcq", q: "A touch feels wrong. What do you do?", pics: ["🗣️", "🤐"], options: ["Say no and tell a trusted grown-up", "Keep it a secret"], fixed: true, answer: 0, hints: ["You can always tell.", "Trusted grown-ups help keep you safe.", "Say no, go away and tell."], explain: "Say no, go away and tell a trusted grown-up. It is never your fault." },
      { type: "mcq", q: "What keeps your body healthy?", pics: ["🥕", "🍭"], options: ["Fruit and vegetables", "Only sweets"], fixed: true, answer: 0, hints: ["Some food helps us grow.", "Sweets are for sometimes.", "Fruit and vegetables."], explain: "Fruit and vegetables help our bodies stay healthy." }
    ],
    reflect: { q: "Who could you tell if something worries you?", options: ["A parent or caregiver", "A teacher", "Another trusted grown-up", "Not sure"] },
    parent: "Your child learned body parts and the senses, and that their body belongs to them. Talk together about who their trusted grown-ups are.",
    teacher: "Covers body parts, senses and body safety (say no, go away, tell). Follow your school's safeguarding procedure if a child discloses anything.",
    done: "My body is mine. I can say no and tell a trusted grown-up." },

  { id: "gr-days", grade: 0, subject: "Life Skills", title: "Days of the week", topic: "Yesterday, today and tomorrow", domain: "Logical and Analytical Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade R Life Skills (Beginning Knowledge), Term 1: Days of the week (names of the days; activities on different days; yesterday, today and tomorrow)",
    intention: "Today I am learning the days of the week.", prompt: "What day is today?",
    lesson: [
      { h: "Seven days", say: "There are seven days in a week. Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.", html: chainRow(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) + P("There are <b>7 days</b> in a week.") },
      { h: "School days and weekend", say: "Monday to Friday are school days. Saturday and Sunday are the weekend.", html: PICS("🏫 🏫 🏫 🏫 🏫  🏡 🏡", "Five school days and two home days") + P("<b>Monday to Friday</b>: school days. <b>Saturday and Sunday</b>: the weekend.") },
      { h: "Yesterday, today, tomorrow", say: "Yesterday was the day before today. Tomorrow is the day after today.", html: chainRow(["Yesterday", "Today", "Tomorrow"]) + P("If today is <b>Tuesday</b>, yesterday was <b>Monday</b> and tomorrow is <b>Wednesday</b>.") }
    ],
    example: { q: "Today is Thursday. What day is tomorrow?", steps: ["Say the days in order.", "Monday, Tuesday, Wednesday, Thursday, …", "Tomorrow is Friday."] },
    questions: [
      { type: "mcq", q: "How many days are in a week?", options: ["7", "5", "10"], answer: 0, hints: ["Count the days.", "Monday, Tuesday, Wednesday, …", "There are seven."], explain: "There are 7 days in a week." },
      { type: "mcq", q: "Which day comes after Monday?", options: ["Tuesday", "Sunday", "Friday"], answer: 0, hints: ["Say the days in order.", "Monday, …", "Monday, Tuesday."], explain: "Tuesday comes after Monday." },
      { type: "mcq", q: "Which days are the weekend?", options: ["Saturday and Sunday", "Monday and Tuesday", "Wednesday and Thursday"], answer: 0, hints: ["Most children do not go to school then.", "They are the last two days.", "Saturday and Sunday."], explain: "Saturday and Sunday are the weekend." },
      { type: "mcq", q: "Today is Wednesday. What was yesterday?", options: ["Tuesday", "Thursday", "Saturday"], answer: 0, hints: ["Yesterday is the day before.", "What comes before Wednesday?", "Tuesday."], explain: "Yesterday was Tuesday." },
      { type: "order", q: "Put these days in order.", items: ["Monday", "Tuesday", "Wednesday"], orderLabel: "first to last", hints: ["The school week starts on Monday.", "Then Tuesday.", "Then Wednesday."], explain: "Monday, Tuesday, Wednesday." }
    ],
    reflect: { q: "Which day do you like best?", options: ["A school day", "Saturday", "Sunday", "Not sure"] },
    parent: "Your child learned the days of the week and the words yesterday, today and tomorrow. Say the day together each morning.",
    teacher: "Shows recall of the day sequence and understanding of yesterday, today and tomorrow.",
    done: "Seven days make a week. What will you do tomorrow?" },

  { id: "gr-transport", grade: 0, subject: "Life Skills", title: "Getting around", topic: "Transport", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade R Life Skills (Beginning Knowledge), Term 3: Transport (how we get to school; kinds of transport on land, water and in the air; transport long ago)",
    intention: "Today I am learning how people and things get from place to place.", prompt: "How do you get to school?",
    lesson: [
      { h: "Land transport", say: "On land we travel by car, taxi, bus, train or bicycle. We can also walk.", html: PICS("🚗 🚐 🚌 🚆 🚲 🚶", "Car, taxi, bus, train, bicycle, walking") + P("On <b>land</b>: car, taxi, bus, train, bicycle, or walking.") },
      { h: "Water and air", say: "Boats and ships travel on water. Aeroplanes and helicopters fly in the air.", html: PICS("⛵ 🚢  ✈️ 🚁", "Boat, ship, aeroplane, helicopter") + P("On <b>water</b>: boats and ships. In the <b>air</b>: aeroplanes and helicopters.") },
      { h: "Long ago", say: "Long ago, people walked, rode horses or used carts pulled by oxen.", html: PICS("🐎 🐂 🛞", "Horse, ox, wheel") + P("<b>Long ago</b> people walked, rode horses or used ox-wagons.") }
    ],
    example: { q: "How can you cross the sea?", steps: ["The sea is water.", "Which transport goes on water?", "A ship or a boat. An aeroplane can also fly over it."] },
    questions: [
      { type: "mcq", q: "Which one flies?", pics: ["✈️", "🚌", "⛵"], options: ["Aeroplane", "Bus", "Boat"], answer: 0, hints: ["It goes up in the sky.", "A bus drives and a boat floats.", "An aeroplane flies."], explain: "An aeroplane flies in the air." },
      { type: "mcq", q: "Which one travels on water?", pics: ["🚢", "🚗", "🚁"], options: ["Ship", "Car", "Helicopter"], answer: 0, hints: ["It floats.", "Cars drive on roads.", "A ship sails on water."], explain: "A ship travels on water." },
      { type: "sort", q: "Sort into land and water.", items: ["Train", "Boat", "Bicycle", "Ship"], bins: ["Land", "Water"], answer: [0, 1, 0, 1], hints: ["Which ones need roads or tracks?", "Boats and ships float.", "Train and bicycle go on land."], explain: "Train and bicycle travel on land. Boat and ship travel on water." },
      { type: "mcq", q: "How did people travel long ago?", pics: ["🐎", "✈️"], options: ["On horses", "By aeroplane"], fixed: true, answer: 0, hints: ["Long ago there were no aeroplanes.", "People used animals.", "On horses."], explain: "Long ago people rode horses or used ox-wagons." },
      { type: "mcq", q: "What should you wear in a car?", pics: ["🔒", "🕶️"], options: ["A seat belt", "Sunglasses"], fixed: true, answer: 0, hints: ["It keeps you safe if the car stops fast.", "It clicks.", "A seat belt."], explain: "A seat belt keeps us safe in a car." }
    ],
    reflect: { q: "Which transport would you like to try?", options: ["Train", "Aeroplane", "Boat", "Not sure"] },
    parent: "Your child learned about transport on land, water and in the air, and long ago.",
    teacher: "Shows classification of transport by medium and simple past and present comparison.",
    done: "Cars, boats and planes: people get around in many ways." },

  { id: "gr-wild", grade: 0, subject: "Life Skills", title: "Wild animals", topic: "Wild animals and where they live", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade R Life Skills (Beginning Knowledge), Term 4: Wild animals (what a wild animal is; kinds of wild animals; where they live; finding out about one wild animal)",
    intention: "Today I am learning about wild animals.", prompt: "What would you like to find out about a wild animal?",
    lesson: [
      { h: "Wild or tame?", say: "Wild animals look after themselves. Tame animals, like pets and farm animals, are looked after by people.", html: PICS("🦁 🐘  🐕 🐄", "Lion, elephant, dog, cow") + P("<b>Wild</b> animals look after themselves. <b>Tame</b> animals are looked after by people.") },
      { h: "Where they live", say: "Lions live on the grassland. Monkeys live in trees. Hippos live in rivers.", html: PICS("🦁🌾 🐒🌳 🦛🏞️", "Lion on grass, monkey in tree, hippo in river") + P("A lion lives on the <b>grassland</b>. A monkey lives in <b>trees</b>. A hippo lives in a <b>river</b>.") },
      { h: "The elephant", say: "An elephant is the biggest land animal. It eats grass, leaves and fruit. It uses its trunk to drink and to pick up food.", html: PICS("🐘", "Elephant") + P("The <b>elephant</b> is the biggest land animal. It eats plants and uses its <b>trunk</b> to drink and pick up food.") }
    ],
    example: { q: "Is a zebra wild or tame?", steps: ["Who looks after a zebra?", "Zebras live in the wild and find their own food.", "A zebra is a wild animal."] },
    questions: [
      { type: "mcq", q: "Which is a wild animal?", pics: ["🦁", "🐕", "🐔"], options: ["Lion", "Dog", "Chicken"], answer: 0, hints: ["Which one is not a pet or farm animal?", "Dogs and chickens live with people.", "A lion is wild."], explain: "A lion is a wild animal." },
      { type: "mcq", q: "Where does a hippo live?", pics: ["🏞️", "🌳", "🏜️"], options: ["In a river", "In a tree", "In a desert"], answer: 0, hints: ["Hippos like water.", "They are too heavy for trees.", "In a river."], explain: "Hippos live in rivers and lakes." },
      { type: "mcq", q: "What does an elephant use to drink?", pics: ["🐘", "🦶"], options: ["Its trunk", "Its feet"], fixed: true, answer: 0, hints: ["It has a long nose.", "It sucks up water.", "Its trunk."], explain: "An elephant drinks with its trunk." },
      { type: "sort", q: "Sort into wild and tame.", items: ["Zebra", "Cat", "Giraffe", "Sheep"], bins: ["Wild", "Tame"], answer: [0, 1, 0, 1], hints: ["Who looks after the animal?", "Cats and sheep are looked after by people.", "Zebra and giraffe are wild."], explain: "Zebra and giraffe are wild. Cat and sheep are tame." },
      { type: "mcq", q: "Where do monkeys like to live?", pics: ["🌳", "🌊"], options: ["In trees", "In the sea"], fixed: true, answer: 0, hints: ["Monkeys climb.", "They do not swim in the sea.", "In trees."], explain: "Monkeys live in trees." }
    ],
    reflect: { q: "Which wild animal do you like?", options: ["Elephant", "Lion", "Monkey", "Hippo"] },
    parent: "Your child learned the difference between wild and tame animals and where some animals live.",
    teacher: "Shows classification of wild and tame animals and simple habitat knowledge.",
    done: "Wild animals look after themselves in their own homes." }
];
const WORDS_EARLY = {
  "ey-wash": { words: [["🦠", "Germs", "tiny living things that can make us sick"], ["🧼", "Soap", "helps wash germs away"]] },
  "ey-turns": { words: [["🔁", "Take turns", "one goes, then the next"], ["🤲", "Share", "let others use it too"]] },
  "ey-story": { words: [["1️⃣", "First", "the one at the start"], ["🔚", "Last", "the one at the end"]] },
  "gr-count": { words: [["0️⃣", "Zero", "none, nothing"], ["➕", "More", "a bigger amount"], ["➖", "Less", "a smaller amount"]] },
  "gr-patterns": { words: [["🔁", "Pattern", "something that repeats"]] },
  "gr-rhyme": { words: [["🎵", "Rhyme", "words that sound the same at the end"]] },
  "gr-syllables": { words: [["👏", "Syllable", "one part of a word, one clap"]] },
  "gr-story": { words: [["👧", "Character", "a person or animal in a story"]] },
  "gr-body": { words: [["🔒", "Private", "just for you"], ["🧑‍🏫", "Trusted grown-up", "a grown-up who keeps you safe and listens"]] },
  "gr-wild": { words: [["🦁", "Wild", "looks after itself"], ["🐕", "Tame", "looked after by people"]] }
};
Object.assign(WORDS, WORDS_EARLY);
