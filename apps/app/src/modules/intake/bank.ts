// The content of the Multidisciplinary Neurodevelopmental Intake, version 2.0 (Pholoso Afrika Foundation,
// 13 November 2026), in the pack's own wording. The rules (flags, ranking, prompts) are in rules.ts.
//
// Left out on purpose, as in the school profile: full names, identity numbers, home addresses, phone numbers, email
// addresses and medical aid numbers. The app knows each learner by a nickname and each adult by their account.
// Current medicines are kept in the family's Health records, which already exist.

// ---------- Answer lists (page 16 of the pack) ----------
export const CONCERN: [string, number][] = [["No concern", 0], ["Slight, we manage", 1], ["Moderate, needs support", 2], ["Significant, affects daily life", 3], ["Severe, we cannot manage without help", 4], ["Not known or too early to say", -1]];
export const FREQUENCY = ["Never", "Rarely", "Sometimes", "Most days", "Every day", "Many times a day", "Not known"];
export const SETTING = ["Home only", "School or work only", "Home and school", "Mostly in public or new places", "Everywhere", "Not known"];
export const PRIORITY = ["Yes, a top priority for us", "Helpful but not urgent", "No", "Not sure"];
export const YNU = ["Yes", "No", "Not sure", "Prefer to discuss in person", "Not known"];
export const YN = ["Yes", "No"];
export const CONSENT_OPT = ["Yes, I agree", "No, I do not agree", "Yes, with the limits noted below"];
export const MILESTONE = ["Earlier than this", "At about this time", "Later than this", "Not yet", "Not known"];
export const SENSORY_PATTERN = ["No concern", "Over-sensitive, avoids or is distressed by it", "Under-responsive, does not seem to notice", "Seeks it out strongly", "Mixed, changes day to day", "Not known"];
export const SEX = ["Female", "Male", "Intersex", "Prefer not to say", "Not known"];
export const PROVINCE = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape", "Outside South Africa"];
export const LANG = ["isiZulu", "isiXhosa", "Afrikaans", "English", "Sepedi", "Setswana", "Sesotho", "Xitsonga", "siSwati", "Tshivenda", "isiNdebele", "South African Sign Language", "Other", "More than one equally", "Not known"];
export const SETTING_TYPE = ["Home, not yet at school", "Creche or day mother", "Early childhood development centre", "Grade R", "Mainstream public school", "Mainstream public school with support", "Independent or private school", "Full service school", "Special school", "Special school resource centre", "Home schooling", "Learning centre or tutor", "College or university", "Protective or supported workshop", "Employed", "Not currently in school or work"];
export const CONTACT = ["WhatsApp", "Phone call", "SMS", "Email", "Through the school", "Through the clinic", "Prefer not to say"];
export const GRANT = ["Not applied for", "Applied, waiting", "Receiving a care dependency grant", "Receiving a disability grant", "Application declined", "Not known"];
export const TREND = ["Getting better", "Staying about the same", "Getting harder", "Up and down, no clear pattern", "Too early to say"];
export const HOPE = ["Mainly a diagnosis or an explanation", "Mainly practical support and strategies", "Both equally", "Mainly help with the school", "Mainly help at home", "Not sure yet, that is what we want help with"];
export const SELFHELP = ["I wrote it myself", "Someone wrote down what I said", "Someone read the questions to me and I chose answers", "I used my device, pictures or signs", "My caregiver answered for me, as they think I would"];
export const FEELING = ["Good", "Mostly okay", "Mixed", "Not good", "Hard to say"];
export const BIRTH = ["Normal vaginal birth", "Assisted vaginal birth, forceps or vacuum", "Planned caesarean section", "Emergency caesarean section", "Not known"];
export const SCREEN = ["Done, result normal", "Done, result abnormal", "Done, result not known", "Not done", "Not known"];
export const SCREEN2 = ["Yes, up to date", "Partly", "No", "Not known"];
export const RETURN = ["Fully returned", "Partly returned", "Not returned", "Not known"];
export const COPING = ["Coping well", "Managing, but it is hard", "Struggling", "At breaking point", "Prefer to discuss in person"];
export const REPORT_AVAIL = ["Yes, attached", "Yes, can be requested", "No", "Not known"];
export const COMMS_MODE = ["Spoken words", "Short phrases", "Single words", "Gestures and pointing", "Sign language", "Picture cards or board", "Speech device or app (AAC)", "Writing or typing", "Behaviour, we read what it means", "Mix of these"];
export const TRIED = ["Not tried", "Tried, it helped", "Tried, no change", "Tried, it made things worse", "Still trying, too early to say", "Not known"];
/** Safety questions: a No is the usual answer, and anything else asks for a private conversation. */
export const SAFE = ["No", "Yes", "Not sure", "Prefer to discuss in person"];
export const PROFESSIONALS = ["Developmental Paediatrician", "Paediatric Neurologist", "Child Psychiatrist", "Clinical Psychologist", "Educational Psychologist", "Neuropsychologist", "Counsellor / Psychotherapist", "Occupational Therapist", "Speech-Language Therapist", "Audiologist", "Physiotherapist", "Dietitian", "Social Worker", "Behaviour Support Practitioner", "Learning Support / Remedial Specialist", "Teacher / SBST Representative", "Early Childhood Practitioner", "Optometrist / Ophthalmologist"];

// ---------- Questions ----------
export interface Question { key: string; q: string; why?: string; list?: string[]; kind?: "date" | "long" }
export interface Section { title: string; note?: string; questions: Question[] }
const qs = (prefix: string, rows: ([string, string?, string[]?, Question["kind"]?] | [string, string | undefined, string[] | undefined, Question["kind"] | undefined, string])[], start = 1): Question[] =>
  rows.map((r, i) => ({ key: r[4] ?? `${prefix}${start + i}`, q: r[0], ...(r[1] ? { why: r[1] } : {}), ...(r[2] ? { list: r[2] } : {}), ...(r[3] ? { kind: r[3] } : {}) }));

