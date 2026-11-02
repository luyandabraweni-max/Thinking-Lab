"use strict";

// ---------- Skills: hands-on projects for every learner, levelled by age group. Original content. ----------
// Each skill: levels keyed by age group. Each project: need, safety, steps, reflect options, badge.
const SKILL_LEVELS = { "3-6": "Play and explore", "7-12": "Try it", "13-18": "Build it", "19-25": "Work-ready" };
const SKILLS = [
  { id: "sk-cooking", name: "Cooking", icon: "🍳", domain: "Inquiry and Systems Thinking",
    about: "Making healthy, safe and tasty food for yourself and others.",
    leads: ["Cook or chef", "Baker", "Caterer", "Running a food business"],
    link: "Links to the Department of Basic Education's occupational subject Food Production, and to Hospitality Studies and Consumer Studies in Grades 10 to 12. TVET colleges offer hospitality and catering programmes.",
    levels: {
      "3-6": [
        { id: "ck1-fruit", title: "Make a fruit salad", time: "20 minutes", adult: true, need: ["A banana", "An apple or a pear", "An orange", "A bowl and a spoon", "A child-safe knife or a grown-up to cut"],
          safety: ["Wash your hands first.", "A grown-up does any cutting with a sharp knife."],
          steps: ["Wash your hands with soap and water.", "Wash the apple and the orange.", "Peel the banana and the orange. A grown-up can help.", "Break or cut the fruit into small pieces.", "Put all the pieces into the bowl and stir gently.", "Share your fruit salad with someone."],
          reflect: ["Peeling", "Stirring", "Sharing", "Eating it"], badge: "Fruit Salad Maker" },
        { id: "ck2-sandwich", title: "Make a sandwich", time: "15 minutes", adult: true, need: ["Two slices of bread", "A spread, such as peanut butter or margarine", "A filling, such as cheese or tomato", "A blunt knife and a plate"],
          safety: ["Wash your hands first.", "Ask before using any food. Some people are allergic to peanuts."],
          steps: ["Wash your hands.", "Put two slices of bread on the plate.", "Spread one slice with a blunt knife.", "Put the filling on top.", "Put the other slice on top and press gently.", "Clean up your space."],
          reflect: ["Spreading", "Choosing a filling", "Cleaning up", "Eating it"], badge: "Sandwich Maker" },
        { id: "ck3-sort", title: "Sort the shopping", time: "15 minutes", adult: false, need: ["Some food from the kitchen cupboard and fridge, such as fruit, a tin, bread and milk"],
          safety: ["Only handle food a grown-up has given you.", "Put cold food back in the fridge when you finish."],
          steps: ["Look at all the food.", "Find the food that comes from plants, like fruit and vegetables.", "Find the food that comes from animals, like milk and eggs.", "Find the food that must stay cold.", "Help put everything back where it belongs."],
          reflect: ["Finding plant food", "Finding cold food", "Putting things away", "Not sure"], badge: "Kitchen Helper" }
      ],
      "7-12": [
        { id: "ck4-oats", title: "Cook oats porridge", time: "20 minutes", adult: true, need: ["Half a cup of oats", "One cup of water or milk", "A pot and a wooden spoon", "A stove", "Fruit or a little honey to top it"],
          safety: ["A grown-up must be with you at the stove.", "Turn pot handles inwards so nobody knocks the pot.", "Use an oven glove for hot handles."],
          steps: ["Wash your hands.", "Put the oats and the water or milk in the pot.", "Put the pot on the stove on medium heat.", "Stir all the time for about five minutes until it is thick.", "Turn off the stove.", "Spoon it into a bowl and add your topping. Let it cool a little before you eat."],
          reflect: ["Measuring", "Stirring", "Being safe at the stove", "Adding a topping"], badge: "Porridge Cook" },
        { id: "ck5-measure", title: "Measure and mix: flapjack batter", time: "30 minutes", adult: true, need: ["One cup of flour", "Two teaspoons of baking powder", "One egg", "One cup of milk", "A pinch of salt", "A bowl, measuring cups, spoons and a whisk"],
          safety: ["Wash your hands after touching raw egg.", "A grown-up does the frying in a hot pan."],
          steps: ["Wash your hands and read all the steps first.", "Measure the flour, baking powder and salt into the bowl.", "Crack the egg into a cup, then add it to the bowl.", "Add the milk a little at a time and whisk until smooth.", "A grown-up cooks spoonfuls in a pan until bubbles show, then turns them.", "Wash the bowl and spoons."],
          reflect: ["Measuring", "Cracking the egg", "Whisking", "Reading the steps"], badge: "Batter Mixer" },
        { id: "ck6-plate", title: "Plan a healthy plate", time: "20 minutes", adult: false, need: ["Paper and crayons, or the foods at home"],
          safety: ["Ask before taking food from the kitchen."],
          steps: ["Draw a big circle for a plate.", "Fill half the plate with vegetables and fruit.", "Fill a quarter with a starch, like pap, rice or bread.", "Fill a quarter with a protein, like beans, eggs, fish or chicken.", "Add a glass of water.", "Show your plan to someone at home and ask if you can make it together."],
          reflect: ["Choosing vegetables", "Choosing a protein", "Drawing it", "Sharing my plan"], badge: "Healthy Plate Planner" }
      ],
      "13-18": [
        { id: "ck7-recipe", title: "Follow a recipe: vegetable soup", time: "1 hour", adult: true, need: ["An onion, two carrots, two potatoes and a tomato", "A stock cube and water", "Oil, salt and pepper", "A chopping board, a knife, a pot and a spoon"],
          safety: ["Use the claw grip: curl your fingertips away from the knife.", "Keep pot handles turned in.", "Have a grown-up nearby the first time you use the stove."],
          steps: ["Read the whole recipe and set out everything you need.", "Wash and peel the vegetables. Chop them into small even pieces.", "Heat a little oil in the pot and fry the onion until soft.", "Add the other vegetables, the stock cube and enough water to cover them.", "Simmer for about 25 minutes until the potatoes are soft.", "Taste, season with salt and pepper, and serve."],
          reflect: ["Chopping safely", "Timing", "Tasting and seasoning", "Following the recipe"], badge: "Soup Cook" },
        { id: "ck8-hygiene", title: "Food safety: clean, separate, cook, chill", time: "30 minutes", adult: false, need: ["A kitchen to look at", "Paper and a pen"],
          safety: ["Do not touch cleaning chemicals."],
          steps: ["Clean: wash hands, boards and surfaces before and after handling food.", "Separate: keep raw meat away from food that is ready to eat.", "Cook: cook meat, chicken and eggs all the way through.", "Chill: keep milk, meat and leftovers cold, and do not leave them out for more than two hours.", "Walk through your kitchen and write one thing that is safe and one thing to improve.", "Make a small poster of the four words for the kitchen."],
          reflect: ["Clean", "Separate", "Cook", "Chill"], badge: "Food Safety Checker" },
        { id: "ck9-budget", title: "Cook a meal for four on a budget", time: "2 hours", adult: true, need: ["A budget agreed with your family, for example R100", "A shop price list or till slips", "A recipe for four people"],
          safety: ["Agree the budget and the menu with a grown-up first.", "Follow the food safety rules."],
          steps: ["Choose a meal for four, such as pap, beans and cabbage.", "List the ingredients and the amounts you need.", "Find the price of each ingredient and add them up.", "Change the plan if the total is more than the budget.", "Cook the meal with a grown-up nearby.", "Work out the cost per person: the total divided by four."],
          reflect: ["Planning", "Working out costs", "Cooking", "Feeding people"], badge: "Budget Cook" }
      ],
      "19-25": [
        { id: "ck10-cost", title: "Cost a recipe and set a price", time: "1 hour", adult: false, need: ["A recipe you can make well, such as vetkoek or muffins", "Shop prices for each ingredient", "A calculator"],
          safety: ["Use real prices from a shop near you."],
          steps: ["Write down every ingredient and the amount the recipe uses.", "Work out the cost of the amount used, not the whole packet. For example, 250 grams from a 1 kilogram bag of flour is a quarter of the price.", "Add the cost of packaging and electricity or gas.", "Divide the total by the number of items the recipe makes. This is the cost per item.", "Add a profit, for example double the cost, to set a selling price.", "Compare your price with what similar food sells for nearby."],
          reflect: ["Costing ingredients", "Adding hidden costs", "Setting a price", "Comparing prices"], badge: "Food Costing" },
        { id: "ck11-sell", title: "Food hygiene for selling food", time: "1 hour", adult: false, need: ["Paper and a pen", "Your local municipality's website or office for the rules"],
          safety: ["Anyone who sells food to the public in South Africa needs a certificate of acceptability from the municipality. Check your local rules."],
          steps: ["List the food you would sell and where you would prepare it.", "Write a hand washing and cleaning routine for each day.", "Plan how you will keep hot food hot and cold food cold.", "Plan how you will store and label food with the date it was made.", "Find out how to apply for a certificate of acceptability at your municipality.", "Make a one-page checklist you can use every day."],
          reflect: ["Daily routine", "Hot and cold food", "Labelling", "The certificate"], badge: "Safe Food Seller" },
        { id: "ck12-week", title: "Plan a week of meals", time: "1 hour", adult: false, need: ["A weekly food budget", "Paper and a pen", "Shop prices"],
          safety: ["Plan for any allergies or health needs in your household."],
          steps: ["Write the days of the week and three meals for each day.", "Use the same ingredients in more than one meal to waste less.", "Write one shopping list for the whole week.", "Price the list and adjust it to fit the budget.", "Plan which meals you can cook ahead and freeze.", "After the week, note what worked and what you would change."],
          reflect: ["Planning meals", "Wasting less", "Sticking to the budget", "Cooking ahead"], badge: "Meal Planner" }
      ]
    } },

  { id: "sk-coding", name: "Coding and digital", icon: "💻", domain: "Logical and Analytical Thinking",
    about: "Giving clear step-by-step instructions, making things with computers, and staying safe online.",
    leads: ["Software developer", "IT support", "Digital designer", "Data and office work"],
    link: "Links to the Department of Basic Education's Coding and Robotics curriculum, and to Information Technology and Computer Applications Technology in Grades 10 to 12. TVET colleges offer IT and computer science programmes.",
    levels: {
      "3-6": [
        { id: "cd1-robot", title: "Be a robot", time: "15 minutes", adult: true, need: ["A partner", "Some space on the floor", "A toy to find"],
          safety: ["Clear the floor so nobody trips."],
          steps: ["One person is the robot. The other person gives instructions.", "Hide the toy a few steps away.", "Give one instruction at a time: step forward, turn left or turn right.", "The robot only does exactly what it is told.", "Keep going until the robot finds the toy.", "Swap places and play again."],
          reflect: ["Giving instructions", "Being the robot", "Turning left and right", "Finding the toy"], badge: "Robot Commander" },
        { id: "cd2-steps", title: "Steps to brush your teeth", time: "10 minutes", adult: false, need: ["Your toothbrush and toothpaste", "A grown-up to listen"],
          safety: ["Use a small amount of toothpaste."],
          steps: ["Think of all the steps to brush your teeth.", "Tell a grown-up the first step.", "Tell the next step, and the next.", "Did you miss a step? Computers need every step.", "Now brush your teeth, following your steps."],
          reflect: ["Thinking of the steps", "Putting them in order", "Finding a missed step", "Not sure"], badge: "Step Thinker" },
        { id: "cd3-pattern", title: "Code a bead pattern", time: "15 minutes", adult: false, need: ["Beads, buttons or blocks in two colours", "A string, or just a table"],
          safety: ["Small beads are not for putting in your mouth."],
          steps: ["Make a rule, like red, blue, red, blue.", "Follow your rule to make a line.", "Make a new rule, like red, red, blue.", "Ask someone to guess your rule.", "Make a necklace or a line with your favourite rule."],
          reflect: ["Making a rule", "Following the rule", "Guessing someone's rule", "Not sure"], badge: "Pattern Coder" }
      ],
      "7-12": [
        { id: "cd4-algorithm", title: "Write an algorithm", time: "20 minutes", adult: false, need: ["Paper and a pen"],
          safety: ["None needed."],
          steps: ["An algorithm is a list of steps that solves a problem.", "Choose a task, like making a cup of tea or tying a shoelace.", "Write every step in order and number them.", "Give your steps to someone and ask them to follow them exactly.", "Watch for steps that are missing or unclear. That is a bug.", "Fix the bug and test your algorithm again."],
          reflect: ["Writing steps", "Testing", "Finding a bug", "Fixing it"], badge: "Algorithm Writer" },
        { id: "cd5-loops", title: "Loops in a dance", time: "15 minutes", adult: false, need: ["Some space", "Music if you like"],
          safety: ["Clear the space so you do not bump into things."],
          steps: ["Make up three moves, like clap, jump and spin.", "Write them as code: clap, jump, spin.", "A loop repeats code. Write: repeat 4 times: clap, jump, spin.", "Do your loop dance.", "Add a condition: if the music stops, freeze.", "Teach your code to someone else."],
          reflect: ["Making moves", "Writing the loop", "Adding the condition", "Teaching it"], badge: "Loop Dancer" },
        { id: "cd6-safe", title: "Be safe online", time: "20 minutes", adult: true, need: ["A grown-up", "Paper and a pen"],
          safety: ["Never share your password, address or school with people online."],
          steps: ["A strong password is long and hard to guess. Make up an example using three random words, but do not use it for real.", "Personal information is your full name, address, school and phone number. Keep it private.", "If someone online asks to meet you or for photos, stop and tell a trusted grown-up.", "Not everything online is true. Check with a second source.", "Make a poster with your three best online safety rules."],
          reflect: ["Passwords", "Private information", "Telling a grown-up", "Checking facts"], badge: "Online Safety Star" }
      ],
      "13-18": [
        { id: "cd7-scratch", title: "Make a simple game in Scratch", time: "1 hour", adult: false, need: ["A computer or tablet with internet", "The free Scratch website, scratch.mit.edu"],
          safety: ["Use a username that is not your real name."],
          steps: ["Open Scratch and start a new project.", "Choose a sprite, the character in your game.", "Add code: when the green flag is clicked, go to the middle.", "Add code so the arrow keys move your sprite.", "Add a second sprite to catch, and a score that goes up when you touch it.", "Test your game, fix any bugs, and ask a friend to play."],
          reflect: ["Moving the sprite", "Making a score", "Fixing bugs", "Sharing my game"], badge: "Game Maker" },
        { id: "cd8-docs", title: "Make a neat document", time: "45 minutes", adult: false, need: ["A computer or phone with a word processor"],
          safety: ["Save your work often."],
          steps: ["Open a new document.", "Type a title and make it a heading.", "Write three short paragraphs about something you know well.", "Add a bulleted list and a table.", "Check spelling and use one clear font.", "Save it as a PDF and give it a sensible file name."],
          reflect: ["Headings", "Lists and tables", "Checking spelling", "Saving as PDF"], badge: "Document Pro" },
        { id: "cd9-spreadsheet", title: "Track something in a spreadsheet", time: "45 minutes", adult: false, need: ["A spreadsheet app, such as Google Sheets or Excel"],
          safety: ["Do not put other people's private information in your sheet."],
          steps: ["Choose something to track, like your pocket money or rainfall for a week.", "Make columns: date, item and amount.", "Fill in at least seven rows.", "Use the SUM formula to add up the amounts.", "Make a simple chart from your data.", "Write one sentence about what the chart shows."],
          reflect: ["Setting up columns", "Using SUM", "Making a chart", "Explaining it"], badge: "Spreadsheet Starter" }
      ],
      "19-25": [
        { id: "cd10-cv", title: "Make a CV on a computer", time: "1 hour", adult: false, need: ["A computer or phone with a word processor", "Your work, study and volunteer history"],
          safety: ["Do not put your ID number on a CV. Share it only when an employer actually needs it."],
          steps: ["Add your name, phone number and email at the top.", "Write two lines about who you are and what work you want.", "List your skills, including practical skills.", "List your education and any training.", "List work, volunteering and projects, newest first.", "Save it as a PDF with your name in the file name."],
          reflect: ["Writing about me", "Listing skills", "Layout", "Saving as PDF"], badge: "Digital CV" },
        { id: "cd11-email", title: "Write a professional email", time: "30 minutes", adult: false, need: ["An email account"],
          safety: ["Check the address before you press send."],
          steps: ["Use a simple email address with your name, not a nickname.", "Write a clear subject line, like: Application for kitchen assistant.", "Start with a greeting: Dear Ms Dlamini.", "Say why you are writing in the first sentence.", "Keep it short and polite, and attach your CV as a PDF.", "End with: Kind regards, and your full name and phone number."],
          reflect: ["Subject line", "Being clear", "Attaching a file", "Being polite"], badge: "Professional Emailer" },
        { id: "cd12-scams", title: "Spot scams and protect your accounts", time: "45 minutes", adult: false, need: ["Your phone or computer"],
          safety: ["Never share a one-time PIN with anyone. Your bank will never ask for it."],
          steps: ["Turn on two-step verification for your email.", "Use a different strong password for each important account.", "Learn the signs of a scam: urgency, prizes you did not enter, and requests for PINs or money.", "Fake job adverts ask you to pay to get a job. Real employers do not.", "Check links before you click: look at the web address carefully.", "If you are scammed, contact your bank straight away and report it."],
          reflect: ["Two-step verification", "Strong passwords", "Spotting scams", "Fake job adverts"], badge: "Scam Spotter" }
      ]
    } },

  { id: "sk-business", name: "Money and small business", icon: "💰", domain: "Logical and Analytical Thinking",
    about: "Understanding money, saving, and starting something of your own.",
    leads: ["Running your own business", "Shop or sales work", "Bookkeeping", "Bank or office work"],
    link: "Links to Economic and Management Sciences in Grades 7 to 9 and Business Studies and Accounting in Grades 10 to 12. TVET colleges offer business and finance programmes.",
    levels: {
      "3-6": [
        { id: "mb1-shop", title: "Play shop", time: "20 minutes", adult: true, need: ["Some toys or food packets to sell", "Real or pretend coins"],
          safety: ["Coins are small. Do not put them in your mouth."],
          steps: ["Put the things you will sell on a table.", "Give each thing a price, like R1, R2 or R5.", "One person is the shopkeeper and one is the customer.", "The customer chooses something and pays.", "The shopkeeper says thank you and gives the item.", "Swap and play again."],
          reflect: ["Being the shopkeeper", "Being the customer", "Counting money", "Not sure"], badge: "Little Shopkeeper" },
        { id: "mb2-coins", title: "Know your coins", time: "15 minutes", adult: true, need: ["South African coins: 10c, 20c, 50c, R1, R2 and R5"],
          safety: ["Wash your hands after handling money."],
          steps: ["Put the coins on the table.", "Find the gold coins and the silver coins.", "Find the R5 coin. It is the biggest.", "Find the R1 coin and the R2 coin.", "Put the coins in order from smallest value to biggest value."],
          reflect: ["Colours", "Sizes", "Putting them in order", "Not sure"], badge: "Coin Spotter" },
        { id: "mb3-jar", title: "Make a saving jar", time: "20 minutes", adult: false, need: ["A clean jar or tin with a lid", "Paper, crayons and glue"],
          safety: ["A grown-up cuts the slot in the lid."],
          steps: ["Decorate your jar with a picture of something you want to save for.", "A grown-up cuts a slot in the lid.", "When you get a coin, put it in the jar.", "Count your coins with a grown-up each week.", "Saving means waiting to buy something bigger later."],
          reflect: ["Decorating", "Choosing a goal", "Counting", "Waiting"], badge: "Saver" }
      ],
      "7-12": [
        { id: "mb4-needs", title: "Needs and wants", time: "20 minutes", adult: false, need: ["Paper and a pen", "Pictures from adverts if you have them"],
          safety: ["None needed."],
          steps: ["A need is something you must have to live, like food, water and a home.", "A want is something nice to have, like a new game.", "Make two columns: needs and wants.", "Sort ten things into the columns.", "Talk with someone at home about why needs come first."],
          reflect: ["Needs", "Wants", "Sorting", "Talking about it"], badge: "Smart Chooser" },
        { id: "mb5-budget", title: "Plan a party budget", time: "30 minutes", adult: false, need: ["Paper and a pen", "A pretend budget of R200", "Prices from a shop catalogue"],
          safety: ["None needed."],
          steps: ["List what you want for a small party: food, drinks, plates and a game.", "Find a price for each item.", "Add up the total.", "If it is more than R200, choose what to leave out or swap for something cheaper.", "Write your final list and the money left over."],
          reflect: ["Listing", "Adding up", "Making choices", "Money left over"], badge: "Budget Planner" },
        { id: "mb6-stall", title: "Run a mini stall", time: "1 hour", adult: true, need: ["Something to sell, like lemonade, crafts or popcorn", "A table and a price sign", "A tin for change"],
          safety: ["A grown-up must agree and be nearby.", "Follow food safety rules if you sell food."],
          steps: ["Work out what it costs to make your product.", "Choose a price that is more than the cost.", "Make a clear sign with your price.", "Sell to family, friends or at a school market.", "Count your money at the end.", "Take away your costs. What is left is your profit."],
          reflect: ["Making the product", "Setting a price", "Selling", "Working out profit"], badge: "Young Entrepreneur" }
      ],
      "13-18": [
        { id: "mb7-income", title: "Income and expenses", time: "45 minutes", adult: false, need: ["Paper or a spreadsheet", "A month of pocket money or pretend income"],
          safety: ["None needed."],
          steps: ["Income is money that comes in. Expenses are money that goes out.", "List your income for one month.", "List your expenses: airtime, data, transport and snacks.", "Take expenses away from income.", "If the answer is negative, find one expense to cut.", "Set a saving goal for next month."],
          reflect: ["Listing income", "Listing expenses", "Finding a cut", "Setting a goal"], badge: "Money Tracker" },
        { id: "mb8-idea", title: "Test a business idea", time: "1 hour", adult: false, need: ["Paper and a pen", "Five people to ask"],
          safety: ["Ask people you know. Do not collect anyone's personal details."],
          steps: ["Think of a problem people near you have.", "Think of a product or service that solves it.", "Ask five people: would you use this, and what would you pay?", "Write down what they said.", "Change your idea based on what you heard.", "Decide: is this worth trying?"],
          reflect: ["Finding a problem", "Asking people", "Changing the idea", "Deciding"], badge: "Idea Tester" },
        { id: "mb9-pitch", title: "Pitch your idea", time: "1 hour", adult: false, need: ["Your business idea", "Someone to pitch to"],
          safety: ["None needed."],
          steps: ["Say the problem in one sentence.", "Say your solution in one sentence.", "Say who your customers are.", "Say how you will make money.", "Say what you need to start.", "Practise until your pitch takes one minute, then pitch to someone."],
          reflect: ["The problem", "The solution", "Making money", "Speaking"], badge: "Pitch Maker" }
      ],
      "19-25": [
        { id: "mb10-plan", title: "Write a one-page business plan", time: "2 hours", adult: false, need: ["Paper or a computer"],
          safety: ["None needed."],
          steps: ["Business name and what you sell.", "Your customers and where you will find them.", "Your competitors and why people will choose you.", "Start-up costs: equipment, stock and permits.", "Monthly costs and your price per item.", "How many sales you need each month to cover your costs."],
          reflect: ["Customers", "Competitors", "Costs", "Break-even sales"], badge: "Business Planner" },
        { id: "mb11-cashbook", title: "Keep a cash book", time: "1 hour", adult: false, need: ["A notebook or a spreadsheet"],
          safety: ["Keep business money separate from personal money."],
          steps: ["Make columns: date, description, money in, money out and balance.", "Write every sale in money in.", "Write every purchase in money out, and keep the slips.", "Work out the balance after each line.", "At the end of each week, count your cash and check it matches.", "At the end of the month, add up the total in and total out."],
          reflect: ["Recording sales", "Keeping slips", "Balancing", "Monthly totals"], badge: "Bookkeeper" },
        { id: "mb12-support", title: "Find support for small businesses", time: "1 hour", adult: false, need: ["Internet access, or a visit to a local library or business centre"],
          safety: ["Never pay a fee to apply for a government grant. Check that offers are real."],
          steps: ["Find out how to register a business with the CIPC.", "Find your nearest small business support office, such as SEDA.", "Look for youth programmes, such as those from the National Youth Development Agency.", "Write down what each one offers: training, mentoring or funding.", "Choose one to contact this month.", "Write down the questions you want to ask them."],
          reflect: ["Registering", "Finding support", "Choosing one", "Preparing questions"], badge: "Support Finder" }
      ]
    } },

  { id: "sk-sport", name: "Sport and fitness", icon: "⚽", domain: "Creativity and Metacognition",
    about: "Moving your body, playing fair, staying healthy and working in a team.",
    leads: ["Coach", "Fitness instructor", "Sports official or referee", "Recreation and events work"],
    link: "Links to physical education in CAPS Life Skills (Grades R to 6) and Life Orientation (Grades 7 to 12). TVET colleges and sports federations offer coaching and fitness courses.",
    levels: {
      "3-6": [
        { id: "sp1-animal", title: "Animal moves", time: "10 minutes", adult: false, need: ["Some space"],
          safety: ["Clear the space so you do not bump into things."],
          steps: ["Hop like a frog.", "Stomp like an elephant.", "Slither like a snake on your tummy.", "Gallop like a horse.", "Stand still like a tree on one leg.", "Lie down and breathe like a sleepy lion."],
          reflect: ["Hopping", "Galloping", "Standing on one leg", "Resting"], badge: "Animal Mover" },
        { id: "sp2-ball", title: "Throw and catch", time: "15 minutes", adult: true, need: ["A soft ball or a rolled-up pair of socks", "A partner"],
          safety: ["Use a soft ball.", "Throw gently."],
          steps: ["Stand close to your partner.", "Hold your hands out ready.", "Your partner throws gently. Watch the ball and catch it.", "Throw it back gently.", "Take one step back and try again.", "Count how many catches you can make."],
          reflect: ["Throwing", "Catching", "Watching the ball", "Counting"], badge: "Catcher" },
        { id: "sp3-balance", title: "Balance walk", time: "10 minutes", adult: false, need: ["A line on the ground, or a rope"],
          safety: ["Keep the line on the ground, not up high."],
          steps: ["Walk along the line, one foot in front of the other.", "Hold your arms out like an aeroplane.", "Walk backwards along the line.", "Walk along the line on your toes.", "Try with a beanbag on your head."],
          reflect: ["Walking forwards", "Walking backwards", "On my toes", "With a beanbag"], badge: "Balancer" }
      ],
      "7-12": [
        { id: "sp4-warmup", title: "Warm up and cool down", time: "15 minutes", adult: false, need: ["Some space"],
          safety: ["Move gently. Stretching should not hurt."],
          steps: ["Warming up gets your body ready and helps prevent injury.", "March on the spot for one minute.", "Do ten arm circles forwards and ten backwards.", "Do ten gentle knee lifts on each side.", "After exercise, cool down by walking slowly for two minutes.", "Hold a gentle stretch for each leg for ten seconds."],
          reflect: ["Marching", "Arm circles", "Cooling down", "Stretching"], badge: "Warm-up Leader" },
        { id: "sp5-rules", title: "Play fair: make game rules", time: "30 minutes", adult: false, need: ["A ball or a skipping rope", "Friends to play with"],
          safety: ["Play on a safe surface away from roads."],
          steps: ["Make up a simple game with a ball or a rope.", "Write three rules that keep it fair.", "Write one rule that keeps it safe.", "Explain the rules to your friends.", "Play, and take turns being the referee.", "Afterwards, decide together if any rule should change."],
          reflect: ["Making rules", "Explaining them", "Being the referee", "Playing fair"], badge: "Fair Player" },
        { id: "sp6-skip", title: "Skipping challenge", time: "20 minutes", adult: false, need: ["A skipping rope"],
          safety: ["Skip on a flat surface.", "Rest if you feel tired."],
          steps: ["Skip with both feet together for thirty seconds.", "Rest for thirty seconds.", "Count how many skips you can do in thirty seconds.", "Try skipping on one foot, then the other.", "Do the challenge again each day this week.", "Write down your counts and look for improvement."],
          reflect: ["Skipping", "Counting", "Trying again", "Seeing improvement"], badge: "Skipper" }
      ],
      "13-18": [
        { id: "sp7-plan", title: "Make a two-week fitness plan", time: "45 minutes", adult: false, need: ["Paper or a phone"],
          safety: ["Start gently. If you have a health condition, check with a health worker first.", "Stop if you feel pain, dizziness or chest tightness."],
          steps: ["Choose three activities you enjoy, like walking, dancing or soccer.", "Plan at least 30 minutes of activity on five days a week.", "Include a warm-up and a cool-down every time.", "Plan rest days.", "Track what you did each day.", "After two weeks, write what changed and what you will keep doing."],
          reflect: ["Choosing activities", "Planning days", "Tracking", "Reviewing"], badge: "Fitness Planner" },
        { id: "sp8-team", title: "Be a good team member", time: "1 hour", adult: false, need: ["A team game, such as soccer, netball or volleyball"],
          safety: ["Play on a safe surface with the right equipment."],
          steps: ["Before the game, agree on one team goal.", "During the game, call your teammates by name.", "Encourage a teammate who makes a mistake.", "Shake hands with the other team at the end.", "Afterwards, name one thing your team did well.", "Name one thing to improve next time."],
          reflect: ["Talking to teammates", "Encouraging", "Good sport", "Reflecting"], badge: "Team Player" },
        { id: "sp9-ref", title: "Referee a game", time: "1 hour", adult: false, need: ["A whistle if you have one", "A game for younger children"],
          safety: ["Stop the game if anyone is hurt and get an adult."],
          steps: ["Learn the main rules of the game.", "Explain the rules to the players before you start.", "Watch closely and make calls calmly.", "Explain your decisions in a few words.", "Treat both teams the same.", "Afterwards, ask the players what went well."],
          reflect: ["Knowing the rules", "Staying calm", "Being fair", "Explaining calls"], badge: "Referee" }
      ],
      "19-25": [
        { id: "sp10-session", title: "Lead a group exercise session", time: "1 hour", adult: false, need: ["A small group of friends or family", "Some space"],
          safety: ["Ask everyone about injuries or health conditions first.", "Offer an easier version of every exercise."],
          steps: ["Plan a 30-minute session: warm-up, main part and cool-down.", "Choose exercises that need no equipment.", "Show each exercise slowly and give an easier option.", "Watch everyone and correct form kindly.", "Keep time and encourage the group.", "Ask for feedback at the end."],
          reflect: ["Planning", "Demonstrating", "Giving easier options", "Getting feedback"], badge: "Session Leader" },
        { id: "sp11-coach", title: "Coach a skill to children", time: "1 hour", adult: false, need: ["A ball", "A few children with a parent's permission"],
          safety: ["Work in the open where other adults can see.", "Get parents' permission and never be alone with a child."],
          steps: ["Choose one simple skill, like passing a ball.", "Show it, then let the children try.", "Give one tip at a time.", "Praise effort, not only success.", "Make it a game so it stays fun.", "Reflect: what helped the children learn?"],
          reflect: ["Showing the skill", "Giving tips", "Making it fun", "Keeping children safe"], badge: "Coach" },
        { id: "sp12-career", title: "Explore work in sport and recreation", time: "1 hour", adult: false, need: ["Internet access or a library"],
          safety: ["Check that training providers are accredited before you pay."],
          steps: ["List jobs in sport: coach, fitness instructor, referee, groundsperson, events organiser.", "Choose two that interest you.", "Find out what training each one needs.", "Look for entry-level coaching or first aid courses near you.", "Find a local club or community programme where you could volunteer.", "Write your next step and a date to do it."],
          reflect: ["Listing jobs", "Finding training", "Volunteering", "Next step"], badge: "Career Explorer" }
      ]
    } }
];

const SKILLS_SOON = [["sk-garden", "Growing food", "🌱"], ["sk-sewing", "Sewing", "🧵"], ["sk-build", "Building and fixing", "🔨"], ["sk-art", "Art and design", "🎨"], ["sk-music", "Music", "🎵"], ["sk-hair", "Hair and beauty care", "💇"], ["sk-care", "Caring for people", "🤝"], ["sk-animals", "Caring for animals", "🐾"], ["sk-dance", "Dance", "💃"]];
const SKILL_HOW = ["I did it", "I did some of it", "I need more practice"];
