"use strict";

// ---------- Learn units: Grade 11 (CAPS FET). Original content. ----------
const DRAMA_G11 = `<div class="passage-text"><p><b>The Inheritance</b> <span class="muted">(a 2to.iQ drama extract)</span></p>
<p><i>(A small kitchen in Gqeberha. MANDLA, 17, sits at the table with an envelope. His older sister, ZODWA, enters with shopping bags.)</i></p>
<p><b>ZODWA:</b> You opened it.</p>
<p><b>MANDLA:</b> <i>(not looking up)</i> It's addressed to both of us.</p>
<p><b>ZODWA:</b> And? What did Tata leave us? His debts?</p>
<p><b>MANDLA:</b> The house. And a letter. He says he's sorry.</p>
<p><i>(Silence. ZODWA puts the bags down slowly.)</i></p>
<p><b>ZODWA:</b> Sorry. Twelve years, and he's sorry. <i>(She laughs, but it cracks.)</i> Read it to me.</p>
<p><b>MANDLA:</b> <i>(aside)</i> If I read her the last line, she'll never forgive him. If I don't, she'll never forgive me.</p></div>`;
const UNITS_G11 = [
  // ===================== GRADE 11 MATHEMATICS =====================
  { id: "g11-quadratics", grade: 11, subject: "Mathematics", title: "Solving quadratic equations", topic: "Equations and inequalities", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 11 Mathematics, Term 1: Equations and inequalities (solve quadratic equations by factorisation and the quadratic formula; nature of roots)",
    intention: "Today I am solving quadratic equations by factorising and with the formula.", prompt: "How do you choose between factorising and the formula?",
    lesson: [
      { h: "Standard form", say: "A quadratic equation can be written as a x squared plus b x plus c equals zero. Always get it into this form first.", html: chainRow(["ax² + bx + c = 0"]) + P("Move every term to one side so the other side is <b>zero</b>.") },
      { h: "Factorising", say: "If x squared minus five x plus six equals zero, factorise to x minus two times x minus three equals zero. So x equals two or x equals three.", html: chainRow(["x² − 5x + 6 = 0", "(x − 2)(x − 3) = 0", "x = 2 or x = 3"]) + P("If a product is zero, one of the factors must be <b>zero</b>.") },
      { h: "The quadratic formula", say: "When it will not factorise easily, use the formula: x equals negative b, plus or minus the square root of b squared minus four a c, all over two a.", html: chainRow(["x = (−b ± √(b² − 4ac)) / 2a"]) + P("b² − 4ac is the <b>discriminant</b>. If it is negative, there are no real roots.") }
    ],
    example: { q: "Solve x² + 2x − 15 = 0.", steps: ["Find two numbers that multiply to −15 and add to 2: 5 and −3.", "(x + 5)(x − 3) = 0.", "x = −5 or x = 3."] },
    questions: [
      { type: "mcq", q: "Solve: x² − 9x + 20 = 0", options: ["x = 4 or x = 5", "x = −4 or x = −5", "x = 2 or x = 10", "x = 9 or x = 20"], answer: 0, hints: ["Multiply to 20, add to −9.", "−4 and −5.", "(x − 4)(x − 5) = 0."], explain: "x = 4 or x = 5." },
      { type: "mcq", q: "Solve: x² = 49", options: ["x = 7 or x = −7", "x = 7 only", "x = 24,5", "x = 49"], answer: 0, hints: ["Two numbers square to 49.", "Positive and negative.", "±7."], explain: "x = ±7." },
      { type: "mcq", q: "What is the discriminant of x² + 4x + 5 = 0?", options: ["−4", "36", "4", "−16"], answer: 0, hints: ["b² − 4ac.", "16 − 20.", "−4."], explain: "16 − 4(1)(5) = −4." },
      { type: "mcq", q: "What does a negative discriminant tell you?", options: ["No real roots", "Two equal roots", "Two real roots", "One root is zero"], answer: 0, hints: ["You'd take the square root of a negative.", "Not possible with real numbers.", "No real roots."], explain: "A negative discriminant means no real roots." },
      { type: "mcq", q: "Solve: 2x² − 8x = 0", options: ["x = 0 or x = 4", "x = 4 only", "x = 2 or x = 8", "x = −4"], answer: 0, hints: ["Common factor: 2x.", "2x(x − 4) = 0.", "x = 0 or x = 4."], explain: "x = 0 or x = 4." }
    ],
    reflect: { q: "What helped you most?", options: ["Writing in standard form", "Finding factor pairs", "Using the formula", "Not sure"] },
    parent: "Your child solved quadratic equations by factorising and using the quadratic formula.",
    teacher: "Shows solving quadratics by factorisation and formula, and interpreting the discriminant.",
    done: "Set the equation to zero, then factorise or use the formula." },

  { id: "g11-depreciation", grade: 11, subject: "Mathematics", title: "Growth and decay", topic: "Finance: depreciation and compound growth", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 11 Mathematics, Term 4: Finance, growth and decay (simple and compound decay; straight-line and reducing-balance depreciation; nominal and effective rates)",
    intention: "Today I am calculating how value grows and falls over time.", prompt: "Why do cars lose value faster in the first years?",
    lesson: [
      { h: "Compound growth", say: "With compound growth, A equals P times one plus i, to the power n. P is the starting amount, i is the rate as a decimal, and n is the number of periods.", html: chainRow(["A = P(1 + i)ⁿ"]) + P("Savings and populations can grow this way.") },
      { h: "Straight-line depreciation", say: "In straight-line depreciation, the value drops by the same amount each year. A equals P times one minus i n.", html: chainRow(["A = P(1 − in)"]) + P("A R100 000 machine losing 10% a year: R10 000 every year.") },
      { h: "Reducing-balance depreciation", say: "In reducing-balance depreciation, the value drops by a percentage of what is left. A equals P times one minus i, to the power n. Cars often lose value this way.", html: chainRow(["A = P(1 − i)ⁿ"]) + P("The amount lost gets <b>smaller</b> each year.") }
    ],
    example: { q: "A R200 000 car depreciates at 15% per year, reducing balance. What is it worth after 2 years?", steps: ["A = 200 000 (1 − 0,15)².", "= 200 000 × 0,7225.", "= R144 500."] },
    questions: [
      { type: "mcq", q: "Which formula is reducing-balance depreciation?", options: ["A = P(1 − i)ⁿ", "A = P(1 + i)ⁿ", "A = P(1 − in)", "A = P(1 + in)"], answer: 0, hints: ["Depreciation means minus.", "Reducing balance compounds.", "Power n."], explain: "A = P(1 − i)ⁿ." },
      { type: "num", q: "R10 000 machine, straight-line depreciation at 10% per year. Value after 3 years?", answer: "R7 000", options: ["R7 000", "R7 290", "R13 000", "R9 700"], hints: ["Loses R1 000 each year.", "3 years.", "R10 000 − R3 000."], explain: "A = 10 000(1 − 0,1 × 3) = R7 000." },
      { type: "num", q: "R5 000 grows at 10% compound per year. Value after 2 years?", answer: "R6 050", options: ["R6 050", "R6 000", "R5 500", "R6 100"], hints: ["A = 5 000(1,1)².", "1,1² = 1,21.", "5 000 × 1,21."], explain: "R6 050." },
      { type: "mcq", q: "Why does reducing-balance lose less each year?", options: ["The percentage is taken from a smaller value", "The rate drops", "It does not", "Inflation"], answer: 0, hints: ["The rate stays the same.", "But what is it a percentage of?", "A smaller value."], explain: "The same percentage of a smaller value is a smaller amount." },
      { type: "mcq", q: "Which is an example of decay?", options: ["A phone losing value", "Savings earning interest", "A growing population", "Salary increases"], answer: 0, hints: ["Decay means decreasing.", "Losing value.", "A phone."], explain: "A phone losing value is decay." }
    ],
    reflect: { q: "What helped you most?", options: ["Matching formulas to situations", "Working year by year", "Real examples like cars", "Not sure"] },
    parent: "Your child calculated compound growth and straight-line and reducing-balance depreciation.",
    teacher: "Shows selecting and applying growth and decay formulas in financial contexts.",
    done: "Growth adds a percentage; depreciation removes one, straight-line or reducing-balance." },

  { id: "g11-circles", grade: 11, subject: "Mathematics", title: "Circle geometry", topic: "Euclidean geometry: circle theorems", domain: "Logical and Analytical Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 11 Mathematics, Term 3: Euclidean geometry (circle theorems: perpendicular from centre bisects chord; angle at centre; angles in the same segment; cyclic quadrilaterals; tangents)",
    intention: "Today I am using circle theorems to find unknown angles.", prompt: "Which theorem do you find easiest to spot in a diagram?",
    lesson: [
      { h: "Angle at the centre", say: "The angle at the centre of a circle is double the angle at the circumference, when both stand on the same arc.", html: chainRow(["∠ centre = 2 × ∠ circumference"]) + P("If the angle at the circumference is 40°, the angle at the centre is <b>80°</b>.") },
      { h: "Angles in a semicircle and same segment", say: "The angle in a semicircle is ninety degrees. Angles in the same segment, standing on the same chord, are equal.", html: chainRow(["∠ in semicircle = 90°", "∠s in same segment are equal"]) },
      { h: "Cyclic quadrilaterals and tangents", say: "In a cyclic quadrilateral, opposite angles add up to one hundred and eighty degrees. A tangent is perpendicular to the radius at the point of contact.", html: chainRow(["Opposite ∠s of cyclic quad = 180°", "Tangent ⊥ radius"]) + P("Always give the <b>reason</b> for each step.") }
    ],
    example: { q: "In a cyclic quadrilateral, one angle is 75°. What is the opposite angle?", steps: ["Opposite angles of a cyclic quadrilateral are supplementary.", "180° − 75°.", "105°."] },
    questions: [
      { type: "num", q: "The angle at the circumference is 35°. What is the angle at the centre on the same arc?", answer: "70", options: ["70", "35", "145", "17,5"], hints: ["Centre is double.", "2 × 35.", "70°."], explain: "70°." },
      { type: "mcq", q: "What is the angle in a semicircle?", options: ["90°", "180°", "45°", "60°"], answer: 0, hints: ["The chord is a diameter.", "A right angle.", "90°."], explain: "The angle in a semicircle is 90°." },
      { type: "num", q: "In a cyclic quadrilateral, one angle is 112°. Find the opposite angle.", answer: "68", options: ["68", "112", "248", "90"], hints: ["Opposite angles add to 180°.", "180 − 112.", "68°."], explain: "68°." },
      { type: "mcq", q: "What angle does a tangent make with the radius at the point of contact?", options: ["90°", "45°", "180°", "60°"], answer: 0, hints: ["Perpendicular.", "Right angle.", "90°."], explain: "A tangent is perpendicular to the radius." },
      { type: "mcq", q: "Two angles stand on the same chord in the same segment. One is 50°. The other is …", options: ["50°", "100°", "130°", "25°"], answer: 0, hints: ["Angles in the same segment.", "They are equal.", "50°."], explain: "Angles in the same segment are equal." }
    ],
    reflect: { q: "What helped you most?", options: ["Marking the diagram", "Learning the theorems", "Writing reasons", "Not sure"] },
    parent: "Your child used circle theorems to find unknown angles.",
    teacher: "Shows applying circle theorems with reasons: angle at centre, semicircle, same segment, cyclic quadrilateral, tangent-radius.",
    done: "Spot the theorem in the diagram, apply it, and give the reason." },

  // ===================== GRADE 11 MATHEMATICAL LITERACY =====================
  { id: "g11-ml-interest", grade: 11, subject: "Mathematical Literacy", title: "Interest, loans and inflation", topic: "Finance: interest", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 11 Mathematical Literacy: Finance (simple and compound interest; loans and investments; the effect of inflation)",
    intention: "Today I am working out interest and the real cost of borrowing.", prompt: "Why might a shop offer to let you pay later?",
    lesson: [
      { h: "Simple interest", say: "Simple interest is worked out on the starting amount only. R1 000 at 10 percent a year earns R100 every year.", html: chainRow(["R1 000", "R1 100", "R1 200", "R1 300"]) + P("Simple interest: the same <b>R100</b> every year.") },
      { h: "Compound interest", say: "With compound interest, each year's interest is added on, so next year you also earn interest on the interest.", html: chainRow(["R1 000", "R1 100", "R1 210", "R1 331"]) + P("10% compound for 3 years: <b>R1 331</b>.") },
      { h: "Borrowing costs more", say: "When you borrow, interest works against you. Store cards and short-term loans often charge high interest, so you can pay back much more than you borrowed. Inflation means prices rise over time, so money buys less.", html: P("Compare the <b>total cost</b> of a loan, not only the monthly payment.") }
    ],
    example: { q: "You invest R5 000 at 8% simple interest per year. How much do you have after 3 years?", steps: ["Interest per year: 8% of 5 000 = R400.", "For 3 years: 400 × 3 = R1 200.", "Total: 5 000 + 1 200 = R6 200."] },
    questions: [
      { type: "num", q: "R2 000 earns 5% simple interest per year. How much interest is earned after 4 years, in rand?", answer: "400", options: ["400", "100", "2 400", "500"], hints: ["5% of 2 000 = R100 a year.", "For 4 years.", "100 × 4."], explain: "R100 a year × 4 years = R400." },
      { type: "num", q: "R1 000 earns 10% compound interest per year. How much is there after 2 years, in rand?", answer: "1 210", options: ["1 210", "1 200", "1 100", "1 331"], hints: ["After 1 year: R1 100.", "Year 2: 10% of 1 100 = R110.", "1 100 + 110."], explain: "1 000 → 1 100 → 1 210." },
      { type: "mcq", q: "Why does compound interest grow faster than simple interest?", options: ["You earn interest on earlier interest too", "The rate is always higher", "The bank adds a bonus", "It is paid every day"], answer: 0, hints: ["What is the interest worked out on?", "The amount keeps growing.", "Interest on interest."], explain: "Each year's interest is added, so it earns interest too." },
      { type: "mcq", q: "Inflation is 5% a year. A loaf of bread costs R20 now. About how much will it cost in a year?", options: ["R21", "R25", "R20,05", "R15"], answer: 0, hints: ["Find 5% of R20.", "That is R1.", "20 + 1."], explain: "5% of R20 = R1, so about R21." },
      { type: "mcq", q: "Two loans of R10 000. Loan A: R950 a month for 12 months. Loan B: R620 a month for 24 months. Which costs less in total?", options: ["Loan A", "Loan B", "They cost the same", "You can't tell"], answer: 0, hints: ["Work out each total.", "A: 950 × 12 = R11 400.", "B: 620 × 24 = R14 880."], explain: "Loan A costs R11 400 in total; Loan B costs R14 880. The smaller monthly payment costs more overall." }
    ],
    reflect: { q: "What helped you most?", options: ["Seeing the amounts year by year", "Working out the total cost", "The worked example", "Not sure"] },
    parent: "Your child compared simple and compound interest, and the real cost of loans.",
    teacher: "Shows calculating simple and compound interest, interpreting inflation, and comparing the total cost of credit.",
    done: "Compound interest grows on itself. Always compare the total cost of a loan." },

  { id: "g11-ml-measure", grade: 11, subject: "Mathematical Literacy", title: "Fencing, tiling and tanks", topic: "Measurement: perimeter, area and volume", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "CAPS Grade 11 Mathematical Literacy: Measurement (perimeter, area and volume of rectangles, circles, rectangular prisms and cylinders; using given formulas in real contexts)",
    intention: "Today I am using perimeter, area and volume for real jobs.", prompt: "Which job at home needs measuring first?",
    lesson: [
      { h: "Perimeter and area", say: "Perimeter is the distance around a shape, like fencing a garden. Area is the space inside, like tiles for a floor. Area is measured in square units.", html: chainRow(["Perimeter: around (m)", "Area: inside (m²)"]) + P("Rectangle: perimeter = 2 × (l + b), area = l × b") },
      { h: "Circles", say: "For a circle, the circumference is pi times the diameter, and the area is pi times the radius squared. Use 3.14 for pi.", html: chainRow(["C = π × d", "A = π × r²", "π ≈ 3,14"]) },
      { h: "Volume", say: "Volume is the space a container holds. For a box, multiply length by breadth by height. For a cylinder, multiply the area of the circle by the height. One cubic metre holds 1 000 litres.", html: chainRow(["Box: l × b × h", "Cylinder: π × r² × h", "1 m³ = 1 000 ℓ"]) }
    ],
    example: { q: "A water tank is a cylinder with radius 1 m and height 2 m. How many litres does it hold? Use π = 3,14.", steps: ["Volume = 3,14 × 1² × 2 = 6,28 m³.", "1 m³ = 1 000 litres.", "6,28 × 1 000 = 6 280 litres."] },
    questions: [
      { type: "num", q: "A room is 4 m by 3 m. What is its floor area, in m²?", answer: "12", options: ["12", "14", "7", "24"], hints: ["Area = length × breadth.", "4 × 3.", "12."], explain: "4 × 3 = 12 m²." },
      { type: "num", q: "How many metres of fencing go around a garden 8 m by 5 m?", answer: "26", options: ["26", "40", "13", "21"], hints: ["Perimeter = 2 × (l + b).", "8 + 5 = 13.", "2 × 13."], explain: "2 × (8 + 5) = 26 m." },
      { type: "num", q: "Find the area of a circle with radius 10 cm, in cm². Use π = 3,14.", answer: "314", options: ["314", "31,4", "62,8", "628"], hints: ["A = π × r².", "10² = 100.", "3,14 × 100."], explain: "3,14 × 100 = 314 cm²." },
      { type: "num", q: "A box is 50 cm long, 20 cm wide and 10 cm high. What is its volume, in cm³?", answer: "10 000", options: ["10 000", "80", "1 000", "100 000"], hints: ["Volume = l × b × h.", "50 × 20 = 1 000.", "1 000 × 10."], explain: "50 × 20 × 10 = 10 000 cm³." },
      { type: "mcq", q: "You want to tile a floor. What do you need to work out?", options: ["The area", "The perimeter", "The volume", "The diameter"], answer: 0, hints: ["Tiles cover the space inside.", "Inside = area.", "Area."], explain: "Tiles cover the area of the floor." }
    ],
    reflect: { q: "What helped you most?", options: ["Knowing which measurement the job needs", "Using the formulas", "Converting m³ to litres", "Not sure"] },
    parent: "Your child worked out perimeter, area and volume for real jobs like fencing, tiling and water tanks.",
    teacher: "Shows selecting and using given formulas for perimeter, area and volume, and converting between cubic metres and litres.",
    done: "Around: perimeter. Inside: area. What it holds: volume." },

  { id: "g11-ml-plans", grade: 11, subject: "Mathematical Literacy", title: "Floor plans and travel time", topic: "Maps, plans and other representations", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade 11 Mathematical Literacy: Maps, plans and other representations (floor plans and symbols; scale calculations; planning routes; distance, speed and time)",
    intention: "Today I am reading floor plans and working out travel times.", prompt: "How do you decide when to leave for a trip?",
    lesson: [
      { h: "Reading a floor plan", say: "A floor plan shows a building from above. It uses symbols for doors, windows and walls, and has a scale so you can work out real sizes.", html: P("A door is often drawn as a line with a quarter circle, showing which way it opens.") },
      { h: "Scale on plans", say: "On a plan with a scale of 1 to 100, 1 centimetre on paper is 1 metre in real life. Measure on the plan, then multiply.", html: chainRow(["1 : 100", "1 cm on paper", "= 1 m real"]) },
      { h: "Distance, speed and time", say: "Distance equals speed times time. A taxi travelling at 60 kilometres per hour for 2 hours covers 120 kilometres. Time equals distance divided by speed.", html: chainRow(["D = S × T", "T = D ÷ S", "S = D ÷ T"]) + P("0,5 hours = 30 minutes; 0,25 hours = 15 minutes.") }
    ],
    example: { q: "A route on a map is 90 km. A bus averages 60 km/h. How long does the trip take?", steps: ["Time = distance ÷ speed.", "90 ÷ 60 = 1,5 hours.", "1,5 hours = 1 hour 30 minutes."] },
    questions: [
      { type: "num", q: "Scale 1 : 100. A bedroom is 3,5 cm long on the plan. How long is it really, in metres?", answer: "3,5", options: ["3,5", "35", "350", "0,35"], hints: ["3,5 × 100 = 350 cm.", "100 cm = 1 m.", "350 ÷ 100."], explain: "350 cm = 3,5 m." },
      { type: "num", q: "A car travels at 80 km/h for 3 hours. How far does it go, in km?", answer: "240", options: ["240", "83", "26,7", "160"], hints: ["Distance = speed × time.", "80 × 3.", "240."], explain: "80 × 3 = 240 km." },
      { type: "mcq", q: "A trip is 150 km at 100 km/h. How long does it take?", options: ["1 hour 30 minutes", "1 hour 50 minutes", "2 hours 30 minutes", "15 minutes"], answer: 0, hints: ["Time = distance ÷ speed.", "150 ÷ 100 = 1,5 hours.", "0,5 hours = 30 minutes."], explain: "1,5 hours = 1 hour 30 minutes, not 1 hour 50 minutes." },
      { type: "mcq", q: "What does a floor plan show?", options: ["A building seen from above", "The front of a building", "Only the roof", "A map of the town"], answer: 0, hints: ["Think of looking down.", "Without the roof.", "From above."], explain: "A floor plan is a view from above, showing the rooms." },
      { type: "mcq", q: "A learner says 0,25 hours is 25 minutes. Is that right?", options: ["No, it is 15 minutes", "Yes", "No, it is 2,5 minutes", "No, it is 40 minutes"], answer: 0, hints: ["An hour has 60 minutes, not 100.", "0,25 is a quarter.", "A quarter of 60."], explain: "0,25 × 60 = 15 minutes." }
    ],
    reflect: { q: "What helped you most?", options: ["Multiplying by the scale", "The D = S × T triangle", "Changing hours to minutes", "Not sure"] },
    parent: "Your child read floor plans and worked out real sizes and travel times.",
    teacher: "Shows interpreting floor plans and symbols, applying scale, and using distance, speed and time, including converting decimal hours.",
    done: "Use the scale for real sizes, and D = S × T for trips. An hour has 60 minutes." },

  { id: "g11-ml-graphs", grade: 11, subject: "Mathematical Literacy", title: "Graphs that tell the truth", topic: "Data handling: graphs", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "CAPS Grade 11 Mathematical Literacy: Data handling (bar graphs, pie charts and line graphs; choosing a suitable graph; recognising misleading graphs)",
    intention: "Today I am choosing the right graph and spotting misleading ones.", prompt: "Have you seen a graph in an advert? Did you trust it?",
    lesson: [
      { h: "Choosing a graph", say: "Use a bar graph to compare groups, a pie chart to show parts of a whole, and a line graph to show change over time.", html: chainRow(["Compare groups: bar", "Parts of a whole: pie", "Change over time: line"]) },
      { h: "Pie charts", say: "A whole pie is 360 degrees, or 100 percent. If 25 percent of a budget goes on food, its slice is a quarter of the circle, 90 degrees.", html: chainRow(["100% = 360°", "25% = 90°", "1% = 3,6°"]) },
      { h: "Misleading graphs", say: "A graph can mislead if the vertical axis does not start at zero, if the scale jumps, or if pictures are stretched. Always read the numbers, not only the shape.", html: P("A small rise looks huge when the axis starts at 95 instead of 0.") }
    ],
    example: { q: "A household spends R3 000 of its R12 000 income on rent. How many degrees is the rent slice in a pie chart?", steps: ["Fraction: 3 000 ÷ 12 000 = 1/4.", "1/4 of 360° = 90°.", "The rent slice is 90°, a quarter of the circle."] },
    questions: [
      { type: "mcq", q: "Which graph best shows how the price of petrol changed over 12 months?", options: ["A line graph", "A pie chart", "A tally", "A map"], answer: 0, hints: ["The question is about change over time.", "Which graph shows time?", "A line graph."], explain: "Line graphs show change over time." },
      { type: "mcq", q: "Which graph best shows how a budget is split between food, rent and transport?", options: ["A pie chart", "A line graph", "A grid map", "A number line"], answer: 0, hints: ["The parts make up one whole budget.", "Parts of a whole.", "A pie chart."], explain: "A pie chart shows parts of a whole." },
      { type: "num", q: "In a pie chart, a slice is 50% of the whole. How many degrees is it?", answer: "180", options: ["180", "50", "90", "360"], hints: ["The whole is 360°.", "50% is half.", "Half of 360."], explain: "Half of 360° = 180°." },
      { type: "mcq", q: "A bar graph of sales starts its vertical axis at 950 instead of 0. What is the danger?", options: ["Small differences look much bigger", "The graph becomes more accurate", "Nothing, it is the same", "The bars become shorter"], answer: 0, hints: ["The bottoms of the bars are cut off.", "What happens to differences between bars?", "They look bigger."], explain: "Cutting off the axis makes small differences look large." },
      { type: "num", q: "A slice of a pie chart is 72°. What percentage of the whole is that? (Type the number only.)", answer: "20", options: ["20", "72", "36", "25"], hints: ["Percentage = degrees ÷ 360 × 100.", "72 ÷ 360 = 0,2.", "0,2 = 20%."], explain: "72 ÷ 360 = 0,2 = 20%." }
    ],
    reflect: { q: "What helped you most?", options: ["Matching the graph to the question", "Working with 360°", "Checking where the axis starts", "Not sure"] },
    parent: "Your child chose suitable graphs and spotted ways that graphs can mislead.",
    teacher: "Shows selecting appropriate representations, calculating pie chart angles, and critically evaluating misleading graphs.",
    done: "Choose the graph that fits the question, and always check the axis." },

  { id: "g11-ml-risk", grade: 11, subject: "Mathematical Literacy", title: "Comparing risks", topic: "Probability: two-way tables", domain: "Logical and Analytical Thinking", category: "Flexible Thinking",
    caps: "CAPS Grade 11 Mathematical Literacy: Probability (two-way tables; tree diagrams for two events; interpreting risk in health, games and insurance)",
    intention: "Today I am comparing risks fairly, using tables and tree diagrams.", prompt: "How do people decide whether something is risky?",
    lesson: [
      { h: "Two-way tables", say: "A two-way table sorts data by two things at once, for example whether people were vaccinated, and whether they got flu. Of 200 vaccinated people, 10 got flu. Of 200 unvaccinated people, 40 got flu.", html: P("Vaccinated: <b>10</b> of 200 got flu.") + P("Not vaccinated: <b>40</b> of 200 got flu.") },
      { h: "Comparing risk", say: "To compare groups fairly, compare probabilities, not only counts. 10 out of 200 is 5 percent. 40 out of 200 is 20 percent. The unvaccinated group had four times the risk.", html: chainRow(["10 ÷ 200 = 5%", "40 ÷ 200 = 20%"]) + P("Percentages let you compare groups of <b>different sizes</b> too.") },
      { h: "Tree diagrams", say: "A tree diagram lists every outcome of two events. Tossing two coins gives four outcomes: heads heads, heads tails, tails heads and tails tails. The chance of two heads is 1 out of 4.", html: chainRow(["HH", "HT", "TH", "TT"]) + P("P(two heads) = <b>1/4</b>") }
    ],
    example: { q: "Of all 400 people above, 10 + 40 got flu. What is the probability that a person picked at random got flu?", steps: ["People who got flu: 10 + 40 = 50.", "Total people: 400.", "50 ÷ 400 = 1/8 = 12,5%."] },
    questions: [
      { type: "num", q: "200 vaccinated people: 10 got flu. What percentage got flu? (Type the number only.)", answer: "5", options: ["5", "10", "20", "50"], hints: ["10 ÷ 200.", "= 0,05.", "0,05 = 5%."], explain: "10 ÷ 200 = 0,05 = 5%." },
      { type: "num", q: "200 unvaccinated people: 40 got flu. What percentage got flu? (Type the number only.)", answer: "20", options: ["20", "40", "4", "80"], hints: ["40 ÷ 200.", "= 0,2.", "0,2 = 20%."], explain: "40 ÷ 200 = 0,2 = 20%." },
      { type: "mcq", q: "From these results, which group had the higher risk of flu?", options: ["The unvaccinated group", "The vaccinated group", "Both the same", "You can't tell"], answer: 0, hints: ["Compare 5% and 20%.", "Which is higher?", "20%."], explain: "20% is higher than 5%." },
      { type: "mcq", q: "Two coins are tossed. What is the probability of getting one head and one tail?", options: ["1/2", "1/4", "1/3", "3/4"], answer: 0, hints: ["List the outcomes: HH, HT, TH, TT.", "HT and TH both work.", "2 out of 4."], explain: "HT and TH: 2 out of 4 = 1/2." },
      { type: "mcq", q: "Why compare percentages instead of counts?", options: ["The groups may be different sizes", "Percentages are always bigger", "Counts are never correct", "It is the law"], answer: 0, hints: ["Imagine 10 sick out of 50, and 20 sick out of 1 000.", "Which group is worse off?", "Size matters."], explain: "Percentages make groups of different sizes comparable." }
    ],
    reflect: { q: "What helped you most?", options: ["Reading the table row by row", "Changing counts to percentages", "Listing outcomes in a tree", "Not sure"] },
    parent: "Your child used two-way tables and tree diagrams to compare risks fairly.",
    teacher: "Shows reading two-way tables, comparing relative risk using percentages, and listing outcomes with tree diagrams.",
    done: "Compare risks with percentages, and list every outcome before you count." },

  // ===================== GRADE 11 ENGLISH HOME LANGUAGE =====================
  { id: "g11-drama", grade: 11, subject: "English Home Language", title: "Drama: The Inheritance", topic: "Dramatic techniques", domain: "Communication and Expression", category: "Reflection",
    caps: "CAPS Grade 11 English Home Language: Literature (drama: stage directions, dialogue, aside, dramatic irony, tension, characterisation; contextual questions)",
    intention: "Today I am analysing how a playwright builds tension and character.", prompt: "Should Mandla read the last line? Why?",
    passage: DRAMA_G11,
    lesson: [
      { h: "Read the extract", say: "Read the extract, or press Read aloud to hear it part by part.", html: DRAMA_G11 },
      { h: "Stage directions", say: "Stage directions, in italics and brackets, tell actors how to move and speak. Not looking up shows Mandla avoiding his sister. She laughs, but it cracks shows hidden pain.", html: P("<i>(not looking up)</i> → avoidance") + P("<i>(She laughs, but it cracks.)</i> → hidden pain") },
      { h: "Aside and dramatic irony", say: "An aside is spoken to the audience, and other characters cannot hear it. Mandla's aside creates dramatic irony: we know there is a painful last line, but Zodwa does not.", html: chainRow(["Aside: to the audience", "Dramatic irony: we know more than a character"]) + P("This creates <b>tension</b>.") }
    ],
    example: { q: "What does Zodwa's question His debts? reveal about her?", steps: ["She expects the worst from her father.", "Her tone is bitter and sarcastic.", "She has been hurt by him and does not trust him."] },
    questions: [
      { type: "mcq", q: "What is an aside?", options: ["Words spoken to the audience that other characters do not hear", "A stage direction", "A long speech to another character", "A song"], answer: 0, hints: ["Mandla says something only we hear.", "Directly to the audience.", "An aside."], explain: "An aside is heard by the audience, not by other characters." },
      { type: "mcq", q: "What creates dramatic irony in this extract?", options: ["We know about the last line, but Zodwa does not", "Zodwa carries shopping", "The kitchen is small", "Mandla is 17"], answer: 0, hints: ["Who knows more?", "The audience heard the aside.", "The last line."], explain: "The audience knows something Zodwa does not." },
      { type: "mcq", q: "What does Twelve years, and he's sorry suggest?", options: ["The father has been absent for a long time", "He was away on holiday", "He visited often", "Zodwa is twelve"], answer: 0, hints: ["Twelve years of what?", "Absence.", "A long absence."], explain: "It suggests the father was absent for twelve years." },
      { type: "mcq", q: "What is the mood at the end of the extract?", options: ["Tense", "Joyful", "Calm", "Funny"], answer: 0, hints: ["Silence. A dilemma.", "Something unresolved.", "Tense."], explain: "The unresolved dilemma creates tension." },
      { type: "mcq", q: "Why does ZODWA put the bags down slowly?", options: ["To show she is shocked", "Because they are heavy", "Because she is tired", "To start cooking"], answer: 0, hints: ["It follows Silence.", "A physical reaction to news.", "Shock."], explain: "The slow movement shows shock at the news." }
    ],
    reflect: { q: "How did you analyse the extract?", options: ["Reading the stage directions", "Focusing on the aside", "Imagining it on stage", "Not sure"] },
    parent: "Your child analysed a drama extract for stage directions, an aside and dramatic irony.",
    teacher: "Shows interpreting stage directions, characterisation, aside and dramatic irony, and their effect on tension.",
    done: "Stage directions, asides and dramatic irony build character and tension." },

  { id: "g11-transactional", grade: 11, subject: "English Home Language", title: "CV and covering letter", topic: "Transactional writing", domain: "Communication and Expression", category: "Planning and Organisation",
    caps: "CAPS Grade 11 English Home Language: Writing and Presenting (transactional texts: CV, covering letter, formal letter; register and format)",
    intention: "Today I am learning to write a clear CV and covering letter.", prompt: "What would you put in your own CV right now?",
    lesson: [
      { h: "The CV", say: "A CV is a short summary of you: contact details, a short profile, education, skills, experience, achievements and references. Keep it to one or two pages.", html: chainRow(["Contact", "Profile", "Education", "Skills", "Experience", "References"]) + P("Volunteering and school leadership count as <b>experience</b>.") },
      { h: "The covering letter", say: "A covering letter introduces you for a specific job. Say which job you are applying for, why you are suitable, and ask for an interview. Use a formal register.", html: chainRow(["Address and date", "Greeting", "Why this job", "Why me", "Closing"]) + P("Tailor it to <b>each</b> job.") },
      { h: "Register and checking", say: "Use formal language, no slang, and a professional email address. Check spelling twice and ask someone to read it.", html: chainRow(["Formal", "Clear", "Checked"]) + P("A single spelling mistake can lose you an interview.") }
    ],
    example: { q: "Which email address is best for a CV: coolkid2000@mail.com or n.dlamini@mail.com?", steps: ["A CV needs to look professional.", "Nicknames look informal.", "n.dlamini@mail.com is better."] },
    questions: [
      { type: "mcq", q: "How long should a school-leaver's CV usually be?", options: ["One or two pages", "Ten pages", "One line", "As long as possible"], answer: 0, hints: ["Employers skim quickly.", "Short and focused.", "One or two pages."], explain: "One or two pages is best." },
      { type: "mcq", q: "Which belongs in a covering letter?", options: ["Why you are suitable for this job", "Your favourite food", "Jokes", "Your full school timetable"], answer: 0, hints: ["It's about the job.", "Persuade the employer.", "Why you are suitable."], explain: "Explain why you suit the specific job." },
      { type: "mcq", q: "Which sentence suits a covering letter?", options: ["I am writing to apply for the position of junior administrator.", "Hey, I want the job.", "Yo, check my CV.", "Give me a call, bro."], answer: 0, hints: ["Formal register.", "No slang.", "The first one."], explain: "It is formal and clear." },
      { type: "mcq", q: "Which counts as experience on a CV?", options: ["Volunteering at a community garden", "Watching TV", "Sleeping late", "Nothing outside paid work"], answer: 0, hints: ["Shows skills and responsibility.", "Unpaid work counts.", "Volunteering."], explain: "Volunteering shows skills and reliability." },
      { type: "order", q: "Put the covering letter in order.", items: ["Your address and the date", "Greeting", "Which job you are applying for", "Why you are suitable", "Closing and signature"], orderLabel: "top to bottom", hints: ["Addresses first.", "Then greet.", "Close at the end."], explain: "Address and date, greeting, the job, why you suit it, closing." }
    ],
    reflect: { q: "What will you add to your CV?", options: ["Volunteering", "Leadership roles", "Skills", "Achievements"] },
    parent: "Your child learned to write a CV and a covering letter.",
    teacher: "Shows knowledge of CV structure, covering letter format and formal register.",
    done: "Keep your CV short and clear, and tailor each covering letter." },

  { id: "g11-critical", grade: 11, subject: "English Home Language", title: "Critical language awareness", topic: "Denotation, connotation and manipulation", domain: "Communication and Expression", category: "Flexible Thinking",
    caps: "CAPS Grade 11 English Home Language: Language Structures and Conventions; Reading and Viewing (critical language awareness: denotation and connotation; emotive and manipulative language; bias)",
    intention: "Today I am noticing how word choice shapes what we think.", prompt: "Where have you seen loaded language in the news?",
    lesson: [
      { h: "Denotation and connotation", say: "Denotation is a word's dictionary meaning. Connotation is the feeling it carries. Slim and skinny both mean thin, but slim sounds positive and skinny can sound negative.", html: chainRow(["slim 👍", "thin", "skinny 👎"]) + P("Same <b>denotation</b>, different <b>connotation</b>.") },
      { h: "Loaded language", say: "Writers choose words to influence us. Protesters or rioters? Freedom fighters or rebels? The choice shows a point of view.", html: chainRow(["protesters ↔ rioters", "debate ↔ row", "claimed ↔ explained"]) + P("Ask: what <b>other word</b> could have been used?") },
      { h: "Manipulation techniques", say: "Watch for generalisations like everyone knows, false choices like you're either with us or against us, and euphemisms that soften bad news, like let go instead of fired.", html: chainRow(["Generalisation", "False choice", "Euphemism"]) + P("Critical readers <b>question</b> the language.") }
    ],
    example: { q: "Headline A: Community members gather to demand water. Headline B: Mob blocks road in water chaos. How do they differ?", steps: ["Both describe the same event.", "A uses neutral words: members, gather, demand.", "B uses negative words: mob, chaos. It frames people as dangerous."] },
    questions: [
      { type: "mcq", q: "Which word has a positive connotation?", options: ["determined", "stubborn", "pig-headed", "obstinate"], answer: 0, hints: ["They mean similar things.", "Which one sounds like praise?", "Determined."], explain: "Determined sounds positive." },
      { type: "mcq", q: "Which is a euphemism?", options: ["passed away", "died", "killed", "dead"], answer: 0, hints: ["A softer way to say something.", "Gentle wording.", "Passed away."], explain: "Passed away softens died." },
      { type: "mcq", q: "Everyone knows this school is the best. What technique is this?", options: ["Generalisation", "Euphemism", "Statistic", "Fact"], answer: 0, hints: ["Everyone?", "A sweeping claim.", "Generalisation."], explain: "It is a sweeping generalisation." },
      { type: "mcq", q: "What is denotation?", options: ["The dictionary meaning", "The feeling a word carries", "A figure of speech", "A type of essay"], answer: 0, hints: ["The literal meaning.", "From a dictionary.", "Denotation."], explain: "Denotation is the literal meaning." },
      { type: "mcq", q: "You either support this plan or you don't care about children. What is the problem?", options: ["It is a false choice", "It is a fact", "It is a euphemism", "It is neutral"], answer: 0, hints: ["Are there only two options?", "You could have other views.", "False choice."], explain: "It falsely limits the options to two." }
    ],
    reflect: { q: "What will you watch for?", options: ["Connotations", "Loaded headlines", "Euphemisms", "False choices"] },
    parent: "Your child learned how word choice and techniques like euphemism can shape opinions.",
    teacher: "Shows distinguishing denotation and connotation, and identifying loaded language, generalisation, false dilemma and euphemism.",
    done: "Notice the feelings behind words, and question language that tries to manipulate." },

  // ===================== GRADE 11 LIFE SCIENCES =====================
  { id: "g11-nutrition", grade: 11, subject: "Life Sciences", title: "Human digestion", topic: "Animal nutrition", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration",
    caps: "CAPS Grade 11 Life Sciences, Term 2: Animal nutrition (human digestive system; mechanical and chemical digestion; enzymes; absorption; balanced diet)",
    intention: "Today I am following food through the digestive system.", prompt: "Why do we need enzymes?",
    lesson: [
      { h: "The digestive tract", say: "Food travels from the mouth, down the oesophagus, to the stomach, the small intestine, the large intestine, and out through the anus. The liver and pancreas help digestion.", html: chainRow(["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine"]) },
      { h: "Mechanical and chemical", say: "Mechanical digestion breaks food into smaller pieces, like chewing. Chemical digestion uses enzymes to break large molecules into small ones the body can absorb.", html: chainRow(["Amylase: starch → sugar", "Protease: protein → amino acids", "Lipase: fat → fatty acids"]) + P("Bile from the liver <b>emulsifies</b> fats.") },
      { h: "Absorption", say: "Most nutrients are absorbed in the small intestine through villi, tiny finger-like folds that give a huge surface area. The large intestine absorbs water.", html: PICS("🫁", "Body") + P("<b>Villi</b> increase surface area for absorption.") }
    ],
    example: { q: "Why does bread start to taste slightly sweet if you chew it for a long time?", steps: ["Saliva contains the enzyme amylase.", "Amylase breaks starch into sugar.", "The sugar makes it taste sweet."] },
    questions: [
      { type: "mcq", q: "Where are most nutrients absorbed?", options: ["Small intestine", "Stomach", "Large intestine", "Oesophagus"], answer: 0, hints: ["Villi are here.", "A huge surface area.", "Small intestine."], explain: "Most absorption happens in the small intestine." },
      { type: "mcq", q: "Which enzyme breaks down starch?", options: ["Amylase", "Lipase", "Protease", "Bile"], answer: 0, hints: ["Found in saliva.", "Starch → sugar.", "Amylase."], explain: "Amylase digests starch." },
      { type: "mcq", q: "What does bile do?", options: ["Emulsifies fats", "Digests protein", "Absorbs water", "Makes saliva"], answer: 0, hints: ["Made by the liver.", "Works on fats.", "Breaks fat into droplets."], explain: "Bile emulsifies fats into small droplets." },
      { type: "mcq", q: "What is the main job of the large intestine?", options: ["Absorb water", "Digest protein", "Make bile", "Chew food"], answer: 0, hints: ["Near the end.", "Forms solid waste.", "Absorbs water."], explain: "The large intestine absorbs water." },
      { type: "order", q: "Put the parts in the order food passes through.", items: ["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine"], orderLabel: "first to last", hints: ["Start at the mouth.", "The stomach comes before the intestines.", "Small before large."], explain: "Mouth, oesophagus, stomach, small intestine, large intestine." }
    ],
    reflect: { q: "What helped you most?", options: ["The pathway order", "Enzyme names", "Villi and surface area", "Not sure"] },
    parent: "Your child followed food through the digestive system and learned the role of enzymes.",
    teacher: "Shows sequencing the alimentary canal, explaining mechanical and chemical digestion, enzymes and absorption.",
    done: "Enzymes break food into small molecules that are absorbed in the small intestine." },

  { id: "g11-population", grade: 11, subject: "Life Sciences", title: "Population ecology", topic: "Population size and interactions", domain: "Inquiry and Systems Thinking", category: "Pattern Thinking",
    caps: "CAPS Grade 11 Life Sciences, Term 3: Population ecology (population size; mark-recapture; growth curves; predator-prey, competition, symbiosis)",
    intention: "Today I am learning how populations grow and interact.", prompt: "What limits the growth of a population?",
    lesson: [
      { h: "Estimating population size", say: "Scientists cannot count every animal. With mark-recapture, they catch and mark some, release them, catch again, and use a formula to estimate the total.", html: chainRow(["N = (M × C) ÷ R"]) + P("M = marked first, C = caught second, R = recaptured marked.") },
      { h: "Growth curves", say: "A population often grows slowly, then quickly, then levels off at the carrying capacity: the most the environment can support.", html: chainRow(["Lag", "Exponential growth", "Stationary phase"]) + P("This S-shape is a <b>logistic</b> or sigmoid curve.") },
      { h: "Interactions", say: "Predators and prey affect each other's numbers. Species compete for resources. Symbiosis includes mutualism, where both benefit, commensalism, where one benefits, and parasitism, where one is harmed.", html: chainRow(["Predation", "Competition", "Mutualism", "Commensalism", "Parasitism"]) }
    ],
    example: { q: "Researchers mark 40 fish. Later they catch 50, and 10 are marked. Estimate the population.", steps: ["N = (M × C) ÷ R.", "N = (40 × 50) ÷ 10.", "N = 200 fish."] },
    questions: [
      { type: "num", q: "30 animals are marked. Later 60 are caught and 15 are marked. Estimate the population.", answer: "120", options: ["120", "105", "90", "450"], hints: ["N = (M × C) ÷ R.", "(30 × 60) ÷ 15.", "1 800 ÷ 15."], explain: "N = 120." },
      { type: "mcq", q: "What is carrying capacity?", options: ["The largest population the environment can support", "The fastest growth rate", "The number of predators", "The first stage of growth"], answer: 0, hints: ["Where the curve levels off.", "Limited by resources.", "The maximum supported."], explain: "Carrying capacity is the maximum sustainable population." },
      { type: "mcq", q: "Oxpeckers eat ticks off buffalo. Both benefit. What is this?", options: ["Mutualism", "Parasitism", "Competition", "Predation"], answer: 0, hints: ["Both benefit.", "A plus-plus relationship.", "Mutualism."], explain: "Both benefit, so it is mutualism." },
      { type: "mcq", q: "A tick feeds on a dog's blood. What is this?", options: ["Parasitism", "Mutualism", "Commensalism", "Competition"], answer: 0, hints: ["One benefits.", "The other is harmed.", "Parasitism."], explain: "The tick benefits and the dog is harmed." },
      { type: "mcq", q: "If prey numbers fall, what usually happens to predators?", options: ["Their numbers fall after a while", "They increase", "Nothing", "They become prey"], answer: 0, hints: ["Less food.", "Fewer predators survive.", "They fall, with a lag."], explain: "Predator numbers fall after prey numbers fall." }
    ],
    reflect: { q: "What helped you most?", options: ["The mark-recapture formula", "The growth curve", "Real animal examples", "Not sure"] },
    parent: "Your child learned how scientists estimate populations and how species interact.",
    teacher: "Shows applying mark-recapture, interpreting growth curves and classifying ecological interactions.",
    done: "Populations grow to their carrying capacity and are shaped by how species interact." },

  { id: "g11-impact", grade: 11, subject: "Life Sciences", title: "Human impact on the environment", topic: "Climate, water and biodiversity", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: "CAPS Grade 11 Life Sciences, Term 4: Human impact on the environment (atmosphere and climate change; water availability and quality; food security; loss of biodiversity; solid waste)",
    intention: "Today I am analysing how human activity affects the environment and what can be done.", prompt: "Which environmental issue affects your community most?",
    lesson: [
      { h: "Climate change", say: "Burning fossil fuels releases carbon dioxide, which traps heat in the atmosphere. This enhanced greenhouse effect is warming the Earth, causing more droughts, floods and heatwaves.", html: chainRow(["Fossil fuels", "CO₂", "Trapped heat", "Climate change"]) + P("South Africa's electricity comes mostly from <b>coal</b>.") },
      { h: "Water", say: "South Africa is a water-scarce country. Water is threatened by pollution, wasteful use, alien plants that use a lot of water, and acid mine drainage.", html: chainRow(["Pollution", "Wastage", "Alien plants", "Mine drainage"]) + P("Cape Town's 2018 drought showed how real <b>Day Zero</b> can be.") },
      { h: "Biodiversity and solutions", say: "Habitat loss, poaching and alien species threaten biodiversity. Solutions include renewable energy, saving water, protected areas, recycling and removing alien plants.", html: chainRow(["Renewables", "Save water", "Protect habitats", "Recycle"]) }
    ],
    example: { q: "How do alien plants like eucalyptus affect water supplies?", steps: ["They use more water than many indigenous plants.", "They reduce the water reaching rivers and dams.", "Clearing them, as Working for Water does, increases water supply."] },
    questions: [
      { type: "mcq", q: "Which gas is mainly linked to the enhanced greenhouse effect?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], answer: 0, hints: ["Released by burning fossil fuels.", "CO₂.", "Carbon dioxide."], explain: "Carbon dioxide is the main greenhouse gas from human activity." },
      { type: "mcq", q: "What is acid mine drainage?", options: ["Acidic water flowing from mines and polluting water", "Rain on a mine", "Drinking water from mines", "A mining tool"], answer: 0, hints: ["From mines.", "Acidic and polluting.", "Polluted water."], explain: "It is acidic, metal-rich water that pollutes rivers." },
      { type: "mcq", q: "Which is a renewable energy source?", options: ["Solar power", "Coal", "Oil", "Natural gas"], answer: 0, hints: ["It does not run out.", "From the sun.", "Solar."], explain: "Solar power is renewable." },
      { type: "mcq", q: "What is the main threat to rhinos in South Africa?", options: ["Poaching", "Too much rain", "Recycling", "Solar farms"], answer: 0, hints: ["Illegal hunting.", "For their horns.", "Poaching."], explain: "Poaching is the main threat to rhinos." },
      { type: "sort", q: "Helps or harms the environment?", items: ["Fixing leaking taps", "Dumping waste in rivers", "Planting indigenous trees", "Burning plastic"], bins: ["Helps", "Harms"], answer: [0, 1, 0, 1], hints: ["Which ones conserve?", "Fixing leaks and planting help.", "Dumping and burning harm."], explain: "Fixing leaks and planting indigenous trees help." }
    ],
    reflect: { q: "Which action could you take?", options: ["Save water", "Reduce waste", "Save electricity", "Protect habitats"] },
    parent: "Your child explored how human activity affects climate, water and biodiversity, and what can be done.",
    teacher: "Shows explaining the enhanced greenhouse effect, threats to water and biodiversity, and evaluating solutions.",
    done: "Human activity affects climate, water and biodiversity, and we can reduce the harm." },

  // ===================== GRADE 11 LIFE ORIENTATION =====================
  { id: "g11-media", grade: 11, subject: "Life Orientation", title: "Media and democracy", topic: "Democracy and human rights: the role of the media", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "CAPS Grade 11 Life Orientation: Democracy and human rights (role of the media in a democratic society; freedom of expression and its limits; responsible use of social media)",
    intention: "Today I am exploring the role of the media in a democracy and how to spot false information.", prompt: "How do you check if something online is true?",
    lesson: [
      { h: "Why the media matters", say: "In a democracy, a free media informs citizens, holds leaders accountable and gives people a voice. Freedom of the press is protected in Section 16 of the Constitution.", html: chainRow(["Inform", "Hold accountable", "Give a voice"]) + P("Investigative journalism has exposed corruption in South Africa.") },
      { h: "Limits", say: "Freedom of expression does not cover propaganda for war, incitement of violence, or hate speech based on race, ethnicity, gender or religion that incites harm.", html: chainRow(["No incitement", "No hate speech", "No propaganda for war"]) + P("Rights have <b>limits</b> that protect others.") },
      { h: "Spotting false information", say: "Before you share, check the source, look for the date, see if trusted outlets report it, and be wary of headlines designed to make you angry.", html: chainRow(["Source?", "Date?", "Other outlets?", "Emotional bait?"]) + P("<b>Pause before you share.</b>") }
    ],
    example: { q: "A WhatsApp message says schools will close tomorrow, with no source. What should you do?", steps: ["Check: who sent it originally? Is there an official source?", "Look on the Department of Education's official channels.", "Do not forward it until it is confirmed."] },
    questions: [
      { type: "mcq", q: "Which section of the Constitution protects freedom of expression?", options: ["Section 16", "Section 9", "Section 28", "Section 1"], answer: 0, hints: ["It covers the press too.", "Not equality (9) or children (28).", "Section 16."], explain: "Section 16 protects freedom of expression." },
      { type: "mcq", q: "Which is NOT protected by freedom of expression?", options: ["Incitement of violence", "Criticising the government", "Writing an opinion piece", "Peaceful protest signs"], answer: 0, hints: ["Some speech causes harm.", "Calling for violence.", "Incitement."], explain: "Incitement to violence is not protected." },
      { type: "mcq", q: "What is a sign of fake news?", options: ["No source and an emotional headline", "Many trusted outlets report it", "It has a date and author", "It quotes official documents"], answer: 0, hints: ["Red flags.", "Who wrote it?", "No source, emotional."], explain: "No source and emotional bait are warning signs." },
      { type: "mcq", q: "How does the media hold leaders accountable?", options: ["By investigating and reporting what they do", "By hiding information", "By only printing praise", "By banning opinions"], answer: 0, hints: ["Watchdog role.", "Exposing wrongdoing.", "Investigating."], explain: "Investigative reporting holds leaders accountable." },
      { type: "order", q: "Put the steps before sharing in order.", items: ["Pause", "Check the source", "Check other trusted outlets", "Decide whether to share"], orderLabel: "first to last", hints: ["Stop first.", "Then check.", "Decide last."], explain: "Pause, check the source, compare outlets, then decide." }
    ],
    reflect: { q: "What will you do before sharing?", options: ["Pause", "Check the source", "Look for other reports", "Not share if unsure"] },
    parent: "Your child explored the media's role in democracy and how to spot false information.",
    teacher: "Shows understanding of media freedom, its constitutional limits and strategies to identify misinformation.",
    done: "A free media protects democracy, and responsible citizens check before they share." },

  { id: "g11-apply", grade: 11, subject: "Life Orientation", title: "Applying for study", topic: "Careers and career choices: admission and applications", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "CAPS Grade 11 Life Orientation: Careers and career choices (requirements for admission to higher education; Admission Point Score; application processes and deadlines)",
    intention: "Today I am learning how admission works and how to plan applications.", prompt: "Which course would you like to apply for?",
    lesson: [
      { h: "Types of NSC pass", say: "The National Senior Certificate has different pass levels. A Bachelor's pass is needed for most degrees. A Diploma pass is needed for diplomas. A Higher Certificate pass is the entry level.", html: chainRow(["Bachelor's", "Diploma", "Higher Certificate"]) + P("Each course also has its own <b>subject</b> requirements.") },
      { h: "Admission Point Score", say: "Many universities use an Admission Point Score, or APS. Each subject percentage earns points, and the points are added up. Each university calculates it slightly differently.", html: chainRow(["80–100% = 7", "70–79% = 6", "60–69% = 5", "…"]) + P("Your <b>Grade 11 final results</b> are often used for early offers.") },
      { h: "Applications", say: "Applications usually open in the year before you study, and many close by September or earlier. Some universities charge a fee. The Central Applications Office in KwaZulu-Natal handles several institutions at once.", html: chainRow(["Research", "Check APS", "Gather documents", "Apply before deadline", "Track your application"]) }
    ],
    example: { q: "A course needs APS 30 and Mathematics at 60%. Sipho has APS 32 and Mathematics 55%. Should he apply?", steps: ["His APS meets the requirement.", "But Mathematics is below 60%.", "He should work to improve Maths, apply, and also apply to a second-choice course."] },
    questions: [
      { type: "mcq", q: "Which NSC pass is needed for most degrees?", options: ["Bachelor's pass", "Diploma pass", "Higher Certificate pass", "No pass needed"], answer: 0, hints: ["Degree = bachelor's.", "The highest level.", "Bachelor's pass."], explain: "A Bachelor's pass is needed for most degrees." },
      { type: "mcq", q: "What is an APS?", options: ["A score based on your subject results", "A type of bursary", "A university", "An exam"], answer: 0, hints: ["Admission Point Score.", "Points for percentages.", "A score."], explain: "It totals points earned from subject results." },
      { type: "mcq", q: "Which results are often used for early offers?", options: ["Grade 11 final results", "Grade 8 results", "Primary school results", "None"], answer: 0, hints: ["Before matric results are out.", "The year before.", "Grade 11."], explain: "Grade 11 results are often used for provisional offers." },
      { type: "mcq", q: "Why apply to more than one course?", options: ["To have a backup if the first is full", "It is not allowed", "To confuse the university", "No reason"], answer: 0, hints: ["Places are limited.", "Have a plan B.", "A backup."], explain: "A second choice gives you a backup." },
      { type: "mcq", q: "When do many applications close?", options: ["In the year before study, often by September", "After classes start", "In December of the study year", "There is no deadline"], answer: 0, hints: ["Plan ahead.", "The year before.", "Often by September."], explain: "Many close by September of the year before." }
    ],
    reflect: { q: "What is your next step?", options: ["Calculate my APS", "Check subject requirements", "List deadlines", "Choose a backup course"] },
    parent: "Your child learned about NSC pass types, APS scores and applying for study.",
    teacher: "Shows understanding of NSC pass levels, APS calculation, subject requirements and application timelines.",
    done: "Know your pass level and APS, check subject requirements, and apply early with a backup." },

  { id: "g11-relationships", grade: 11, subject: "Life Orientation", title: "Healthy relationships", topic: "Development of the self in society", domain: "Creativity and Metacognition", category: "Emotional Readiness",
    caps: "CAPS Grade 11 Life Orientation: Development of the self in society (relationships: signs of healthy and unhealthy relationships; respect and boundaries; where to get help)",
    intention: "Today I am learning the signs of healthy and unhealthy relationships.", prompt: "What does respect look like in a friendship or relationship?",
    lesson: [
      { h: "Healthy signs", say: "Healthy relationships, whether friendships or dating, include respect, trust, honesty, good communication, and space to be yourself and see other people.", html: chainRow(["Respect", "Trust", "Honesty", "Communication", "Independence"]) },
      { h: "Warning signs", say: "Warning signs include jealousy and control, checking your phone, isolating you from friends, put-downs, pressure, threats, or any kind of violence.", html: chainRow(["Control", "Isolation", "Put-downs", "Pressure", "Threats"]) + P("Abuse can be physical, emotional, financial or digital.") },
      { h: "Boundaries and help", say: "You have the right to set boundaries and to say no. If a relationship feels unsafe, talk to a trusted adult. In South Africa, the GBV Command Centre is on 0800 428 428, and Childline is on 116.", html: chainRow(["Trusted adult", "Counsellor", "GBV Command Centre 0800 428 428", "Childline 116"]) + P("It is never your fault if someone abuses you.") }
    ],
    example: { q: "Leila's partner demands her phone password and gets angry when she sees friends. Is this healthy?", steps: ["Demanding passwords and anger about friends are controlling behaviours.", "These are warning signs.", "Leila deserves respect. She can talk to a trusted adult or counsellor for support."] },
    questions: [
      { type: "mcq", q: "Which is a sign of a healthy relationship?", options: ["Respecting each other's boundaries", "Checking each other's phones", "Isolating from friends", "Threats"], answer: 0, hints: ["Mutual respect.", "Space and trust.", "Boundaries."], explain: "Respecting boundaries is healthy." },
      { type: "mcq", q: "Which is a warning sign?", options: ["Extreme jealousy and control", "Supporting your goals", "Honest conversations", "Spending time apart"], answer: 0, hints: ["Control is not love.", "Jealousy that limits you.", "Control."], explain: "Extreme jealousy and control are warning signs." },
      { type: "mcq", q: "What is digital abuse?", options: ["Using technology to control or harass someone", "Using a computer for homework", "Sending a birthday message", "Online learning"], answer: 0, hints: ["Abuse through phones or apps.", "Tracking, threats, sharing images.", "Control or harassment."], explain: "Digital abuse uses technology to control or harass." },
      { type: "mcq", q: "What is the GBV Command Centre number?", options: ["0800 428 428", "10111", "116", "112"], answer: 0, hints: ["Toll-free.", "0800 …", "0800 428 428."], explain: "The GBV Command Centre is on 0800 428 428." },
      { type: "mcq", q: "If you feel unsafe in a relationship, what should you do?", options: ["Talk to a trusted adult or helpline", "Keep it secret", "Blame yourself", "Do nothing"], answer: 0, hints: ["You are not alone.", "Get support.", "Talk to someone."], explain: "Reach out to a trusted adult or helpline." }
    ],
    reflect: { q: "What matters most to you in a relationship?", options: ["Respect", "Trust", "Honesty", "Space to be myself"] },
    parent: "Your child learned the signs of healthy and unhealthy relationships and where to get help.",
    teacher: "Shows identifying healthy relationship qualities, warning signs of abuse, boundary-setting and support services.",
    done: "Healthy relationships are built on respect. You can always ask for help." }
];
const WORDS_G11 = {
  "g11-quadratics": { words: [["🟰", "Quadratic", "an equation with x² as the highest power"], ["🔍", "Discriminant", "b² − 4ac, which tells you about the roots"]] },
  "g11-depreciation": { words: [["📉", "Depreciation", "a loss of value over time"], ["📈", "Compound", "calculated on the growing total"]] },
  "g11-circles": { words: [["⭕", "Circumference", "the edge of a circle"], ["➖", "Chord", "a line joining two points on a circle"], ["📏", "Tangent", "a line that touches a circle at one point"]] },
  "g11-drama": { words: [["🗣️", "Aside", "words spoken to the audience only"], ["🎭", "Dramatic irony", "when the audience knows more than a character"], ["👴", "Tata", "isiXhosa for father"]] },
  "g11-transactional": { words: [["📄", "CV", "a short summary of your education, skills and experience"], ["🎩", "Register", "how formal or informal language is"]] },
  "g11-critical": { words: [["📖", "Denotation", "a word's dictionary meaning"], ["💭", "Connotation", "the feeling a word carries"], ["🪶", "Euphemism", "a softer way of saying something unpleasant"]] },
  "g11-nutrition": { words: [["🧪", "Enzyme", "a protein that speeds up a chemical reaction"], ["🌿", "Villi", "tiny folds in the small intestine"], ["💧", "Emulsify", "break fat into small droplets"]] },
  "g11-population": { words: [["📏", "Carrying capacity", "the largest population an area can support"], ["🤝", "Mutualism", "both species benefit"], ["🦟", "Parasitism", "one benefits and one is harmed"]] },
  "g11-impact": { words: [["🌡️", "Greenhouse effect", "gases trapping heat in the atmosphere"], ["🌱", "Alien plant", "a plant not native to the area"]] },
  "g11-media": { words: [["📰", "Accountability", "being answerable for your actions"], ["🧢", "Misinformation", "false information"]] },
  "g11-apply": { words: [["🎓", "APS", "Admission Point Score"], ["📜", "NSC", "National Senior Certificate, the matric certificate"]] },
  "g11-relationships": { words: [["🚧", "Boundary", "a limit you set to protect yourself"], ["🚩", "Warning sign", "a sign that something is wrong"]] }
};
Object.assign(WORDS, WORDS_G11);