/** Page 01: what is being agreed to. Item 3 lets the learner's team see the intake; item 4 lets the school have the support profile. */
export const CONSENT_ITEMS = [
  "The purpose of this form has been explained, and this information is given willingly.",
  "The named professionals may collect and keep this information for assessment and support planning.",
  "The named professionals may share relevant information with one another for coordinated support.",
  "Relevant information may be shared with the school or workplace named on this form.",
  "The team may contact the people and services listed, to request records.",
  "The team may contact the family by the method chosen on the About page.",
  "The person being assessed has been told about this, in a way they can understand, as far as their age and understanding allow.",
  "Anonymous information, with all identifying details removed, may be used to improve services and for research or training.",
  "The family understands that the team has a legal duty to report a child protection concern, as set out on the Safety page."
];

export const ABOUT: Section[] = [
  { title: "Who the assessment is for", questions: qs("a", [
    ["Age now"], ["Sex recorded at birth", "Asked only where it affects medical interpretation.", SEX], ["Gender and pronouns, if the person wants this recorded", "Optional."], ["Province", undefined, PROVINCE]]) },
  { title: "Language", questions: qs("a", [
    ["Main language spoken at home", undefined, LANG], ["Other languages used at home", "List all of them, even if only a little is spoken."], ["Strongest language for understanding", "The language in which the person understands best.", LANG],
    ["Strongest language for speaking or signing", undefined, LANG], ["Preferred language for the assessment", undefined, LANG], ["Is an interpreter needed for the appointment?", "Say yes if any part of the appointment would be easier in another language.", YNU],
    ["Preferred language for the written report", undefined, LANG], ["Language of learning and teaching at school", "Important where this differs from the home language.", LANG]], 5) },
  { title: "Education, work and daily setting", questions: qs("a", [
    ["School, creche, college or workplace"], ["Current grade, year or role"], ["How long at this school or workplace"], ["Type of setting", undefined, SETTING_TYPE],
    ["Days and hours attended each week", "For example, five mornings, 07:45 to 13:00."], ["How the person travels there", "For example, scholar transport, taxi, walks, lift club."]], 13) },
  { title: "Family and household", note: "Names and contact details stay with your account and are not asked for here.", questions: qs("a", [
    ["Who lives in the home", "Please list the relationship and ages. For example, mother 38, brother 11, grandmother 64.", undefined, "long"], ["Who cares for the person day to day"],
    ["Who holds legal authority to consent for this person", "Usually a parent or legal guardian. A court order may apply."], ["Best way and time to reach the family"], ["Preferred contact method", undefined, CONTACT],
    ["Who completed this form, and their relationship to the person"], ["Date this form was completed", undefined, undefined, "date"], ["Anyone who helped complete it, and how", "For example, an older sibling translated, or a therapist helped with the health section."]], 19) },
  { title: "Medical aid, funding and access", questions: qs("a", [
    ["Medical aid or scheme, and plan", "Write None if there is no cover. The membership number is not needed here."], ["Referring doctor, clinic or school"],
    ["Is a disability grant or care dependency grant in place or applied for?", undefined, GRANT], ["Anything that makes attending appointments difficult", "Cost, transport, time off work, distance, child care for siblings, anything else. Saying so helps the team plan around it.", undefined, "long"]], 27) }
];

export const STORY: Section[] = [
  { title: "Start with what is going well", questions: qs("o", [
    ["What does this person enjoy most?", "Anything at all. Music, numbers, animals, trains, swimming, a particular person, a particular place.", undefined, "long"],
    ["What are they good at?", "Think about memory, noticing detail, kindness, humour, building, drawing, sport, technology, languages, patience with younger children.", undefined, "long"],
    ["When are they happiest and most themselves?", "Describe the setting, the people and the time of day.", undefined, "long"], ["What do you most admire about them?", undefined, undefined, "long"],
    ["What do other people often get wrong about them?", "This matters. It tells the team what to look past.", undefined, "long"],
    ["What has the person achieved that the team should know about?", "Big or small. A first word, a first friend, a swimming badge, a term with no absences.", undefined, "long"]]) },
  { title: "Why you are here now", questions: qs("o", [
    ["What made you decide to ask for an assessment at this point?", "Something usually changes. A school comment, a new grade, a difficult term, a family member noticing something.", undefined, "long"],
    ["Who first raised a concern, and when?"], ["Has anyone suggested a particular diagnosis or difficulty?", "Say who suggested it and when. A suggestion is a starting point, not a conclusion.", undefined, "long"],
    ["Your three main concerns, in your own words", "Number them 1, 2, 3. Put the one that worries you most first.", undefined, "long"], ["How long has each concern been present?"],
    ["Is it getting better, staying the same or getting harder?", undefined, TREND], ["In which settings is it most noticeable?", undefined, SETTING],
    ["What does a hard day look like, from waking up to bedtime?", "Walk the team through it. Concrete detail helps more than labels.", undefined, "long"], ["What does a good day look like?", undefined, undefined, "long"]], 7) },
  { title: "Hopes for this assessment", questions: qs("o", [
    ["What three questions do you most want answered?", undefined, undefined, "long"], ["What would need to change for life at home to feel easier?", undefined, undefined, "long"],
    ["What would need to change at school?", undefined, undefined, "long"], ["Are you hoping for a diagnosis, for support, for both, or are you not sure?", "There is no wrong answer here.", HOPE],
    ["Is there anything you are worried this assessment might lead to?", "Some families worry about labels, school placement, family reaction or cost. Saying so lets the team talk it through with you.", undefined, "long"],
    ["Is there anything you want the team to know but would rather not write here?", "If yes, the team will make private time to talk.", YNU]], 16) },
  { title: "Family background the team should understand", questions: qs("o", [
    ["Anyone in the family with autism, ADHD, learning differences or developmental delay", "Diagnosed or strongly suspected. Include yourself. This is common and helpful to know.", undefined, "long"],
    ["Anyone in the family with speech, language, hearing, vision, motor or coordination differences", undefined, undefined, "long"],
    ["Anyone in the family with epilepsy, a neurological condition or a known genetic condition", undefined, undefined, "long"],
    ["Anyone in the family treated for a mental health condition", "Share only what you are comfortable sharing, and only what feels relevant.", undefined, "long"],
    ["Major changes or losses in this person's life", "Moves, a new school, separation, a death, a serious illness, time apart from a caregiver, a frightening event. Give approximate dates.", undefined, "long"],
    ["Who else is involved in raising or supporting this person?", "Grandparents, aunts and uncles, a domestic worker, a church or mosque community, a neighbour, a sports coach.", undefined, "long"],
    ["Beliefs, practices or cultural context the team should respect", "Including anything about food, touch, naming, prayer, traditional healing or how disability is understood in the family.", undefined, "long"],
    ["Has the family consulted a traditional health practitioner or faith healer about this?", "Asked without judgement. Many families do, and it is useful context.", undefined, "long"]], 22) }
];

