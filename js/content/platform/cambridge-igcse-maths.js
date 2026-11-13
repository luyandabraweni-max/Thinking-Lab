"use strict";

// ---------- Cambridge IGCSE lessons for the new app only (the live site doesn't load js/content/platform/). ----------
// Grade 10 = IGCSE year 1, Grade 11 = IGCSE year 2. Original content, following the published syllabus topics.
// Cambridge uses decimal points and $ amounts, so these lessons do too.
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const M = { subject: "Mathematics", curriculum: "Cambridge", domain: "Logical and Analytical Thinking" };
  PLATFORM_UNITS.push(
  // ===================== CAMBRIDGE IGCSE MATHEMATICS, YEAR 1 (GRADE 10) =====================
  { ...M, id: "cam10-standard-form", grade: 10, title: "Standard form", topic: "Number", category: "Pattern Thinking",
    caps: "Cambridge IGCSE Mathematics (0580): Number (standard form; calculating with numbers in standard form)",
    intention: "Today I am writing very large and very small numbers in standard form.", prompt: "Where might you meet a very large or very small number?",
    lesson: [
      { h: "Big numbers", say: "Standard form writes a number as a number from 1 up to, but not including, 10, multiplied by a power of 10. 4 500 000 is 4.5 times 10 to the power 6.", html: chainRow(["4 500 000", "4.5 × 10⁶"]) + P("The first part must be at least 1 and less than 10.") },
      { h: "Small numbers", say: "For numbers less than 1, the power of 10 is negative. 0.00032 is 3.2 times 10 to the power minus 4.", html: chainRow(["0.00032", "3.2 × 10⁻⁴"]) },
      { h: "Calculating", say: "To multiply, multiply the first parts and add the powers. Then check the answer is still in standard form.", html: P("(3 × 10⁴) × (5 × 10³) = 15 × 10⁷ = <b>1.5 × 10⁸</b>") }
    ],
    example: { q: "Write 0.000067 in standard form.", steps: ["Move the decimal point to get 6.7.", "It moved 5 places.", "0.000067 = 6.7 × 10⁻⁵."] },
    questions: [
      { type: "mcq", q: "Write 72 000 in standard form.", options: ["7.2 × 10⁴", "72 × 10³", "7.2 × 10³", "0.72 × 10⁵"], answer: 0, hints: ["The first part must be between 1 and 10.", "7.2, then count the places.", "4 places."], explain: "72 000 = 7.2 × 10 000 = 7.2 × 10⁴." },
      { type: "mcq", q: "Write 0.0059 in standard form.", options: ["5.9 × 10⁻³", "5.9 × 10³", "59 × 10⁻⁴", "5.9 × 10⁻²"], answer: 0, hints: ["It is less than 1, so the power is negative.", "Move the point to get 5.9.", "3 places."], explain: "0.0059 = 5.9 × 10⁻³." },
      { type: "num", q: "Write 3.4 × 10³ as an ordinary number.", answer: "3 400", options: ["3 400", "34 000", "340", "0.0034"], hints: ["10³ = 1 000.", "3.4 × 1 000.", "3 400."], explain: "3.4 × 1 000 = 3 400." },
      { type: "mcq", q: "Work out (2 × 10⁵) × (4 × 10³).", options: ["8 × 10⁸", "8 × 10¹⁵", "6 × 10⁸", "8 × 10²"], answer: 0, hints: ["Multiply 2 × 4.", "Add the powers: 5 + 3.", "8 × 10⁸."], explain: "2 × 4 = 8 and 10⁵ × 10³ = 10⁸." },
      { type: "mcq", q: "Which number is NOT in standard form?", options: ["12 × 10⁴", "1.2 × 10⁵", "9.9 × 10⁻²", "1 × 10⁶"], answer: 0, hints: ["Check each first part.", "Is it from 1 to less than 10?", "12 is too big."], explain: "12 is not less than 10, so 12 × 10⁴ should be 1.2 × 10⁵." }
    ],
    reflect: R("Counting the places", "Checking the first part is between 1 and 10", "Adding the powers"),
    parent: "Your child wrote very large and very small numbers in standard form, and calculated with them.",
    teacher: "Shows converting to and from standard form, including negative powers, and multiplying in standard form.",
    done: "Standard form: a number from 1 to less than 10, times a power of 10." },

  { ...M, id: "cam10-simultaneous", grade: 10, title: "Simultaneous equations", topic: "Algebra", category: "Problem Solving",
    caps: "Cambridge IGCSE Mathematics (0580): Algebra and graphs (solving simultaneous linear equations by elimination and substitution)",
    intention: "Today I am solving two equations with two unknowns.", prompt: "Where might two facts together tell you two unknown prices?",
    lesson: [
      { h: "Two unknowns", say: "Simultaneous equations are two equations that are both true at the same time. You need two equations to find two unknowns.", html: P("x + y = 10 and x − y = 4") },
      { h: "Elimination", say: "Add or subtract the equations to remove one unknown. Adding x plus y equals 10 to x minus y equals 4 gives 2x equals 14, so x is 7.", html: chainRow(["Add: 2x = 14", "x = 7", "y = 3"]) },
      { h: "Substitution and checking", say: "You can also make one unknown the subject and substitute it into the other equation. Always check your answer in both equations.", html: P("Check: 7 + 3 = 10 ✓ and 7 − 3 = 4 ✓") }
    ],
    example: { q: "Solve 2x + y = 11 and x + y = 7.", steps: ["Subtract the second equation from the first: x = 4.", "Substitute: 4 + y = 7, so y = 3.", "Check: 2(4) + 3 = 11 ✓."] },
    questions: [
      { type: "mcq", q: "Solve x + y = 12 and x − y = 2.", options: ["x = 7, y = 5", "x = 5, y = 7", "x = 6, y = 6", "x = 10, y = 2"], answer: 0, hints: ["Add the equations.", "2x = 14.", "x = 7, then y = 5."], explain: "2x = 14, so x = 7 and y = 5. Check: 7 − 5 = 2 ✓." },
      { type: "num", q: "If 3x + y = 14 and x + y = 6, what is x?", answer: "4", options: ["4", "2", "8", "6"], hints: ["Subtract the second from the first.", "2x = 8.", "x = 4."], explain: "2x = 8, so x = 4." },
      { type: "num", q: "Using x = 4 and x + y = 6, what is y?", answer: "2", options: ["2", "10", "4", "6"], hints: ["Substitute x = 4.", "4 + y = 6.", "y = 2."], explain: "4 + y = 6, so y = 2." },
      { type: "mcq", q: "To eliminate y from 2x + 3y = 13 and 4x − 3y = 5, you should…", options: ["add the equations", "subtract the equations", "multiply both by 3", "divide by y"], answer: 0, hints: ["Look at the y terms: +3y and −3y.", "They cancel when added.", "Add."], explain: "+3y and −3y cancel when you add." },
      { type: "mcq", q: "Two pens and a ruler cost $5. One pen and a ruler cost $3.50. How much is one pen?", options: ["$1.50", "$2", "$3.50", "$1"], answer: 0, hints: ["2p + r = 5 and p + r = 3.50.", "Subtract the equations.", "p = 1.50."], explain: "Subtracting gives p = $1.50." }
    ],
    reflect: R("Choosing whether to add or subtract", "Substituting back", "Checking in both equations"),
    parent: "Your child solved pairs of equations with two unknowns.",
    teacher: "Shows solving simultaneous linear equations by elimination and substitution, and checking solutions.",
    done: "Remove one unknown, solve, substitute back, then check." },

  { ...M, id: "cam10-straight-lines", grade: 10, title: "Straight-line graphs", topic: "Coordinate geometry", category: "Pattern Thinking",
    caps: "Cambridge IGCSE Mathematics (0580): Coordinate geometry (gradient; y = mx + c; parallel lines)",
    intention: "Today I am finding gradients and equations of straight lines.", prompt: "What does steepness mean on a hill or a graph?",
    lesson: [
      { h: "y = mx + c", say: "Every straight line, except a vertical one, can be written as y equals m x plus c. m is the gradient, how steep the line is. c is where it crosses the y-axis.", html: chainRow(["m: gradient", "c: y-intercept"]) },
      { h: "Finding the gradient", say: "The gradient is the change in y divided by the change in x between two points. From 1, 3 to 3, 7, y goes up 4 while x goes up 2, so the gradient is 2.", html: P("gradient = (y₂ − y₁) ÷ (x₂ − x₁) = (7 − 3) ÷ (3 − 1) = <b>2</b>") },
      { h: "Parallel lines", say: "Parallel lines have the same gradient. A negative gradient means the line goes down from left to right.", html: P("y = 2x + 1 and y = 2x − 5 are <b>parallel</b>.") }
    ],
    example: { q: "Find the equation of the line through (0, −1) with gradient 3.", steps: ["The line crosses the y-axis at −1, so c = −1.", "The gradient is 3, so m = 3.", "y = 3x − 1."] },
    questions: [
      { type: "mcq", q: "What is the gradient of y = 5x − 2?", options: ["5", "−2", "2", "−5"], answer: 0, hints: ["Compare with y = mx + c.", "m is the number in front of x.", "5."], explain: "m = 5." },
      { type: "mcq", q: "Where does y = 4x + 7 cross the y-axis?", options: ["(0, 7)", "(7, 0)", "(0, 4)", "(4, 0)"], answer: 0, hints: ["c is the y-intercept.", "c = 7.", "At x = 0."], explain: "c = 7, so it crosses at (0, 7)." },
      { type: "num", q: "Find the gradient of the line through (2, 1) and (4, 9).", answer: "4", options: ["4", "8", "2", "5"], hints: ["Change in y: 9 − 1 = 8.", "Change in x: 4 − 2 = 2.", "8 ÷ 2."], explain: "8 ÷ 2 = 4." },
      { type: "mcq", q: "Which line is parallel to y = 3x + 2?", options: ["y = 3x − 4", "y = 2x + 3", "y = −3x + 2", "y = x + 3"], answer: 0, hints: ["Parallel lines have the same gradient.", "The gradient is 3.", "Which has 3x?"], explain: "y = 3x − 4 also has gradient 3." },
      { type: "mcq", q: "A line has a negative gradient. What does it look like?", options: ["It goes down from left to right", "It goes up from left to right", "It is horizontal", "It is vertical"], answer: 0, hints: ["Negative: y falls as x grows.", "Read from left to right.", "Downhill."], explain: "A negative gradient slopes down from left to right." }
    ],
    reflect: R("Reading m and c from the equation", "Change in y over change in x", "Same gradient means parallel"),
    parent: "Your child found the gradient and equation of straight lines.",
    teacher: "Shows calculating gradient from two points, interpreting y = mx + c, and identifying parallel lines.",
    done: "y = mx + c: m is the gradient, c is the y-intercept." },

  { ...M, id: "cam10-polygons", grade: 10, title: "Angles in polygons", topic: "Geometry", category: "Problem Solving",
    caps: "Cambridge IGCSE Mathematics (0580): Geometry (angle properties of polygons; interior and exterior angles of regular polygons)",
    intention: "Today I am working out the angles in polygons.", prompt: "Why do you think bees build hexagons?",
    lesson: [
      { h: "Interior angles", say: "The interior angles of a polygon with n sides add up to n minus 2, times 180 degrees. A pentagon has 5 sides, so its angles add up to 540 degrees.", html: P("Sum of interior angles = (n − 2) × 180°") },
      { h: "Exterior angles", say: "The exterior angles of any polygon add up to 360 degrees. In a regular polygon they are all equal, so each one is 360 divided by the number of sides.", html: chainRow(["Exterior angles add to 360°", "Regular: 360° ÷ n"]) },
      { h: "Interior and exterior together", say: "At each corner, the interior and exterior angles lie on a straight line, so they add up to 180 degrees.", html: P("interior + exterior = 180°") }
    ],
    example: { q: "Find each interior angle of a regular hexagon.", steps: ["Each exterior angle: 360° ÷ 6 = 60°.", "Interior = 180° − 60° = 120°.", "Check: 6 × 120° = 720° = (6 − 2) × 180° ✓."] },
    questions: [
      { type: "num", q: "What do the interior angles of a quadrilateral add up to, in degrees?", answer: "360", options: ["360", "180", "540", "720"], hints: ["n = 4.", "(4 − 2) × 180.", "2 × 180."], explain: "(4 − 2) × 180° = 360°." },
      { type: "num", q: "What do the interior angles of a pentagon add up to, in degrees?", answer: "540", options: ["540", "360", "720", "900"], hints: ["n = 5.", "(5 − 2) × 180.", "3 × 180."], explain: "3 × 180° = 540°." },
      { type: "num", q: "Each exterior angle of a regular polygon is 30°. How many sides does it have?", answer: "12", options: ["12", "30", "6", "10"], hints: ["Exterior angles add to 360°.", "360 ÷ 30.", "12."], explain: "360° ÷ 30° = 12 sides." },
      { type: "num", q: "Find each interior angle of a regular octagon, in degrees.", answer: "135", options: ["135", "45", "120", "144"], hints: ["Exterior: 360 ÷ 8 = 45°.", "Interior = 180 − exterior.", "180 − 45."], explain: "180° − 45° = 135°." },
      { type: "mcq", q: "What do the exterior angles of a 20-sided polygon add up to?", options: ["360°", "3 240°", "180°", "720°"], answer: 0, hints: ["Does the number of sides matter for exterior angles?", "No.", "Always 360°."], explain: "The exterior angles of any polygon add to 360°." }
    ],
    reflect: R("The (n − 2) × 180° rule", "Exterior angles adding to 360°", "Interior + exterior = 180°"),
    parent: "Your child worked out interior and exterior angles of polygons.",
    teacher: "Shows using the interior angle sum and exterior angle properties of polygons, including regular polygons.",
    done: "Interior sum: (n − 2) × 180°. Exterior sum: always 360°." },

  { ...M, id: "cam10-frequency", grade: 10, title: "Averages from frequency tables", topic: "Statistics", category: "Inquiry and Exploration",
    caps: "Cambridge IGCSE Mathematics (0580): Statistics (mean, median and mode from frequency tables; estimating the mean from grouped data)",
    intention: "Today I am finding averages from frequency tables.", prompt: "Why might a sports coach keep a frequency table?",
    lesson: [
      { h: "Frequency tables", say: "A frequency table shows how many times each value occurs, for example the number of goals scored in 10 matches.", html: P("Goals: 0, 1, 2, 3") + P("Frequency: 2, 4, 3, 1") },
      { h: "The mean", say: "To find the mean, multiply each value by its frequency, add these up, then divide by the total frequency.", html: P("(0×2 + 1×4 + 2×3 + 3×1) ÷ 10 = 13 ÷ 10 = <b>1.3</b> goals") },
      { h: "Grouped data", say: "When data is grouped, for example heights from 150 to 160 centimetres, you don't know the exact values. Use the midpoint of each group to estimate the mean.", html: chainRow(["150 to 160 cm", "midpoint 155"]) + P("The answer is an <b>estimate</b>.") }
    ],
    example: { q: "Values 1, 2, 3 have frequencies 5, 3, 2. Find the mean.", steps: ["Multiply and add: 1×5 + 2×3 + 3×2 = 5 + 6 + 6 = 17.", "Total frequency: 5 + 3 + 2 = 10.", "Mean = 17 ÷ 10 = 1.7."] },
    questions: [
      { type: "mcq", q: "Goals 0, 1, 2, 3 have frequencies 2, 4, 3, 1. What is the mode?", options: ["1 goal", "4 goals", "2 goals", "3 goals"], answer: 0, hints: ["The mode is the value with the highest frequency.", "The highest frequency is 4.", "Which value has it?"], explain: "1 goal happened most often (4 times)." },
      { type: "num", q: "Goals 0, 1, 2, 3 have frequencies 2, 4, 3, 1. How many matches were there?", answer: "10", options: ["10", "6", "4", "13"], hints: ["Add the frequencies.", "2 + 4 + 3 + 1.", "10."], explain: "2 + 4 + 3 + 1 = 10 matches." },
      { type: "num", q: "Values 2, 4, 6 have frequencies 1, 2, 1. Find the mean.", answer: "4", options: ["4", "12", "3", "6"], hints: ["2×1 + 4×2 + 6×1 = 16.", "Total frequency: 4.", "16 ÷ 4."], explain: "16 ÷ 4 = 4." },
      { type: "num", q: "What is the midpoint of the group 20 to 30?", answer: "25", options: ["25", "50", "10", "20"], hints: ["Halfway between 20 and 30.", "(20 + 30) ÷ 2.", "25."], explain: "(20 + 30) ÷ 2 = 25." },
      { type: "mcq", q: "Why is a mean from grouped data only an estimate?", options: ["We don't know the exact values in each group", "The groups are always wrong", "Midpoints are too large", "Frequencies are guesses"], answer: 0, hints: ["What do we use instead of the real values?", "Midpoints.", "The real values are unknown."], explain: "We use midpoints because the exact values are unknown." }
    ],
    reflect: R("Multiplying value by frequency", "Dividing by the total frequency", "Using midpoints"),
    parent: "Your child found averages from frequency tables, including grouped data.",
    teacher: "Shows calculating mean, median and mode from frequency tables and estimating the mean from grouped data.",
    done: "Mean from a table: add up value × frequency, then divide by the total frequency." },

  // ===================== CAMBRIDGE IGCSE MATHEMATICS, YEAR 2 (GRADE 11) =====================
  { ...M, id: "cam11-quadratics", grade: 11, title: "Solving quadratic equations", topic: "Algebra", category: "Problem Solving",
    caps: "Cambridge IGCSE Mathematics (0580): Algebra and graphs (solving quadratic equations by factorising and by the quadratic formula)",
    intention: "Today I am solving quadratic equations.", prompt: "Why might an equation have two answers?",
    lesson: [
      { h: "Factorising", say: "A quadratic equation has an x squared term. Make one side zero, then factorise. If two brackets multiply to give zero, one of them must be zero.", html: P("x² + 5x + 6 = 0 → (x + 2)(x + 3) = 0 → x = −2 or x = −3") },
      { h: "The quadratic formula", say: "When it won't factorise, use the formula: x equals minus b, plus or minus the square root of b squared minus 4 a c, all over 2 a.", html: P("x = (−b ± √(b² − 4ac)) ÷ 2a") },
      { h: "Two answers", say: "Most quadratic equations have two solutions. Check both by substituting them back into the equation.", html: P("Check x = −2: 4 − 10 + 6 = 0 ✓") }
    ],
    example: { q: "Solve x² − x − 12 = 0.", steps: ["Find two numbers that multiply to −12 and add to −1: −4 and 3.", "(x − 4)(x + 3) = 0.", "x = 4 or x = −3."] },
    questions: [
      { type: "mcq", q: "Factorise x² + 7x + 10.", options: ["(x + 5)(x + 2)", "(x + 10)(x + 1)", "(x + 7)(x + 3)", "(x − 5)(x − 2)"], answer: 0, hints: ["Multiply to 10, add to 7.", "5 × 2 = 10 and 5 + 2 = 7.", "(x + 5)(x + 2)."], explain: "5 and 2 multiply to 10 and add to 7." },
      { type: "mcq", q: "Solve (x − 3)(x + 6) = 0.", options: ["x = 3 or x = −6", "x = −3 or x = 6", "x = 3 or x = 6", "x = 18"], answer: 0, hints: ["One bracket must be zero.", "x − 3 = 0 or x + 6 = 0.", "x = 3 or x = −6."], explain: "x − 3 = 0 gives 3; x + 6 = 0 gives −6." },
      { type: "mcq", q: "Solve x² − 9 = 0.", options: ["x = 3 or x = −3", "x = 3 only", "x = 9", "x = 4.5"], answer: 0, hints: ["x² = 9.", "Which numbers square to 9?", "Don't forget the negative."], explain: "3² = 9 and (−3)² = 9." },
      { type: "num", q: "In 2x² + 3x − 5 = 0, what is the value of b² − 4ac?", answer: "49", options: ["49", "−31", "9", "40"], hints: ["a = 2, b = 3, c = −5.", "9 − 4(2)(−5).", "9 + 40."], explain: "9 − 4 × 2 × (−5) = 9 + 40 = 49." },
      { type: "mcq", q: "Using the formula, what are the solutions of 2x² + 3x − 5 = 0?", options: ["x = 1 or x = −2.5", "x = −1 or x = 2.5", "x = 2 or x = −5", "x = 7 or x = −3"], answer: 0, hints: ["√49 = 7.", "x = (−3 ± 7) ÷ 4.", "4 ÷ 4 and −10 ÷ 4."], explain: "(−3 + 7) ÷ 4 = 1 and (−3 − 7) ÷ 4 = −2.5." }
    ],
    reflect: R("Factorising first", "Using the formula carefully", "Checking both answers"),
    parent: "Your child solved quadratic equations by factorising and with the formula.",
    teacher: "Shows solving quadratic equations by factorisation and by the quadratic formula, and checking solutions.",
    done: "Make one side zero, factorise or use the formula, and expect two answers." },

  { ...M, id: "cam11-functions", grade: 11, title: "Composite and inverse functions", topic: "Functions", category: "Flexible Thinking",
    caps: "Cambridge IGCSE Mathematics (0580), Extended: Functions (function notation; composite functions; inverse functions)",
    intention: "Today I am combining and reversing functions.", prompt: "What everyday actions can be undone, and which can't?",
    lesson: [
      { h: "Function notation", say: "f of x means a rule applied to x. If f of x is 2x plus 3, then f of 4 is 2 times 4 plus 3, which is 11.", html: P("f(x) = 2x + 3 → f(4) = <b>11</b>") },
      { h: "Composite functions", say: "f g of x means do g first, then f. If g of x is x squared, then f g of 3 is f of 9, which is 21.", html: chainRow(["x = 3", "g: 9", "f: 21"]) },
      { h: "Inverse functions", say: "The inverse function, f to the minus 1, undoes f. Write y equals f of x, swap x and y, then make y the subject.", html: P("f(x) = 2x + 3 → f⁻¹(x) = (x − 3) ÷ 2") }
    ],
    example: { q: "f(x) = 3x − 1. Find f⁻¹(x).", steps: ["Write y = 3x − 1, then swap x and y: x = 3y − 1.", "Add 1: x + 1 = 3y.", "f⁻¹(x) = (x + 1) ÷ 3."] },
    questions: [
      { type: "num", q: "f(x) = 5x − 2. Find f(3).", answer: "13", options: ["13", "15", "1", "17"], hints: ["Replace x with 3.", "5 × 3 − 2.", "15 − 2."], explain: "5 × 3 − 2 = 13." },
      { type: "num", q: "f(x) = x + 4 and g(x) = 2x. Find fg(3).", answer: "10", options: ["10", "14", "7", "12"], hints: ["Do g first: g(3) = 6.", "Then f(6).", "6 + 4."], explain: "g(3) = 6, then f(6) = 10." },
      { type: "num", q: "f(x) = x + 4 and g(x) = 2x. Find gf(3).", answer: "14", options: ["14", "10", "7", "24"], hints: ["Do f first: f(3) = 7.", "Then g(7).", "2 × 7."], explain: "f(3) = 7, then g(7) = 14. The order matters." },
      { type: "mcq", q: "f(x) = 2x + 3. What is f⁻¹(x)?", options: ["(x − 3) ÷ 2", "(x + 3) ÷ 2", "2x − 3", "x ÷ 2 + 3"], answer: 0, hints: ["Undo the steps in reverse order.", "f multiplies by 2, then adds 3.", "Subtract 3, then divide by 2."], explain: "Undo +3 first, then ×2: (x − 3) ÷ 2." },
      { type: "mcq", q: "If f(5) = 12, what is f⁻¹(12)?", options: ["5", "12", "1/12", "7"], answer: 0, hints: ["The inverse undoes f.", "f takes 5 to 12.", "So f⁻¹ takes 12 back to 5."], explain: "f⁻¹ reverses f, so f⁻¹(12) = 5." }
    ],
    reflect: R("Doing the inside function first", "Swapping x and y", "Undoing steps in reverse"),
    parent: "Your child combined functions and found inverse functions.",
    teacher: "Shows evaluating functions, forming composite functions in the correct order, and finding inverse functions.",
    done: "fg(x): g first, then f. The inverse undoes the function." },

  { ...M, id: "cam11-vectors", grade: 11, title: "Vectors", topic: "Transformations and vectors", category: "Pattern Thinking",
    caps: "Cambridge IGCSE Mathematics (0580): Transformations and vectors (column vectors; adding, subtracting and multiplying vectors by a scalar; magnitude)",
    intention: "Today I am adding vectors and finding their length.", prompt: "How would you give directions using only across and up?",
    lesson: [
      { h: "What a vector is", say: "A vector has size and direction. A column vector shows how far to move across, then up. In these lessons we write it in a line: 3, minus 2 means 3 to the right and 2 down.", html: P("(3, −2): <b>3 right, 2 down</b>") + P("In a column vector, the top number is across and the bottom number is up.") },
      { h: "Adding vectors", say: "To add vectors, add the top numbers and add the bottom numbers. 3, minus 2 plus 1, 5 gives 4, 3. To multiply by a number, multiply both parts.", html: P("(3, −2) + (1, 5) = <b>(4, 3)</b>") + P("2 × (3, −2) = (6, −4)") },
      { h: "Magnitude", say: "The magnitude is the length of the vector. Use Pythagoras: the square root of across squared plus up squared. The vector 3, 4 has magnitude 5.", html: P("|(3, 4)| = √(3² + 4²) = √25 = <b>5</b>") }
    ],
    example: { q: "a = (2, 1) and b = (−1, 3). Find 2a + b.", steps: ["2a = (4, 2).", "2a + b = (4 + (−1), 2 + 3).", "= (3, 5)."] },
    questions: [
      { type: "mcq", q: "What does the vector (−4, 1) mean?", options: ["4 left and 1 up", "4 right and 1 down", "1 left and 4 up", "4 up and 1 left"], answer: 0, hints: ["The first number is across.", "Negative across means left.", "The second number is up."], explain: "−4 across is 4 left; 1 is 1 up." },
      { type: "mcq", q: "Find (2, 5) + (3, −1).", options: ["(5, 4)", "(5, 6)", "(−1, 6)", "(6, −5)"], answer: 0, hints: ["Add the first numbers: 2 + 3.", "Add the second numbers: 5 + (−1).", "(5, 4)."], explain: "(2 + 3, 5 − 1) = (5, 4)." },
      { type: "mcq", q: "a = (1, −2). Find 3a.", options: ["(3, −6)", "(4, 1)", "(3, −2)", "(1, −6)"], answer: 0, hints: ["Multiply both numbers by 3.", "3 × 1 and 3 × (−2).", "(3, −6)."], explain: "3 × (1, −2) = (3, −6)." },
      { type: "num", q: "Find the magnitude of the vector (6, 8).", answer: "10", options: ["10", "14", "48", "100"], hints: ["√(6² + 8²).", "36 + 64 = 100.", "√100."], explain: "√100 = 10." },
      { type: "mcq", q: "Find (5, 2) − (1, 4).", options: ["(4, −2)", "(6, 6)", "(4, 2)", "(−4, 2)"], answer: 0, hints: ["Subtract the first numbers: 5 − 1.", "Subtract the second numbers: 2 − 4.", "(4, −2)."], explain: "(5 − 1, 2 − 4) = (4, −2)." }
    ],
    reflect: R("Across first, then up", "Adding part by part", "Pythagoras for the length"),
    parent: "Your child added and scaled vectors and found their length.",
    teacher: "Shows interpreting column vectors, performing vector addition, subtraction and scalar multiplication, and calculating magnitude.",
    done: "Work part by part, and use Pythagoras for the magnitude." },

  { ...M, id: "cam11-sine-cosine", grade: 11, title: "The sine and cosine rules", topic: "Trigonometry", category: "Problem Solving",
    caps: "Cambridge IGCSE Mathematics (0580), Extended: Trigonometry (sine rule and cosine rule in triangles that are not right-angled)",
    intention: "Today I am solving triangles that are not right-angled.", prompt: "How could a surveyor measure across a river without crossing it?",
    lesson: [
      { h: "Beyond right angles", say: "The sine and cosine rules work in any triangle, not only right-angled ones. Label the sides a, b and c, opposite the angles A, B and C.", html: P("Side <b>a</b> is opposite angle <b>A</b>.") },
      { h: "The sine rule", say: "Use the sine rule when you know a side and the angle opposite it. a over sin A equals b over sin B equals c over sin C.", html: P("a ÷ sin A = b ÷ sin B = c ÷ sin C") },
      { h: "The cosine rule", say: "Use the cosine rule when you know two sides and the angle between them, or all three sides. a squared equals b squared plus c squared minus 2 b c cos A.", html: P("a² = b² + c² − 2bc cos A") }
    ],
    example: { q: "b = 5 cm, c = 8 cm and A = 60°. Find a.", steps: ["a² = 5² + 8² − 2(5)(8) cos 60°.", "cos 60° = 0.5, so a² = 25 + 64 − 40 = 49.", "a = 7 cm."] },
    questions: [
      { type: "mcq", q: "You know two sides and the angle between them. Which rule finds the third side?", options: ["The cosine rule", "The sine rule", "Pythagoras only", "Neither"], answer: 0, hints: ["The angle is between the two sides.", "That matches a² = b² + c² − 2bc cos A.", "The cosine rule."], explain: "Two sides and the included angle: use the cosine rule." },
      { type: "mcq", q: "You know angle A, angle B and side a. Which rule finds side b?", options: ["The sine rule", "The cosine rule", "Pythagoras", "Neither"], answer: 0, hints: ["You have a side and its opposite angle.", "That is a matching pair.", "The sine rule."], explain: "A side with its opposite angle: use the sine rule." },
      { type: "num", q: "b = 3, c = 4 and A = 90°. Use a² = b² + c² − 2bc cos A to find a. (cos 90° = 0)", answer: "5", options: ["5", "7", "25", "1"], hints: ["The last term is 0.", "a² = 9 + 16 = 25.", "√25."], explain: "a² = 25, so a = 5. With a right angle, the cosine rule becomes Pythagoras." },
      { type: "num", q: "a ÷ sin 30° = 10. What is a? (sin 30° = 0.5)", answer: "5", options: ["5", "20", "10", "0.5"], hints: ["a = 10 × sin 30°.", "10 × 0.5.", "5."], explain: "a = 10 × 0.5 = 5." },
      { type: "mcq", q: "In triangle ABC, which side is opposite angle C?", options: ["c", "a", "b", "The longest side"], answer: 0, hints: ["Sides are named after the opposite angle.", "Small letter, capital angle.", "c."], explain: "Side c is opposite angle C." }
    ],
    reflect: R("Labelling the sides and angles", "Choosing the right rule", "Substituting carefully"),
    parent: "Your child used the sine and cosine rules to solve triangles.",
    teacher: "Shows labelling triangles, selecting the sine or cosine rule appropriately, and substituting to find sides.",
    done: "Matching side and angle: sine rule. Two sides and the angle between: cosine rule." },

  { ...M, id: "cam11-tree-diagrams", grade: 11, title: "Probability with tree diagrams", topic: "Probability", category: "Flexible Thinking",
    caps: "Cambridge IGCSE Mathematics (0580): Probability (tree diagrams; combined events; probability with and without replacement)",
    intention: "Today I am using tree diagrams for combined events.", prompt: "Does taking a sweet out of a bag change the chances for the next person?",
    lesson: [
      { h: "Tree diagrams", say: "A tree diagram shows two or more events one after the other. Multiply along the branches to find the probability of a path.", html: P("P(A then B) = P(A) × P(B)") },
      { h: "Adding paths", say: "When more than one path gives the outcome you want, add the probabilities of those paths.", html: P("P(one red) = P(red, blue) + P(blue, red)") },
      { h: "Without replacement", say: "If you don't put the first item back, the probabilities on the second branches change, because there is one item fewer in the bag.", html: P("3 red and 2 blue: P(red, red) = 3/5 × 2/4 = 6/20 = <b>3/10</b>") }
    ],
    example: { q: "A bag has 4 green counters and 1 yellow counter. Two are taken without replacement. Find P(both green).", steps: ["First green: 4/5.", "Second green: 3/4, because one green counter is gone.", "4/5 × 3/4 = 12/20 = 3/5."] },
    questions: [
      { type: "mcq", q: "P(rain) = 0.3 each day, independently. What is P(rain on both of two days)?", options: ["0.09", "0.6", "0.3", "0.9"], answer: 0, hints: ["Multiply along the branches.", "0.3 × 0.3.", "0.09."], explain: "0.3 × 0.3 = 0.09." },
      { type: "mcq", q: "A coin is tossed twice. What is P(two tails)?", options: ["1/4", "1/2", "1/3", "3/4"], answer: 0, hints: ["P(tail) = 1/2 each time.", "Multiply.", "1/2 × 1/2."], explain: "1/2 × 1/2 = 1/4." },
      { type: "mcq", q: "A bag has 2 red and 3 blue counters. One is taken and not replaced. If it was red, what is P(the second is red)?", options: ["1/4", "2/5", "1/5", "2/4"], answer: 0, hints: ["How many are left?", "4 counters, 1 of them red.", "1/4."], explain: "1 red out of 4 remaining = 1/4." },
      { type: "mcq", q: "A bag has 2 red and 3 blue counters. Two are taken without replacement. What is P(red, then red)?", options: ["1/10", "4/25", "2/9", "1/5"], answer: 0, hints: ["First red: 2/5.", "Second red: 1/4.", "2/5 × 1/4 = 2/20."], explain: "2/5 × 1/4 = 2/20 = 1/10." },
      { type: "mcq", q: "On a tree diagram, when do you add probabilities?", options: ["When several paths give the outcome you want", "Along each branch", "Never", "Only with replacement"], answer: 0, hints: ["Along a path you multiply.", "Between paths…", "…you add."], explain: "Multiply along a path; add the paths that give the outcome." }
    ],
    reflect: R("Multiplying along branches", "Adding the paths", "Changing the fractions without replacement"),
    parent: "Your child used tree diagrams to find probabilities of combined events.",
    teacher: "Shows constructing and using tree diagrams, including conditional probability without replacement.",
    done: "Multiply along a path, add between paths, and adjust without replacement." }
  );
}
