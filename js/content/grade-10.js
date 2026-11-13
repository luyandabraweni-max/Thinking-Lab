"use strict";

// ---------- Learn units: Grade 10 (CAPS FET: Mathematics, Mathematical Literacy, English HL, Life Sciences, Life Orientation). Original content. ----------
const POEM_TAXI = `<div class="passage-text"><p><b>Rank</b> <span class="muted">(a 2to.iQ poem)</span></p>
<p>At five the rank is already awake,<br>a throat of engines clearing<br>the night from its voice.</p>
<p>Gogo Nomsa sells boiled eggs and patience,<br>her hands a quiet arithmetic<br>of coins and change and small talk.</p>
<p>The queue unspools like thread from a spool,<br>each worker stitched<br>to a city that never learns their names.</p>
<p>And still they laugh. And still<br>the hooter's two short notes<br>are a kind of song.</p></div>`;
const triTrig = `<svg width="190" height="140" viewBox="0 0 190 140" role="img" aria-label="Right-angled triangle with angle theta at the bottom left. Opposite side 3, adjacent side 4, hypotenuse 5."><polygon points="20,120 170,120 170,20" fill="var(--brand-soft)" stroke="var(--ink)" stroke-width="2"/><rect x="156" y="106" width="14" height="14" fill="none" stroke="var(--ink)"/><text x="40" y="116" font-size="13" fill="var(--ink)">θ</text><text x="95" y="136" font-size="13" text-anchor="middle" fill="var(--ink)">adjacent 4</text><text x="178" y="72" font-size="13" fill="var(--ink)">3</text><text x="80" y="62" font-size="13" text-anchor="middle" fill="var(--ink)">hyp 5</text></svg>`;
const UNITS_G10 = [
  // ===================== GRADE 10 MATHEMATICS =====================
  { id: "g10-exponents", grade: 10, subject: "Mathematics", title: "Laws of exponents", topic: "Exponents", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 10 Mathematics, Term 1: Exponents (laws of exponents for integral exponents; simplify expressions; solve simple exponential equations)",
    intention: "Today I am using the laws of exponents to simplify expressions.", prompt: "Which law do you find easiest to remember, and why?",
    lesson: [
      { h: "Multiplying and dividing", say: "When multiplying powers with the same base, add the exponents. When dividing, subtract them. x to the 3 times x to the 4 is x to the 7.", html: chainRow(["aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ ÷ aⁿ = aᵐ⁻ⁿ"]) + P("Only works when the <b>base</b> is the same.") },
      { h: "Power of a power", say: "A power raised to another power: multiply the exponents. x squared, all cubed, is x to the 6.", html: chainRow(["(aᵐ)ⁿ = aᵐⁿ", "(ab)ⁿ = aⁿbⁿ"]) + P("Every factor inside the bracket gets the exponent.") },
      { h: "Zero and negative exponents", say: "Anything except zero to the power of zero is one. A negative exponent means one over the positive power. Two to the minus three is one over eight.", html: chainRow(["a⁰ = 1", "a⁻ⁿ = 1/aⁿ", "2⁻³ = 1/8"]) + P("A negative exponent does <b>not</b> make the answer negative.") }
    ],
    example: { q: "Simplify (2x³)² × x⁻⁴.", steps: ["(2x³)² = 4x⁶.", "4x⁶ × x⁻⁴: add the exponents, 6 + (−4) = 2.", "Answer: 4x²."] },
    questions: [
      { type: "mcq", q: "Simplify: a⁵ × a³", options: ["a⁸", "a¹⁵", "a²", "2a⁸"], answer: 0, hints: ["Same base, multiplying.", "Add the exponents.", "5 + 3."], explain: "a⁵ × a³ = a⁸." },
      { type: "mcq", q: "Simplify: y¹⁰ ÷ y⁴", options: ["y⁶", "y¹⁴", "y⁴⁰", "y²·⁵"], answer: 0, hints: ["Dividing: subtract.", "10 − 4.", "y⁶."], explain: "y¹⁰ ÷ y⁴ = y⁶." },
      { type: "mcq", q: "What is 5⁰?", options: ["1", "0", "5", "Undefined"], answer: 0, hints: ["Any non-zero number to the power 0.", "Always the same answer.", "1."], explain: "5⁰ = 1." },
      { type: "mcq", q: "What is 3⁻²?", options: ["1/9", "−9", "−6", "9"], answer: 0, hints: ["Negative exponent: one over.", "1/3².", "1/9."], explain: "3⁻² = 1/9." },
      { type: "mcq", q: "Solve: 2ˣ = 32", options: ["x = 5", "x = 16", "x = 4", "x = 6"], answer: 0, hints: ["Write 32 as a power of 2.", "32 = 2⁵.", "So x = 5."], explain: "2⁵ = 32, so x = 5." }
    ],
    reflect: { q: "What helped you most?", options: ["Writing the laws out", "Checking the base is the same", "Writing numbers as powers", "Not sure"] },
    parent: "Your child used the laws of exponents to simplify expressions and solve simple exponential equations.",
    teacher: "Shows applying exponent laws, zero and negative exponents, and solving exponential equations with a common base.",
    done: "Same base: add when multiplying, subtract when dividing, multiply for a power of a power." },

  { id: "g10-trig", grade: 10, subject: "Mathematics", title: "Trigonometric ratios", topic: "Sin, cos and tan", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 10 Mathematics, Term 2: Trigonometry (define sin, cos and tan in right-angled triangles; solve two-dimensional problems)",
    intention: "Today I am using sin, cos and tan to work with right-angled triangles.", prompt: "How do you decide which ratio to use?",
    lesson: [
      { h: "Naming the sides", say: "Choose an angle, called theta. The hypotenuse is the longest side. The opposite side is across from theta. The adjacent side is next to theta.", html: triTrig + P("Labels depend on <b>which angle</b> you choose.") },
      { h: "The three ratios", say: "Sine theta is opposite over hypotenuse. Cosine theta is adjacent over hypotenuse. Tangent theta is opposite over adjacent. Remember SOH CAH TOA.", html: chainRow(["sin θ = O/H", "cos θ = A/H", "tan θ = O/A"]) + P("<b>SOH CAH TOA</b>") },
      { h: "Using them", say: "In this triangle, sine theta is three fifths, cosine theta is four fifths, and tangent theta is three quarters.", html: chainRow(["sin θ = 3/5", "cos θ = 4/5", "tan θ = 3/4"]) + P("Use a calculator in <b>degree</b> mode to find angles and lengths.") }
    ],
    example: { q: "A ramp is 10 m long and rises at 30°. How high does it rise?", steps: ["The ramp is the hypotenuse, 10 m. The height is opposite the 30° angle.", "Opposite and hypotenuse: use sin.", "height = 10 × sin 30° = 10 × 0,5 = 5 m."] },
    questions: [
      { type: "mcq", q: "Which ratio is opposite over hypotenuse?", options: ["sin θ", "cos θ", "tan θ"], answer: 0, hints: ["SOH.", "S, O, H.", "Sine."], explain: "sin θ = opposite/hypotenuse." },
      { type: "mcq", q: "In the triangle shown, what is tan θ?", html: triTrig, options: ["3/4", "4/3", "3/5", "4/5"], answer: 0, hints: ["TOA.", "Opposite over adjacent.", "3 over 4."], explain: "tan θ = 3/4." },
      { type: "mcq", q: "You know the adjacent side and the hypotenuse. Which ratio do you use?", options: ["cos", "sin", "tan"], answer: 0, hints: ["Adjacent and hypotenuse.", "CAH.", "Cosine."], explain: "cos θ = adjacent/hypotenuse." },
      { type: "num", q: "sin θ = 0,5. What is θ, in degrees?", answer: "30", options: ["30", "60", "45", "90"], hints: ["Use sin⁻¹ on a calculator.", "Or remember a special angle.", "sin 30° = 0,5."], explain: "θ = 30°." },
      { type: "num", q: "A ladder 6 m long makes 60° with the ground. How far is its foot from the wall?", answer: "3", options: ["3", "5,2", "6", "12"], hints: ["The distance is adjacent to 60°.", "Use cos.", "6 × cos 60° = 6 × 0,5."], explain: "6 × cos 60° = 3 m." }
    ],
    reflect: { q: "What helped you most?", options: ["Labelling the sides first", "SOH CAH TOA", "Drawing a sketch", "Not sure"] },
    parent: "Your child used sin, cos and tan to find sides and angles in right-angled triangles.",
    teacher: "Shows labelling sides relative to an angle, selecting the correct ratio and solving 2-D problems.",
    done: "Label the sides, choose the ratio with SOH CAH TOA, then solve." },

  { id: "g10-stats", grade: 10, subject: "Mathematics", title: "Mean, median and spread", topic: "Statistics", domain: "Logical and Analytical Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 10 Mathematics, Term 4: Statistics (measures of central tendency; range, quartiles and interquartile range; five-number summary)",
    intention: "Today I am summarising data using averages and spread.", prompt: "When is the median a better average than the mean?",
    lesson: [
      { h: "Three averages", say: "The mean adds all values and divides by how many there are. The median is the middle value when the data is in order. The mode is the most common value.", html: chainRow(["Mean: add ÷ count", "Median: middle", "Mode: most often"]) + P("Data: 2, 3, 3, 5, 7. Mean 4, median 3, mode 3.") },
      { h: "Outliers", say: "An outlier is a value far from the rest. It pulls the mean towards it, but barely moves the median. That is why the median is often used for incomes and house prices.", html: chainRow(["3, 4, 4, 5, 34"]) + P("Mean = 10, but the median = 4 describes the data better.") },
      { h: "Spread", say: "The range is the highest minus the lowest. Quartiles split ordered data into four equal parts. The interquartile range is Q3 minus Q1, the spread of the middle half.", html: chainRow(["Min", "Q1", "Median", "Q3", "Max"]) + P("This is the <b>five-number summary</b>.") }
    ],
    example: { q: "Test marks: 45, 52, 58, 61, 64, 70, 88. Find the median and range.", steps: ["The data is already in order, with 7 values.", "The middle value is the 4th: 61.", "Range = 88 − 45 = 43."] },
    questions: [
      { type: "num", q: "Find the mean of 4, 6, 8, 10, 12.", answer: "8", options: ["8", "40", "10", "6"], hints: ["Add them: 40.", "There are 5 values.", "40 ÷ 5."], explain: "40 ÷ 5 = 8." },
      { type: "num", q: "Find the median of 9, 2, 7, 4, 5.", answer: "5", options: ["5", "7", "4", "9"], hints: ["Put them in order first.", "2, 4, 5, 7, 9.", "The middle value."], explain: "In order: 2, 4, 5, 7, 9. The median is 5." },
      { type: "mcq", q: "What is the mode of 3, 5, 5, 6, 8, 5, 2?", options: ["5", "3", "6", "4,9"], answer: 0, hints: ["Most common.", "Count each value.", "5 appears three times."], explain: "5 appears most often." },
      { type: "mcq", q: "Salaries in a small company: R8 000, R9 000, R9 500, R10 000, R95 000. Which average is most representative?", options: ["Median", "Mean", "Range", "Maximum"], answer: 0, hints: ["One value is an outlier.", "The mean will be pulled up.", "The median."], explain: "The median (R9 500) is not distorted by the outlier." },
      { type: "num", q: "Q1 = 12 and Q3 = 30. What is the interquartile range?", answer: "18", options: ["18", "42", "21", "12"], hints: ["IQR = Q3 − Q1.", "30 − 12.", "18."], explain: "IQR = 30 − 12 = 18." }
    ],
    reflect: { q: "What helped you most?", options: ["Ordering the data first", "Spotting outliers", "The five-number summary", "Not sure"] },
    parent: "Your child summarised data with mean, median, mode, range and quartiles.",
    teacher: "Shows calculating measures of central tendency and dispersion, and judging which average represents data best.",
    done: "Use averages for the centre and range or IQR for the spread." },

  // ===================== GRADE 10 MATHEMATICAL LITERACY =====================
  { id: "g10-ml-budget", grade: 10, subject: "Mathematical Literacy", title: "Budgets that balance", topic: "Finance: income and expenses", domain: "Logical and Analytical Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade 10 Mathematical Literacy: Finance (financial documents; income, expenditure, profit and loss; household budgets)",
    intention: "Today I am planning a budget so that income covers expenses.", prompt: "Which household expense is easiest to cut, and why?",
    lesson: [
      { h: "Income and expenses", say: "Income is money coming in, like a wage, a grant or money from selling. Expenses are money going out, like transport, food and airtime.", html: chainRow(["Income: money in", "Expenses: money out"]) + P("A <b>budget</b> plans how income will cover expenses.") },
      { h: "Fixed and variable expenses", say: "Fixed expenses stay the same each month, like rent or school fees. Variable expenses change, like food, electricity and transport.", html: chainRow(["Fixed: rent, school fees", "Variable: food, electricity"]) + P("Variable expenses are usually where you can save.") },
      { h: "Surplus or deficit", say: "Subtract total expenses from total income. If the answer is positive, it is a surplus you can save. If it is negative, it is a deficit: you must spend less or earn more.", html: P("Income − expenses = balance") + P("Positive: <b>surplus</b>. Negative: <b>deficit</b>.") }
    ],
    example: { q: "Thabo earns R6 500 a month. He spends R2 800 on rent, R1 900 on food, R950 on transport and R400 on airtime. What is his balance?", steps: ["Add the expenses: 2 800 + 1 900 + 950 + 400 = R6 050.", "Subtract from income: 6 500 − 6 050 = R450.", "He has a surplus of R450 to save."] },
    questions: [
      { type: "mcq", q: "Which of these is income?", options: ["A child support grant", "A taxi fare", "The electricity bill", "School shoes"], answer: 0, hints: ["Income is money coming in.", "Which one brings money to the household?", "The grant."], explain: "A grant is money coming in. The others are expenses." },
      { type: "mcq", q: "Which is a fixed expense?", options: ["Monthly rent", "Groceries", "Electricity", "Airtime"], answer: 0, hints: ["Fixed means the same every month.", "Which one is agreed in advance?", "Rent."], explain: "Rent stays the same each month. The others change." },
      { type: "num", q: "Lerato's income is R8 200. Her expenses add up to R7 650. What is her surplus, in rand?", answer: "550", options: ["550", "1 550", "650", "450"], hints: ["Surplus = income − expenses.", "8 200 − 7 650.", "550."], explain: "8 200 − 7 650 = R550." },
      { type: "mcq", q: "A family's income is R12 000 and their expenses are R12 600. What does this mean?", options: ["They have a deficit of R600", "They have a surplus of R600", "Their budget balances", "They saved R12 600"], answer: 0, hints: ["Are the expenses more or less than the income?", "More: 12 600 − 12 000 = 600.", "A deficit."], explain: "They spend R600 more than they earn: a deficit." },
      { type: "num", q: "A spaza shop buys 24 cold drinks for R168 and sells each one for R10. What is the profit, in rand?", answer: "72", options: ["72", "240", "168", "48"], hints: ["Money from sales: 24 × R10.", "That is R240.", "Profit = 240 − 168."], explain: "Sales R240 − cost R168 = R72 profit." }
    ],
    reflect: { q: "What helped you most?", options: ["Sorting money in and money out", "Adding the expenses first", "The worked example", "Not sure"] },
    parent: "Your child worked out a household budget: income, fixed and variable expenses, and a surplus or deficit.",
    teacher: "Shows identifying income and expenditure, classifying fixed and variable costs, and calculating a budget balance and profit.",
    done: "Income minus expenses shows a surplus or a deficit." },

  { id: "g10-ml-units", grade: 10, subject: "Mathematical Literacy", title: "Converting units and recipes", topic: "Measurement: conversions", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 10 Mathematical Literacy: Measurement (conversions between metric units; measuring length, mass and volume; scaling recipes)",
    intention: "Today I am converting between units and scaling a recipe.", prompt: "Where at home do you see measurements every day?",
    lesson: [
      { h: "Metric units", say: "Length uses millimetres, centimetres, metres and kilometres. Mass uses grams and kilograms. Volume uses millilitres and litres.", html: chainRow(["10 mm = 1 cm", "100 cm = 1 m", "1 000 m = 1 km"]) + P("1 000 g = 1 kg and 1 000 ml = 1 ℓ.") },
      { h: "Bigger or smaller units", say: "To change to a smaller unit, multiply. To change to a bigger unit, divide. Two and a half kilograms is 2 500 grams.", html: chainRow(["To a smaller unit: ×", "To a bigger unit: ÷"]) + P("2,5 kg × 1 000 = 2 500 g") },
      { h: "Scaling a recipe", say: "To feed more people, multiply every ingredient by the same number. If a recipe serves 4 and you need to feed 12, multiply everything by 3.", html: chainRow(["12 ÷ 4 = 3", "every ingredient × 3"]) + P("Scale <b>every</b> ingredient by the same number.") }
    ],
    example: { q: "A recipe for 6 people uses 750 g of mealie meal. How much is needed for 18 people, in kilograms?", steps: ["18 ÷ 6 = 3, so multiply by 3.", "750 g × 3 = 2 250 g.", "2 250 ÷ 1 000 = 2,25 kg."] },
    questions: [
      { type: "num", q: "How many millilitres are in 2 litres?", answer: "2 000", options: ["2 000", "200", "20", "20 000"], hints: ["1 litre = 1 000 ml.", "Multiply by 1 000.", "2 × 1 000."], explain: "2 × 1 000 = 2 000 ml." },
      { type: "num", q: "Convert 350 cm to metres.", answer: "3,5", options: ["3,5", "35", "0,35", "3 500"], hints: ["100 cm = 1 m.", "To a bigger unit, divide.", "350 ÷ 100."], explain: "350 ÷ 100 = 3,5 m." },
      { type: "mcq", q: "To change kilometres to metres, you …", options: ["multiply by 1 000", "divide by 1 000", "multiply by 100", "divide by 100"], answer: 0, hints: ["Metres are smaller than kilometres.", "To a smaller unit, multiply.", "1 km = 1 000 m."], explain: "1 km = 1 000 m, so multiply by 1 000." },
      { type: "num", q: "A recipe for 4 people needs 300 ml of milk. How many millilitres are needed for 10 people?", answer: "750", options: ["750", "1 200", "3 000", "600"], hints: ["Find the amount for 1 person first.", "300 ÷ 4 = 75 ml.", "75 × 10."], explain: "75 ml per person × 10 = 750 ml." },
      { type: "mcq", q: "Which is the heaviest?", options: ["2,1 kg", "1 900 g", "2 050 g", "0,5 kg"], answer: 0, hints: ["Change them all to grams.", "2,1 kg = 2 100 g.", "2 100 g is the most."], explain: "2,1 kg = 2 100 g, more than 2 050 g and 1 900 g." }
    ],
    reflect: { q: "What helped you most?", options: ["Remembering bigger or smaller", "Changing everything to one unit", "Finding the amount for one person", "Not sure"] },
    parent: "Your child converted between metric units and scaled a recipe for more people.",
    teacher: "Shows converting between metric units of length, mass and volume, and using proportional reasoning to scale recipes.",
    done: "To a smaller unit, multiply. To a bigger unit, divide." },

  { id: "g10-ml-maps", grade: 10, subject: "Mathematical Literacy", title: "Map scales and grids", topic: "Maps, plans and other representations", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 10 Mathematical Literacy: Maps, plans and other representations (number and bar scales; grid references; estimating real distances on maps)",
    intention: "Today I am using a map scale to work out real distances.", prompt: "When have you used a map, on paper or on a phone?",
    lesson: [
      { h: "What a scale means", say: "A scale of 1 to 50 000 means 1 centimetre on the map stands for 50 000 centimetres in real life. That is 500 metres.", html: chainRow(["1 cm on the map", "50 000 cm real", "= 500 m"]) + P("Scale is written <b>1 : 50 000</b>.") },
      { h: "Bar scales", say: "A bar scale is a line marked with real distances. Measure on the map with a ruler or a piece of string, then compare it with the bar.", html: P("A bar scale stays correct when a map is made bigger or smaller, because the bar changes size with it.") },
      { h: "Grid references", say: "Many maps have a grid, with letters along one side and numbers along the other. B3 means column B, row 3. It helps you find places quickly.", html: chainRow(["Letter: column", "Number: row", "B3"]) }
    ],
    example: { q: "On a map with scale 1 : 25 000, two villages are 8 cm apart. How far apart are they really, in kilometres?", steps: ["8 × 25 000 = 200 000 cm.", "200 000 cm ÷ 100 = 2 000 m.", "2 000 m ÷ 1 000 = 2 km."] },
    questions: [
      { type: "num", q: "Scale 1 : 100. A wall is 5 cm long on the plan. How long is it really, in metres?", answer: "5", options: ["5", "500", "50", "0,5"], hints: ["5 × 100 = 500 cm.", "100 cm = 1 m.", "500 ÷ 100."], explain: "5 × 100 = 500 cm = 5 m." },
      { type: "num", q: "Scale 1 : 50 000. Two towns are 4 cm apart on the map. What is the real distance, in kilometres?", answer: "2", options: ["2", "20", "200", "0,2"], hints: ["4 × 50 000 = 200 000 cm.", "That is 2 000 m.", "2 000 m = 2 km."], explain: "200 000 cm = 2 000 m = 2 km." },
      { type: "mcq", q: "Why does a bar scale stay correct when a map is photocopied larger?", options: ["The bar is enlarged by the same amount as the map", "The bar is always 1 cm long", "Photocopies never change size", "The numbers change by themselves"], answer: 0, hints: ["What happens to the bar when the map grows?", "It grows too.", "By the same amount."], explain: "The bar grows with the map, so it still matches." },
      { type: "mcq", q: "On a grid map, what does D2 mean?", options: ["Column D, row 2", "Row D, column 2", "2 km in direction D", "Distance 2"], answer: 0, hints: ["Letters and numbers label the grid.", "The letter is the column.", "The number is the row."], explain: "D is the column and 2 is the row." },
      { type: "mcq", q: "A map scale is 1 : 200 000. Which is true?", options: ["1 cm on the map is 2 km in real life", "1 cm on the map is 200 m", "1 cm on the map is 20 km", "1 cm on the map is 200 km"], answer: 0, hints: ["1 cm = 200 000 cm.", "200 000 cm = 2 000 m.", "2 000 m = 2 km."], explain: "200 000 cm = 2 000 m = 2 km." }
    ],
    reflect: { q: "What helped you most?", options: ["Multiplying by the scale", "Converting cm to m to km", "Using the grid letters and numbers", "Not sure"] },
    parent: "Your child used map scales and grid references to work out real distances.",
    teacher: "Shows using number and bar scales to calculate real distances, converting units, and reading grid references.",
    done: "Measure on the map, multiply by the scale, then change to sensible units." },

  { id: "g10-ml-data", grade: 10, subject: "Mathematical Literacy", title: "Surveys and summaries", topic: "Data handling", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 10 Mathematical Literacy: Data handling (developing questions; collecting data with surveys; organising data in frequency tables; mean, median, mode and range)",
    intention: "Today I am collecting data and summarising it.", prompt: "What question would you like to ask your class?",
    lesson: [
      { h: "The data cycle", say: "Data handling starts with a question, like how do learners in our class get to school? Then you collect the answers, organise them, summarise them and say what they mean.", html: chainRow(["Question", "Collect", "Organise", "Summarise", "Interpret"]) },
      { h: "Tallies and frequency tables", say: "A tally mark records each answer. Group tallies in fives so they are easy to count. The frequency is how many times each answer came up.", html: P("Walk: 13 · Taxi: 9 · Bus: 6 · Car: 2") + P("Total: <b>30</b> learners.") },
      { h: "Summarising", say: "The mode is the most common answer. For numbers, the mean and median describe the centre, and the range describes the spread. Always say what the numbers mean in real life.", html: chainRow(["Mode: most common", "Mean: fair share", "Range: spread"]) }
    ],
    example: { q: "Five learners' travel times in minutes: 10, 15, 15, 20, 40. Find the mean and the range.", steps: ["Add: 10 + 15 + 15 + 20 + 40 = 100.", "Mean = 100 ÷ 5 = 20 minutes.", "Range = 40 − 10 = 30 minutes."] },
    questions: [
      { type: "mcq", q: "Which is the best survey question?", options: ["How do you usually travel to school?", "Don't you think taxis are dangerous?", "Why is walking the best?", "Travel?"], answer: 0, hints: ["A good question is clear.", "It doesn't push people towards an answer.", "The first one is fair to every answer."], explain: "It is clear and doesn't suggest an answer." },
      { type: "num", q: "A tally group of four lines with a fifth line across them stands for how many?", answer: "5", options: ["5", "4", "6", "10"], hints: ["Count every line.", "Four lines plus the one across.", "5."], explain: "Tallies are grouped in fives." },
      { type: "mcq", q: "Walk 13, Taxi 9, Bus 6, Car 2. What is the mode?", options: ["Walk", "Taxi", "Bus", "Car"], answer: 0, hints: ["The mode is the most common.", "Which has the biggest number?", "13."], explain: "Walking has the highest frequency, 13." },
      { type: "num", q: "Walk 13, Taxi 9, Bus 6, Car 2. How many learners were asked?", answer: "30", options: ["30", "13", "28", "4"], hints: ["Add all the frequencies.", "13 + 9 + 6 + 2.", "30."], explain: "13 + 9 + 6 + 2 = 30." },
      { type: "num", q: "Find the range of these prices: R12, R18, R9, R25, R15.", answer: "16", options: ["16", "25", "9", "15,8"], hints: ["Range = highest − lowest.", "Highest R25, lowest R9.", "25 − 9."], explain: "R25 − R9 = R16." }
    ],
    reflect: { q: "What helped you most?", options: ["The data cycle", "Counting the tallies", "Finding the highest and lowest", "Not sure"] },
    parent: "Your child asked a survey question, organised the answers in a table and summarised them.",
    teacher: "Shows formulating unbiased questions, using tallies and frequency tables, and calculating mode, mean and range in context.",
    done: "Ask a fair question, organise the answers, then summarise what they mean." },

  { id: "g10-ml-chance", grade: 10, subject: "Mathematical Literacy", title: "How likely is it?", topic: "Probability", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 10 Mathematical Literacy: Probability (the probability scale from 0 to 1; expressing probability as fractions, decimals and percentages; weather forecasts and games)",
    intention: "Today I am describing how likely things are.", prompt: "What does a 60% chance of rain make you decide to do?",
    lesson: [
      { h: "The probability scale", say: "Probability says how likely something is, from 0, impossible, to 1, certain. A half, or 50 percent, means it is just as likely to happen as not.", html: chainRow(["0: impossible", "0,5: even chance", "1: certain"]) },
      { h: "Working it out", say: "Sometimes every outcome is equally likely. Then the probability is the number of outcomes you want, divided by the total number of outcomes. Rolling a 6 on a dice is 1 out of 6.", html: P("Probability = outcomes you want ÷ all outcomes") + P("P(rolling a 6) = <b>1/6</b>") },
      { h: "Three ways to write it", say: "You can write a probability as a fraction, a decimal or a percentage. One quarter is 0.25, which is 25 percent. A forecast of 70 percent rain means rain is likely, not certain.", html: chainRow(["1/4", "0,25", "25%"]) }
    ],
    example: { q: "A bag has 3 red, 5 blue and 2 green sweets. You take one without looking. What is the probability that it is blue?", steps: ["Total sweets: 3 + 5 + 2 = 10.", "Blue sweets: 5 out of 10.", "5/10 = 1/2 = 0,5 = 50%."] },
    questions: [
      { type: "mcq", q: "The forecast says there is an 80% chance of rain. What does this mean?", options: ["Rain is likely, but not certain", "It will definitely rain", "It will rain for 80% of the day", "80 mm of rain will fall"], answer: 0, hints: ["80% is high, but not 100%.", "Likely, not certain.", "The first answer."], explain: "80% means rain is likely, but it might not rain." },
      { type: "mcq", q: "What is the probability of rolling an even number on a normal dice?", options: ["1/2", "1/6", "1/3", "2/3"], answer: 0, hints: ["The even numbers are 2, 4 and 6.", "That is 3 out of 6.", "3/6 = 1/2."], explain: "3 even numbers out of 6 = 1/2." },
      { type: "num", q: "A coin is tossed. What is the probability of heads, as a percentage? (Type the number only.)", answer: "50", options: ["50", "25", "100", "0"], hints: ["Heads or tails: 2 outcomes.", "1 out of 2.", "1/2 = 50%."], explain: "1/2 = 50%." },
      { type: "mcq", q: "Which event has a probability of 0?", options: ["Rolling a 7 on a normal dice", "Rolling a 6", "Getting heads", "Rolling a number less than 7"], answer: 0, hints: ["0 means impossible.", "A normal dice shows 1 to 6.", "A 7 can't happen."], explain: "A normal dice has no 7, so it is impossible." },
      { type: "mcq", q: "A box has 4 winning tickets and 16 losing tickets. What is the chance of winning?", options: ["1/5", "1/4", "4/16", "1/16"], answer: 0, hints: ["Total tickets: 4 + 16 = 20.", "4 out of 20.", "4/20 = 1/5."], explain: "4 winners out of 20 tickets = 1/5." }
    ],
    reflect: { q: "What helped you most?", options: ["The 0 to 1 scale", "Counting all the outcomes", "Changing fractions to percentages", "Not sure"] },
    parent: "Your child described how likely events are, using fractions, decimals and percentages.",
    teacher: "Shows using the probability scale, calculating simple theoretical probability, and interpreting forecasts.",
    done: "Probability = outcomes you want ÷ all outcomes, from 0 to 1." },

  // ===================== GRADE 10 ENGLISH HOME LANGUAGE =====================
  { id: "g10-poetry", grade: 10, subject: "English Home Language", title: "Poem: Rank", topic: "Analysing poetry", domain: "Communication and Expression", category: "Creativity",
    caps: "CAPS Grade 10 English Home Language: Literature (poetry: imagery, metaphor, enjambment, tone, theme; contextual questions)",
    intention: "Today I am analysing how a poet creates meaning through imagery and structure.", prompt: "What do you think the poem is saying about the workers?",
    passage: POEM_TAXI,
    lesson: [
      { h: "Read the poem", say: "Read the poem, or press Read aloud to hear it part by part.", html: POEM_TAXI },
      { h: "Metaphor and imagery", say: "The rank is a throat of engines clearing the night from its voice. The rank is personified as a person waking up. Gogo Nomsa sells boiled eggs and patience, which mixes something concrete with something abstract.", html: chainRow(["throat of engines", "eggs and patience", "a quiet arithmetic"]) + P("Unexpected pairings make us <b>look again</b>.") },
      { h: "Enjambment and theme", say: "Enjambment is when a sentence runs over the end of a line without punctuation. It creates flow, like the moving queue. The theme is the dignity and resilience of workers in a city that overlooks them.", html: P("<b>Enjambment</b>: each worker stitched / to a city …") + P("<b>Theme</b>: dignity and resilience.") }
    ],
    example: { q: "What does the simile The queue unspools like thread from a spool suggest?", steps: ["Thread unspools steadily and continuously.", "The queue moves forward in a long, steady line.", "It also links to stitched, suggesting workers are sewn into the city's fabric."] },
    questions: [
      { type: "mcq", q: "What figure of speech is a throat of engines clearing the night from its voice?", options: ["Personification", "Simile", "Hyperbole", "Alliteration"], answer: 0, hints: ["Does a rank have a throat?", "Human qualities given to a place.", "Personification."], explain: "The rank is described as a person clearing its throat." },
      { type: "mcq", q: "Why might the poet say she sells boiled eggs and patience?", options: ["She is patient with customers as well as selling food", "Patience is an egg", "She sells nothing", "It is a mistake"], answer: 0, hints: ["Patience cannot be sold literally.", "What does she give customers besides eggs?", "Patience and kindness."], explain: "It suggests she offers patience along with her goods." },
      { type: "mcq", q: "What does a city that never learns their names suggest?", options: ["The workers are overlooked", "The city is friendly", "Nobody has a name", "The workers are famous"], answer: 0, hints: ["Who notices the workers?", "Nobody knows them.", "They are overlooked."], explain: "The workers are essential but unnoticed." },
      { type: "mcq", q: "What is the tone of the final stanza?", options: ["Hopeful and resilient", "Angry", "Despairing", "Bored"], answer: 0, hints: ["And still they laugh.", "Despite everything.", "Hopeful."], explain: "And still they laugh shows resilience and hope." },
      { type: "mcq", q: "What is enjambment?", options: ["A sentence running on past the end of a line", "A rhyme at the end of a line", "A repeated first sound", "A comparison with like"], answer: 0, hints: ["It is about lines.", "No punctuation at the line end.", "It runs on."], explain: "Enjambment carries a sentence over a line break." }
    ],
    reflect: { q: "How did you understand the poem best?", options: ["Reading it slowly", "Listening to it", "Unpacking one image at a time", "Not sure"] },
    parent: "Your child analysed a poem's imagery, structure, tone and theme.",
    teacher: "Shows interpreting personification, metaphor and simile, enjambment, tone and theme in an unseen poem.",
    done: "Look at imagery, structure and tone to find a poem's theme." },

  { id: "g10-visual", grade: 10, subject: "English Home Language", title: "Reading visual texts", topic: "Visual literacy: adverts and cartoons", domain: "Communication and Expression", category: "Reflection",
    caps: "CAPS Grade 10 English Home Language: Reading and Viewing (visual literacy: advertisements and cartoons; layout, font, colour, target audience, purpose)",
    intention: "Today I am analysing how pictures and words work together in adverts and cartoons.", prompt: "Which advert has persuaded you recently, and how?",
    lesson: [
      { h: "Elements of a visual text", say: "Visual texts combine images and words. Look at the layout, font size, colour, the main image, the slogan and the logo.", html: chainRow(["Image", "Slogan", "Font", "Colour", "Layout", "Logo"]) + P("Ask: what do I notice <b>first</b>, and why?") },
      { h: "Audience and purpose", say: "Every advert targets an audience and has a purpose: to sell, inform or change behaviour. Colours, models and language are chosen for that audience.", html: chainRow(["Who is it for?", "What does it want?", "How does it persuade?"]) + P("A sports drink advert might use bold colours and action shots for young athletes.") },
      { h: "Cartoons", say: "Cartoons comment on issues, often with humour or exaggeration. Caricature exaggerates features. Speech bubbles, captions and symbols carry the message.", html: PICS("💬 🖋️", "Speech bubble and pen") + P("Ask: what is the cartoonist <b>criticising</b>?") }
    ],
    example: { q: "An advert shows a smiling family around a braai with the slogan Real meat, real moments. Who is the target audience and what is the message?", steps: ["The image shows families and a South African tradition.", "The slogan links the product to togetherness.", "It targets parents and suggests the product creates family moments."] },
    questions: [
      { type: "mcq", q: "What is a slogan?", options: ["A short, memorable phrase", "The company's address", "The price", "A long paragraph"], answer: 0, hints: ["It is catchy.", "Often under the logo.", "Short and memorable."], explain: "A slogan is a short, memorable phrase." },
      { type: "mcq", q: "Why are the largest words usually the most important?", options: ["They draw the eye first", "They are cheaper", "They are random", "They are hidden"], answer: 0, hints: ["Size creates focus.", "What do you read first?", "They draw the eye."], explain: "Size directs attention." },
      { type: "mcq", q: "What is caricature?", options: ["Exaggerating someone's features", "A type of font", "A real photograph", "A logo"], answer: 0, hints: ["Used in cartoons.", "Big ears, big nose.", "Exaggeration."], explain: "Caricature exaggerates features for effect." },
      { type: "mcq", q: "An energy drink advert uses neon colours and skateboarders. Who is the target audience?", options: ["Young people", "Retired people", "Babies", "Farmers only"], answer: 0, hints: ["Skateboarding.", "Bright, bold colours.", "Young people."], explain: "The images target young, active people." },
      { type: "mcq", q: "A public health poster says Wash your hands, save lives. What is its purpose?", options: ["To change behaviour", "To sell soap", "To entertain", "To advertise a shop"], answer: 0, hints: ["It is not selling a brand.", "It wants people to act.", "Change behaviour."], explain: "It aims to change behaviour." }
    ],
    reflect: { q: "What will you look for first next time?", options: ["The target audience", "The slogan", "Colour and layout", "The hidden message"] },
    parent: "Your child analysed how adverts and cartoons use images and words to persuade.",
    teacher: "Shows identifying visual elements, target audience, purpose and techniques in adverts and cartoons.",
    done: "Ask who a visual text is for, what it wants, and how it persuades." },

  { id: "g10-essay", grade: 10, subject: "English Home Language", title: "Essay types", topic: "Narrative, descriptive, argumentative and reflective essays", domain: "Communication and Expression", category: "Planning and Organisation",
    caps: "CAPS Grade 10 English Home Language: Writing and Presenting (essays: narrative, descriptive, argumentative, discursive, reflective; planning and paragraphing)",
    intention: "Today I am learning the features of different essay types.", prompt: "Which essay type do you enjoy writing most?",
    lesson: [
      { h: "Four main types", say: "A narrative essay tells a story. A descriptive essay paints a picture with the senses. An argumentative essay takes a side and argues it. A reflective essay explores your own thoughts and growth.", html: chainRow(["Narrative: story", "Descriptive: senses", "Argumentative: one side", "Reflective: thoughts"]) },
      { h: "Planning", say: "Before writing, brainstorm, then make a plan: introduction, three or four body paragraphs, and a conclusion. Each body paragraph has one main idea.", html: chainRow(["Brainstorm", "Plan", "Draft", "Edit", "Final copy"]) + P("Most exams give marks for your <b>plan</b>.") },
      { h: "Strong paragraphs", say: "Start each paragraph with a topic sentence. Support it with detail or evidence. Link it to the next paragraph with a transition.", html: chainRow(["Topic sentence", "Support", "Link"]) + P("Vary sentence length to keep the reader interested.") }
    ],
    example: { q: "The topic is The day I learned to stand up for myself. Which essay type fits best?", steps: ["It is about a personal experience.", "It could tell a story and reflect on what you learned.", "A narrative or reflective essay fits best."] },
    questions: [
      { type: "mcq", q: "Which essay type takes one side of an issue?", options: ["Argumentative", "Descriptive", "Narrative", "Reflective"], answer: 0, hints: ["It argues.", "One side.", "Argumentative."], explain: "Argumentative essays take one side." },
      { type: "mcq", q: "Which essay focuses on sights, sounds and smells?", options: ["Descriptive", "Argumentative", "Discursive", "Transactional"], answer: 0, hints: ["Senses.", "Painting a picture.", "Descriptive."], explain: "Descriptive essays appeal to the senses." },
      { type: "mcq", q: "What is a topic sentence?", options: ["The sentence that states a paragraph's main idea", "The last sentence of an essay", "The title", "A quote"], answer: 0, hints: ["It starts a paragraph.", "It tells what the paragraph is about.", "Main idea."], explain: "It states the paragraph's main idea." },
      { type: "mcq", q: "Should school uniforms be scrapped? Which types could fit this topic?", options: ["Argumentative or discursive", "Narrative only", "Descriptive only", "None"], answer: 0, hints: ["It is a debate topic.", "One side, or both sides.", "Argumentative or discursive."], explain: "A debate topic suits argumentative or discursive writing." },
      { type: "order", q: "Put the writing process in order.", items: ["Brainstorm", "Plan", "Draft", "Edit", "Final copy"], orderLabel: "first to last", hints: ["Ideas first.", "Then structure.", "Edit before the final copy."], explain: "Brainstorm, plan, draft, edit, final copy." }
    ],
    reflect: { q: "Which part of essay writing will you work on?", options: ["Planning", "Topic sentences", "Descriptive detail", "Editing"] },
    parent: "Your child learned the features of narrative, descriptive, argumentative and reflective essays.",
    teacher: "Shows distinguishing essay types, the writing process and paragraph structure.",
    done: "Choose the right essay type, plan first, and build strong paragraphs." },

  // ===================== GRADE 10 LIFE SCIENCES =====================
  { id: "g10-mitosis", grade: 10, subject: "Life Sciences", title: "Cell division: mitosis", topic: "The cell cycle", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 10 Life Sciences, Term 1: Cell division (the cell cycle; mitosis: prophase, metaphase, anaphase, telophase; importance of mitosis; cancer)",
    intention: "Today I am learning how cells divide by mitosis.", prompt: "Why must the new cells be identical to the parent cell?",
    lesson: [
      { h: "The cell cycle", say: "Most of a cell's life is spent in interphase, growing and copying its DNA. Then it divides by mitosis, making two identical daughter cells.", html: chainRow(["Interphase", "Mitosis", "Cytokinesis"]) + P("DNA is copied during <b>interphase</b>.") },
      { h: "The four phases", say: "In prophase, chromosomes become visible. In metaphase, they line up in the middle. In anaphase, the chromatids are pulled apart to opposite poles. In telophase, two new nuclei form.", html: chainRow(["Prophase", "Metaphase", "Anaphase", "Telophase"]) + P("Remember <b>PMAT</b>.") },
      { h: "Why it matters", say: "Mitosis allows growth, repair of damaged tissue and asexual reproduction. When cell division goes out of control, a tumour can form. This is how cancer develops.", html: chainRow(["Growth", "Repair", "Asexual reproduction"]) + P("Uncontrolled mitosis can lead to <b>cancer</b>.") }
    ],
    example: { q: "In which phase do chromosomes line up across the middle of the cell?", steps: ["Think: M for middle.", "Metaphase.", "The chromosomes line up on the equator of the cell."] },
    questions: [
      { type: "order", q: "Put the phases of mitosis in order.", items: ["Prophase", "Metaphase", "Anaphase", "Telophase"], orderLabel: "first to last", hints: ["PMAT.", "P, M, A, T.", "Prophase first."], explain: "Prophase, metaphase, anaphase, telophase." },
      { type: "mcq", q: "When is DNA copied?", options: ["Interphase", "Metaphase", "Anaphase", "Telophase"], answer: 0, hints: ["Before mitosis begins.", "The longest phase.", "Interphase."], explain: "DNA replicates during interphase." },
      { type: "mcq", q: "In which phase are chromatids pulled to opposite poles?", options: ["Anaphase", "Prophase", "Metaphase", "Interphase"], answer: 0, hints: ["A for apart.", "They separate.", "Anaphase."], explain: "Chromatids separate in anaphase." },
      { type: "mcq", q: "How many daughter cells does mitosis produce?", options: ["Two identical cells", "Four different cells", "One cell", "Eight cells"], answer: 0, hints: ["One cell divides.", "Into how many?", "Two, identical."], explain: "Two genetically identical daughter cells." },
      { type: "mcq", q: "Which is NOT a function of mitosis?", options: ["Making sex cells", "Growth", "Repair", "Asexual reproduction"], answer: 0, hints: ["Sex cells need half the chromosomes.", "That needs a different division.", "Meiosis makes sex cells."], explain: "Sex cells are made by meiosis, not mitosis." }
    ],
    reflect: { q: "What helped you most?", options: ["PMAT", "Picturing each phase", "Linking it to growth and repair", "Not sure"] },
    parent: "Your child learned the cell cycle and the four phases of mitosis.",
    teacher: "Shows sequencing the cell cycle and phases of mitosis, and explaining the role of mitosis and its link to cancer.",
    done: "Mitosis makes two identical cells for growth and repair." },

  { id: "g10-ecosystems", grade: 10, subject: "Life Sciences", title: "Energy flow in ecosystems", topic: "Biosphere to ecosystems", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 10 Life Sciences, Term 4: Biosphere to ecosystems (biotic and abiotic factors; trophic levels; food chains and webs; energy pyramids; nutrient cycles)",
    intention: "Today I am tracing how energy moves through an ecosystem.", prompt: "Why are there usually fewer top predators than plants?",
    lesson: [
      { h: "Biotic and abiotic", say: "An ecosystem has biotic, living factors like plants and animals, and abiotic, non-living factors like sunlight, water, soil and temperature.", html: chainRow(["Biotic: living", "Abiotic: non-living"]) + P("Both affect what can live there.") },
      { h: "Trophic levels", say: "Producers make food from sunlight. Primary consumers eat producers. Secondary consumers eat primary consumers. Decomposers break down dead matter.", html: chainRow(["Grass", "Springbok", "Cheetah"]) + P("Each step is a <b>trophic level</b>.") },
      { h: "The ten percent rule", say: "Only about ten percent of energy passes to the next level. The rest is used for life processes or lost as heat. That is why energy pyramids get narrower at the top.", html: chainRow(["10 000 J", "1 000 J", "100 J", "10 J"]) + P("Fewer <b>top predators</b> can be supported.") }
    ],
    example: { q: "Grass has 20 000 J of energy. About how much reaches a cheetah that eats a springbok?", steps: ["Grass to springbok: 10% of 20 000 = 2 000 J.", "Springbok to cheetah: 10% of 2 000 = 200 J.", "About 200 J."] },
    questions: [
      { type: "mcq", q: "Which is an abiotic factor?", options: ["Rainfall", "Grass", "Bacteria", "Lions"], answer: 0, hints: ["Non-living.", "Weather.", "Rainfall."], explain: "Rainfall is non-living, so abiotic." },
      { type: "mcq", q: "What is the role of decomposers?", options: ["Break down dead matter and recycle nutrients", "Make food from sunlight", "Hunt other animals", "Produce oxygen only"], answer: 0, hints: ["Fungi and bacteria.", "They break things down.", "Recycle nutrients."], explain: "Decomposers recycle nutrients from dead matter." },
      { type: "mcq", q: "In grass → grasshopper → frog → snake, what is the frog?", options: ["Secondary consumer", "Producer", "Primary consumer", "Decomposer"], answer: 0, hints: ["Grass is the producer.", "The grasshopper is primary.", "The frog eats the grasshopper."], explain: "The frog is a secondary consumer." },
      { type: "num", q: "A producer level has 50 000 J. Using the 10% rule, how much reaches the primary consumers?", answer: "5000", options: ["5000", "500", "45000", "50000"], hints: ["10% passes on.", "50 000 ÷ 10.", "5 000 J."], explain: "10% of 50 000 = 5 000 J." },
      { type: "mcq", q: "Why is energy lost between trophic levels?", options: ["Used for life processes and lost as heat", "It is destroyed", "It is stored forever", "It turns into water"], answer: 0, hints: ["Animals move and keep warm.", "Respiration releases heat.", "Life processes and heat."], explain: "Most energy is used or lost as heat." }
    ],
    reflect: { q: "What helped you most?", options: ["Food chain examples", "The 10% rule", "The pyramid shape", "Not sure"] },
    parent: "Your child traced how energy flows through ecosystems.",
    teacher: "Shows identifying biotic and abiotic factors, trophic levels and applying the 10% energy transfer rule.",
    done: "Energy flows from producers to consumers, and about 90% is lost at each step." },

  { id: "g10-transport", grade: 10, subject: "Life Sciences", title: "Transport in plants", topic: "Xylem, phloem and transpiration", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 10 Life Sciences, Term 3: Support and transport systems in plants (xylem and phloem; transpiration; factors affecting transpiration; wilting)",
    intention: "Today I am learning how water and food move through a plant.", prompt: "Why might a plant wilt on a hot, windy day?",
    lesson: [
      { h: "Xylem and phloem", say: "Xylem carries water and minerals up from the roots. Phloem carries food, made in the leaves, to all parts of the plant.", html: chainRow(["Xylem: water up", "Phloem: food everywhere"]) + P("Together they form <b>vascular bundles</b>.") },
      { h: "Transpiration", say: "Transpiration is the loss of water vapour from leaves through tiny pores called stomata. It pulls water up the xylem like drinking through a straw.", html: PICS("🍃 💧", "Leaf and water") + P("The <b>transpiration pull</b> moves water upwards.") },
      { h: "Factors", say: "Transpiration is faster when it is hot, windy, bright and dry. It is slower when it is cool, still and humid.", html: chainRow(["↑ temperature", "↑ wind", "↑ light", "↓ humidity"]) + P("If plants lose water faster than they take it in, they <b>wilt</b>.") }
    ],
    example: { q: "Why do plants in the desert often have small, waxy leaves?", steps: ["Deserts are hot and dry, so transpiration is fast.", "Small, waxy leaves lose less water.", "This helps the plant survive."] },
    questions: [
      { type: "mcq", q: "What does xylem transport?", options: ["Water and minerals", "Glucose", "Oxygen only", "Seeds"], answer: 0, hints: ["From the roots.", "Up the stem.", "Water and minerals."], explain: "Xylem carries water and minerals." },
      { type: "mcq", q: "What does phloem transport?", options: ["Food made in the leaves", "Water only", "Soil", "Carbon dioxide"], answer: 0, hints: ["Sugars.", "From the leaves.", "Food."], explain: "Phloem carries sugars from the leaves." },
      { type: "mcq", q: "What are stomata?", options: ["Pores in leaves", "Root hairs", "Seeds", "Flowers"], answer: 0, hints: ["Tiny openings.", "Mostly under the leaf.", "Pores."], explain: "Stomata are tiny pores, mainly on the underside of leaves." },
      { type: "mcq", q: "Which condition slows transpiration?", options: ["High humidity", "Strong wind", "Bright light", "High temperature"], answer: 0, hints: ["The air is already full of water vapour.", "Less difference.", "High humidity."], explain: "Humid air slows water loss from leaves." },
      { type: "mcq", q: "Why does a plant wilt?", options: ["It loses more water than it takes in", "It has too much food", "It grows too fast", "It has too much light"], answer: 0, hints: ["Cells lose water.", "They go floppy.", "Water loss."], explain: "Water loss greater than uptake makes cells floppy." }
    ],
    reflect: { q: "What helped you most?", options: ["The straw comparison", "Xylem up, phloem everywhere", "Real plant examples", "Not sure"] },
    parent: "Your child learned how xylem and phloem transport water and food, and what affects transpiration.",
    teacher: "Shows distinguishing xylem and phloem, explaining transpiration and factors affecting its rate.",
    done: "Xylem carries water up, phloem carries food, and leaves lose water by transpiration." },

  // ===================== GRADE 10 LIFE ORIENTATION =====================
  { id: "g10-stress", grade: 10, subject: "Life Orientation", title: "Managing stress", topic: "Development of the self in society", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: "CAPS Grade 10 Life Orientation: Development of the self in society (strategies to enhance self-awareness and well-being; coping with stress)",
    intention: "Today I am learning to recognise stress and use healthy ways to cope.", prompt: "What is one healthy thing that helps you when you are stressed?",
    lesson: [
      { h: "What stress is", say: "Stress is your body's response to pressure. A little stress can help you focus. Too much, for too long, can affect sleep, mood, concentration and health.", html: chainRow(["Pressure", "→", "Body response"]) + P("Signs: headaches, poor sleep, irritability, worry.") },
      { h: "Healthy coping", say: "Healthy ways to cope include exercise, sleep and talking to someone. Break tasks into steps. Breathe slowly, and make time for things you enjoy.", html: chainRow(["Move", "Sleep", "Talk", "Plan", "Breathe"]) + P("Try <b>box breathing</b>: in for 4, hold 4, out 4, hold 4.") },
      { h: "Unhealthy coping and help", say: "Unhealthy coping, like isolating yourself or using alcohol, makes stress worse over time. If stress feels overwhelming, talk to a trusted adult, a school counsellor or a helpline.", html: chainRow(["Trusted adult", "Counsellor", "Clinic", "Helpline"]) + P("Asking for help is a <b>strength</b>.") }
    ],
    example: { q: "Andile has three assignments due and cannot sleep. What could help?", steps: ["Recognise the signs: poor sleep and worry.", "Make a plan: list tasks, set small daily goals.", "Look after himself: exercise, a regular bedtime, and talk to a teacher about deadlines."] },
    questions: [
      { type: "mcq", q: "Which is a sign of too much stress?", options: ["Trouble sleeping", "Feeling rested", "Good concentration", "Calm mood"], answer: 0, hints: ["Stress affects the body.", "Which is a problem?", "Trouble sleeping."], explain: "Poor sleep is a common sign of stress." },
      { type: "mcq", q: "Which is a healthy coping strategy?", options: ["Exercise", "Skipping meals", "Isolating yourself", "Staying up all night"], answer: 0, hints: ["Good for body and mind.", "Moving helps.", "Exercise."], explain: "Exercise reduces stress hormones." },
      { type: "mcq", q: "Can some stress be useful?", options: ["Yes, a little can help you focus", "No, never", "Only for adults", "Only at night"], answer: 0, hints: ["Think of before a race.", "It sharpens attention.", "Yes, a little."], explain: "Short-term stress can improve focus." },
      { type: "order", q: "Put box breathing in order.", items: ["Breathe in for 4", "Hold for 4", "Breathe out for 4", "Hold for 4"], orderLabel: "first to last", hints: ["Start by breathing in.", "Then hold.", "Then out, then hold."], explain: "In, hold, out, hold." },
      { type: "mcq", q: "Stress has felt overwhelming for weeks. What is the best step?", options: ["Talk to a counsellor or trusted adult", "Keep it to yourself", "Ignore it", "Drop all friends"], answer: 0, hints: ["You don't have to handle it alone.", "Professional support helps.", "Talk to someone."], explain: "Talking to a counsellor or trusted adult is the best step." }
    ],
    reflect: { q: "Which strategy will you try?", options: ["Exercise", "Box breathing", "Planning my tasks", "Talking to someone"] },
    parent: "Your child learned to recognise stress and practise healthy coping strategies.",
    teacher: "Shows identifying signs of stress, distinguishing healthy from unhealthy coping and knowing where to seek help.",
    done: "Notice stress early, use healthy strategies, and ask for help when it is too much." },

  { id: "g10-rights", grade: 10, subject: "Life Orientation", title: "Human rights in action", topic: "Democracy and human rights", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "CAPS Grade 10 Life Orientation: Democracy and human rights (human rights violations; discrimination; campaigns and organisations that protect human rights)",
    intention: "Today I am learning how human rights are protected and how to respond to violations.", prompt: "Which human rights issue do you care about most?",
    lesson: [
      { h: "Violations", say: "A human rights violation is when someone's rights are denied or abused. Examples are discrimination, gender-based violence, or a child being kept out of school.", html: chainRow(["Discrimination", "Violence", "Exclusion"]) + P("Violations can happen at home, school, work or online.") },
      { h: "Who protects rights", say: "In South Africa, the courts protect rights. So do the Chapter 9 institutions. These include the South African Human Rights Commission, the Commission for Gender Equality and the Public Protector.", html: chainRow(["Courts", "Human Rights Commission", "Gender Commission", "Public Protector"]) + P("Anyone can lodge a complaint with the <b>SAHRC</b>.") },
      { h: "Taking action", say: "You can respond in different ways. You can report it, or support the person affected. You can raise awareness with a campaign, or join an organisation that works on the issue.", html: chainRow(["Report", "Support", "Raise awareness", "Join"]) + P("A campaign needs a clear <b>goal</b>, <b>audience</b> and <b>message</b>.") }
    ],
    example: { q: "A learner is refused entry to a school activity because of their religion. What could be done?", steps: ["This is unfair discrimination, which violates the right to equality.", "The learner and family can raise it with the school and governing body.", "If not resolved, they can complain to the SAHRC."] },
    questions: [
      { type: "mcq", q: "Which is a human rights violation?", options: ["Refusing someone a job because of their race", "Choosing a sports team", "Wearing a uniform", "Doing homework"], answer: 0, hints: ["Unfair treatment.", "Because of who someone is.", "Race discrimination."], explain: "Refusing a job because of race is unfair discrimination." },
      { type: "mcq", q: "Which institution handles human rights complaints?", options: ["South African Human Rights Commission", "SARS", "The Post Office", "A bank"], answer: 0, hints: ["Its name says it.", "A Chapter 9 institution.", "SAHRC."], explain: "The SAHRC handles human rights complaints." },
      { type: "mcq", q: "What are Chapter 9 institutions?", options: ["Bodies that support democracy", "Shops", "Sports teams", "Schools"], answer: 0, hints: ["Named after a chapter of the Constitution.", "They protect democracy.", "Supporting democracy."], explain: "Chapter 9 institutions support constitutional democracy." },
      { type: "mcq", q: "What does a campaign need?", options: ["A clear goal, audience and message", "Only a logo", "Nothing", "Lots of money only"], answer: 0, hints: ["What do you want?", "Who should hear it?", "Goal, audience, message."], explain: "A clear goal, audience and message." },
      { type: "mcq", q: "You see someone being bullied online for their sexuality. What is a helpful response?", options: ["Support them and report the posts", "Share the posts", "Ignore it", "Join in"], answer: 0, hints: ["Stand with the person.", "Platforms can remove abuse.", "Support and report."], explain: "Supporting and reporting helps protect their rights." }
    ],
    reflect: { q: "How would you take action?", options: ["Report", "Support someone", "Run a campaign", "Join an organisation"] },
    parent: "Your child learned about human rights violations and how they are addressed in South Africa.",
    teacher: "Shows identifying violations, knowing Chapter 9 institutions and planning responses and campaigns.",
    done: "Human rights are protected by law and by people who take action." },

  { id: "g10-funding", grade: 10, subject: "Life Orientation", title: "Paying for further study", topic: "Careers and career choices: funding", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade 10 Life Orientation: Careers and career choices (options after school; financial aid, bursaries, scholarships and loans; requirements)",
    intention: "Today I am finding out how to pay for study after school.", prompt: "Which funding option might suit you?",
    lesson: [
      { h: "Options after school", say: "After matric there are many options. You can study at a university, a university of technology, a TVET college or a private college. You can do a learnership, or go into work or business.", html: chainRow(["University", "TVET college", "Learnership", "Work or business"]) },
      { h: "Funding options", say: "NSFAS offers bursaries to qualifying students at public universities and TVET colleges, based on household income. Companies, government departments and charities also offer bursaries and scholarships. Loans must be repaid.", html: chainRow(["NSFAS", "Bursaries", "Scholarships", "Student loans"]) + P("Learnerships let you <b>earn while you learn</b>.") },
      { h: "Plan early", say: "Applications often close in the year before you study, sometimes by September or earlier. Keep certified copies of your ID and results ready, and check the official websites.", html: chainRow(["Research", "Gather documents", "Apply early", "Follow up"]) + P("Beware of <b>scams</b>: you should never pay to apply for NSFAS.") }
    ],
    example: { q: "Thandeka wants to study nursing but her family cannot afford fees. What should she do?", steps: ["Check whether she qualifies for NSFAS.", "Look for health bursaries from provincial health departments and hospital groups.", "Apply early and keep copies of all documents."] },
    questions: [
      { type: "mcq", q: "What does NSFAS provide?", options: ["Financial aid for qualifying students", "Free cars", "Jobs only", "Private school fees"], answer: 0, hints: ["National Student Financial Aid Scheme.", "For study.", "Financial aid."], explain: "NSFAS funds qualifying students at public institutions." },
      { type: "mcq", q: "What is the difference between a bursary and a loan?", options: ["A loan must be paid back", "A bursary must be paid back with interest", "They are the same", "Loans are free"], answer: 0, hints: ["Which one do you owe?", "Loans are borrowed money.", "Loans must be repaid."], explain: "Loans must be repaid. Bursaries usually do not, though some require work-back." },
      { type: "mcq", q: "What is a learnership?", options: ["Earning while you learn in a workplace", "A type of loan", "A university degree", "A holiday"], answer: 0, hints: ["Work and study together.", "Often with a stipend.", "Earn while you learn."], explain: "A learnership combines workplace learning and study." },
      { type: "mcq", q: "Someone asks you to pay R500 to apply for NSFAS. What is it?", options: ["Probably a scam", "Normal", "Required", "A bursary"], answer: 0, hints: ["NSFAS applications are free.", "Paying is a warning sign.", "A scam."], explain: "NSFAS applications are free, so this is likely a scam." },
      { type: "mcq", q: "When should you start researching funding?", options: ["Early, in Grade 10 or 11", "After you finish studying", "Never", "The week classes start"], answer: 0, hints: ["Deadlines are early.", "Plan ahead.", "Grade 10 or 11."], explain: "Start early, because many deadlines fall in the year before study." }
    ],
    reflect: { q: "What will you do next?", options: ["Check NSFAS", "Look for bursaries", "Find learnerships", "Talk to my family"] },
    parent: "Your child learned about study options after school and ways to fund them, including NSFAS, bursaries and learnerships.",
    teacher: "Shows knowledge of post-school pathways, funding options, application timing and avoiding scams.",
    done: "Research funding early: NSFAS, bursaries, scholarships and learnerships." }
];
const WORDS_G10 = {
  "g10-exponents": { words: [["🔢", "Base", "the number being multiplied"], ["⬆️", "Exponent", "how many times the base is multiplied"]] },
  "g10-trig": { words: [["📐", "Hypotenuse", "the longest side, opposite the right angle"], ["↔️", "Adjacent", "the side next to the angle"], ["↕️", "Opposite", "the side across from the angle"]] },
  "g10-stats": { words: [["➗", "Mean", "the total divided by the number of values"], ["🎯", "Median", "the middle value in ordered data"], ["🚩", "Outlier", "a value far from the rest"]] },
  "g10-poetry": { words: [["↪️", "Enjambment", "a sentence running on past the end of a line"], ["🎭", "Personification", "giving human qualities to non-human things"], ["🚖", "Rank", "a place where taxis wait for passengers"]] },
  "g10-visual": { words: [["📢", "Slogan", "a short, memorable phrase"], ["🎯", "Target audience", "the people a text is aimed at"], ["🤡", "Caricature", "a drawing that exaggerates features"]] },
  "g10-essay": { words: [["🧭", "Topic sentence", "the sentence that gives a paragraph's main idea"], ["🔗", "Transition", "a word or phrase linking ideas"]] },
  "g10-mitosis": { words: [["🧬", "Chromosome", "a structure made of DNA"], ["➗", "Mitosis", "cell division that makes two identical cells"], ["🔄", "Interphase", "the stage when the cell grows and copies its DNA"]] },
  "g10-ecosystems": { words: [["🌿", "Biotic", "living"], ["🪨", "Abiotic", "non-living"], ["🪜", "Trophic level", "a feeding level in a food chain"]] },
  "g10-transport": { words: [["⬆️", "Xylem", "tubes that carry water up"], ["🍯", "Phloem", "tubes that carry food"], ["💨", "Transpiration", "water loss from leaves"]] },
  "g10-stress": { words: [["🧠", "Stress", "the body's response to pressure"], ["🧰", "Coping", "dealing with a difficulty"]] },
  "g10-rights": { words: [["⚖️", "Violation", "when a right is denied or abused"], ["🏛️", "SAHRC", "South African Human Rights Commission"]] },
  "g10-funding": { words: [["🎓", "Bursary", "money for study that usually does not have to be paid back"], ["🏦", "NSFAS", "National Student Financial Aid Scheme"], ["🛠️", "Learnership", "earning while you learn in a workplace"]] }
};
Object.assign(WORDS, WORDS_G10);