export const VOICE: Section[] = [
  { title: "About me", questions: qs("w", [["What I like to be called"], ["How I filled this in", undefined, SELFHELP], ["Things I am good at", undefined, undefined, "long"], ["Things I really like", undefined, undefined, "long"], ["Things I do not like", undefined, undefined, "long"],
    ["My favourite place to be"], ["My favourite person to be with, and why", undefined, undefined, "long"], ["What I want to be or do when I am older", undefined, undefined, "long"]]) },
  { title: "School or work", questions: qs("w", [["What I like about school or work", undefined, undefined, "long"], ["What is hard about school or work", undefined, undefined, "long"], ["The subject or task I enjoy most"], ["The subject or task I find hardest"],
    ["What my teacher or boss does that helps me", undefined, undefined, "long"], ["What makes it harder for me", undefined, undefined, "long"], ["Where I sit, and whether that works for me", undefined, undefined, "long"], ["How break time or lunch time goes for me", undefined, undefined, "long"]], 9) },
  { title: "Friends and people", questions: qs("w", [["Who my friends are", undefined, undefined, "long"], ["How I feel about having friends", undefined, FEELING], ["What I would like to be different about friendships", undefined, undefined, "long"],
    ["Is anyone unkind to me?", undefined, SAFE], ["If yes, what happens, and who knows about it", undefined, undefined, "long"]], 17) },
  { title: "My body and my senses", questions: qs("w", [["Sounds, lights, smells, clothes or places that bother me", undefined, undefined, "long"], ["Things that feel good to me", undefined, undefined, "long"], ["How I know when I am getting upset or overloaded", undefined, undefined, "long"],
    ["What helps me feel calm again", undefined, undefined, "long"], ["What I need other people to do when I am overloaded", undefined, undefined, "long"], ["What I need other people to stop doing", undefined, undefined, "long"], ["How I sleep", undefined, FEELING], ["How I feel about food and eating", undefined, FEELING]], 22) },
  { title: "What I want", questions: qs("w", [["The one thing I would most like to be easier", undefined, undefined, "long"], ["Something I would like help with", undefined, undefined, "long"], ["Something I do not want to change about myself", undefined, undefined, "long"],
    ["What I want the people assessing me to know", undefined, undefined, "long"], ["Do I want to be told what the team finds out?", undefined, YNU], ["Who I want with me at the appointment"], ["Anything that would make the appointment easier for me", undefined, undefined, "long"]], 30) }
];

export const HEALTH: Section[] = [
  { title: "Pregnancy and birth", questions: qs("p", [
    ["Any illness, infection, high blood pressure or other problem during pregnancy", undefined, undefined, "long"],
    ["Any medication, alcohol, tobacco or other substances during pregnancy", "Asked of every family, without judgement. Accurate information helps the team."],
    ["Any injury, accident, surgery or severe stress during pregnancy"], ["How many weeks pregnant at birth", "Write 40 weeks if full term, or Not known."], ["Type of birth", undefined, BIRTH],
    ["Birth weight", "In kilograms if known."], ["Did the baby need help to breathe, or resuscitation?"], ["Admission to a neonatal unit, and for how long"],
    ["Jaundice needing treatment, infection, seizures or feeding problems after birth"], ["Newborn hearing screening", undefined, SCREEN], ["Any condition identified at or soon after birth"], ["Any genetic or metabolic testing done, and the result"]]) },
  { title: "Current health", questions: qs("h", [
    ["Diagnoses already made, and by whom", "Include the month and year where you can.", undefined, "long"], ["Operations, hospital stays or serious illnesses", undefined, undefined, "long"],
    ["Head injury, loss of consciousness or concussion"], ["Seizures, fits, staring spells, odd movements or episodes?", undefined, YNU], ["If yes, describe what you saw, how long it lasted and what happened afterwards", undefined, undefined, "long"],
    ["Stomach pain, constipation, diarrhoea, reflux or feeding problems"], ["Headaches or other recurring pain"],
    ["How the person shows you that they are in pain", "Some people do not say that it hurts. The team needs to know what to watch for.", undefined, "long"],
    ["Teeth and dental care"], ["Puberty, periods or hormonal changes relevant to care"], ["Immunisations up to date?", undefined, SCREEN2], ["Height and weight, if measured"], ["Any growth or weight concern raised by a clinic or doctor"]]) },
  { title: "Hearing and vision", questions: qs("v", [
    ["Repeated ear infections, grommets or ear problems"], ["Hearing tested by an audiologist?", undefined, SCREEN], ["Date and place of the last hearing test"],
    ["Does the person seem to hear you in a quiet room but not in noise?", undefined, YNU], ["Hearing aid or assistive listening device in use"], ["Eyes tested by an optometrist or eye doctor?", undefined, SCREEN],
    ["Date and place of the last eye test"], ["Glasses prescribed, and are they worn?"], ["Squint, eye turning, head tilting or holding things very close"]]) },
  { title: "Loss of skills", questions: qs("l", [
    ["Has this person ever lost a skill they clearly had before?", "Words, babbling, eye contact, interest in people, play, toilet training, walking or anything else.", YNU],
    ["If yes, which skill, at what age, and over what period", undefined, undefined, "long"], ["What else was happening at that time?", "An illness, a hospital stay, a move, a new baby, a loss, a change of carer.", undefined, "long"], ["Did the skill return?", undefined, RETURN]]) }
];

