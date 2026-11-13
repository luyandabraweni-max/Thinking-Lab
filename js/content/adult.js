"use strict";

// ---------- Learn units: ages 19 to 25 (GETCA-aligned English, Mathematics and ICT, plus life and work skills). Original content. ----------
const GETCA = "Aligned to the General Education and Training Certificate for Adults (GETCA, NQF level 1)";
const LEASE_TEXT = `<div class="passage-text"><p><b>Lease agreement (extract)</b> <span class="muted">(a 2to.iQ practice document)</span></p>
<p><b>1. Rent.</b> The monthly rent is R3 200, payable on or before the 1st day of each month. Rent paid after the 7th will incur a late fee of R150.</p>
<p><b>2. Deposit.</b> The tenant will pay a deposit equal to one month's rent. The deposit will be held in an interest-bearing account and refunded, with interest, within 14 days of the end of the lease, less the cost of repairing damage beyond normal wear and tear.</p>
<p><b>3. Inspection.</b> The landlord and tenant will inspect the property together at the start and end of the lease.</p>
<p><b>4. Notice.</b> Either party may end this lease by giving one calendar month's written notice.</p>
<p><b>5. Utilities.</b> Water and electricity are not included in the rent. The tenant will buy prepaid electricity.</p></div>`;
const UNITS_ADULT = [
  // ===================== ENGLISH (GETCA) =====================
  { id: "ad-forms", grade: 13, subject: "English", title: "Filling in official forms", topic: "Reading and completing forms", domain: "Communication and Expression", category: "Planning and Organisation",
    caps: GETCA + ", English: reading and completing functional texts such as application forms",
    intention: "Today I am learning to complete official forms accurately.", prompt: "Which form have you found confusing before?",
    lesson: [
      { h: "Read first", say: "Read the whole form before you write. Note which fields are compulsory, often marked with a star, and what documents you must attach.", html: chainRow(["Read all", "Find required fields *", "Gather documents"]) + P("Use <b>BLOCK CAPITALS</b> if the form asks for them.") },
      { h: "Common fields", say: "Forms ask for your full names, surname and ID number. They ask for your date of birth in a set format. They also ask for your home address, postal address and contact details.", html: chainRow(["Surname", "Full names", "ID number", "Date of birth (YYYY/MM/DD)", "Address"]) + P("<b>Physical</b> address is where you live. <b>Postal</b> address is where mail goes.") },
      { h: "Check and sign", say: "Check spelling, numbers and dates. Do not leave required fields blank: write N slash A if something does not apply. Sign and date only after checking. Keep a copy.", html: chainRow(["Check", "N/A if not applicable", "Sign and date", "Keep a copy"]) + P("Never sign a blank form.") }
    ],
    example: { q: "A form asks for date of birth as YYYY/MM/DD. You were born on 5 March 2003. What do you write?", steps: ["YYYY is the year: 2003.", "MM is the month: 03. DD is the day: 05.", "2003/03/05."] },
    questions: [
      { type: "mcq", q: "What does a star (*) next to a field usually mean?", options: ["The field is compulsory", "The field is optional", "Skip this field", "It is a mistake"], answer: 0, hints: ["Common on forms.", "You must fill it in.", "Compulsory."], explain: "A star usually marks a required field." },
      { type: "mcq", q: "A field asks for your spouse's name, but you are not married. What should you write?", options: ["N/A", "Leave it blank", "Make up a name", "Your own name"], answer: 0, hints: ["It does not apply.", "Show you saw it.", "N/A."], explain: "N/A shows the field does not apply." },
      { type: "mcq", q: "What is a postal address?", options: ["Where your mail is delivered", "Where you were born", "Your email", "Your workplace only"], answer: 0, hints: ["Post.", "Mail.", "Where mail goes."], explain: "A postal address is where your post is delivered." },
      { type: "mcq", q: "When should you sign a form?", options: ["After checking that everything is correct", "Before filling it in", "Never", "On a blank form"], answer: 0, hints: ["Your signature means you agree.", "Check first.", "After checking."], explain: "Only sign after checking everything." },
      { type: "mcq", q: "Born 21 November 2001. Write it as DD/MM/YYYY.", options: ["21/11/2001", "11/21/2001", "2001/11/21", "21/2001/11"], answer: 0, hints: ["Day first.", "Then month.", "Then year."], explain: "21/11/2001." }
    ],
    reflect: { q: "What will you do next time you fill in a form?", options: ["Read it all first", "Check date formats", "Write N/A when needed", "Keep a copy"] },
    parent: "The learner practised completing official forms accurately.",
    teacher: "Shows reading form instructions, using correct date and address formats, and checking before signing.",
    done: "Read the whole form, fill in every required field correctly, then check and sign." },

  { id: "ad-email", grade: 13, subject: "English", title: "Writing a professional email", topic: "Workplace writing", domain: "Communication and Expression", category: "Communication",
    caps: GETCA + ", English: writing functional texts for work, such as emails and messages",
    intention: "Today I am writing clear, polite emails for work and study.", prompt: "Who might you need to email formally this month?",
    lesson: [
      { h: "Parts of an email", say: "A professional email has a clear subject line and a greeting. Then say why you are writing, and give the details. End politely, with your name and contact number.", html: chainRow(["Subject", "Greeting", "Purpose", "Details", "Closing", "Name"]) },
      { h: "Clear and short", say: "Say why you are writing in the first sentence. Use short paragraphs. Ask for one clear action, such as please confirm the time.", html: `<div class="passage-text"><p><b>Subject:</b> Application for Admin Assistant post, ref 24/07</p><p>Dear Ms Naidoo</p><p>I am applying for the Admin Assistant post advertised on your website. Please find my CV attached.</p><p>Kind regards<br>Sipho Mokoena<br>072 000 0000</p></div>` },
      { h: "Tone and checking", say: "Avoid slang, emojis and all capitals, which look like shouting. Check names and spelling, and attach any files you mention before you press send.", html: chainRow(["No slang", "No ALL CAPS", "Check attachments", "Reread"]) }
    ],
    example: { q: "Which subject line is better: Hi or Request to reschedule interview, 14 March?", steps: ["The subject should tell the reader what the email is about.", "Hi says nothing.", "Request to reschedule interview, 14 March is clear."] },
    questions: [
      { type: "mcq", q: "Which is the most professional greeting?", options: ["Dear Mr Khumalo", "Yo boss", "Hey!!!", "Sup"], answer: 0, hints: ["Formal.", "Use the person's title.", "Dear Mr Khumalo."], explain: "Dear plus title and surname is professional." },
      { type: "mcq", q: "Where should you state why you are writing?", options: ["In the first sentence", "At the very end", "Nowhere", "In the subject line only"], answer: 0, hints: ["Get to the point.", "Early.", "First sentence."], explain: "State your purpose in the first sentence." },
      { type: "mcq", q: "Why avoid writing in ALL CAPITALS?", options: ["It looks like shouting", "It is faster", "It is more formal", "Computers cannot read it"], answer: 0, hints: ["How does it feel to read?", "Loud.", "Shouting."], explain: "All capitals reads like shouting." },
      { type: "mcq", q: "Which closing is professional?", options: ["Kind regards", "Later", "Bye bye", "Love you"], answer: 0, hints: ["Polite and formal.", "Common in work emails.", "Kind regards."], explain: "Kind regards is a professional closing." },
      { type: "order", q: "Put the parts of an email in order.", items: ["Subject line", "Greeting", "Purpose", "Closing", "Your name and number"], orderLabel: "top to bottom", hints: ["The subject comes first.", "Then greet.", "Sign off last."], explain: "Subject, greeting, purpose, closing, name." }
    ],
    reflect: { q: "What will you check before sending?", options: ["Subject line", "Tone", "Spelling and names", "Attachments"] },
    parent: "The learner practised writing professional emails.",
    teacher: "Shows structuring an email, stating purpose clearly, appropriate register and checking before sending.",
    done: "Clear subject, polite greeting, purpose first, check before you send." },

  { id: "ad-lease", grade: 13, subject: "English", title: "Reading a lease agreement", topic: "Reading contracts", domain: "Communication and Expression", category: "Problem Solving",
    caps: GETCA + ", English: reading for understanding in everyday documents such as contracts; links to the Rental Housing Act",
    intention: "Today I am reading a lease carefully so I know my rights and duties.", prompt: "What would you ask a landlord before signing?",
    passage: LEASE_TEXT,
    lesson: [
      { h: "Read the extract", say: "Read the lease extract, or press Read aloud to hear it part by part.", html: LEASE_TEXT },
      { h: "Key terms", say: "The tenant rents the property. The landlord owns it. The deposit is money held as security. Notice is the warning you must give before ending the lease.", html: chainRow(["Tenant", "Landlord", "Deposit", "Notice"]) + P("Read every clause before you sign.") },
      { h: "Your rights", say: "South Africa's Rental Housing Act has rules about deposits. The deposit must be kept in an account that earns interest. The landlord and tenant should check the property together at the start and at the end. Disputes can go to the Rental Housing Tribunal in your province.", html: chainRow(["Interest on deposit", "Joint inspection", "Rental Housing Tribunal"]) + P("Take dated photos of the property when you move in.") }
    ],
    example: { q: "You pay rent on the 9th. What happens, according to the lease?", steps: ["Rent is due on or before the 1st.", "Paying after the 7th incurs a late fee.", "You pay R3 200 plus a R150 late fee."] },
    questions: [
      { type: "mcq", q: "How much is the deposit?", options: ["R3 200", "R150", "R6 400", "Nothing"], answer: 0, hints: ["One month's rent.", "Rent is R3 200.", "R3 200."], explain: "The deposit equals one month's rent: R3 200." },
      { type: "mcq", q: "Within how many days must the deposit be refunded?", options: ["14 days", "7 days", "30 days", "1 year"], answer: 0, hints: ["Clause 2.", "After the lease ends.", "14 days."], explain: "Within 14 days of the end of the lease." },
      { type: "mcq", q: "What can be deducted from the deposit?", options: ["Cost of damage beyond normal wear and tear", "Any amount the landlord wants", "The interest", "Nothing at all"], answer: 0, hints: ["Clause 2.", "Normal wear is allowed.", "Damage beyond that."], explain: "Only repair costs for damage beyond normal wear and tear." },
      { type: "mcq", q: "How much notice must you give to end the lease?", options: ["One calendar month, in writing", "One day", "A phone call", "None"], answer: 0, hints: ["Clause 4.", "Written.", "One month."], explain: "One calendar month's written notice." },
      { type: "mcq", q: "Why take dated photos when you move in?", options: ["To prove the condition if there is a dispute about damage", "For social media", "It is not useful", "To sell the property"], answer: 0, hints: ["Evidence.", "Deposit disputes.", "Proof of condition."], explain: "Photos prove the property's condition at the start." }
    ],
    reflect: { q: "What will you check before signing a lease?", options: ["The deposit rules", "Notice period", "Who pays utilities", "Late fees"] },
    parent: "The learner read a lease agreement and identified tenant rights and responsibilities.",
    teacher: "Shows reading contractual clauses, extracting key details and knowing tenant protections.",
    done: "Read every clause, know your rights, and keep evidence." },

  // ===================== MATHEMATICS (GETCA) =====================
  { id: "ad-budget", grade: 13, subject: "Mathematics", title: "Making a monthly budget", topic: "Personal finance", domain: "Logical and Analytical Thinking", category: "Planning and Organisation",
    caps: GETCA + ", Mathematics: number and calculations in personal finance (income, expenses, budgets)",
    intention: "Today I am planning a monthly budget so my money lasts.", prompt: "Which expense surprises you most each month?",
    lesson: [
      { h: "Income and expenses", say: "Income is money coming in. Expenses are money going out. Fixed expenses stay the same, like rent. Variable expenses change, like food and data.", html: chainRow(["Income", "−", "Expenses", "=", "What's left"]) + P("<b>Fixed</b>: rent, transport pass. <b>Variable</b>: food, airtime.") },
      { h: "Needs, wants and savings", say: "Pay needs first: housing, food, transport. Then save a small amount, even R50, before spending on wants.", html: chainRow(["Needs", "Savings", "Wants"]) + P("Pay yourself first: <b>save</b> before you spend on wants.") },
      { h: "Track and adjust", say: "Write down what you actually spend. If expenses are more than income, cut variable costs or find ways to earn more.", html: chainRow(["Plan", "Track", "Compare", "Adjust"]) }
    ],
    example: { q: "Income R6 500. Rent R2 500, transport R1 200, food R1 800, airtime R300. How much is left?", steps: ["Add expenses: 2 500 + 1 200 + 1 800 + 300 = R5 800.", "Subtract from income: 6 500 − 5 800.", "R700 left for savings and other costs."] },
    questions: [
      { type: "mcq", q: "Which is a fixed expense?", options: ["Monthly rent", "Groceries", "Takeaways", "Entertainment"], answer: 0, hints: ["Same every month.", "Agreed in a lease.", "Rent."], explain: "Rent stays the same each month." },
      { type: "num", q: "Income R8 000, expenses R7 350. How much is left?", answer: "R650", options: ["R650", "R750", "R1 650", "R15 350"], hints: ["Income minus expenses.", "8 000 − 7 350.", "R650."], explain: "R650 left." },
      { type: "mcq", q: "Which is a need?", options: ["Transport to work", "New sneakers", "Streaming subscription", "Eating out"], answer: 0, hints: ["Needed to live or earn.", "Getting to work.", "Transport."], explain: "Transport to work is a need." },
      { type: "num", q: "You save R150 a month. How much after one year?", answer: "R1 800", options: ["R1 800", "R1 500", "R150", "R18 000"], hints: ["12 months.", "150 × 12.", "R1 800."], explain: "R150 × 12 = R1 800." },
      { type: "mcq", q: "Your expenses are higher than your income. What is a good first step?", options: ["Cut variable spending", "Borrow more", "Ignore it", "Stop paying rent"], answer: 0, hints: ["Which costs can change?", "Food, airtime, extras.", "Cut variable spending."], explain: "Reduce variable costs first." }
    ],
    reflect: { q: "What will you try?", options: ["Writing a budget", "Tracking my spending", "Saving first", "Cutting a want"] },
    parent: "The learner planned a monthly budget with income, expenses and savings.",
    teacher: "Shows classifying expenses, calculating surplus or deficit and prioritising needs and savings.",
    done: "Income minus expenses: pay needs first, save next, then wants." },

  { id: "ad-payslip", grade: 13, subject: "Mathematics", title: "Reading a payslip", topic: "Gross pay, deductions and net pay", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: GETCA + ", Mathematics: percentages and calculations in the workplace (wages, deductions); links to the Basic Conditions of Employment Act",
    intention: "Today I am reading a payslip and checking the deductions.", prompt: "Why is it important to check your payslip?",
    lesson: [
      { h: "Gross and net pay", say: "Gross pay is what you earn before deductions. Net pay is what you actually receive after deductions.", html: chainRow(["Gross pay", "−", "Deductions", "=", "Net pay"]) },
      { h: "Common deductions", say: "UIF is the Unemployment Insurance Fund. You pay one percent of your pay, and your employer pays another one percent. PAYE is income tax, deducted if you earn above the tax threshold.", html: chainRow(["UIF 1%", "PAYE (income tax)", "Pension or medical aid"]) + P("UIF supports you if you lose your job, go on maternity leave or get sick.") },
      { h: "Hourly and overtime", say: "If you are paid by the hour, gross pay is hours times the rate. Overtime is usually paid at one and a half times the normal rate.", html: chainRow(["Hours × rate", "Overtime × 1,5"]) + P("Employers must give you a payslip each pay day.") }
    ],
    example: { q: "Gross pay R7 000. UIF is 1%. How much is the UIF deduction?", steps: ["1% means divide by 100.", "7 000 ÷ 100 = 70.", "UIF deduction: R70."] },
    questions: [
      { type: "mcq", q: "What is net pay?", options: ["Pay after deductions", "Pay before deductions", "Overtime only", "Your bonus"], answer: 0, hints: ["What arrives in your account.", "After money is taken off.", "After deductions."], explain: "Net pay is what you receive after deductions." },
      { type: "num", q: "Gross pay R5 500. UIF at 1%. What is the deduction?", answer: "R55", options: ["R55", "R550", "R5,50", "R110"], hints: ["1% of 5 500.", "5 500 ÷ 100.", "R55."], explain: "R55." },
      { type: "num", q: "You work 40 hours at R30 per hour. What is your gross pay?", answer: "R1 200", options: ["R1 200", "R70", "R1 000", "R120"], hints: ["Hours × rate.", "40 × 30.", "R1 200."], explain: "40 × R30 = R1 200." },
      { type: "num", q: "Normal rate R30 per hour. What is the overtime rate at 1,5 times?", answer: "R45", options: ["R45", "R31,50", "R60", "R33"], hints: ["30 × 1,5.", "Half of 30 is 15.", "30 + 15."], explain: "R45 per hour." },
      { type: "mcq", q: "What does UIF help with?", options: ["Income if you lose your job", "Buying a car", "Paying school fees", "Holidays"], answer: 0, hints: ["Unemployment Insurance.", "When you're out of work.", "Lost income."], explain: "UIF pays benefits if you become unemployed, among other cases." }
    ],
    reflect: { q: "What will you check on your payslip?", options: ["Hours worked", "Rate of pay", "Deductions", "Net pay"] },
    parent: "The learner read a payslip and calculated gross pay, UIF and overtime.",
    teacher: "Shows distinguishing gross and net pay, calculating percentage deductions, hourly pay and overtime.",
    done: "Gross minus deductions equals net pay. Check your payslip every time." },

  { id: "ad-bestbuy", grade: 13, subject: "Mathematics", title: "Finding the best buy", topic: "Unit prices and comparing value", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: GETCA + ", Mathematics: ratio, rate and measurement in everyday contexts (unit prices, comparing value)",
    intention: "Today I am comparing prices to find the best value.", prompt: "Is the biggest pack always the best buy?",
    lesson: [
      { h: "Unit price", say: "To compare products of different sizes, find the unit price. That is the price for one unit, such as one kilogram or one litre.", html: chainRow(["Price ÷ quantity", "=", "unit price"]) + P("Many shop labels show the unit price in small print.") },
      { h: "An example", say: "Two kilograms of rice for R40 is R20 per kilogram. Five kilograms for R90 is R18 per kilogram. The bigger bag is cheaper per kilogram.", html: chainRow(["2 kg: R40 → R20/kg", "5 kg: R90 → R18/kg"]) },
      { h: "Think beyond price", say: "The best buy also depends on three things. Can you afford it now? Will it spoil before you use it? Do you have space to store it?", html: chainRow(["Unit price", "Can I afford it?", "Will it spoil?"]) + P("Bulk buying with neighbours or a stokvel can lower costs.") }
    ],
    example: { q: "500 ml of oil costs R25. 2 litres costs R80. Which is cheaper per litre?", steps: ["500 ml is half a litre: R25 × 2 = R50 per litre.", "2 litres for R80: R40 per litre.", "The 2-litre bottle is cheaper per litre."] },
    questions: [
      { type: "num", q: "A 3 kg bag of maize meal costs R45. What is the price per kg?", answer: "R15", options: ["R15", "R135", "R48", "R42"], hints: ["Price ÷ kg.", "45 ÷ 3.", "R15."], explain: "R15 per kg." },
      { type: "mcq", q: "Which is the better buy: 1 kg for R22 or 2,5 kg for R50?", options: ["2,5 kg for R50", "1 kg for R22", "They are the same"], answer: 0, hints: ["Find price per kg.", "R50 ÷ 2,5 = R20.", "R20 is less than R22."], explain: "2,5 kg works out at R20/kg." },
      { type: "mcq", q: "Why might the cheapest unit price NOT be the best buy?", options: ["It might spoil before you use it", "Big packs are illegal", "Unit prices are always wrong", "It is always best"], answer: 0, hints: ["Think about waste.", "Fresh food goes off.", "Spoiling."], explain: "If it spoils, you waste money." },
      { type: "num", q: "6 eggs cost R21. What is the price per egg?", answer: "R3,50", options: ["R3,50", "R3", "R4", "R126"], hints: ["21 ÷ 6.", "6 × 3 = 18, 3 left.", "R3,50."], explain: "R21 ÷ 6 = R3,50." },
      { type: "mcq", q: "What is a stokvel?", options: ["A savings or buying group", "A type of bank loan", "A shop", "A tax"], answer: 0, hints: ["Common in South Africa.", "Members contribute together.", "A savings group."], explain: "A stokvel is a group that saves or buys together." }
    ],
    reflect: { q: "What will you do when shopping?", options: ["Check unit prices", "Think about spoilage", "Buy in bulk with others", "Stick to my list"] },
    parent: "The learner calculated unit prices to compare value when shopping.",
    teacher: "Shows calculating and comparing unit prices, converting units and weighing practical factors.",
    done: "Compare unit prices, then think about budget, storage and spoilage." },

  // ===================== INFORMATION AND COMMUNICATION TECHNOLOGY =====================
  { id: "ad-scams", grade: 13, subject: "Information and Communication Technology", title: "Staying safe from scams", topic: "Online safety", domain: "Inquiry and Systems Thinking", category: "Problem Solving",
    caps: GETCA + ", Information and Communication Technology elective: safe and responsible use of digital devices and the internet",
    intention: "Today I am learning to spot and avoid scams.", prompt: "Have you received a message that looked like a scam?",
    lesson: [
      { h: "Common scams", say: "Here are common scams. A fake job offer asks you to pay a fee. A message pretends to be from your bank. You win a prize you never entered. Someone asks you for money urgently.", html: chainRow(["Fake jobs", "Bank phishing", "Fake prizes", "Urgent money requests"]) },
      { h: "Warning signs", say: "Watch for these warning signs. Someone rushes you. Someone asks for a password or a one-time PIN. You must pay to get a job. There are spelling mistakes, or a link does not match the real website.", html: chainRow(["Urgent!", "Asks for PIN or OTP", "Pay to get a job", "Strange link"]) + P("A real bank will <b>never</b> ask for your PIN or OTP.") },
      { h: "What to do", say: "Do not click links or share codes. Contact the organisation using a number from their official website or your card. Report scams and warn others. Use strong, different passwords.", html: chainRow(["Don't click", "Call the official number", "Report", "Strong passwords"]) }
    ],
    example: { q: "An SMS says: Your account is blocked. Click here and enter your OTP to unlock. What should you do?", steps: ["Urgency plus a request for an OTP are warning signs.", "Do not click or share anything.", "Call your bank on the number on the back of your card."] },
    questions: [
      { type: "mcq", q: "A job advert asks you to pay R300 for training before you start. What is it likely to be?", options: ["A scam", "A normal job", "A bursary", "A learnership"], answer: 0, hints: ["Real employers pay you.", "Paying to get a job is a warning sign.", "A scam."], explain: "Asking you to pay for a job is a classic scam." },
      { type: "mcq", q: "Who should you share your OTP with?", options: ["Nobody", "The bank caller", "A friend", "Anyone who asks politely"], answer: 0, hints: ["One-time PIN.", "It approves transactions.", "Nobody."], explain: "Never share your OTP with anyone." },
      { type: "mcq", q: "Which is the safest way to check if a message from your bank is real?", options: ["Call the number on your card", "Reply to the SMS", "Click the link", "Call the number in the message"], answer: 0, hints: ["Use a number you trust.", "Not from the message.", "The number on your card."], explain: "Use the official number you already trust." },
      { type: "mcq", q: "Which password is strongest?", options: ["Blue!Taxi7Mango", "123456", "password", "your name"], answer: 0, hints: ["Long and mixed.", "Hard to guess.", "Blue!Taxi7Mango."], explain: "A long mix of words, numbers and symbols is strongest." },
      { type: "sort", q: "Warning sign or safe?", items: ["Pay a fee to get the job", "Official website address you typed yourself", "Urgent request for your PIN", "Calling the number on your bank card"], bins: ["Warning sign", "Safe"], answer: [0, 1, 0, 1], hints: ["Fees and PIN requests are warnings.", "Using official contacts is safe.", "Sort each."], explain: "Fees and PIN requests are warning signs." }
    ],
    reflect: { q: "What will you do?", options: ["Never share OTPs", "Check before clicking", "Use stronger passwords", "Warn my family"] },
    parent: "The learner learned to recognise and avoid common scams.",
    teacher: "Shows identifying scam tactics, protecting credentials and verifying through official channels.",
    done: "Never share PINs or OTPs, and check with the real organisation." },

  { id: "ad-spreadsheet", grade: 13, subject: "Information and Communication Technology", title: "Spreadsheet basics", topic: "Using a spreadsheet", domain: "Logical and Analytical Thinking", category: "Planning and Organisation",
    caps: GETCA + ", Information and Communication Technology elective: using application software such as spreadsheets",
    intention: "Today I am learning how spreadsheets organise and calculate data.", prompt: "What could you track with a spreadsheet?",
    lesson: [
      { h: "Cells, rows and columns", say: "A spreadsheet is a grid. Columns have letters, rows have numbers, and each box is a cell with an address, like B3.", html: chainRow(["Column B", "Row 3", "Cell B3"]) + P("Free spreadsheet apps work on phones too.") },
      { h: "Formulas", say: "A formula starts with an equals sign. Equals B2 plus B3 adds two cells. Equals SUM of B2 to B10 adds a whole range.", html: chainRow(["=B2+B3", "=SUM(B2:B10)", "=AVERAGE(B2:B10)"]) + P("Change a number and the answer <b>updates</b> automatically.") },
      { h: "Uses", say: "Spreadsheets are used for budgets, stock lists, timesheets and sales records. Many entry-level office jobs ask for basic spreadsheet skills.", html: chainRow(["Budgets", "Stock", "Timesheets", "Sales"]) }
    ],
    example: { q: "Your weekly sales are in cells C2 to C8. What formula gives the total?", steps: ["You want to add a range.", "Use SUM with the first and last cell.", "=SUM(C2:C8)."] },
    questions: [
      { type: "mcq", q: "What does a formula start with?", options: ["=", "+", "#", "SUM"], answer: 0, hints: ["Equals.", "Tells the spreadsheet to calculate.", "="], explain: "Formulas start with =." },
      { type: "mcq", q: "What is cell D5?", options: ["Column D, row 5", "Row D, column 5", "The 5th sheet", "A formula"], answer: 0, hints: ["Letter is the column.", "Number is the row.", "Column D, row 5."], explain: "D5 is column D, row 5." },
      { type: "mcq", q: "Which formula adds A1 to A20?", options: ["=SUM(A1:A20)", "=A1-A20", "=ADD(A1,A20)", "SUM A1 A20"], answer: 0, hints: ["SUM and a range.", "Colon for a range.", "=SUM(A1:A20)."], explain: "=SUM(A1:A20)." },
      { type: "mcq", q: "What does =AVERAGE(B2:B6) do?", options: ["Finds the mean of those cells", "Adds them", "Finds the biggest", "Counts them"], answer: 0, hints: ["Average.", "The mean.", "Mean of the cells."], explain: "It calculates the mean." },
      { type: "mcq", q: "Why use a formula instead of typing the answer?", options: ["It updates when the numbers change", "It looks nicer", "It is slower", "It is required by law"], answer: 0, hints: ["Change a value…", "The total changes too.", "Automatic updates."], explain: "Formulas recalculate automatically." }
    ],
    reflect: { q: "What would you track first?", options: ["My budget", "Sales", "Hours worked", "Savings"] },
    parent: "The learner learned spreadsheet basics: cells, formulas and SUM.",
    teacher: "Shows cell referencing, writing simple formulas and functions, and practical uses.",
    done: "Spreadsheets use cells and formulas to calculate for you." },

  // ===================== LIFE AND WORK SKILLS =====================
  { id: "ad-jobsearch", grade: 13, subject: "Life and work skills", title: "Finding work", topic: "Job search", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "Life and work skills: job search strategies, linked to the Department of Employment and Labour and youth employment services",
    intention: "Today I am planning a job search that uses many routes.", prompt: "Which job search route have you not tried yet?",
    lesson: [
      { h: "Many routes", say: "Look for work on job sites and company websites, and through recruitment agencies. Use ESSA, the job system of the Department of Employment and Labour. Try youth employment programmes, and ask people you know.", html: chainRow(["Job sites", "Company websites", "Labour centres (ESSA)", "Youth programmes", "Your network"]) + P("Many jobs are filled through <b>word of mouth</b>.") },
      { h: "Be ready", say: "Have an updated CV, and certified copies of your ID and qualifications. You also need a professional email address, and a phone with airtime and data.", html: chainRow(["CV", "Certified copies", "Email", "Airtime"]) + P("Keep digital copies on your phone.") },
      { h: "Stay organised", say: "Keep a list of where you applied, the date, the contact person and any follow-up. Follow up politely after one or two weeks.", html: chainRow(["Where", "When", "Contact", "Follow-up"]) + P("Rejections are normal. Keep going and keep learning.") }
    ],
    example: { q: "Ayanda applies for 10 jobs online and hears nothing. What else could she do?", steps: ["Register on ESSA and with youth employment programmes.", "Ask people she knows about openings, and visit local businesses with her CV.", "Keep a list and follow up on her applications."] },
    questions: [
      { type: "mcq", q: "What is ESSA?", options: ["The Department of Employment and Labour's job-seeker system", "A bank", "A university", "A clothing shop"], answer: 0, hints: ["Employment Services of South Africa.", "Government.", "Job-seeker database."], explain: "ESSA is the department's employment services system." },
      { type: "mcq", q: "What is networking in a job search?", options: ["Telling people you know that you are looking for work", "Fixing internet cables", "Only using social media", "Applying online only"], answer: 0, hints: ["People you know.", "Word of mouth.", "Telling your network."], explain: "Networking means using your contacts." },
      { type: "mcq", q: "Why keep a list of applications?", options: ["To follow up and stay organised", "It is not useful", "To show off", "To apply twice"], answer: 0, hints: ["Track progress.", "Remember who to call.", "Organised."], explain: "A list helps you follow up." },
      { type: "mcq", q: "When should you follow up on an application?", options: ["After one or two weeks, politely", "Every hour", "Never", "Before applying"], answer: 0, hints: ["Give them time.", "Be polite.", "1–2 weeks."], explain: "A polite follow-up after a week or two is reasonable." },
      { type: "mcq", q: "Which documents should you have ready?", options: ["CV and certified copies of ID and qualifications", "Only a photo", "Nothing", "Your bank PIN"], answer: 0, hints: ["What do employers ask for?", "Proof of who you are and what you've done.", "CV and certified copies."], explain: "A CV and certified copies are usually needed." }
    ],
    reflect: { q: "What will you do this week?", options: ["Update my CV", "Register on ESSA", "Tell my network", "Start an application list"] },
    parent: "The learner planned a job search using several routes.",
    teacher: "Shows identifying job search channels, preparing documents and organising applications.",
    done: "Use many routes, be ready with documents, and stay organised." },

  { id: "ad-workrights", grade: 13, subject: "Life and work skills", title: "Your rights at work", topic: "Basic Conditions of Employment", domain: "Inquiry and Systems Thinking", category: "Reflection",
    caps: "Life and work skills: workers' rights under the Basic Conditions of Employment Act, the National Minimum Wage Act and the Unemployment Insurance Act",
    intention: "Today I am learning my basic rights as a worker in South Africa.", prompt: "Which workplace right did you not know about?",
    lesson: [
      { h: "Contracts and pay", say: "You should get a written description of your job, pay and hours. There is a national minimum wage, updated every year. Check the current rate on the Department of Employment and Labour's website.", html: chainRow(["Written particulars", "Minimum wage", "Payslip"]) },
      { h: "Hours and leave", say: "The ordinary maximum is 45 hours a week. Full-time workers get annual leave of 21 consecutive days, or 15 working days, a year, and sick leave. Overtime must be agreed and paid at a higher rate.", html: chainRow(["Max 45 hours/week", "Annual leave", "Sick leave", "Overtime paid extra"]) },
      { h: "Getting help", say: "If your rights are not respected, raise it with your employer first. You can contact the Department of Employment and Labour, or the CCMA for unfair dismissal and disputes. A trade union can also help.", html: chainRow(["Talk to employer", "Department of Employment and Labour", "CCMA", "Union"]) + P("Keep copies of payslips and messages as evidence.") }
    ],
    example: { q: "Lerato is told to work 55 hours a week with no overtime pay. Is this allowed?", steps: ["Ordinary hours are capped at 45 a week.", "Overtime must be agreed and paid at a higher rate.", "No. She can raise it with her employer, then the Department of Employment and Labour."] },
    questions: [
      { type: "mcq", q: "What is the maximum ordinary working week?", options: ["45 hours", "60 hours", "35 hours", "No limit"], answer: 0, hints: ["Set by the BCEA.", "More than 40.", "45 hours."], explain: "45 ordinary hours a week." },
      { type: "mcq", q: "Where can you take an unfair dismissal dispute?", options: ["The CCMA", "SARS", "The IEC", "A bank"], answer: 0, hints: ["Commission for Conciliation, Mediation and Arbitration.", "Labour disputes.", "CCMA."], explain: "The CCMA handles unfair dismissal disputes." },
      { type: "mcq", q: "How often is the national minimum wage usually updated?", options: ["Every year", "Never", "Every 10 years", "Every day"], answer: 0, hints: ["It changes.", "Annually.", "Every year."], explain: "It is reviewed and updated annually." },
      { type: "mcq", q: "Why keep copies of payslips?", options: ["As evidence if there is a dispute", "For fun", "They are not important", "To sell them"], answer: 0, hints: ["Proof.", "Disputes.", "Evidence."], explain: "Payslips are evidence of what you were paid." },
      { type: "mcq", q: "What should overtime be?", options: ["Agreed and paid at a higher rate", "Unpaid", "Forced", "Paid less"], answer: 0, hints: ["Extra hours.", "More pay.", "Agreed and paid more."], explain: "Overtime must be agreed and paid at a higher rate." }
    ],
    reflect: { q: "What will you do?", options: ["Ask for written terms", "Check the minimum wage", "Keep my payslips", "Know where to get help"] },
    parent: "The learner learned basic workplace rights and where to get help.",
    teacher: "Shows knowledge of key BCEA provisions, minimum wage, and dispute routes including the CCMA.",
    done: "Know your hours, leave and pay rights, and where to get help." },

  { id: "ad-credit", grade: 13, subject: "Life and work skills", title: "Credit and debt", topic: "Borrowing wisely", domain: "Logical and Analytical Thinking", category: "Problem Solving",
    caps: "Life and work skills: consumer finance, linked to the National Credit Act (credit agreements, credit records, debt counselling)",
    intention: "Today I am learning how credit works and how to avoid debt traps.", prompt: "When is borrowing a good idea, and when is it risky?",
    lesson: [
      { h: "How credit works", say: "Credit is borrowed money that you repay with interest and fees. Store cards, personal loans, cellphone contracts and lay-bys on credit are all forms of credit.", html: chainRow(["Borrow", "Interest + fees", "Repay more"]) + P("Always ask: what is the <b>total</b> I will repay?") },
      { h: "Your credit record", say: "Credit bureaus keep a record of how you repay. Missed payments lower your score and make borrowing harder. You can get a free credit report once a year from each credit bureau.", html: chainRow(["Pay on time", "Good record", "Easier borrowing"]) },
      { h: "Debt traps and help", say: "Borrowing to repay other debt, or using illegal lenders who keep your ID or bank card, can trap you. If you are struggling, a registered debt counsellor can help you restructure your debt.", html: chainRow(["No loan to pay a loan", "Never give away your ID or card", "Debt counsellor"]) + P("Lenders must be registered with the <b>National Credit Regulator</b>.") }
    ],
    example: { q: "A phone costs R6 000 cash, or R399 a month for 24 months. How much more does credit cost?", steps: ["Total on credit: 399 × 24 = R9 576.", "Difference: 9 576 − 6 000.", "R3 576 more."] },
    questions: [
      { type: "num", q: "R250 a month for 12 months. What is the total repaid?", answer: "R3 000", options: ["R3 000", "R2 500", "R262", "R250"], hints: ["Payment × months.", "250 × 12.", "R3 000."], explain: "R3 000." },
      { type: "mcq", q: "What happens if you miss payments?", options: ["Your credit record is damaged", "Nothing", "You get a reward", "The debt disappears"], answer: 0, hints: ["Bureaus record it.", "Future borrowing is harder.", "Damaged record."], explain: "Missed payments damage your credit record." },
      { type: "mcq", q: "A lender asks to keep your bank card and PIN. What does this signal?", options: ["An illegal lender", "A normal bank", "A free service", "A bursary"], answer: 0, hints: ["This is not allowed.", "Registered lenders don't do this.", "Illegal."], explain: "Keeping your card and PIN is illegal practice." },
      { type: "mcq", q: "How often can you get a free credit report from each bureau?", options: ["Once a year", "Never", "Every day", "Once in a lifetime"], answer: 0, hints: ["It's your right.", "Annual.", "Once a year."], explain: "You can get one free report a year from each bureau." },
      { type: "mcq", q: "Who can help if you are over-indebted?", options: ["A registered debt counsellor", "An illegal lender", "Nobody", "A lottery"], answer: 0, hints: ["Registered professional.", "Restructures debt.", "Debt counsellor."], explain: "A registered debt counsellor can help." }
    ],
    reflect: { q: "What will you do?", options: ["Compare total cost", "Check my credit report", "Avoid illegal lenders", "Pay on time"] },
    parent: "The learner learned how credit, interest and credit records work, and how to avoid debt traps.",
    teacher: "Shows calculating total cost of credit, understanding credit records and recognising illegal lending and support options.",
    done: "Check the total cost, pay on time, and avoid illegal lenders." },

  { id: "ad-independent", grade: 13, subject: "Life and work skills", title: "Living independently", topic: "Running a household", domain: "Inquiry and Systems Thinking", category: "Planning and Organisation",
    caps: "Life and work skills: independent living (housing, utilities, transport, health services and personal documents)",
    intention: "Today I am planning the practical parts of living on my own.", prompt: "Which part of living independently feels hardest?",
    lesson: [
      { h: "Utilities", say: "Plan for water, electricity and data. Prepaid electricity helps you control spending. Switch off appliances at the wall and use a geyser blanket or timer to save electricity.", html: chainRow(["Water", "Electricity", "Data"]) + P("Load-shedding apps help you plan around outages.") },
      { h: "Documents and services", say: "Keep your ID, bank details, tax number if you have one, and medical information safe, with copies. Register at your local clinic. Know where your nearest police station and hospital are.", html: chainRow(["ID", "Bank details", "Clinic card", "Emergency numbers"]) + P("Emergency: 10111 police, 10177 ambulance, 112 from a cellphone.") },
      { h: "Routines", say: "Weekly routines help: plan meals, shop with a list, clean regularly and keep a calendar for bills and appointments.", html: chainRow(["Meal plan", "Shopping list", "Cleaning", "Calendar"]) }
    ],
    example: { q: "Zanele's electricity runs out by the 20th every month. What could help?", steps: ["Check which appliances use most: geyser, heater, stove.", "Use a geyser timer, cook with lids on pots, and switch off at the wall.", "Budget a set amount of prepaid each week rather than buying it all at once."] },
    questions: [
      { type: "mcq", q: "Which appliance often uses the most electricity at home?", options: ["The geyser", "A phone charger", "An LED bulb", "A radio"], answer: 0, hints: ["Heating water.", "Big and always on.", "Geyser."], explain: "Geysers use a large share of home electricity." },
      { type: "mcq", q: "What number do you call from a cellphone in an emergency?", options: ["112", "100", "411", "1234"], answer: 0, hints: ["Works on any network.", "Three digits.", "112."], explain: "112 works from a cellphone." },
      { type: "mcq", q: "Why keep copies of your ID and documents?", options: ["In case originals are lost or stolen", "To sell them", "No reason", "To give to strangers"], answer: 0, hints: ["Backup.", "Replacing documents is slow.", "In case of loss."], explain: "Copies help if originals are lost." },
      { type: "mcq", q: "Which is a good way to save on electricity?", options: ["Switch appliances off at the wall", "Leave the geyser on high all day", "Keep lights on in empty rooms", "Open the fridge often"], answer: 0, hints: ["Standby uses power.", "Off at the wall.", "Switch off."], explain: "Switching off at the wall stops standby power use." },
      { type: "order", q: "Put a weekly routine in order.", items: ["Plan meals", "Write a shopping list", "Shop", "Cook and store food"], orderLabel: "first to last", hints: ["Plan first.", "Then list.", "Then shop and cook."], explain: "Plan meals, list, shop, cook." }
    ],
    reflect: { q: "What will you set up first?", options: ["A utilities budget", "Copies of documents", "Clinic registration", "A weekly routine"] },
    parent: "The learner planned for utilities, documents, services and routines for independent living.",
    teacher: "Shows planning utilities, safeguarding documents, knowing services and building household routines.",
    done: "Plan utilities, keep documents safe, know your services, and build routines." }
];
const WORDS_ADULT = {
  "ad-forms": { words: [["⭐", "Compulsory", "must be filled in"], ["🚫", "N/A", "not applicable, it does not apply to you"]] },
  "ad-email": { words: [["✉️", "Subject line", "the short title of an email"], ["📎", "Attachment", "a file sent with an email"]] },
  "ad-lease": { words: [["🏠", "Tenant", "the person renting"], ["🔑", "Landlord", "the owner of the property"], ["💰", "Deposit", "money held as security"]] },
  "ad-budget": { words: [["📌", "Fixed expense", "a cost that stays the same"], ["🔄", "Variable expense", "a cost that changes"]] },
  "ad-payslip": { words: [["💵", "Gross pay", "pay before deductions"], ["👛", "Net pay", "pay after deductions"], ["🛡️", "UIF", "Unemployment Insurance Fund"]] },
  "ad-bestbuy": { words: [["🏷️", "Unit price", "the price for one unit, like per kilogram"], ["🤝", "Stokvel", "a group that saves or buys together"]] },
  "ad-scams": { words: [["🎣", "Phishing", "tricking people into giving private details"], ["🔢", "OTP", "one-time PIN"]] },
  "ad-spreadsheet": { words: [["🔲", "Cell", "one box in a spreadsheet"], ["🧮", "Formula", "a calculation starting with ="]] },
  "ad-jobsearch": { words: [["🏛️", "ESSA", "the government's job-seeker system"], ["📑", "Certified copy", "a copy officially stamped as true"]] },
  "ad-workrights": { words: [["⚖️", "CCMA", "Commission for Conciliation, Mediation and Arbitration"], ["⏱️", "Overtime", "hours worked beyond normal hours"]] },
  "ad-credit": { words: [["💳", "Credit", "borrowed money you repay with interest"], ["📊", "Credit record", "a history of how you repay debt"], ["🧑‍💼", "Debt counsellor", "a registered person who helps restructure debt"]] },
  "ad-independent": { words: [["⚡", "Prepaid", "paid for before you use it"], ["🔥", "Geyser", "a hot water tank"]] }
};
Object.assign(WORDS, WORDS_ADULT);
