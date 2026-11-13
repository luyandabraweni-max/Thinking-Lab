"use strict";

// ---------- Cambridge IGCSE Combined Science, for the new app only. Original content. ----------
{
  const R = (...o) => ({ q: "What helped you most?", options: [...o, "Not sure"] });
  const S = { subject: "Combined Science", curriculum: "Cambridge", domain: "Inquiry and Systems Thinking", category: "Inquiry and Exploration" };
  PLATFORM_UNITS.push(
  // ===================== CAMBRIDGE IGCSE COMBINED SCIENCE, YEAR 1 (GRADE 10) =====================
  { ...S, id: "cam10-sci-cells", grade: 10, title: "Cells, diffusion and osmosis", topic: "Biology: cells",
    caps: "Cambridge IGCSE Combined Science (0653): Biology (plant and animal cells; diffusion; osmosis)",
    intention: "Today I am learning how substances move into and out of cells.", prompt: "Why do you think wilted lettuce goes crisp in cold water?",
    lesson: [
      { h: "Plant and animal cells", say: "Animal and plant cells both have a nucleus, cytoplasm and a cell membrane. Plant cells also have a cell wall, chloroplasts and a large vacuole.", html: chainRow(["Both: nucleus, cytoplasm, membrane", "Plants also: wall, chloroplasts, vacuole"]) },
      { h: "Diffusion", say: "Diffusion is the net movement of particles from a region of higher concentration to a region of lower concentration, down a concentration gradient. It is how oxygen gets into cells.", html: chainRow(["Higher concentration", "Lower concentration"]) },
      { h: "Osmosis", say: "Osmosis is the movement of water through a partially permeable membrane, from a dilute solution to a more concentrated one. Plant cells take in water by osmosis and become firm.", html: P("Water moves towards the <b>more concentrated</b> solution.") }
    ],
    example: { q: "Why does a slice of potato in very salty water go soft?", steps: ["The salty water is more concentrated than the potato cells.", "Water leaves the cells by osmosis.", "The cells lose water and become soft (flaccid)."] },
    questions: [
      { type: "mcq", q: "Which structure is found in plant cells but not animal cells?", options: ["Cell wall", "Nucleus", "Cell membrane", "Cytoplasm"], answer: 0, hints: ["Three are in both.", "Which gives plants a rigid shape?", "The cell wall."], explain: "Only plant cells have a cell wall." },
      { type: "mcq", q: "What is the function of chloroplasts?", options: ["Photosynthesis", "Controlling the cell", "Storing water", "Letting substances in"], answer: 0, hints: ["They contain chlorophyll.", "They make food using light.", "Photosynthesis."], explain: "Chloroplasts carry out photosynthesis." },
      { type: "mcq", q: "In diffusion, particles move…", options: ["from higher to lower concentration", "from lower to higher concentration", "only through cell walls", "only in plants"], answer: 0, hints: ["Think of perfume spreading.", "From crowded to less crowded.", "Down the gradient."], explain: "Diffusion is from higher to lower concentration." },
      { type: "mcq", q: "Osmosis is the movement of…", options: ["water through a partially permeable membrane", "oxygen into the blood", "sugar into cells", "salt out of cells"], answer: 0, hints: ["It is a special kind of diffusion.", "Of one substance.", "Water."], explain: "Osmosis is water moving through a partially permeable membrane." },
      { type: "mcq", q: "A plant cell is placed in pure water. What happens?", options: ["It takes in water and becomes firm", "It loses water and shrinks", "Nothing", "It bursts at once"], answer: 0, hints: ["Pure water is more dilute than the cell.", "Water moves in.", "The wall stops it bursting."], explain: "Water enters by osmosis; the cell wall keeps it from bursting, so it becomes firm." }
    ],
    reflect: R("Comparing the two kinds of cell", "Higher to lower concentration", "The potato example"),
    parent: "Your child learnt how cells are built and how water and other substances move in and out.",
    teacher: "Shows comparing plant and animal cells, and explaining diffusion and osmosis in terms of concentration.",
    done: "Diffusion: higher to lower concentration. Osmosis: water through a membrane." },

  { ...S, id: "cam10-sci-states", grade: 10, title: "States of matter", topic: "Chemistry: particles",
    caps: "Cambridge IGCSE Combined Science (0653): Chemistry (states of matter; changes of state; the kinetic particle model; diffusion in gases)",
    intention: "Today I am explaining solids, liquids and gases using particles.", prompt: "Why can you smell food cooking from another room?",
    lesson: [
      { h: "Three states", say: "In a solid, particles are packed closely in a regular pattern and vibrate. In a liquid they are close but move around each other. In a gas they are far apart and move quickly in all directions.", html: chainRow(["Solid: fixed, vibrate", "Liquid: close, flow", "Gas: far apart, fast"]) },
      { h: "Changing state", say: "Heating gives particles more energy. Melting turns a solid into a liquid; boiling turns a liquid into a gas. Cooling reverses these: condensing and freezing.", html: chainRow(["Solid", "Liquid", "Gas"]) + P("Melting, then boiling. Back again: condensing, then freezing.") },
      { h: "Temperature and diffusion", say: "Gases diffuse faster at higher temperatures, because the particles move faster. Lighter gas particles also diffuse faster than heavier ones.", html: P("Hotter: faster particles, <b>faster diffusion</b>.") }
    ],
    example: { q: "Explain why a puddle dries up on a sunny day.", steps: ["The sun heats the water particles.", "Some particles at the surface gain enough energy to escape as a gas.", "This is evaporation, so the puddle slowly disappears."] },
    questions: [
      { type: "mcq", q: "In which state are particles arranged in a regular pattern?", options: ["Solid", "Liquid", "Gas", "All three"], answer: 0, hints: ["Think of ice.", "Particles fixed in place.", "Solid."], explain: "Solids have a regular, fixed arrangement." },
      { type: "mcq", q: "What is the change from gas to liquid called?", options: ["Condensation", "Evaporation", "Melting", "Freezing"], answer: 0, hints: ["Think of a cold window in a steamy kitchen.", "Gas becomes droplets.", "Condensation."], explain: "Gas to liquid is condensation." },
      { type: "mcq", q: "Why can gases be compressed easily?", options: ["There are large spaces between the particles", "The particles are very small", "Gases have no particles", "The particles are stuck together"], answer: 0, hints: ["What is between gas particles?", "Lots of space.", "So they can be pushed together."], explain: "The large gaps between particles can be squeezed." },
      { type: "mcq", q: "What happens to the particles when a solid is heated?", options: ["They vibrate more", "They stop moving", "They get smaller", "They disappear"], answer: 0, hints: ["Heat gives energy.", "More energy, more movement.", "They vibrate more."], explain: "The particles gain energy and vibrate more." },
      { type: "mcq", q: "Which gas diffuses fastest at the same temperature?", options: ["The one with the lightest particles", "The one with the heaviest particles", "They all diffuse equally fast", "None of them diffuse"], answer: 0, hints: ["Lighter particles move faster.", "Faster particles spread faster.", "The lightest."], explain: "Lighter particles move faster, so they diffuse faster." }
    ],
    reflect: R("Picturing the particles", "Linking heat to energy", "The puddle example"),
    parent: "Your child explained solids, liquids and gases, and changes of state, using particles.",
    teacher: "Shows using the kinetic particle model to explain states, changes of state and rates of diffusion.",
    done: "More energy, faster particles: solids melt, liquids boil and gases spread faster." },

  { ...S, id: "cam10-sci-atoms", grade: 10, title: "Atoms and the periodic table", topic: "Chemistry: atomic structure",
    caps: "Cambridge IGCSE Combined Science (0653): Chemistry (atomic structure; proton number and mass number; groups in the periodic table)",
    intention: "Today I am finding what is inside an atom.", prompt: "What do you think everything is made of?",
    lesson: [
      { h: "Inside an atom", say: "An atom has a tiny nucleus containing protons and neutrons, with electrons in shells around it. Protons are positive, electrons are negative, and neutrons have no charge.", html: chainRow(["Proton: +1", "Neutron: 0", "Electron: −1"]) },
      { h: "Proton and mass numbers", say: "The proton number is the number of protons. The mass number is protons plus neutrons. In a neutral atom, the number of electrons equals the number of protons.", html: P("Sodium: proton number 11, mass number 23, so <b>12 neutrons</b>.") },
      { h: "The periodic table", say: "Elements are arranged in order of proton number. Elements in the same group have the same number of outer electrons, so they react in similar ways.", html: P("Group I metals all have <b>1</b> outer electron.") }
    ],
    example: { q: "Carbon has proton number 6 and mass number 12. How many protons, neutrons and electrons?", steps: ["Protons = proton number = 6.", "Neutrons = 12 − 6 = 6.", "Electrons = protons = 6 in a neutral atom."] },
    questions: [
      { type: "mcq", q: "Which particle has a negative charge?", options: ["Electron", "Proton", "Neutron", "Nucleus"], answer: 0, hints: ["Protons are positive.", "Neutrons are neutral.", "Electrons."], explain: "Electrons are negative." },
      { type: "num", q: "An atom has proton number 8 and mass number 16. How many neutrons does it have?", answer: "8", options: ["8", "16", "24", "2"], hints: ["Neutrons = mass number − proton number.", "16 − 8.", "8."], explain: "16 − 8 = 8 neutrons." },
      { type: "num", q: "Chlorine has proton number 17. How many electrons does a chlorine atom have?", answer: "17", options: ["17", "35", "18", "7"], hints: ["A neutral atom…", "…has equal protons and electrons.", "17."], explain: "Electrons = protons = 17." },
      { type: "mcq", q: "Why do elements in the same group react in similar ways?", options: ["They have the same number of outer electrons", "They have the same mass", "They are the same colour", "They have the same number of neutrons"], answer: 0, hints: ["Reactions involve the outer shell.", "What do group members share?", "Outer electrons."], explain: "Same number of outer electrons, so similar reactions." },
      { type: "mcq", q: "Where are protons and neutrons found?", options: ["In the nucleus", "In the shells", "Outside the atom", "Only in metals"], answer: 0, hints: ["Electrons are in shells.", "The centre of the atom.", "The nucleus."], explain: "Protons and neutrons are in the nucleus." }
    ],
    reflect: R("Remembering the three particles", "Mass number − proton number", "Linking groups to outer electrons"),
    parent: "Your child learnt what atoms are made of and how the periodic table is organised.",
    teacher: "Shows describing atomic structure, calculating subatomic particles, and relating group number to outer electrons.",
    done: "Protons give the proton number; add neutrons for the mass number." },

  { ...S, id: "cam10-sci-motion", grade: 10, title: "Speed and motion graphs", topic: "Physics: motion",
    caps: "Cambridge IGCSE Combined Science (0653): Physics (speed; distance–time and speed–time graphs; acceleration)",
    intention: "Today I am reading motion graphs and working out speed and acceleration.", prompt: "How would you show a taxi trip on a graph?",
    lesson: [
      { h: "Speed", say: "Average speed is total distance divided by total time. A cyclist who travels 30 metres in 6 seconds has an average speed of 5 metres per second.", html: P("speed = distance ÷ time") },
      { h: "Distance–time graphs", say: "On a distance–time graph, the gradient is the speed. A straight sloping line means constant speed; a flat line means the object is not moving.", html: chainRow(["Steeper: faster", "Flat: stopped"]) },
      { h: "Speed–time graphs", say: "On a speed–time graph, the gradient is the acceleration, and the area under the line is the distance travelled.", html: chainRow(["Gradient: acceleration", "Area: distance"]) }
    ],
    example: { q: "A car speeds up from 0 to 20 m/s in 4 s. Find its acceleration.", steps: ["Acceleration = change in speed ÷ time.", "= (20 − 0) ÷ 4.", "= 5 m/s²."] },
    questions: [
      { type: "num", q: "A runner covers 100 m in 20 s. What is her average speed, in m/s?", answer: "5", options: ["5", "2000", "0.2", "80"], hints: ["speed = distance ÷ time.", "100 ÷ 20.", "5."], explain: "100 ÷ 20 = 5 m/s." },
      { type: "mcq", q: "On a distance–time graph, what does a horizontal line show?", options: ["The object is stationary", "Constant speed", "Acceleration", "Very high speed"], answer: 0, hints: ["Distance isn't changing.", "So it isn't moving.", "Stationary."], explain: "No change in distance means it is not moving." },
      { type: "mcq", q: "On a speed–time graph, what does the gradient show?", options: ["Acceleration", "Distance", "Time", "Mass"], answer: 0, hints: ["Change in speed ÷ time.", "That is…", "acceleration."], explain: "The gradient of speed against time is acceleration." },
      { type: "num", q: "A bus slows from 15 m/s to 5 m/s in 5 s. What is its deceleration, in m/s²?", answer: "2", options: ["2", "10", "3", "4"], hints: ["Change in speed: 15 − 5 = 10 m/s.", "Divide by time.", "10 ÷ 5."], explain: "10 ÷ 5 = 2 m/s²." },
      { type: "num", q: "An object moves at a steady 10 m/s for 6 s. Using the area under a speed–time graph, how far does it go, in metres?", answer: "60", options: ["60", "16", "0.6", "600"], hints: ["The area is a rectangle.", "10 × 6.", "60."], explain: "10 × 6 = 60 m." }
    ],
    reflect: R("speed = distance ÷ time", "Reading the gradient", "Area under the graph"),
    parent: "Your child worked out speed and acceleration, and read motion graphs.",
    teacher: "Shows calculating speed and acceleration, and interpreting gradients and areas on motion graphs.",
    done: "Distance–time: gradient is speed. Speed–time: gradient is acceleration, area is distance." },

  { ...S, id: "cam10-sci-energy", grade: 10, title: "Energy resources and efficiency", topic: "Physics: energy",
    caps: "Cambridge IGCSE Combined Science (0653): Physics (energy stores and transfers; efficiency; energy resources)",
    intention: "Today I am tracking energy transfers and working out efficiency.", prompt: "Where does your home's electricity come from?",
    lesson: [
      { h: "Stores and transfers", say: "Energy is stored in different ways, such as chemical, kinetic, gravitational potential and thermal. Energy is never created or destroyed, only transferred.", html: chainRow(["Chemical (coal)", "Thermal", "Kinetic (turbine)", "Electrical"]) },
      { h: "Efficiency", say: "Efficiency is the useful energy output divided by the total energy input. No machine is 100 percent efficient: some energy is always wasted, often as heat.", html: P("efficiency = useful output ÷ total input × 100%") },
      { h: "Energy resources", say: "Coal, oil and gas are non-renewable and release carbon dioxide. Solar, wind and hydroelectric power are renewable, but they can depend on the weather or the place.", html: chainRow(["Non-renewable: coal, gas, oil", "Renewable: solar, wind, hydro"]) }
    ],
    example: { q: "A bulb takes in 200 J of electrical energy and gives out 40 J of light. Find its efficiency.", steps: ["Useful output = 40 J; total input = 200 J.", "40 ÷ 200 = 0.2.", "0.2 × 100% = 20%."] },
    questions: [
      { type: "num", q: "A motor takes in 500 J and gives 400 J of useful kinetic energy. What is its efficiency, as a percentage? (Type the number only.)", answer: "80", options: ["80", "20", "125", "100"], hints: ["Useful ÷ total.", "400 ÷ 500 = 0.8.", "× 100."], explain: "400 ÷ 500 × 100 = 80%." },
      { type: "mcq", q: "Which is a renewable energy resource?", options: ["Wind", "Coal", "Natural gas", "Oil"], answer: 0, hints: ["Renewable won't run out.", "Three are fossil fuels.", "Wind."], explain: "Wind won't run out; the others are fossil fuels." },
      { type: "mcq", q: "What usually happens to wasted energy?", options: ["It is transferred to the surroundings as heat", "It is destroyed", "It turns into mass", "It is stored for ever"], answer: 0, hints: ["Energy can't be destroyed.", "Where does it go?", "Heat to the surroundings."], explain: "Wasted energy usually spreads out as heat." },
      { type: "mcq", q: "What is one disadvantage of solar power?", options: ["It doesn't produce electricity at night", "It releases carbon dioxide", "It will run out", "It needs coal"], answer: 0, hints: ["What does solar need?", "Sunlight.", "None at night."], explain: "Solar panels need light, so they don't work at night." },
      { type: "mcq", q: "In a coal power station, what is the first energy store?", options: ["Chemical", "Kinetic", "Electrical", "Sound"], answer: 0, hints: ["Energy is stored in the coal.", "Released by burning.", "Chemical."], explain: "Coal stores chemical energy." }
    ],
    reflect: R("Following the energy chain", "useful ÷ total", "Comparing energy resources"),
    parent: "Your child followed energy transfers, worked out efficiency and compared energy resources.",
    teacher: "Shows describing energy stores and transfers, calculating efficiency, and evaluating renewable and non-renewable resources.",
    done: "Energy is transferred, never destroyed. Efficiency = useful ÷ total." },

  // ===================== CAMBRIDGE IGCSE COMBINED SCIENCE, YEAR 2 (GRADE 11) =====================
  { ...S, id: "cam11-sci-enzymes", grade: 11, title: "Enzymes", topic: "Biology: enzymes",
    caps: "Cambridge IGCSE Combined Science (0653): Biology (enzymes as biological catalysts; effects of temperature and pH)",
    intention: "Today I am finding out how enzymes work and what stops them.", prompt: "Why does a high fever make people so ill?",
    lesson: [
      { h: "Biological catalysts", say: "Enzymes are proteins that speed up chemical reactions in living things without being used up. Each enzyme fits a particular substrate, like a lock and key.", html: chainRow(["Substrate", "Fits the active site", "Products"]) },
      { h: "Temperature", say: "Enzymes work best at an optimum temperature, about 37 degrees Celsius in humans. Above this, the active site changes shape and the enzyme is denatured.", html: P("Denatured: the shape is lost, and it <b>can't</b> work again.") },
      { h: "pH", say: "Each enzyme also has an optimum pH. Pepsin in the stomach works best in acid, while enzymes in the small intestine work best in slightly alkaline conditions.", html: chainRow(["Pepsin: acidic", "Intestine enzymes: alkaline"]) }
    ],
    example: { q: "Explain why an enzyme stops working at 70 °C.", steps: ["High temperature changes the shape of the active site.", "The substrate no longer fits.", "The enzyme is denatured, so the reaction stops."] },
    questions: [
      { type: "mcq", q: "What are enzymes?", options: ["Proteins that act as biological catalysts", "Fats that store energy", "Sugars", "Minerals"], answer: 0, hints: ["They speed up reactions.", "They are made of protein.", "Biological catalysts."], explain: "Enzymes are protein catalysts." },
      { type: "mcq", q: "What does denatured mean?", options: ["The active site has changed shape permanently", "The enzyme is working fast", "The enzyme is cold", "The enzyme has been eaten"], answer: 0, hints: ["It happens at high temperature.", "The shape is lost.", "Permanently."], explain: "Denaturing permanently changes the active site's shape." },
      { type: "mcq", q: "What happens to enzyme activity at low temperatures?", options: ["It slows down, but the enzyme is not denatured", "It stops for ever", "It speeds up", "The enzyme melts"], answer: 0, hints: ["Particles move slowly when cold.", "Fewer collisions.", "But the shape survives."], explain: "Cold slows enzymes, but they recover when warmed." },
      { type: "mcq", q: "Why does each enzyme work on only one substrate?", options: ["Only that substrate fits its active site", "Enzymes are lazy", "Other substrates are too hot", "Substrates are all the same"], answer: 0, hints: ["Lock and key.", "Shape matters.", "Only one fits."], explain: "The active site's shape fits only its substrate." },
      { type: "num", q: "What is the optimum temperature of most human enzymes, in °C?", answer: "37", options: ["37", "100", "0", "70"], hints: ["Body temperature.", "A little under 40.", "37."], explain: "Human body temperature, about 37 °C." }
    ],
    reflect: R("The lock-and-key picture", "What denatured means", "Linking enzymes to the body"),
    parent: "Your child learnt how enzymes speed up reactions and what stops them working.",
    teacher: "Shows explaining enzyme specificity and the effects of temperature and pH, including denaturation.",
    done: "Enzymes fit their substrate. Too hot or the wrong pH changes their shape." },

  { ...S, id: "cam11-sci-plants", grade: 11, title: "Photosynthesis and respiration", topic: "Biology: plants and energy",
    caps: "Cambridge IGCSE Combined Science (0653): Biology (photosynthesis; limiting factors; aerobic respiration)",
    intention: "Today I am comparing how plants make food and how all living things release energy.", prompt: "Where does the mass of a tree come from?",
    lesson: [
      { h: "Photosynthesis", say: "Plants make glucose from carbon dioxide and water, using light energy absorbed by chlorophyll. Oxygen is released.", html: P("carbon dioxide + water → glucose + oxygen") + P("Needs <b>light</b> and <b>chlorophyll</b>.") },
      { h: "Limiting factors", say: "The rate of photosynthesis can be limited by light intensity, carbon dioxide concentration or temperature. Increasing whichever is in shortest supply speeds it up.", html: chainRow(["Light", "Carbon dioxide", "Temperature"]) },
      { h: "Aerobic respiration", say: "All living cells respire to release energy. Aerobic respiration uses glucose and oxygen and produces carbon dioxide and water. It is not the same as breathing.", html: P("glucose + oxygen → carbon dioxide + water") + P("Energy is <b>released</b>.") }
    ],
    example: { q: "A greenhouse farmer adds carbon dioxide on bright days. Why?", steps: ["On bright days, light is not the limiting factor.", "Carbon dioxide may then limit the rate.", "Adding it increases photosynthesis, so the plants grow faster."] },
    questions: [
      { type: "mcq", q: "Which gas do plants take in for photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: 0, hints: ["It is a raw material.", "Animals breathe it out.", "Carbon dioxide."], explain: "Carbon dioxide is used to make glucose." },
      { type: "mcq", q: "What absorbs light energy in a leaf?", options: ["Chlorophyll", "Water", "Starch", "Glucose"], answer: 0, hints: ["It makes leaves green.", "Found in chloroplasts.", "Chlorophyll."], explain: "Chlorophyll absorbs light." },
      { type: "mcq", q: "What are the products of aerobic respiration?", options: ["Carbon dioxide and water", "Glucose and oxygen", "Oxygen and water", "Starch and carbon dioxide"], answer: 0, hints: ["It is the reverse of photosynthesis.", "Glucose and oxygen go in.", "Carbon dioxide and water come out."], explain: "Respiration produces carbon dioxide and water." },
      { type: "mcq", q: "A plant is in dim light with plenty of carbon dioxide. What is the limiting factor?", options: ["Light intensity", "Carbon dioxide", "Water", "Soil"], answer: 0, hints: ["Which is in short supply?", "The light is dim.", "Light."], explain: "Dim light limits the rate." },
      { type: "mcq", q: "Which statement is true?", options: ["Plants respire all the time, day and night", "Plants only respire at night", "Only animals respire", "Respiration is the same as breathing"], answer: 0, hints: ["All living cells need energy.", "All the time.", "Day and night."], explain: "All living cells respire all the time." }
    ],
    reflect: R("Comparing the two word equations", "Finding the limiting factor", "Respiration is not breathing"),
    parent: "Your child compared photosynthesis and respiration, and what limits plant growth.",
    teacher: "Shows stating the word equations for photosynthesis and aerobic respiration, and applying limiting factors.",
    done: "Plants make glucose with light; every living cell respires to release energy." },

  { ...S, id: "cam11-sci-acids", grade: 11, title: "Acids, bases and salts", topic: "Chemistry: acids and bases",
    caps: "Cambridge IGCSE Combined Science (0653): Chemistry (the pH scale; neutralisation; preparing and naming salts)",
    intention: "Today I am using the pH scale and naming salts.", prompt: "Why do people take antacids for heartburn?",
    lesson: [
      { h: "The pH scale", say: "pH measures how acidic or alkaline a solution is. Below 7 is acidic, 7 is neutral, and above 7 is alkaline. Universal indicator changes colour across the scale.", html: chainRow(["Below 7: acidic", "7: neutral", "Above 7: alkaline"]) },
      { h: "Neutralisation", say: "An acid reacts with a base to make a salt and water. This is neutralisation. Farmers add lime to acidic soil for this reason.", html: P("acid + base → salt + water") },
      { h: "Naming salts", say: "A salt's name comes from the metal in the base and the acid used. Hydrochloric acid makes chlorides, sulfuric acid makes sulfates, and nitric acid makes nitrates.", html: chainRow(["Hydrochloric: chloride", "Sulfuric: sulfate", "Nitric: nitrate"]) }
    ],
    example: { q: "Name the salt made when sodium hydroxide reacts with hydrochloric acid.", steps: ["The metal comes from the base: sodium.", "Hydrochloric acid makes chlorides.", "The salt is sodium chloride; water is also made."] },
    questions: [
      { type: "mcq", q: "A solution has pH 3. What is it?", options: ["Acidic", "Neutral", "Alkaline", "Pure water"], answer: 0, hints: ["Compare it with 7.", "Below 7.", "Acidic."], explain: "pH 3 is below 7, so acidic." },
      { type: "mcq", q: "What are the products of neutralisation?", options: ["A salt and water", "An acid and a base", "Oxygen and hydrogen", "Carbon dioxide only"], answer: 0, hints: ["Acid + base → …", "Two products.", "Salt and water."], explain: "Acid + base → salt + water." },
      { type: "mcq", q: "Which salt is made from copper oxide and sulfuric acid?", options: ["Copper sulfate", "Copper chloride", "Copper nitrate", "Sulfur oxide"], answer: 0, hints: ["The metal is copper.", "Sulfuric acid makes…", "…sulfates."], explain: "Copper oxide + sulfuric acid → copper sulfate + water." },
      { type: "mcq", q: "What pH is a neutral solution?", options: ["7", "0", "14", "1"], answer: 0, hints: ["The middle of the scale.", "Pure water.", "7."], explain: "Neutral is pH 7." },
      { type: "mcq", q: "Why might a farmer add lime to soil?", options: ["To neutralise acidic soil", "To make the soil more acidic", "To add salt", "To kill all the plants"], answer: 0, hints: ["Lime is a base.", "Base + acid…", "…neutralises."], explain: "Lime neutralises acidic soil so crops grow better." }
    ],
    reflect: R("The pH number line", "acid + base → salt + water", "Matching acids to salt names"),
    parent: "Your child used the pH scale and named the salts made in neutralisation.",
    teacher: "Shows interpreting pH, describing neutralisation and naming salts from given acids and bases.",
    done: "Below 7 acid, above 7 alkali. Acid + base → salt + water." },

  { ...S, id: "cam11-sci-circuits", grade: 11, title: "Electric circuits", topic: "Physics: electricity",
    caps: "Cambridge IGCSE Combined Science (0653): Physics (current, potential difference and resistance; series and parallel circuits)",
    intention: "Today I am working out current, voltage and resistance.", prompt: "Why do the other lights stay on when one bulb in your house blows?",
    lesson: [
      { h: "Current and voltage", say: "Current is the flow of charge, measured in amperes with an ammeter connected in series. Voltage, or potential difference, is measured in volts with a voltmeter connected in parallel.", html: chainRow(["Current: ammeter, in series", "Voltage: voltmeter, in parallel"]) },
      { h: "Resistance", say: "Resistance opposes the current. Voltage equals current times resistance, so resistance is voltage divided by current, measured in ohms.", html: P("V = I × R, so R = V ÷ I") },
      { h: "Series and parallel", say: "In a series circuit, the current is the same everywhere and the voltages add up. In a parallel circuit, each branch gets the full voltage, and the currents in the branches add up.", html: chainRow(["Series: same current", "Parallel: same voltage"]) }
    ],
    example: { q: "A lamp has 6 V across it and 0.5 A through it. Find its resistance.", steps: ["R = V ÷ I.", "R = 6 ÷ 0.5.", "R = 12 Ω."] },
    questions: [
      { type: "num", q: "A resistor has 12 V across it and 3 A through it. What is its resistance, in ohms?", answer: "4", options: ["4", "36", "15", "0.25"], hints: ["R = V ÷ I.", "12 ÷ 3.", "4."], explain: "12 ÷ 3 = 4 Ω." },
      { type: "num", q: "A 10 Ω resistor carries 2 A. What is the voltage across it, in volts?", answer: "20", options: ["20", "5", "12", "0.2"], hints: ["V = I × R.", "2 × 10.", "20."], explain: "2 × 10 = 20 V." },
      { type: "mcq", q: "How is an ammeter connected?", options: ["In series", "In parallel", "Across the battery only", "It isn't connected"], answer: 0, hints: ["It measures the flow through the circuit.", "The current must go through it.", "In series."], explain: "An ammeter goes in series so the current passes through it." },
      { type: "mcq", q: "Two identical lamps are in parallel with a 6 V battery. What is the voltage across each?", options: ["6 V", "3 V", "12 V", "0 V"], answer: 0, hints: ["In parallel, each branch gets…", "…the full voltage.", "6 V."], explain: "Each parallel branch gets the full 6 V." },
      { type: "mcq", q: "In a series circuit, if one lamp breaks…", options: ["all the lamps go out", "only that lamp goes out", "the others get brighter", "nothing happens"], answer: 0, hints: ["There is only one path.", "A break stops the current.", "Everywhere."], explain: "A break in the only path stops the current everywhere." }
    ],
    reflect: R("V = I × R", "Where to connect the meters", "Series and parallel rules"),
    parent: "Your child worked out current, voltage and resistance, and compared series and parallel circuits.",
    teacher: "Shows applying V = IR, connecting meters correctly, and describing current and voltage in series and parallel circuits.",
    done: "V = I × R. Series shares the voltage; parallel shares the current." },

  { ...S, id: "cam11-sci-waves", grade: 11, title: "Properties of waves", topic: "Physics: waves",
    caps: "Cambridge IGCSE Combined Science (0653): Physics (transverse and longitudinal waves; amplitude, wavelength and frequency; the wave equation)",
    intention: "Today I am describing waves and using the wave equation.", prompt: "How does sound reach your ears?",
    lesson: [
      { h: "Describing waves", say: "Waves transfer energy without transferring matter. Amplitude is the height from the middle to a peak. Wavelength is the distance from one peak to the next. Frequency is the number of waves each second, in hertz.", html: chainRow(["Amplitude", "Wavelength", "Frequency (Hz)"]) },
      { h: "Transverse and longitudinal", say: "In transverse waves, like light and water waves, the vibrations are at right angles to the direction the wave travels. In longitudinal waves, like sound, the vibrations are along the direction of travel.", html: chainRow(["Transverse: light, water", "Longitudinal: sound"]) },
      { h: "The wave equation", say: "Wave speed equals frequency times wavelength. A wave with frequency 5 hertz and wavelength 2 metres travels at 10 metres per second.", html: P("v = f × λ") }
    ],
    example: { q: "A sound wave has frequency 170 Hz and wavelength 2 m. Find its speed.", steps: ["v = f × λ.", "v = 170 × 2.", "v = 340 m/s."] },
    questions: [
      { type: "mcq", q: "What do waves transfer?", options: ["Energy, not matter", "Matter, not energy", "Both energy and matter", "Neither"], answer: 0, hints: ["A cork on a ripple bobs up and down.", "It doesn't travel with the wave.", "Energy only."], explain: "Waves carry energy; the material just vibrates in place." },
      { type: "mcq", q: "Which is a longitudinal wave?", options: ["Sound", "Light", "A water ripple", "A radio wave"], answer: 0, hints: ["Vibrations along the direction of travel.", "Compressions and rarefactions.", "Sound."], explain: "Sound is longitudinal; the others are transverse." },
      { type: "num", q: "A wave has frequency 4 Hz and wavelength 3 m. What is its speed, in m/s?", answer: "12", options: ["12", "7", "1.33", "0.75"], hints: ["v = f × λ.", "4 × 3.", "12."], explain: "4 × 3 = 12 m/s." },
      { type: "mcq", q: "What is the frequency of a wave?", options: ["The number of waves passing a point each second", "The height of a wave", "The distance between peaks", "The speed of the wave"], answer: 0, hints: ["Measured in hertz.", "How often.", "Waves per second."], explain: "Frequency is waves per second (Hz)." },
      { type: "num", q: "A water wave travels at 6 m/s with wavelength 2 m. What is its frequency, in Hz?", answer: "3", options: ["3", "12", "8", "4"], hints: ["f = v ÷ λ.", "6 ÷ 2.", "3."], explain: "6 ÷ 2 = 3 Hz." }
    ],
    reflect: R("Labelling a wave", "Transverse or longitudinal", "v = f × λ"),
    parent: "Your child described waves and used the wave equation.",
    teacher: "Shows describing wave properties, distinguishing transverse and longitudinal waves, and applying v = fλ.",
    done: "Waves carry energy. v = f × λ." }
  );
}