/** Page 05 milestones: the age by which at least three quarters of children show the skill. Late is a prompt, not a diagnosis. */
export const MILESTONES: [string, string][] = [
  ["Smiles back at you", "by 2 months"], ["Turns to a voice or looks when you call their name", "by 9 months"], ["Sits up without support", "by 9 months"],
  ["Babbles and takes turns making sounds with you", "by 9 months"], ["Looks for a toy that is hidden", "by 12 months"], ["Picks up small things with thumb and finger", "by 12 months"],
  ["Pulls up to stand", "by 12 months"], ["Points at something to show it to you", "by 18 months"], ["Says a few clear words other than mama or dada", "by 15 months"],
  ["Walks on their own", "by 18 months"], ["Copies what you do, such as sweeping or talking on a phone", "by 18 months"], ["Puts two words together, such as \"more milk\"", "by 2 years"],
  ["Follows a simple instruction with two steps", "by 3 years"], ["Speech is mostly understood by people outside the family", "by 4 years"], ["Plays pretend games with other children", "by 4 years"],
  ["Toilet trained during the day", "by 4 years"], ["Dresses with very little help", "by 5 years"], ["Holds a pencil to write letters or numbers", "by 5 years"], ["Pedals a bicycle or tricycle", "by 5 years"]
];

// ---------- Page 06: the daily life profile ----------
export interface DailyItem { n: number; area: string; text: string }
const DAILY_ROWS: [string, string[]][] = [
  ["Communication and language", ["Understanding what you say at home", "Understanding instructions in a group or classroom", "Asking for what they need, in any way", "Telling you about something that happened earlier", "Being understood by people outside the family", "Starting a conversation", "Keeping a conversation going and taking turns", "Understanding jokes, teasing, hints or figures of speech", "Answering questions about why or how", "Communication is much better in one language than another"]],
  ["Social connection", ["Approaching other children or adults", "Joining a group that is already playing or talking", "Making friends", "Keeping friends over time", "Reading faces, tone of voice and body language", "Personal space and physical boundaries", "Knowing who is safe and who is not", "Being left out, teased or bullied", "Preferring to be alone"]],
  ["Play, interests and flexibility", ["Playing alongside or with others", "Pretend or imaginative play, if age appropriate", "Very deep or narrow interests", "Repetitive movements, sounds or actions", "Lining up, sorting or arranging things", "Needing routines and sameness", "Coping when plans change without warning", "Moving from one activity to the next", "Trying something new or unfamiliar"]],
  ["Attention, activity and organisation", ["Starting a task without being told again", "Staying with a task to the end", "Sitting still when it is expected", "Always on the go, restless or fidgety", "Acting before thinking it through", "Interrupting or blurting out", "Waiting for a turn", "Remembering instructions with more than one step", "Losing or forgetting belongings and homework", "Keeping a bag, desk or room in order", "Managing time and working at a reasonable pace", "Switching attention away from something absorbing"]],
  ["Learning", ["Reading accuracy and fluency", "Understanding what was read", "Writing and getting ideas onto paper", "Spelling", "Handwriting that is legible and not exhausting", "Numbers, calculation and maths reasoning", "Copying from the board or a book", "Working independently in class", "Homework at home", "Keeping up with the class or year level", "Showing what they know in a test or exam"]],
  ["Feelings and regulation", ["Naming and describing their own feelings", "Worry and anxiety", "Low mood or losing interest in things they liked", "Frustration and anger", "Reactions that seem much bigger than the situation", "Calming down again after being upset", "Holding it together at school and falling apart at home", "Confidence and how they speak about themselves", "Fears or phobias that get in the way", "Separating from a caregiver"]],
  ["Behaviour and distress", ["Going quiet, still or unreachable when overwhelmed", "Meltdowns or explosive episodes", "Refusing or avoiding what is asked", "Needing to be in control of what happens", "Damage to property when upset", "Hurting other people when upset", "Leaving a place suddenly or running off", "Taking risks without seeing the danger"]],
  ["Movement and physical skills", ["Pencil grip and writing stamina", "Scissors, buttons, zips, laces and small fasteners", "Using a knife, fork or spoon", "Running, jumping, climbing and ball skills", "Balance, bumping into things and falling", "Learning a new physical skill", "Tiring quickly or low stamina", "Posture, sitting upright at a desk", "Pain or physical discomfort in daily activity"]],
  ["Daily living and independence", ["Getting dressed", "Washing, bathing and drying", "Teeth, hair and nails", "Using the toilet by day", "Staying dry at night", "Knowing when they need the toilet", "Eating and drinking without help", "Falling asleep", "Staying asleep through the night", "Waking and getting going in the morning", "Road, water and stranger safety", "Using money, shopping or travelling, if age appropriate", "Phone, screens and online safety", "Helping with chores or work tasks"]],
  ["Eating and nutrition", ["Range and variety of foods accepted", "Reaction to new foods", "How long mealtimes take", "Distress or conflict at mealtimes", "Chewing or swallowing", "Coughing, choking or gagging when eating or drinking", "Drinking enough fluid", "Appetite, and whether it changes with medication"]],
  ["Taking part in life", ["Going to school or work willingly", "Being at school or work for the full day", "Birthday parties and family gatherings", "Sport, clubs, scouts or dance", "Faith or cultural activities", "Shops, taxis, waiting rooms and crowded places", "Haircuts, clinics and the dentist", "Holidays and sleeping away from home", "Having a friend to visit, or visiting a friend"]]
];
export const DAILY: DailyItem[] = (() => { let n = 0; return DAILY_ROWS.flatMap(([area, items]) => items.map(text => ({ n: ++n, area, text }))); })();
export const DAILY_AREAS = DAILY_ROWS.map(([a]) => a);

// ---------- Page 07: the sensory profile ----------
export const SENSES = ["Sound and noise", "Light, brightness and busy visual spaces", "Touch, clothing labels, seams and textures", "Hair washing, brushing, haircuts and nail cutting", "Taste and food texture", "Smell", "Movement, swinging, spinning and heights", "Body awareness, pressure, squeezing and crashing", "Noticing hunger, thirst and the need for the toilet", "Noticing hot, cold and being unwell", "Response to pain", "Being touched unexpectedly"];
export const SENSORY_MORE: Section[] = [
  { title: "Environment, early warning signs and recovery", note: "This is the part the team uses to plan the appointment. Please do not skip it.", questions: qs("x", [
    ["Which places or situations are hardest for this person's senses?", undefined, undefined, "long"], ["Which places feel good or calming?", undefined, undefined, "long"],
    ["What are the first signs that this person is becoming overloaded?", "The team will use this to stop a session before it becomes too much.", undefined, "long"], ["What helps them recover, and how long does it usually take?", undefined, undefined, "long"],
    ["What makes it worse, and should be avoided?", undefined, undefined, "long"], ["Anything they always carry, wear or need with them?", "Headphones, a cap, a chew, a fidget, a particular bottle, a blanket, a toy."],
    ["Is there anything the team must not do in the session?", undefined, undefined, "long"]]) },
  { title: "How this person communicates best", questions: qs("k", [
    ["Main way this person communicates with people who know them well", undefined, COMMS_MODE], ["Main way with people who do not know them", undefined, COMMS_MODE],
    ["Does this person use a communication device, board, pictures or signs?", "If yes, please bring it to the appointment and say how it works.", YNU], ["How the system works, and who set it up"],
    ["How this person tells you they need a break", "Words, a sign, going quiet, leaving the room, a behaviour you have learned to read.", undefined, "long"],
    ["How this person says yes and no", "Critically important. The team must not misread a polite yes.", undefined, "long"],
    ["How long this person needs to process a question before answering", "For example, a few seconds, or up to a minute. Silence is often processing, not refusal."],
    ["Anything about how to talk to this person that the team should know", "For example, use short sentences, do not ask why questions, give a choice of two, avoid standing too close, let them look away while they listen.", undefined, "long"]]) }
];

// ---------- Page 08: safety and wellbeing ----------
export const SAFETY: Section[] = [
  { title: "Right now", questions: qs("s", [["Is anyone in immediate danger today?", "If yes, please stop filling in this form and use the emergency numbers above.", SAFE], ["Is there anything the team should know before the first appointment?", undefined, undefined, "long"]]) },
  { title: "Keeping this person safe", questions: qs("s", [
    ["Does this person leave the house, classroom or a shop without warning?", undefined, SAFE], ["Is there any concern about road safety, water, heights or fire?", undefined, SAFE],
    ["Does this person understand who is safe to go with or talk to?", undefined, ["Yes", "No", "Not sure", "Prefer to discuss in person"]], ["Any concern about what this person does or sees online, or who contacts them?", undefined, SAFE],
    ["Does this person eat or put non-food items in their mouth?", undefined, SAFE], ["What safety measures are in place at home now?", "Locks, gates, alarms, a tracker, a wristband, supervision arrangements, a safety plan.", undefined, "long"]], 3) },
  { title: "Wellbeing", questions: qs("s", [
    ["Has this person said or shown that they do not want to be here, or wished to be gone?", "The team asks this of everyone. If this is happening, say so and the team will respond today.", SAFE],
    ["Is there anything about this person's own safety that worries you?", undefined, SAFE], ["Has this person hurt themselves, whether on purpose or when distressed?", undefined, SAFE],
    ["Is anyone else in the home at risk, including siblings?", undefined, SAFE], ["Would you like the team to arrange support for this now?", undefined, YNU]], 9) },
  { title: "Protection and circumstances", questions: qs("s", [
    ["Any concern about how this person is treated by anyone?", undefined, SAFE], ["Is this person being bullied, excluded or targeted?", undefined, SAFE], ["Is anyone in the household living with violence or threats?", undefined, SAFE],
    ["Is there a court order, parenting plan or social worker involved?", undefined, SAFE], ["If yes to any of the above, what would you like the team to know?", "Write only what you are comfortable writing. You may leave this blank and talk instead.", undefined, "long"]], 14) },
  { title: "The family's own needs", questions: qs("s", [
    ["How are the caregivers coping at the moment?", "Caring for someone with high support needs is heavy work. The team can help with this too.", COPING], ["Is anyone in the family going without sleep, work or care because of this?", undefined, undefined, "long"],
    ["Would the family like information about respite, support groups or counselling?", undefined, YNU], ["Is there enough food, transport money and basic support in the home at the moment?", "Asked so the team can connect the family with a social worker if it would help.", YNU]], 19) }
];
/** Safety answers that need a private conversation: anything but No (and, for "understands who is safe", anything but Yes). */
export const SAFETY_FOLLOW_UP = ["w20", "s1", "s3", "s4", "s5", "s6", "s7", "s9", "s10", "s11", "s12", "s14", "s15", "s16"];

export const SERVICES_Q: Question[] = qs("r", [
  ["What has worked best in any support so far?", undefined, undefined, "long"], ["What has not worked, or should not be repeated?", undefined, undefined, "long"], ["Has anything been tried that made things worse?", undefined, undefined, "long"],
  ["Which professionals should receive the report from this assessment?"], ["Is this person on a waiting list anywhere?"], ["Has an assessment been done before and the family disagreed with it?", "Say so. The team would rather know.", undefined, "long"],
  ["Documents the family can provide, with consent", "Clinic card, Road to Health booklet, school reports, previous assessment reports, hearing or vision results, discharge summaries, medication list, court order.", undefined, "long"]]);

/** Table rows the family adds: the columns, in order. */
export const TABLES = {
  seen: { title: "Professionals already seen", note: "Work backwards from the most recent. Include anyone seen at a clinic, a hospital, a school or privately. Write Not known where you cannot remember.",
    cols: [["discipline", "Professional or discipline"], ["place", "Place"], ["date", "Date seen"], ["reason", "Reason for the visit"], ["concluded", "What they concluded"], ["report", "Report available?", REPORT_AVAIL]] as [string, string, string[]?][] },
  therapy: { title: "Therapy and support, now and in the past", note: "",
    cols: [["service", "Service"], ["provider", "Provider"], ["started", "Started"], ["ended", "Ended"], ["often", "How often"], ["goals", "Goals worked on"], ["changed", "What changed"], ["ongoing", "Still ongoing?", YN]] as [string, string, string[]?][] },
  stopped: { title: "Medicines stopped in the past, and why", note: "Medicines taken now are recorded in Health.",
    cols: [["medicine", "Medicine"], ["when", "When it was taken"], ["why", "Why it was stopped"], ["happened", "What happened"]] as [string, string, string[]?][] },
  allergy: { title: "Allergies and bad reactions", note: "This is the first thing a clinician looks for. Please complete it even if the reaction was mild.",
    cols: [["cause", "What causes the reaction"], ["type", "Type"], ["happens", "What happens"], ["severe", "How severe"], ["treatment", "Treatment carried"], ["plan", "Emergency plan in place?", YNU]] as [string, string, string[]?][] }
};
export type TableKey = keyof typeof TABLES;

export const HELPLINES: [string, string][] = [
  ["Police, fire, ambulance", "10111, or 112 from a cellphone"], ["Childline South Africa (children and families, 24 hours)", "116, toll free"],
  ["SADAG Suicide Crisis Helpline (24 hours)", "0800 567 567, or SMS 31393"], ["Adcock Ingram Depression and Anxiety Helpline", "0800 70 80 90"],
  ["SADAG ADHD Helpline", "0800 55 44 33"], ["LifeLine South Africa, national counselling", "0861 322 322"],
  ["Gender-Based Violence Command Centre (24 hours)", "0800 428 428, or *120*7867#"], ["Autism South Africa", "011 484 9909"],
  ["UNICEF Parent Text support", "WhatsApp the word SUPPORT to 083 283 8620"]
];

// ---------- Page 15: the question bank and professional mapping ----------
/** The shared sections every professional uses: collected once, for the whole team. */
export const SHARED: [string, string, string, string][] = [
  ["S001", "02 About", "Identity, language, household, access", "Core background, language profile, household, funding and barriers to attending"],
  ["S002", "03 Our Story", "Strengths and interests", "What the person enjoys, is good at and is admired for"],
  ["S003", "03 Our Story", "Presenting concerns", "Onset, course, settings, a hard day and a good day"],
  ["S004", "03 Our Story", "Family history", "Neurodevelopmental, sensory, neurological and mental health history in the family"],
  ["S005", "03 Our Story", "Life events", "Moves, losses, separations, frightening events and major change"],
  ["S006", "03 Our Story", "Culture and belief", "Family understanding of difference, practices and any traditional or faith consultation"],
  ["S007", "04 In My Own Words", "The person's own account", "Self-reported strengths, difficulties, school experience, sensory needs and priorities"],
  ["S008", "05 Early Years & Health", "Pregnancy and birth", "Antenatal exposures, gestation, delivery, birth weight and neonatal course"],
  ["S009", "05 Early Years & Health", "Early milestones", "Age-anchored surveillance prompts across motor, language, social and self-care"],
  ["S010", "05 Early Years & Health", "Loss of skills", "Regression in language, social, play, motor or continence skills, with timing"],
  ["S011", "05 Early Years & Health", "Medical history", "Diagnoses, hospitalisations, head injury, seizures, pain and gastrointestinal symptoms"],
  ["S012", "05 Early Years & Health", "Hearing and vision", "Otitis media history, audiology and optometry status, listening in noise"],
  ["S013", "05 Early Years & Health", "Medicines and allergies", "Full medicine table with dose, timing, effect and side effects, plus allergy table"],
  ["S014", "06 Daily Life Profile", "Communication and language", "Rated and described receptive, expressive, pragmatic and bilingual profile"],
  ["S015", "06 Daily Life Profile", "Social connection", "Approach, friendship, social reading, boundaries, exclusion and bullying"],
  ["S016", "06 Daily Life Profile", "Play, interests and flexibility", "Play level, focused interests, repetitive behaviour, routine and change"],
  ["S017", "06 Daily Life Profile", "Attention and organisation", "Initiation, sustaining, activity level, impulsivity, memory and time"],
  ["S018", "06 Daily Life Profile", "Learning", "Reading, writing, spelling, handwriting, mathematics and showing knowledge"],
  ["S019", "06 Daily Life Profile", "Feelings and regulation", "Mood, anxiety, recovery, masking, self-concept and separation"],
  ["S020", "06 Daily Life Profile", "Behaviour and distress", "Shutdown, meltdown, refusal, control, aggression, leaving and risk"],
  ["S021", "06 Daily Life Profile", "Movement and physical skills", "Fine motor, gross motor, balance, stamina, posture and pain"],
  ["S022", "06 Daily Life Profile", "Daily living and independence", "Dressing, hygiene, continence, feeding, sleep, safety and money"],
  ["S023", "06 Daily Life Profile", "Eating and nutrition", "Variety, mealtime distress, chewing, swallowing, fluids and appetite"],
  ["S024", "06 Daily Life Profile", "Taking part in life", "School attendance, family events, clubs, public places and staying away"],
  ["S025", "07 Sensory Profile", "Sensory profile", "Twelve channels rated for pattern, impact, helps, triggers and examples"],
  ["S026", "07 Sensory Profile", "Overload and recovery", "Early warning signs, recovery time, environments and what to avoid"],
  ["S027", "07 Sensory Profile", "Communication access", "Mode, device, yes and no signals, processing time and how to address the person"],
  ["S028", "08 Safety & Wellbeing", "Safety", "Absconding, road and water safety, online safety and the current safety plan"],
  ["S029", "08 Safety & Wellbeing", "Wellbeing and protection", "Risk to self, risk from others, bullying, household violence and statutory duty"],
  ["S030", "08 Safety & Wellbeing", "Family need", "Caregiver coping, sleep, respite and material need in the household"],
  ["S031", "09 School Report", "School observation", "Independent rating across communication, learning, behaviour, health and environment"],
  ["S032", "09 School Report", "What the school has tried", "Classroom strategies with outcome and whether still in place"],
  ["S033", "09 School Report", "SIAS status", "Learner profile, SNA stage, support level, Individual Support Plan and concessions"],
  ["S034", "10 Reports & Services", "Previous assessments", "Who was seen, when, what was concluded and whether a report is available"],
  ["S035", "10 Reports & Services", "Therapy history", "What was tried, for how long, what changed and what should not be repeated"]
];
/** Discipline-specific focus areas, covered in the session by the professional, not by the family. */
const D = (prof: string, rows: [string, string][]) => rows.map(([area, q]) => ({ prof, area, q }));
export const DISCIPLINE = [
  ...D("Developmental Paediatrician", [
    ["Growth and surveillance", "Plot head circumference, height and weight against the Road to Health record and note the trajectory."],
    ["Dysmorphology", "Examine for dysmorphic features, skin markings and birthmarks suggesting a neurocutaneous or genetic syndrome."],
    ["Genetic pathway", "Decide whether chromosomal microarray, fragile X or targeted genetic testing is indicated, and counsel the family first."],
    ["Co-occurring conditions", "Screen systematically for epilepsy, sleep disorder, constipation, iron deficiency, hearing and vision loss."],
    ["Medication review", "Review the medicine table against indication, dose for weight, duration and side effect burden."],
    ["Puberty and transition", "Plan for puberty, menstrual management, sexual health education and adult services handover."]]),
  ...D("Paediatric Neurologist", [
    ["Event characterisation", "Take a second-by-second account of any suspected seizure, including aura, duration, colour change, incontinence and recovery."],
    ["Investigation", "Decide on EEG, sleep-deprived EEG or MRI, and state what question each test is meant to answer."],
    ["Regression", "Where skills were lost, exclude an epileptic encephalopathy, a metabolic cause and a progressive condition."],
    ["Examination", "Document tone, power, reflexes, gait, coordination and any asymmetry or movement disorder."],
    ["Headache and pain", "Characterise headache pattern and red flags where pain has been reported."]]),
  ...D("Child Psychiatrist", [
    ["Differential", "Separate anxiety, depression, trauma response, attachment difficulty and neurodevelopmental difference, and note where they overlap."],
    ["Risk", "Assess current risk directly with the young person, apart from the caregiver, and record a safety plan."],
    ["Medication", "Discuss indication, expected benefit, monitoring, side effects and what would make the team stop."],
    ["Trauma", "Ask about adverse experiences in a trauma-informed way, without requiring the detail in writing."],
    ["Family functioning", "Assess caregiver mental health and the effect of caregiving load on the whole household."]]),
  ...D("Clinical Psychologist", [
    ["Formulation", "Build a formulation that holds the developmental, family, school and cultural picture together."],
    ["Standardised measures", "Select measures validated or at least appropriate for the person's language and culture, and name the limits of any that are not."],
    ["Mood and anxiety", "Assess mood, anxiety, self-concept and coping with instruments suited to the person's communication profile."],
    ["Masking", "Explore whether the person holds difficulties in at school and releases them at home, and what that costs."],
    ["Feedback", "Plan how findings will be given to the person themselves, in a form they can use."]]),
  ...D("Educational Psychologist", [
    ["Cognitive profile", "Assess reasoning, working memory and processing speed, and interpret in the language of testing."],
    ["Academic attainment", "Compare attainment with year level and with the person's own reasoning profile, not only with the class."],
    ["Specific learning difficulty", "Test phonological processing, rapid naming, decoding, fluency, spelling and written expression."],
    ["Accommodations", "Specify accommodations and concessions with the evidence for each, and the form needed to apply."],
    ["SIAS alignment", "Translate the findings into SNA language and a draft Individual Support Plan the school can implement."],
    ["Placement", "Advise on placement only with the family, and set out what support would make the current placement work."]]),
  ...D("Neuropsychologist", [
    ["Acquired change", "Establish the baseline before any illness or injury and the trajectory since."],
    ["Executive function", "Assess planning, inhibition, set shifting and self-monitoring with performance and rating measures."],
    ["Memory", "Separate encoding, storage and retrieval, and verbal from visual material."],
    ["Attention", "Separate sustained, selective and divided attention, and consider the effect of fatigue and medication timing."],
    ["Validity", "Note effort, fatigue, language and sensory factors affecting the validity of the profile."]]),
  ...D("Counsellor / Psychotherapist", [
    ["Goals", "Agree goals in the person's own words, drawn from In My Own Words."],
    ["Adjustment", "Support the family through diagnosis, grief, relief and identity, without rushing any stage."],
    ["Sibling support", "Ask about siblings' understanding, worry and need for time of their own."],
    ["Self-advocacy", "Build the person's language for their own needs and boundaries."]]),
  ...D("Occupational Therapist", [
    ["Occupational profile", "Identify the daily activities that matter most to this person and where they break down."],
    ["Sensory integration", "Use the sensory profile to form a hypothesis, then confirm by observation and structured assessment."],
    ["Fine motor and handwriting", "Assess grasp, in-hand manipulation, bilateral coordination, speed and legibility under timed conditions."],
    ["Self-care", "Assess dressing, grooming, toileting and feeding, and grade tasks to the current level."],
    ["Environment", "Recommend changes to the classroom, desk, seating, lighting and noise, with costs where relevant."],
    ["Equipment", "Specify assistive devices, seating, pencil grips or technology, and who funds them."],
    ["Regulation plan", "Write a regulation plan the school and home can both run, using what already works."]]),
  ...D("Speech-Language Therapist", [
    ["Receptive language", "Assess understanding of vocabulary, grammar and complex instructions in the strongest language."],
    ["Expressive language", "Assess vocabulary, sentence structure, narrative and word finding."],
    ["Speech sound system", "Assess articulation, phonology, intelligibility in connected speech and stimulability."],
    ["Social communication", "Assess conversation, repair, inference, figurative language and perspective taking in real interaction."],
    ["Bilingual profile", "Assess in every language used, and never diagnose a disorder from a second-language profile alone."],
    ["AAC", "Evaluate the need for augmentative and alternative communication, and start it without waiting for speech to fail."],
    ["Feeding and swallowing", "Where chewing, coughing or choking was reported, assess oral-motor function and swallow safety as a priority."],
    ["Literacy link", "Link phonological processing findings to the reading and spelling profile."]]),
  ...D("Audiologist", [
    ["Peripheral hearing", "Complete age-appropriate audiometry, tympanometry and otoacoustic emissions before any language conclusion is drawn."],
    ["Middle ear history", "Establish the history of infections, grommets and fluctuating hearing across the language-learning years."],
    ["Hearing in noise", "Assess speech perception in noise, which the intake flags and which standard audiometry can miss."],
    ["Auditory processing", "Consider auditory processing assessment where hearing is normal but listening is not."],
    ["Classroom listening", "Advise on seating, remote microphone systems and classroom acoustics."]]),
  ...D("Physiotherapist", [
    ["Gross motor", "Assess tone, strength, range, balance, gait and motor planning against age expectation."],
    ["Participation", "Assess what stops this person taking part in play, sport and physical education."],
    ["Pain and fatigue", "Characterise pain, hypermobility and exercise tolerance where these were reported."],
    ["Mobility and equipment", "Prescribe orthotics, mobility aids and seating, and review physical access at home and school."],
    ["Home programme", "Write a programme short enough that the family will actually do it."]]),
  ...D("Dietitian", [
    ["Intake", "Take a three day food and fluid record rather than relying on recall."],
    ["Selective eating", "Separate sensory-based selective eating from a medical or swallowing cause, with the therapy team."],
    ["Growth", "Interpret growth and weight against the medication list, since appetite suppression is common."],
    ["Micronutrients", "Consider iron, vitamin D, calcium, zinc and fibre where variety is very restricted, and test before supplementing."],
    ["Mealtime structure", "Advise on mealtime environment, timing and pressure, not only on food content."],
    ["Culture and cost", "Build the plan from foods the family already buys, eats and can afford."]]),
  ...D("Social Worker", [
    ["Material circumstances", "Assess income, food security, housing, transport and the cost of attending appointments."],
    ["Grants and services", "Advise on the care dependency grant, disability grant, assistive devices and respite, and help with the application."],
    ["Child protection", "Act on any safeguarding concern on the safety page, including the section 110 reporting duty."],
    ["Family system", "Assess caregiver load, sibling needs, kinship care arrangements and informal support."],
    ["School advocacy", "Support the family through the SIAS process, placement decisions and any appeal."],
    ["Community linkage", "Connect the family to parent support, disability organisations and local services."]]),
  ...D("Behaviour Support Practitioner", [
    ["Functional assessment", "Complete a functional behaviour assessment using direct observation across settings, not reports alone."],
    ["Antecedents", "Map setting events, demands, transitions and sensory conditions that precede distress."],
    ["Function", "Hypothesise the function of the behaviour and state the evidence for it."],
    ["Communication first", "Teach a functionally equivalent way to communicate the same need before trying to reduce anything."],
    ["Environment first", "Change the environment and the demand before changing the person."],
    ["Restrictive practice", "Record any restrictive practice in use, who authorised it, and the plan to end it."],
    ["Plan ownership", "Write a plan the family and the teacher can run on their worst day, not their best."]]),
  ...D("Learning Support / Remedial Specialist", [
    ["Baseline", "Establish a measurable baseline for reading, spelling, writing and maths."],
    ["Intervention", "Choose a structured, evidence-based programme and state the dose, duration and who delivers it."],
    ["Progress monitoring", "Set review points with the measure to be repeated, so the team can tell whether it is working."],
    ["Classroom transfer", "Agree with the class teacher what changes in the classroom, not only in the withdrawal session."],
    ["Assistive technology", "Trial text to speech, speech to text, typing and calculators, and record what helped."]]),
  ...D("Teacher / SBST Representative", [
    ["Observation", "Record what is seen in class, with dates and examples, as evidence for the SNA."],
    ["Differentiation", "Record the curriculum differentiation already in place at content, method, assessment and environment level."],
    ["SIAS process", "Confirm the learner profile, SNA 1 and SNA 2 status and the support level rating."],
    ["Escalation", "Where school-level support is not enough, prepare the DBE 120 referral to the District Based Support Team."],
    ["Concessions", "Prepare any accommodation or exemption application, with the evidence attached."],
    ["Implementation", "Agree who in the school owns each item of the support plan, and when it is reviewed."]]),
  ...D("Early Childhood Practitioner", [
    ["Play observation", "Observe free play, peer interaction and routine transitions over a full session."],
    ["Early intervention", "Start support now rather than waiting for a diagnosis, and record what is tried."],
    ["Caregiver coaching", "Coach the caregiver in the daily routine, since that is where learning happens at this age."],
    ["School readiness", "Plan the transition into Grade R or Grade 1 at least two terms ahead."]]),
  ...D("Optometrist / Ophthalmologist", [
    ["Visual acuity", "Test distance and near acuity with a method matched to the person's communication level."],
    ["Binocular function", "Assess squint, convergence, accommodation and tracking, which affect reading directly."],
    ["Refraction", "Refract under cycloplegia where cooperation is limited, and check whether prescribed glasses are tolerated."],
    ["Functional vision", "Report what this person can see in a classroom, not only the acuity figure."]])
].map((d, i) => ({ id: `D${String(i + 1).padStart(3, "0")}`, ...d }));

/** The clinical formulation the team writes (page 11). Nothing above it is a finding; everything in it is. */
export const FORMULATION: Question[] = qs("f", [
  ["Who contributed to this formulation, and when", undefined, undefined, "long"], ["Working formulation across the domains assessed", undefined, undefined, "long"],
  ["Diagnoses considered and the reasoning for and against each", undefined, undefined, "long"], ["What remains uncertain, and what would resolve it", undefined, undefined, "long"],
  ["Agreed priorities with the family, in order", undefined, undefined, "long"], ["Agreed priorities with the person themselves", undefined, undefined, "long"],
  ["Immediate actions, with an owner and a date for each", undefined, undefined, "long"], ["Onward referrals made", undefined, undefined, "long"],
  ["What was explained to the family, and how they responded", undefined, undefined, "long"], ["Date of the feedback meeting", undefined, undefined, "date"], ["Review date", undefined, undefined, "date"]]);
/** The team's review of the safety page (page 08). */
export const SAFETY_REVIEW: Question[] = qs("sr", [
  ["Date this page was reviewed, and by whom"], ["Was any concern discussed directly with the family?", undefined, YNU], ["Action taken, including any referral or report", undefined, undefined, "long"],
  ["Is a safety plan needed before the next appointment?", undefined, YNU], ["Date of the next safety review", undefined, undefined, "date"]]);
