// The content of the School Neurodevelopmental Learner Profile, version 2.0 (Pholoso Afrika Foundation, 13 November
// 2026): every observation prompt, the strategies catalogue, the phase guide and the answer lists, in the pack's own
// wording. The pack's rules (flags, alerts, ranking, risk) are in rules.ts.

export type Phase = "ecd" | "foundation" | "intermediate" | "senior" | "fet";
export const PHASES: Phase[] = ["ecd", "foundation", "intermediate", "senior", "fet"];
export const PHASE_NAME: Record<Phase, string> = {
  ecd: "Preschool / ECD", foundation: "Foundation Phase (Grades R-3)", intermediate: "Intermediate Phase (Grades 4-6)",
  senior: "Senior Phase (Grades 7-9)", fet: "FET Phase (Grades 10-12)"
};
/** What each phase page is about (the line under its title in the pack). */
export const PHASE_INTRO: Record<Phase, string> = {
  ecd: "Development through play and relationships, not formal academic performance. Observe during the ordinary routine rather than setting up a task.",
  foundation: "Learning to read, write and count, and learning how to be a learner. This is the phase in which a difference most often becomes visible, because the curriculum starts demanding skills that were not needed before.",
  intermediate: "Reading to learn rather than learning to read. Written volume rises, and the scaffolding of a single class teacher starts to fall away.",
  senior: "Many subject teachers, abstract reasoning and competing deadlines. Executive demand usually rises faster than independence does.",
  fet: "Specialised subjects, high stakes assessment and the examination access decisions that have to be made in this phase or not at all."
};

// ---------- Answer lists (page 17 of the pack) ----------
/** Impact on access and participation, with its score. -1 is not observed yet, which is not a zero. */
export const IMPACT: [string, number][] = [
  ["No barrier observed", 0], ["Slight, managed by usual teaching", 1], ["Moderate, needs planned support", 2],
  ["Significant, limits access or participation", 3], ["Severe, cannot access this without support", 4], ["Not observed yet", -1]
];
/** Support needed right now, with its score. */
export const SUPPORT_NOW: [string, number][] = [
  ["Independent", 0], ["Occasional prompt or reminder", 1], ["Regular adult support in the lesson", 2],
  ["Constant adult support", 3], ["Cannot take part even with support", 4], ["Not applicable", -1]
];
export const FREQUENCY = ["Not observed", "Rarely", "Sometimes", "Often", "Very often", "Consistently", "Varies by setting", "Not known"];
export const ROLES = ["ECD Practitioner", "Class Teacher", "Subject Teacher", "Learning Support Educator", "School-Based Support Team (SBST) member", "School Counsellor", "School Psychologist", "Occupational Therapist (school based)", "Speech-Language Therapist (school based)", "Educational Psychologist", "School Nurse", "Deputy Principal or Principal", "Teaching Assistant or Learning Support Assistant", "District official (DBST)", "Other authorised school professional"];
export const SIAS_STAGE = ["No SNA started", "Learner profile opened only", "SNA 1 in progress", "SNA 1 completed by the teacher", "SNA 2 completed by the SBST", "SNA 3 / DBE 120 submitted to the DBST", "Individual Support Plan in place", "District support allocated", "Placement under review", "Not known"];
export const SIAS_LEVEL = ["Level 1, low support", "Level 2, moderate support", "Level 3, high support", "Level 4, very high support", "Not yet rated"];
export const YNU = ["Yes", "No", "Not sure", "In progress", "Not applicable"];
export const YN = ["Yes", "No"];
export const TRIED = ["Not tried", "Tried, it helped", "Tried, no change", "Tried, it made things worse", "Still trying, too early to say", "Tried, but not applied consistently"];
export const DECISION = ["Continue as is", "Continue and strengthen", "Change the approach", "Stop", "Escalate to the SBST", "Refer to the DBST", "Not yet reviewed"];
export const REVIEW_FREQ = ["Daily", "Weekly", "Fortnightly", "Monthly", "Each term", "At the agreed review date", "As needed"];
export const ATTEND_BAND = ["Full attendance", "Occasional absence", "Frequent absence", "Frequent late arrival", "Absent 3 or more days in a row", "School refusal episodes", "Not known"];
export const PLACEMENT = ["Mainstream, no additional support", "Mainstream with classroom support", "Mainstream with a facilitator", "Full service school", "Special school", "Special school resource centre", "Home education", "Not known"];
export const CONSENT_OPT = ["Yes, consent given", "No, consent refused", "Consent given with limits", "Not yet requested", "Parent could not be reached"];
export const COMMS_MODE = ["Spoken words", "Short phrases", "Single words", "Gestures and pointing", "South African Sign Language", "Picture cards or a communication board", "Speech device or app (AAC)", "Writing or typing", "Behaviour, staff read what it means", "A mix of these"];
export const EVIDENCE_SRC = ["Direct classroom observation", "Observed on the playground", "Reported by another teacher", "Reported by the parent or caregiver", "Reported by the learner", "From the learner's written work", "From assessment or test results", "From the attendance register", "From a professional report", "Not yet verified"];
export const LANG = ["isiZulu", "isiXhosa", "Afrikaans", "English", "Sepedi", "Setswana", "Sesotho", "Xitsonga", "siSwati", "Tshivenda", "isiNdebele", "South African Sign Language", "Other", "More than one equally", "Not known"];
export const VOICEHOW = ["The learner wrote it", "An adult scribed what the learner said", "An adult read the questions and the learner chose", "The learner used a device, pictures or signs", "Observed during play and recorded by the adult", "The learner declined to take part"];

// ---------- Page 01: the profile and school context ----------
/** One question: key, wording, why it is asked, and how it is answered (a list, a date, a number, or text). */
export interface Question { key: string; q: string; why?: string; list?: string[]; kind?: "date" | "number" | "long" }
export interface Section { title: string; note?: string; questions: Question[] }

// Real names, identity numbers, dates of birth, contact details, health conditions, allergies and medicines are not
// asked here: the app knows each learner by a nickname, and health stays in the family's health records, under their
// consent. The pack's other questions are kept in its wording.
export const CONTEXT: Section[] = [
  { title: "Who this learner is", questions: [
    { key: "grade", q: "Grade or class" },
    { key: "phase", q: "School phase", why: "This choice decides which observation sheet to complete, and drives the alerts, the support map and the plan.", list: PHASES.map(p => PHASE_NAME[p]) },
    { key: "firstYear", q: "Is the learner in the first year of this phase?", why: "Grade R, 1, 4, 7 and 10 are the highest risk years. Say yes if this is one of them.", list: YN },
    { key: "school", q: "School name and EMIS number" },
    { key: "district", q: "District and circuit" },
    { key: "placement", q: "Current placement", list: PLACEMENT },
    { key: "keyContact", q: "Class teacher or key contact" },
    { key: "opened", q: "Date this profile was opened", kind: "date" },
    { key: "reviewDate", q: "Date of this review", kind: "date" }
  ] },
  { title: "Language and communication", questions: [
    { key: "homeLang", q: "Home language", list: LANG },
    { key: "otherLangs", q: "Other languages used at home" },
    { key: "lolt", q: "Language of learning and teaching", why: "Where this differs from the home language, never read a language difference as a disorder.", list: LANG },
    { key: "strongestLang", q: "Is the learner being taught in their strongest language?", list: YNU },
    { key: "commsMode", q: "Main way this learner communicates in class", list: COMMS_MODE },
    { key: "usesDevice", q: "Does the learner use a device, signs, pictures or an app?", list: YNU },
    { key: "deviceSetup", q: "Who set it up, and have staff been shown how it works?", why: "A system nobody can operate is not access." },
    { key: "interpreter", q: "Interpreter or communication support needed for meetings?", list: YNU },
    { key: "familyLang", q: "Preferred language for contacting the family", list: LANG }
  ] },
  { title: "Who observed, and on what basis", questions: [
    { key: "completedBy", q: "Role of the person completing this profile", list: ROLES },
    { key: "knownFor", q: "How long this person has known the learner" },
    { key: "seesHow", q: "How often this person sees the learner", why: "For example, every day for four lessons a week, or twice a week on the playground." },
    { key: "otherStaff", q: "Other staff who contributed, and in what way" },
    { key: "period", q: "Observation period covered by this profile", why: "For example, Term 3 2026, from 14 July to 25 September." }
  ] },
  { title: "Consent and information sharing", note: "Health information is special personal information under POPIA. Where the learner is under 18, the Act requires the prior consent of a competent person, usually a parent or legal guardian.", questions: [
    { key: "consent", q: "Consent obtained from a parent or legal guardian", list: CONSENT_OPT },
    { key: "consentWhen", q: "Date consent was given, and who recorded it" },
    { key: "consentLimits", q: "Limits the family placed on sharing", why: "Write None if there are none." },
    { key: "shareExternal", q: "May this profile be shared with external professionals?", list: YN },
    { key: "namedPros", q: "Named professionals it may be shared with" },
    { key: "notShare", q: "Anyone it must NOT be shared with", why: "Including where a court order or parenting plan applies. Keep the order with the school's records." },
    { key: "learnerTold", q: "Was the learner told about this, in a way they understand?", list: YNU },
    { key: "voiceHow", q: "How the learner's own views were gathered", why: "Complete the learner's own words. Note here if the learner declined, or if a different method was used.", list: VOICEHOW }
  ] },
  { title: "Where the learner sits in the SIAS process", note: "SIAS allocates support by level of need, not by diagnosis. A learner does not need a diagnosis to receive support.", questions: [
    { key: "siasStage", q: "Stage reached in the SIAS process", list: SIAS_STAGE },
    { key: "siasDate", q: "Date the current stage was reached", kind: "date" },
    { key: "supportLevel", q: "Level of support currently rated", list: SIAS_LEVEL },
    { key: "isp", q: "Is an Individual Support Plan in place?", list: YNU },
    { key: "ispReviewed", q: "Date the Individual Support Plan was last reviewed", kind: "date" },
    { key: "sbstMet", q: "Has the SBST met about this learner?", list: YN },
    { key: "sbstDate", q: "Date of the last SBST meeting", kind: "date" },
    { key: "dbe120", q: "Has the case been referred to the DBST on DBE 120?", list: YN },
    { key: "dbe125", q: "Curriculum differentiation recorded (DBE 125)?", list: YN },
    { key: "dbe124", q: "Accommodation or exemption applied for (DBE 124)?", why: "For the FET phase this is the examination concession application. It is a separate process from SIAS and it has its own deadline.", list: YNU },
    { key: "concessionDue", q: "Date the concession application is due in this district", why: "Confirm the current date with the district or assessment body each year. Deadlines differ between the DBE, the IEB and other assessment bodies, and they change.", kind: "date" },
    { key: "dbe126", q: "Health and disability assessment completed (DBE 126)?", list: YNU }
  ] },
  { title: "Attendance", questions: [
    { key: "attendBand", q: "Attendance pattern this term", list: ATTEND_BAND },
    { key: "daysAbsent", q: "Days absent this term", why: "Count school days, not periods. Leave blank if the register is not yet available.", kind: "number" },
    { key: "schoolDays", q: "School days in the term so far", why: "Used to work out the attendance rate.", kind: "number" },
    { key: "longestRun", q: "Longest run of consecutive days absent", why: "Policy requires the class teacher to report three consecutive days of unexplained absence to the principal.", kind: "number" },
    { key: "lates", q: "Number of late arrivals this term", kind: "number" },
    { key: "absencePattern", q: "Is there a pattern to the absence?", why: "For example, always a Monday, always before a test, always after a difficult weekend." },
    { key: "absenceReasons", q: "Reasons given by the family" },
    { key: "followedUp", q: "Has the absence been followed up, and by whom?" }
  ] },
  { title: "Safety and what staff must know today", note: "Health conditions, allergies and medicines are in the family's health records, shown to the team only with the family's consent.", questions: [
    { key: "emergencyPlan", q: "Is there an authorised health or emergency plan?", list: YNU },
    { key: "planKept", q: "Where the authorised plan is kept", why: "A relief teacher must be able to find this in under a minute." },
    { key: "accessNeeds", q: "Anything that affects access to the building or the playground" },
    { key: "evacuation", q: "Does the learner need help in an evacuation?", list: YN },
    { key: "evacuationStaff", q: "Staff member responsible in the fire plan, and a backup", why: "Name a backup for when that person is absent." }
  ] },
  { title: "Strengths, history and what already works", questions: [
    { key: "goodAt", q: "What this learner is good at", why: "Answer this before anything else on the observation sheets. It is not a courtesy question. Support that does not build on a strength rarely holds.", kind: "long" },
    { key: "enjoys", q: "What the learner enjoys at school", kind: "long" },
    { key: "atBest", q: "When staff see this learner at their best", kind: "long" },
    { key: "works", q: "What already works in this classroom", why: "The single most useful thing a school can record. Protect it in any new plan.", kind: "long" },
    { key: "notWork", q: "What definitely does not work", kind: "long" },
    { key: "bestAdult", q: "Which adult does this learner respond to best, and why", kind: "long" },
    { key: "previous", q: "Previous school or setting, and date of transfer" },
    { key: "repeated", q: "Has the learner repeated a grade, or had a long gap in schooling?" },
    { key: "reports", q: "Reports or assessments on file, with dates", why: "Note where each is kept. Assessment reports older than two years are often not accepted for concession applications." },
    { key: "externals", q: "External professionals currently involved, with consent" },
    { key: "familyPriorities", q: "Family's stated priorities for school", kind: "long" },
    { key: "familyDate", q: "Date this was discussed with the family", kind: "date" }
  ] }
];

// ---------- Page 03: in the learner's own words ----------
export interface VoiceQuestion { key: string; q: string; when: string; choice?: string[]; group: string }
/** Three answers raise alerts (someone unkind, not feeling safe, no adult to go to), so they also take a choice. */
export const VOICE_CHOICE = ["Yes", "No", "Not sure", "Did not want to answer"];
export const VOICE: VoiceQuestion[] = [
  ["School, as I see it", "v3", "What I like about school", "Good for every phase."],
  ["School, as I see it", "v4", "What is hard about school", "Good for every phase."],
  ["School, as I see it", "v5", "The subject or activity I like most", "Every phase."],
  ["School, as I see it", "v6", "The subject or activity I find hardest", "Every phase."],
  ["School, as I see it", "v7", "What my teacher does that helps me", "Every phase."],
  ["School, as I see it", "v8", "What makes it harder for me", "Every phase."],
  ["School, as I see it", "v9", "Where I sit, and whether that works for me", "Foundation phase and upwards."],
  ["School, as I see it", "v10", "How break time goes for me", "Every phase."],
  ["School, as I see it", "v11", "What I do when I do not understand something", "Intermediate phase and upwards."],
  ["School, as I see it", "v12", "What happens when I ask for help", "Intermediate phase and upwards."],
  ["People", "v13", "Who I sit with and play with", "Every phase."],
  ["People", "v14", "Is there an adult at school I can go to?", "Every phase. A No here matters."],
  ["People", "v15", "Who that adult is", "Every phase."],
  ["People", "v16", "Is anyone unkind to me at school?", "Every phase. Any answer other than No is followed up the same day."],
  ["People", "v17", "If yes, what happens, where, and who knows", "Every phase."],
  ["People", "v18", "Do I feel safe at school?", "Every phase."],
  ["My body, my senses and my day", "v19", "Noise, light, smells or places at school that bother me", "Every phase."],
  ["My body, my senses and my day", "v20", "What helps me when it gets too much", "Every phase."],
  ["My body, my senses and my day", "v21", "How I know I am getting overwhelmed", "Foundation phase and upwards."],
  ["My body, my senses and my day", "v22", "What I need adults to do when that happens", "Every phase."],
  ["My body, my senses and my day", "v23", "What I need adults to stop doing", "Every phase."],
  ["My body, my senses and my day", "v24", "How tired I am by the end of the school day", "Senior and FET phases especially."],
  ["What I want", "v25", "The one thing I would most like to be easier", "Every phase."],
  ["What I want", "v26", "Something I would like help with", "Every phase."],
  ["What I want", "v27", "Something I do not want changed about me", "Every phase."],
  ["What I want", "v28", "Do I know what support I am getting, and why?", "Senior and FET phases. A No here is a finding."],
  ["What I want", "v29", "Do I want my support to be private from my classmates?", "Senior and FET phases. Record the answer and respect it."],
  ["What I want", "v30", "What I want to do after school", "Senior and FET phases."],
  ["What I want", "v31", "What I want the adults planning my support to know", "Every phase."]
].map(([group, key, q, when]) => ({ group: group!, key: key!, q: q!, when: when!, ...(key === "v14" || key === "v16" || key === "v18" ? { choice: VOICE_CHOICE } : {}) }));

// ---------- Observations: the core page (every phase) and the five phase pages ----------
export interface Item { id: string; phase: Phase | "core"; domain: string; text: string }
const page = (phase: Item["phase"], prefix: string, rows: [string, string[]][]): Item[] => {
  let n = 0;
  return rows.flatMap(([domain, texts]) => texts.map(text => ({ id: `${prefix}${++n}`, phase, domain, text })));
};

export const CORE: Item[] = page("core", "c", [
  ["Learner & enrolment", [
    "How long have you known the learner, and in what capacity?",
    "How often do you observe the learner directly?",
    "Which settings have you observed: whole class, small group, one-to-one, playground, meals, sport, excursions or online learning?",
    "Are observations consistent across settings? Describe differences.",
    "Which information is based on direct observation and which was reported by someone else?"]],
  ["Communication & language", [
    "How does the learner understand spoken instructions, including multi-step or unfamiliar instructions?",
    "How does the learner communicate ideas, questions, disagreement, discomfort and requests for help?",
    "Does the learner use or benefit from visuals, gestures, sign, AAC, written prompts or assistive communication?",
    "Are there differences between conversational language, academic language and social communication?",
    "Does the learner understand figurative language, implied meaning, humour or non-literal expressions at the expected stage?"]],
  ["Social interaction", [
    "How does the learner participate in pairs, small groups, whole-class discussion and unstructured settings?",
    "How does the learner initiate interaction, respond to others and sustain shared activity?",
    "How does the learner interpret social cues, personal space, tone and changes in group expectations?",
    "Are there peer relationships that support belonging, safety and participation?",
    "Are there repeated conflicts, misunderstandings, isolation or exclusion requiring support?"]],
  ["Attention & task engagement", [
    "How does the learner sustain attention during teacher talk, independent work and preferred activities?",
    "How does the learner respond to distractions, background noise, movement and visual clutter?",
    "Can the learner start a task, track steps, check work and finish within available time?",
    "How much prompting, scaffolding or adult proximity is required?",
    "Does performance vary by time of day, subject, task length, interest or environment?"]],
  ["Behaviour & emotional regulation", [
    "What observable signs indicate that the learner is becoming overwhelmed, frustrated, anxious or disengaged?",
    "What usually happens immediately before the difficulty, and what happens afterwards?",
    "How does the learner communicate a need for a break, clarification, reduced demand or support?",
    "What strategies help the learner return to a comfortable and engaged state?",
    "Are transitions, uncertainty or sensory conditions associated with distress?",
    "How does the school respond, and does the response reduce or escalate the difficulty?"]],
  ["Sensory environment", [
    "How does the learner respond to noise, lighting, temperature, smells, touch, crowding and movement?",
    "Are there particular locations or times such as assembly, corridors, lunch, transport or sport that affect participation?",
    "Does the learner seek movement, quiet, predictable seating, reduced visual input or other adjustments?",
    "Are sensory supports available, acceptable to the learner and used without stigma?",
    "Does the learner have access to a calm, supervised space and a planned way to request it?"]],
  ["Motor & written output", [
    "How does the learner manage handwriting, drawing, cutting, manipulating tools or practical materials?",
    "Does written output reflect understanding, or is it limited by speed, fatigue, pain or motor effort?",
    "How does the learner manage stairs, playground movement, sport, physical education and mobility?",
    "Are there barriers to using a keyboard, tablet, adapted stationery or other access equipment?"]],
  ["Adaptive independence", [
    "How independently does the learner manage belongings, routines, personal organisation and classroom responsibilities?",
    "Can the learner follow school safety routines and seek adult help when needed?",
    "Are there support needs related to toileting, eating, medication, mobility or personal care during the school day?",
    "Are support arrangements discreet, respectful, age-appropriate and agreed with learner/family as appropriate?"]],
  ["Attendance & participation", [
    "Are there patterns in late arrival, absence, early collection, partial attendance or missed lessons?",
    "Are attendance patterns linked to particular days, subjects, transitions, social events or health needs?",
    "Does the learner participate in excursions, assemblies, sport, clubs, practical lessons and school events?",
    "What adjustments enable participation rather than exclusion from activities?"]],
  ["Wellbeing & safeguarding", [
    "Have staff noticed a sustained change in mood, engagement, attendance, self-care or peer interaction?",
    "Has the learner disclosed or shown signs of bullying, harassment, abuse, neglect, exploitation or feeling unsafe?",
    "Does the learner know which trusted adult to approach and how to report a concern?",
    "Are there immediate safety concerns that require action under school safeguarding procedures?",
    "Have concerns been escalated to the designated safeguarding lead or appropriate authority in line with policy?"]],
  ["Interventions & accommodations", [
    "What classroom strategies, accommodations or interventions have been tried?",
    "When did each strategy start, how consistently was it used and by whom?",
    "What was the learner's baseline before the intervention?",
    "What observable change followed in engagement, accuracy, independence, wellbeing or participation?",
    "Was the learner asked whether the support was helpful or acceptable?",
    "What should continue, change, stop or be trialled next?"]],
  ["Strengths & learner voice", [
    "What does the learner do well, enjoy or show deep knowledge about?",
    "Which conditions help the learner demonstrate strengths?",
    "What does the learner say helps them learn, participate or feel comfortable?",
    "What goals or changes does the learner want adults at school to understand?",
    "How are interests incorporated into teaching and motivation without making access conditional?"]],
  ["Family & collaboration", [
    "Has the school discussed observations and support plans with parent/caregiver, and when?",
    "What information has the family shared that is relevant to school participation?",
    "Are there agreed communication methods and review intervals between home and school?",
    "Which external professionals or services are involved, and is information sharing authorised?",
    "Are language, transport, cost, digital access or scheduling barriers affecting collaboration?"]],
  ["Curriculum access", [
    "Which teaching formats support access: explicit modelling, chunked instructions, worked examples, visuals, hands-on tasks or pre-teaching vocabulary?",
    "Are instructions provided verbally and in accessible written or visual form?",
    "Are tasks adjusted to reduce unnecessary language, copying, memory load or time pressure while preserving learning goals?",
    "Are there opportunities to demonstrate learning in more than one way?",
    "Are expectations, routines and success criteria explicit and predictable?"]],
  ["School support process", [
    "Has the learner been discussed by the school-based support team, and what was agreed?",
    "Is there an individual support plan or learner support record, and when was it last reviewed?",
    "Have reasonable accommodations, assistive technology or curriculum access supports been considered?",
    "Has the school consulted district-based support or specialist services where appropriate?",
    "Are responsibilities, timelines and review dates assigned for each agreed action?"]],
  ["Transitions between phases", [
    "How did the learner manage the move into this phase, and what changed for them?",
    "Which supports from the previous phase were handed over, and which quietly stopped?",
    "Does every teacher who sees this learner know about the support plan?",
    "What needs to be prepared before the move into the next phase, and by when?",
    "Who will hand over to the receiving teacher or school, and on what date?"]],
  ["Assistive technology and access", [
    "What technology or equipment does the learner use, and does it work in every lesson?",
    "Have staff been shown how the learner's device or system works?",
    "Is the learner able to use their accommodation independently?",
    "What is stopping an available support from being used consistently?"]]
]);

export const PHASE_ITEMS: Record<Phase, Item[]> = {
  ecd: page("ecd", "e", [
    ["Development & readiness", [
      "How does the child explore a new room, materials or unfamiliar activities?",
      "Does the child show curiosity by looking, reaching, pointing, bringing objects or inviting an adult to notice something?",
      "How does the child respond when an adult follows their interest or joins their play?",
      "How does the child shift between self-chosen play and adult-guided activities?",
      "How does the child communicate basic needs such as help, comfort, food, drink or toileting?",
      "How does the child respond to simple one-step directions in familiar routines?",
      "Does the child imitate actions, sounds, gestures or pretend-play ideas?",
      "How does the child manage arrival, separation from caregiver and reunion?",
      "Which early readiness activities are accessible or difficult: matching, sorting, sequencing, puzzles, songs and stories?"]],
    ["Play & social participation", [
      "What kinds of play are observed: sensory exploration, functional play, construction, pretend play, role play or games?",
      "Does the child play alone, alongside peers, cooperatively or move between these forms?",
      "How does the child enter play with another child and respond when a peer joins?",
      "How does the child share, take turns or negotiate access to toys, with or without adult support?",
      "Does the child use toys flexibly or repeat particular actions/sequences? Describe neutrally.",
      "How does the child respond when play changes, an object is unavailable or another child changes the rules?",
      "Does the child share enjoyment, interest or discoveries with adults or peers?",
      "How are songs, rhymes, stories, movement games and circle-time activities experienced?"]],
    ["Early communication", [
      "How does the child communicate when speech is not yet reliable or is not their main communication method?",
      "Does the child use gestures, pointing, facial expression, signs, pictures or communication devices?",
      "How does the child indicate yes/no, choice, refusal, discomfort or request for help?",
      "How does the child respond to their name and familiar voices in different environments?",
      "How does the child understand familiar words, songs, routines and simple questions?",
      "Does the child use words, phrases or sentences spontaneously, by imitation or with prompting?",
      "How understandable is the child's speech to familiar and unfamiliar communication partners?",
      "How does the child communicate with peers compared with familiar adults?"]],
    ["Early literacy", [
      "Does the child show interest in books, pictures, shared reading or being read to?",
      "Can the child attend to a short story in a way that is comfortable for them?",
      "Does the child recognise familiar logos, symbols, pictures, own name or environmental print?",
      "Does the child enjoy rhyming, rhythm, songs, sound play or noticing words that begin alike?",
      "How does the child handle books: orientation, page turning, pointing to pictures or print?",
      "Does the child make marks, draw, scribble or attempt to represent meaning?"]],
    ["Early mathematics", [
      "Does the child sort, match, group or classify objects by colour, shape, size or type?",
      "Does the child show awareness of more/less, big/small, same/different or one/many?",
      "Does the child recite number words, count objects or match number words to quantities?",
      "Does the child notice patterns, sequences, shapes, spatial relationships or simple puzzles?",
      "How does the child approach practical problem-solving such as fitting, building or distributing objects?"]],
    ["Adaptive independence", [
      "How independently does the child manage snack/lunch routines, opening containers and drinking?",
      "How does the child participate in toileting and handwashing routines, with what level of support?",
      "How does the child manage shoes, coat, bag and simple dressing tasks?",
      "Can the child follow familiar daily routines using visual cues, modelling or verbal reminders?",
      "How does the child signal pain, illness, tiredness or need for a break?"]],
    ["Sensory environment", [
      "How does the child respond to group noise, singing, bells, overlapping voices or sudden sounds?",
      "How does the child respond to bright light, visual clutter, crowded walls or busy movement?",
      "Are there preferences or avoidances relating to textures, messy play, water, sand, paint or clothing?",
      "How does the child respond to movement activities such as swinging, climbing, spinning or running?",
      "Which sensory experiences appear to help the child settle, engage or recover?"]],
    ["Playground & group routines", [
      "How does the child engage in outdoor play, climbing, balancing, water/sand play and movement experiences?",
      "Can the child participate in shared routines such as snack, tidy-up, story time and group songs?",
      "How does the child respond to waiting, sharing limited resources and adult-led transitions?",
      "Does the child show emerging awareness of safety boundaries and respond to familiar safety cues?"]]
  ]),
  foundation: page("foundation", "f", [
    ["Emergent literacy & reading", [
      "Which language(s) of learning and teaching are used, and in which language(s) is the learner strongest?",
      "Can the learner identify and manipulate sounds in spoken words: rhyme, syllables, initial/final sounds, blending and segmenting?",
      "How accurately does the learner connect letters/graphemes with sounds in the language being taught?",
      "Can the learner decode unfamiliar words, and what word patterns cause difficulty?",
      "How does reading accuracy and pace compare with current grade and language demands?",
      "Can the learner retell a short text, identify key events and answer literal questions?",
      "Can the learner make simple inferences, predict events or connect text to prior knowledge?",
      "Does the learner recognise common words automatically or rely heavily on sounding out or memorisation?",
      "How does the learner respond to shared reading, independent reading and reading aloud?",
      "Does reading effort affect stamina, comprehension or willingness to participate?"]],
    ["Writing", [
      "How does the learner form letters and numbers, including directionality, size, spacing and consistency?",
      "Can the learner copy from the board or a near-point model at an appropriate pace?",
      "Can the learner write their name, words and simple sentences independently?",
      "Can the learner generate an idea orally before writing it?",
      "Can the learner sequence ideas into a simple written message or story?",
      "How are spelling attempts, sound-letter links and punctuation developing?",
      "Does handwriting effort affect the amount, quality or completion of work?",
      "Does the learner communicate more effectively through drawing, oral responses, typing or other modes?"]],
    ["Early numeracy", [
      "Does the learner demonstrate one-to-one correspondence when counting objects?",
      "Can the learner compare quantities and understand more, less, equal and number magnitude?",
      "How secure are number recognition, ordering and place-value concepts for the grade?",
      "Can the learner use concrete materials, drawings or number lines to solve problems?",
      "How does the learner approach addition and subtraction, and explain their strategy?",
      "Can the learner recognise patterns, shapes, measurement concepts and spatial relationships?",
      "Can the learner solve simple word problems when language demands are supported?",
      "Are errors mainly related to number concepts, memory, language, attention or recording?"]],
    ["Classroom routines & executive skills", [
      "Can the learner begin a familiar task after whole-class instructions?",
      "Can the learner follow a two- or three-step classroom instruction?",
      "Can the learner keep track of basic materials such as books, stationery, bag and homework?",
      "How does the learner manage waiting, turn-taking and stopping one activity to start another?",
      "Can the learner sustain engagement for short teacher-directed and self-directed activities?",
      "How much adult prompting is needed to complete and submit routine work?",
      "How does the learner manage carpet time, group instruction, paired work and independent work?",
      "Can the learner communicate confusion, ask for help or request repetition?",
      "How does the learner respond to correction, mistakes or work that feels difficult?"]],
    ["Classroom learning access", [
      "Can the learner copy information from the board while retaining their place and completing the task?",
      "Does the learner understand classroom language such as before/after, first/next/last, explain, compare and describe?",
      "How does the learner manage the shift from play-based learning to formal desk-based tasks?",
      "Can the learner demonstrate understanding through pointing, manipulatives, oral response or drawing?",
      "Does the learner need explicit teaching of classroom routines, rules and hidden expectations?"]]
  ]),
  intermediate: page("intermediate", "i", [
    ["Reading to learn", [
      "Can the learner read grade-level texts accurately and with sufficient fluency to support comprehension?",
      "Can the learner identify main ideas, supporting details, sequence, cause and effect?",
      "Can the learner make inferences, interpret vocabulary in context and summarise information?",
      "Can the learner compare information across paragraphs, texts, diagrams and tables?",
      "How does the learner cope with independent reading and subject-specific texts?",
      "Does reading stamina, pace or comprehension change with text length or complexity?"]],
    ["Extended writing", [
      "Can the learner plan, organise and write a coherent paragraph or extended response?",
      "Can the learner distinguish and use narrative, descriptive, instructional and factual text forms?",
      "Can the learner organise ideas into a logical sequence?",
      "Can the learner take notes from a lesson, text or visual presentation?",
      "How do spelling, grammar, punctuation, editing and presentation affect meaning?",
      "Can the learner complete written tasks within typical classroom time?",
      "Does the learner benefit from writing frames, graphic organisers, speech-to-text or keyboarding?"]],
    ["Mathematical reasoning", [
      "How secure is understanding of whole numbers, fractions, decimals and percentages as taught?",
      "Can the learner select an appropriate operation for a word problem and explain why?",
      "Can the learner follow multi-step calculations without losing place or sequence?",
      "How does the learner interpret mathematical vocabulary, symbols, diagrams and written problem statements?",
      "Can the learner transfer a taught strategy to a differently worded or unfamiliar problem?",
      "How does the learner approach measurement, geometry, data handling and patterns?",
      "Are difficulties consistent across practical, oral and written mathematics tasks?"]],
    ["Study & organisation", [
      "Can the learner record homework and remember what needs to be completed?",
      "Can the learner organise books and materials for different subjects or days?",
      "Can the learner break a longer assignment into steps and monitor progress?",
      "How does the learner prepare for tests and retain information over time?",
      "Can the learner estimate task duration and manage classroom time?",
      "How does the learner respond when several tasks or deadlines occur in one week?",
      "How does the learner navigate friendship groups, group projects, conflict and unstructured break times?"]],
    ["Curriculum access", [
      "Can the learner use a dictionary, glossary, contents page, index or digital search to locate information?",
      "Can the learner interpret charts, maps, timelines, diagrams and multi-modal information?",
      "Can the learner plan and complete a research or project task with staged deadlines?",
      "Can the learner distinguish relevant from irrelevant information when answering a question?",
      "How does the learner manage increased homework volume and responsibility across subjects?"]]
  ]),
  senior: page("senior", "s", [
    ["Subject rotation & abstract learning", [
      "How does the learner manage transitions between multiple subject teachers, classrooms and expectations?",
      "Are there clear differences in performance between subjects? Identify strengths and barriers by subject.",
      "Can the learner understand subject-specific vocabulary, diagrams, processes and abstract concepts?",
      "Can the learner apply concepts to unfamiliar examples rather than reproduce a memorised procedure?",
      "How does the learner manage practical tasks, projects, experiments and collaborative assignments?",
      "Is there a gap between oral understanding, class participation and written assessment performance?",
      "Which demands are most difficult: reading load, writing volume, pace, abstraction, memory or independent work?",
      "Can the learner interpret command words such as analyse, evaluate, justify, compare and discuss?"]],
    ["Executive functioning & independence", [
      "Can the learner manage a timetable, move between classes and arrive with required materials?",
      "Can the learner track assignments, test dates and longer-term project deadlines across subjects?",
      "Can the learner prioritise tasks when several teachers set work simultaneously?",
      "Can the learner plan, initiate, monitor and submit independent work without repeated prompting?",
      "How effectively does the learner take notes while listening and identify key information?",
      "Can the learner estimate time, manage distractions and recover after interruption?",
      "Does the learner use a planner, checklist or digital reminder independently?"]],
    ["Adolescent wellbeing & peer context", [
      "Have there been changes in attendance, participation, mood, peer engagement or academic performance?",
      "How does the learner navigate peer pressure, group identity, social media-related issues and conflict?",
      "Are there concerns about bullying, harassment, exclusion, coercion or online safety?",
      "Does the learner have a trusted adult at school and know how to access support privately?",
      "How does the learner manage increasing expectations for independence and self-advocacy?",
      "Are routines and support arrangements sensitive to privacy and changing personal-care needs during puberty, where relevant?",
      "Does the learner experience anxiety around presentations, group work, tests or unpredictable change?"]],
    ["Higher-order thinking", [
      "Can the learner interpret metaphor, inference, implied meaning and complex instructions?",
      "Can the learner compare viewpoints, evaluate evidence and explain reasoning?",
      "Can the learner transfer learning across subjects or real-life contexts?",
      "How does the learner cope with open-ended tasks where there is no single obvious answer?",
      "Can the learner identify what they do not understand and choose a strategy to address it?"]],
    ["Curriculum access", [
      "Can the learner connect concepts across topics and explain cause, consequence or systems?",
      "Can the learner interpret complex graphs, formulae, maps, source documents or practical instructions?",
      "How does the learner cope with simultaneous changes in teacher expectations, assessment formats and environments?",
      "Can the learner advocate for clarification or adjustment without unwanted disclosure to peers?"]]
  ]),
  fet: page("fet", "t", [
    ["Subject-specific performance", [
      "List current subjects and describe performance, participation and support needs in each subject.",
      "Are there subject-specific barriers involving reading volume, technical vocabulary, calculations, practical work or extended writing?",
      "Can the learner interpret examination-style questions, command words and mark allocations?",
      "Can the learner structure extended essays, reports, practical write-ups or research assignments?",
      "Can the learner manage practical assessments, portfolios, projects and cumulative coursework?",
      "Does performance differ between coursework, oral demonstration, practical tasks and formal examinations?",
      "Which subjects or learning pathways align with strengths, interests and longer-term goals?"]],
    ["Independent study & workload", [
      "Can the learner independently create and follow a realistic weekly study timetable?",
      "Can the learner prioritise revision across subjects and prepare for cumulative examinations?",
      "Can the learner select effective study strategies rather than relying only on rereading or last-minute study?",
      "How does the learner manage long assignments, research tasks and multiple deadlines?",
      "Can the learner monitor progress, identify gaps and seek help early?",
      "Can the learner sustain study over longer periods while managing rest, sleep and wellbeing?",
      "How effectively does the learner use assistive technology, digital calendars, reminders or accessible materials?"]],
    ["Assessment access & accommodations", [
      "What barriers arise in tests and examinations: time, reading, writing, processing, sensory environment, anxiety or movement?",
      "Which accommodations or concessions are currently approved, requested or being considered?",
      "Are accommodations implemented consistently across subjects and internal assessments?",
      "Does the learner understand and use approved accommodations independently?",
      "Are there supporting reports, school records or application timelines to consider?",
      "How do assessment results change when access arrangements are in place?"]],
    ["Post-school transition", [
      "Has the learner explored university, TVET college, learnerships, apprenticeships, employment, entrepreneurship or other pathways?",
      "Can the learner identify strengths, interests, support needs and preferred working/learning environments?",
      "Has the learner practised self-advocacy and explaining support needs?",
      "Can the learner manage transport, time, money, appointments and daily routines at the level expected after school?",
      "Are applications, funding, disability support services, career guidance or workplace exposure needed?",
      "What transition information should be shared with a post-school provider, and what consent is required?",
      "Is there a transition plan with actions, responsible people and review dates?"]],
    ["Curriculum access", [
      "Can the learner manage the pace and depth of subject content and independent preparation expected in FET?",
      "Can the learner plan and complete practical investigations, research projects and formal tasks over extended periods?",
      "Can the learner manage subject-specific terminology, multi-source reading and synthesis of evidence?",
      "Are subject choices aligned with learner strengths, interests and possible post-school pathways?",
      "Does the learner understand subject-choice implications, prerequisites and pathway options?"]]
  ])
};

// ---------- Page 14: the accommodations and strategies catalogue ----------
export interface Strategy { n: number; domain: string; title: string; how: string; cost: "No cost" | "Low" | "Medium" }
const S = (domain: string, rows: [string, string, Strategy["cost"]][], from: number): Strategy[] => rows.map(([title, how, cost], i) => ({ n: from + i, domain, title, how, cost }));
export const STRATEGIES: Strategy[] = [
  ...S("Communication & language", [
    ["Give instructions one step at a time", "Say one step, wait, check it has landed, then give the next. Write the steps on the board as backup.", "No cost"],
    ["Pre-teach subject vocabulary", "Give the learner the new words before the lesson, with a picture or a translation into their strongest language.", "Low"],
    ["Allow processing time", "Count ten seconds silently after a question before rephrasing or moving on. Silence is usually processing, not refusal.", "No cost"],
    ["Offer a choice of two rather than an open question", "Replace what do you think with do you think A or B, then build back up.", "No cost"],
    ["Check understanding by asking the learner to show, not say", "Point, draw, demonstrate or sort, so understanding is not hidden by expressive difficulty.", "No cost"]], 1),
  ...S("Social interaction", [
    ["Structure unstructured time", "Give a role at break: equipment monitor, buddy bench, a club. Most distress happens where there is no structure.", "Low"],
    ["Set up a buddy system with a trained peer", "Choose the peer carefully, brief them privately, and rotate so no one carries it alone.", "Low"],
    ["Teach the hidden rules explicitly", "Name what the class is expected to do and why, rather than assuming it is obvious.", "No cost"],
    ["Protect a quiet alternative at break", "A library, a classroom or a club. Being alone by choice is not a problem to solve.", "Low"]], 6),
  ...S("Attention & task engagement", [
    ["Break the task into visible parts", "Number the steps and let the learner tick each one. Finishing is easier when the end is visible.", "No cost"],
    ["Shorten the task, not the learning", "Ask for five questions that show the skill rather than twenty that show stamina.", "No cost"],
    ["Agree a movement break the learner can take without asking", "A card, a signal or a job to run. Pre-agreed, so it is not a negotiation in the moment.", "No cost"],
    ["Seat away from doors, windows and high traffic", "Front and to the side usually beats front and centre, which raises exposure.", "No cost"],
    ["Cue before transitions", "Give a two minute warning and name what comes next.", "No cost"]], 10),
  ...S("Behaviour & emotional regulation", [
    ["Identify the trigger before the strategy", "Record what came immediately before, what happened and what came after, for two weeks, before changing anything.", "No cost"],
    ["Agree a safe exit route and place", "Pre-agreed, available without asking in words, and never removed as a punishment.", "Low"],
    ["Teach and rehearse the signal when calm", "A regulation strategy taught during distress will not be learned. Rehearse it on good days.", "No cost"],
    ["Reduce the demand before the moment, not during it", "Where distress is predictable, change the lesson design rather than managing the aftermath.", "No cost"],
    ["Plan the recovery, not just the incident", "Record how long recovery takes and protect that time. Returning too soon causes the next incident.", "No cost"]], 15),
  ...S("Sensory environment", [
    ["Allow ear defenders or headphones", "Agree where and when, brief all staff, and never remove them as a consequence.", "Low"],
    ["Reduce visual clutter near the learner", "Clear the wall in the learner's line of sight and keep displays behind them.", "No cost"],
    ["Give an alternative to the hall and assembly", "Arrive early, sit at the edge, leave first, or attend for part of it.", "No cost"],
    ["Allow a sensory tool or a known comfort item", "Agree what it is and where it lives, so it does not become a classroom issue.", "Low"],
    ["Plan for fire drills and unexpected bells", "Warn in advance where possible, and agree where the learner goes.", "No cost"]], 20),
  ...S("Motor & written output", [
    ["Reduce copying from the board", "Give a printed copy or a photograph. Copying tests vision and motor skill, not understanding.", "Low"],
    ["Allow a laptop, tablet or voice to text", "Trial it first and record whether output improves. Evidence of use supports a later concession application.", "Medium"],
    ["Accept the answer in another form", "Oral answers, diagrams, bullet points or a recording, where the written form is not what is being assessed.", "No cost"],
    ["Provide a scribe for longer written tasks", "Start in internal assessments so the learner is practised before any examination.", "Medium"],
    ["Adjust the physical set-up", "Chair height, desk slope, pencil grip, paper position and lighting, usually on occupational therapy advice.", "Low"]], 25),
  ...S("Adaptive independence", [
    ["Use a visual routine for the daily sequence", "Photographs or symbols for the order of the day, kept where the learner can see it.", "Low"],
    ["Teach the routine in steps and fade the prompt", "Record which step still needs an adult, so progress is visible and support reduces on purpose.", "No cost"],
    ["Allow extra time and privacy for personal care", "Especially from the senior phase onwards, where dignity and privacy become the issue.", "Low"],
    ["Plan for the parts of the day with no adult watching", "Arrival, break, changing for sport and going home are where independence actually breaks down.", "No cost"]], 30),
  ...S("Attendance & participation", [
    ["Follow up every absence pattern, not just the total", "A learner absent every Monday is telling the school something that a termly percentage hides.", "No cost"],
    ["Offer a phased or late start where anxiety drives absence", "Agree it formally and in writing, with a date to review and increase.", "Low"],
    ["Give a soft landing on arrival", "A job, a named adult and somewhere to go before the bell.", "No cost"],
    ["Keep the work accessible during absence", "So that returning does not mean facing an impossible backlog, which drives the next absence.", "Low"]], 34),
  ...S("Wellbeing & safeguarding", [
    ["Name a trusted adult and tell the learner who it is", "A learner cannot use a support system they do not know exists.", "No cost"],
    ["Give a private way to ask for help", "A card, a note, an email address or a signal, so asking does not require speaking in front of peers.", "No cost"],
    ["Record concerns factually and on the day", "What was seen or heard, when, where, and who was told. Facts, not conclusions.", "No cost"],
    ["Follow the statutory reporting route when the threshold is met", "Do not investigate it yourself. Report it, and record that you did.", "No cost"]], 38),
  ...S("Curriculum access", [
    ["Differentiate the content, the method, the assessment or the environment", "SIAS expects differentiation at these four levels. Record which one was changed, on DBE 125.", "No cost"],
    ["Give the learning objective in advance", "So the learner knows what success looks like before the lesson rather than after it.", "No cost"],
    ["Use graphic organisers and writing frames", "Especially from the intermediate phase, where extended writing becomes the barrier.", "Low"],
    ["Provide text at an accessible reading level", "Same content, different reading load, so a reading barrier does not become a subject barrier.", "Low"],
    ["Check the accommodation is used in every subject", "An accommodation applied by one teacher and not the rest is not an accommodation.", "No cost"]], 42),
  ...S("Emergent literacy & reading", [
    ["Teach phonics explicitly, systematically and cumulatively", "Follow a structured programme. Record the dose: how many minutes, how often, delivered by whom.", "Medium"],
    ["Give daily short decoding practice", "Ten focused minutes a day beats an hour a week.", "Low"],
    ["Separate decoding from comprehension when assessing", "Read the text aloud to the learner to see what they understand when the decoding load is removed.", "No cost"],
    ["Use paired or echo reading", "An adult or practised peer reads first, the learner follows.", "No cost"]], 47),
  ...S("Writing", [
    ["Let the learner say it before writing it", "Oral rehearsal, or a voice recording, before the pen touches paper.", "No cost"],
    ["Provide a writing frame or sentence starters", "Reduce the planning load so the content can show.", "Low"],
    ["Mark for content separately from spelling and handwriting", "Say which one is being marked, so effort goes to the right place.", "No cost"],
    ["Reduce the volume, keep the demand", "One well-built paragraph can show what three pages would.", "No cost"]], 51),
  ...S("Early numeracy", [
    ["Keep concrete materials available past the age they are usually withdrawn", "Counters, number lines and blocks are a support, not a sign of failure.", "Low"],
    ["Reduce the language load in word problems", "Shorten the sentence, keep the mathematics.", "No cost"],
    ["Check whether the error is number, language, memory or recording", "The strategy depends entirely on which it is.", "No cost"],
    ["Give a multiplication and number fact reference card", "Automatic recall is not the skill being assessed in most tasks.", "No cost"]], 55),
  ...S("Mathematical reasoning", [
    ["Allow a calculator where calculation is not what is being assessed", "State in the plan which tasks this applies to.", "No cost"],
    ["Provide worked examples to refer to", "A model on the desk reduces load on working memory.", "No cost"],
    ["Teach the command words directly", "Explain, justify, compare and evaluate must be taught, not assumed.", "No cost"]], 59),
  ...S("Classroom routines & executive skills", [
    ["Post the routine and point to it rather than repeating it", "Reduces the verbal load and builds independence.", "No cost"],
    ["Use a checklist for leaving the classroom", "Books, bag, homework, jersey. Checked by the learner, not the adult.", "No cost"],
    ["Give a personal copy of the timetable", "On paper and on a phone, colour coded by subject.", "No cost"]], 62),
  ...S("Study & organisation", [
    ["Set up a homework recording system that does not rely on memory", "Photograph the board, use a shared class page, or have it checked before the bell.", "No cost"],
    ["Break long assignments into dated stages", "Each stage checked, so a problem is found in week one and not the night before.", "No cost"],
    ["Teach one study strategy properly rather than naming five", "Retrieval practice and spacing, taught and rehearsed in class.", "Low"]], 65),
  ...S("Executive functioning & independence", [
    ["Give one named adult who holds the whole picture", "From the senior phase onwards this matters more than any single strategy.", "Low"],
    ["Share a one page profile with every subject teacher", "The support map produces it. Update it each term.", "No cost"],
    ["Teach the learner to ask for an adjustment privately", "Rehearse the words. Self-advocacy is a taught skill, not a personality trait.", "No cost"]], 68),
  ...S("Adolescent wellbeing & peer context", [
    ["Check in briefly and regularly rather than only in crisis", "Two minutes a week from a trusted adult prevents more than an hour in a crisis.", "No cost"],
    ["Keep support discreet", "Support delivered publicly is often refused. Ask the learner how they want it done.", "No cost"],
    ["Watch for masking", "A learner who is fine at school and falling apart at home is not fine at school.", "No cost"]], 71),
  ...S("Assessment access & accommodations", [
    ["Apply the accommodation in every internal assessment first", "An accommodation first used in a final examination usually fails. Build the record early.", "Low"],
    ["Keep the evidence file current", "Reports, internal assessment results with and without the accommodation, and the ISP history.", "Low"],
    ["Confirm this year's application deadline with the district", "Deadlines differ by assessment body and change. Record the date in the profile and diarise it.", "No cost"],
    ["Teach the learner to use the accommodation", "Working with a scribe or a reader is a skill that has to be practised.", "Low"]], 74),
  ...S("Post-school transition", [
    ["Start transition planning at least two years out", "Grade 10 is not too early. Grade 12 is usually too late.", "No cost"],
    ["Register with the receiving institution's disability unit early", "Support does not transfer automatically. Someone has to apply.", "Low"],
    ["Build self-advocacy before the learner leaves", "After school, nobody will explain the learner's needs for them.", "No cost"]], 78),
  ...S("Play & social participation", [
    ["Join the child's play before redirecting it", "Follow their lead first. Entry into play is the intervention.", "No cost"],
    ["Use a predictable play routine with a clear start and end", "Visual or musical cues to signal transitions.", "Low"],
    ["Teach turn taking with a concrete object", "A timer or a passed object makes an abstract rule visible.", "No cost"]], 81),
  ...S("Early communication", [
    ["Respond to every communication attempt, however it is made", "A gesture, a look or a behaviour is communication, and responding builds more of it.", "No cost"],
    ["Model the next step up, without demanding it", "If the child uses one word, model two. Do not withhold the item until they say it.", "No cost"],
    ["Introduce pictures, signs or a device without waiting for speech to fail", "These support speech development, they do not replace it.", "Medium"]], 84),
  ...S("Development & readiness", [
    ["Build the skill inside the routine, not in a separate session", "Snack, tidy-up and story time are the curriculum at this age.", "No cost"],
    ["Reduce the number of transitions in a session", "Most distress at this age happens between activities, not during them.", "No cost"],
    ["Share observations with the family early and plainly", "Early referral changes outcomes more than any classroom strategy.", "No cost"]], 87),
  ...S("Interventions & accommodations", [
    ["Record what was tried, for how long, and by whom", "A support used twice is not a support that was tried. Without the dose and the duration, a district official cannot act on the record.", "No cost"],
    ["Check the accommodation is applied by every teacher", "An adjustment applied in one classroom and not the rest is not an adjustment. Confirm it in writing, not in a corridor.", "No cost"],
    ["Ask the learner whether the support helped", "Support the learner finds embarrassing will be refused, and the refusal will be recorded as the support not working.", "No cost"]], 90),
  ...S("Strengths & learner voice", [
    ["Build the support on an existing strength", "Use the strength as the route in, not as a reward for completing the hard thing.", "No cost"],
    ["Give the learner a role that uses what they are good at", "Visible competence in front of peers changes how a class sees a learner, and how the learner sees themselves.", "No cost"],
    ["Record the learner's own words in the plan", "Quote them. A plan written only in adult language is a plan the learner cannot hold.", "No cost"]], 93),
  ...S("Family & collaboration", [
    ["Agree one communication channel and stick to it", "A book, a message, a call at an agreed time. Many channels means no channel.", "No cost"],
    ["Lead with what is going well", "A family that only hears from the school when something is wrong stops answering.", "No cost"],
    ["Remove the practical barriers to attending a meeting", "Timing, transport, language and childcare decide attendance more often than willingness does.", "Low"]], 96),
  ...S("School support process", [
    ["Give every action an owner and a date", "An action owned by the school is owned by nobody. Name the person.", "No cost"],
    ["Set the review date when the plan is written", "Not when the term ends, and not when someone remembers.", "No cost"],
    ["Keep the evidence file current from the start", "Reports, assessment results with and without support, and the ISP history. Assembling it later, under deadline, is where applications fail.", "Low"]], 99),
  ...S("Transitions between phases", [
    ["Hand over in a meeting, not in a file", "Ten minutes between the sending and receiving teacher transfers more than a document does.", "No cost"],
    ["Name what will fall away in the next phase", "Then decide deliberately whether to keep it, rather than losing it by default.", "No cost"],
    ["Give the receiving teacher the one page summary before the first day", "The support map produces it. Day one is when a learner decides whether the new year is safe.", "No cost"],
    ["Let the learner walk the new timetable or classroom in advance", "Especially before Grade 4, Grade 7 and Grade 10.", "Low"]], 102),
  ...S("Assistive technology and access", [
    ["Show every teacher how the system works, including relief staff", "A device nobody can operate is not access. Record who has been shown and when.", "Low"],
    ["Check the technology works in the room it is needed in", "Power, signal, noise and seating defeat more devices than the device itself does.", "Low"],
    ["Teach the learner to use it independently", "Then record that they can, because that record supports a later concession application.", "Low"],
    ["Have a plan for when it fails", "Paper backup, a spare, or an agreed alternative, so a flat battery is not a lost lesson.", "Low"]], 106),
  ...S("Early literacy", [
    ["Read aloud daily and talk about the pictures", "Shared attention around a book is the foundation, before any letter is taught.", "No cost"],
    ["Play with sound: rhyme, clapping syllables, first sounds", "Phonological awareness predicts later reading, and it is built in play.", "No cost"],
    ["Make the child's own name the first print they own", "Name cards on the peg, the chair, the work. Personally meaningful print comes first.", "No cost"]], 110),
  ...S("Early mathematics", [
    ["Count real things in the routine", "Cups at snack, children in the line, steps to the gate. Counting in context before counting on paper.", "No cost"],
    ["Sort and match before asking for numerals", "Colour, shape, size and type build the thinking that number sits on.", "No cost"],
    ["Use the language of comparison out loud", "More, fewer, bigger, the same. Mathematical language starts as spoken language.", "No cost"]], 113),
  ...S("Reading to learn", [
    ["Give the text in advance", "Reading it once before the lesson changes what the learner can do during it.", "Low"],
    ["Provide the same content at an accessible reading level", "So a reading barrier does not become a history or science barrier.", "Low"],
    ["Teach how to find the main idea explicitly", "Model it, do it together, then let them try. Do not assume it transfers from decoding.", "No cost"]], 116),
  ...S("Extended writing", [
    ["Plan before writing, in any form", "A mind map, bullets, a voice note or a verbal rehearsal. The planning is the task.", "No cost"],
    ["Supply the structure and assess the content", "Writing frames and paragraph starters are scaffolding, not cheating.", "Low"],
    ["Allow typing or dictation for longer pieces", "Record the difference in output. That record is evidence for later access arrangements.", "Medium"]], 119),
  ...S("Subject rotation & abstract learning", [
    ["Give one shared one page profile to every subject teacher", "Ten teachers each discovering the learner independently wastes a term.", "No cost"],
    ["Make the abstract concrete before going back to the abstract", "A diagram, a model or an example first, then the rule.", "No cost"],
    ["Teach the command words", "Analyse, evaluate, justify and compare are the actual barrier in many answers.", "No cost"]], 122),
  ...S("Higher-order thinking", [
    ["Separate thinking from writing", "Let the learner argue it aloud before being asked to write it. Reasoning is often present and invisible.", "No cost"],
    ["Give a worked example of a good answer", "Show what quality looks like rather than describing it.", "No cost"],
    ["Allow thinking time before answering in class", "Give the question, then come back to the learner. Cold calling tests retrieval speed, not understanding.", "No cost"]], 125),
  ...S("Subject-specific performance", [
    ["Identify whether the barrier is the subject or the format", "A learner strong orally and weak on paper has an output barrier, not a subject barrier.", "No cost"],
    ["Check subject choice against strengths, not only marks", "A subject chosen against the profile costs three years.", "No cost"],
    ["Front-load the technical vocabulary of each subject", "Every subject is partly a new language.", "Low"]], 128),
  ...S("Independent study & workload", [
    ["Build the study timetable with the learner, not for them", "Then review it after two weeks against what actually happened.", "No cost"],
    ["Break cumulative revision into a weekly cycle", "Little and often, revisiting older content, rather than a block before the examination.", "No cost"],
    ["Agree a realistic ceiling on hours", "A learner working until midnight is not managing the workload, and the collapse is coming.", "No cost"]], 131),
  ...S("Playground & group routines", [
    ["Give a structured option at break", "A club, a job or a game with known rules, available but never compulsory.", "Low"],
    ["Brief the staff on duty", "The adult on the playground usually knows nothing about the support plan.", "No cost"],
    ["Teach the routine of the group game explicitly", "Lining up, taking turns and joining in are taught skills.", "No cost"]], 134),
  ...S("Classroom learning access", [
    ["Give instructions in writing as well as aloud", "On the board, on the desk, or on a card. Spoken-only instruction excludes a lot of learners.", "No cost"],
    ["Allow the learner to show understanding in more than one way", "Pointing, sorting, demonstrating or speaking, rather than writing alone.", "No cost"],
    ["Make the routine and the success criteria explicit", "Predictability lowers the cost of being in the room.", "No cost"]], 137)
];

// ---------- Page 02: what changes at each school level ----------
export const GUIDE_ROWS: [string, Record<Phase, string>][] = [
  ["Ages and grades usually covered", {
    ecd: "About 2 to 6 years, before Grade R in some settings and including Grade R in others.", foundation: "Grade R to Grade 3. Roughly 5 to 9 years.",
    intermediate: "Grade 4 to Grade 6. Roughly 10 to 12 years.", senior: "Grade 7 to Grade 9. Roughly 13 to 15 years.", fet: "Grade 10 to Grade 12. Roughly 16 to 18 years." }],
  ["What the setting is mainly asking the learner to do", {
    ecd: "Separate from a caregiver, join a group, play, communicate a need, follow a familiar routine and explore materials.",
    foundation: "Learn to read, write and count. Sit at a desk for longer. Follow instructions given to a whole class rather than to them personally.",
    intermediate: "Read in order to learn, rather than learn to read. Write at length. Hold several steps in mind. Work from a textbook.",
    senior: "Move between many subject teachers, each with different rules. Think abstractly. Plan across competing deadlines. Manage a social world.",
    fet: "Carry a specialised subject load, study independently, and sit high stakes examinations that decide what comes next." }],
  ["What the learner must now do alone for the first time", {
    ecd: "Be apart from a familiar adult. Ask for help from someone who does not know them well.",
    foundation: "Start a task after a whole-class instruction. Keep track of a book, a bag and homework.",
    intermediate: "Record homework from the board, pack for different subjects, and break a long task into steps.",
    senior: "Hold a timetable in mind, carry work between rooms, and ask an unfamiliar teacher for an adjustment without the class hearing.",
    fet: "Build a study timetable, decide what to revise, and use an approved accommodation correctly under examination conditions." }],
  ["What difficulties typically surface here, and why", {
    ecd: "Communication, joint attention, play, sensory responses and separation. The setting is the first place a difference is seen outside the home.",
    foundation: "Reading, spelling, handwriting and sitting still. The curriculum suddenly demands skills that were not needed before, so differences become visible.",
    intermediate: "Comprehension, written output and organisation. Support that was carried by the single class teacher disappears, and so does the scaffolding.",
    senior: "Executive function, anxiety, masking and school refusal. Demands rise faster than independence does, and the learner is now managing ten adults.",
    fet: "Workload collapse, examination access and missed concessions. A learner who coped by working twice as hard often cannot sustain it at this volume." }],
  ["The highest risk moments in this phase", {
    ecd: "Arrival and separation, transitions between activities, group noise, and the move into Grade R.",
    foundation: "The move from play-based learning to desk work in Grade 1, and the reading demands of Grade 3.",
    intermediate: "Grade 4 itself. One teacher becomes many subjects, written volume rises sharply and support often falls away unnoticed.",
    senior: "Grade 7, the first year of subject rotation. Also any term where assessments from several subjects land in the same week.",
    fet: "Grade 10 subject choice, and the concession application window. A missed application here cannot usually be fixed in Grade 12." }],
  ["What good support looks like here", {
    ecd: "Predictable routine, visual cues, a familiar adult, sensory options, and play-based intervention rather than formal teaching.",
    foundation: "Explicit, structured teaching of phonics and number. Instructions broken into steps. Multi-sensory materials. Short tasks with clear ends.",
    intermediate: "Graphic organisers, writing frames, note-taking support, a homework recording system, and reduced copying from the board.",
    senior: "One named adult who holds the whole picture across subjects. A shared one page profile given to every subject teacher. Explicit teaching of planning.",
    fet: "Accommodations used consistently in every internal assessment, assistive technology, a realistic study plan, and transition planning for what follows school." }],
  ["What must be decided or recorded in this phase", {
    ecd: "Whether a referral for developmental assessment is needed, and whether the setting can meet the support need as it stands.",
    foundation: "Open the learner profile. Complete SNA 1 and record what was tried at classroom level before escalating.",
    intermediate: "Review whether classroom support is still working. Complete SNA 2 with the SBST if it is not, and start the Individual Support Plan.",
    senior: "Confirm the support plan transfers to every subject teacher. Escalate to the DBST on DBE 120 if school level support is not enough.",
    fet: "Apply for examination accommodations on DBE 124 with current supporting evidence, and build a post-school transition plan." }],
  ["Preparing for the next phase", {
    ecd: "Visit the Grade R classroom, share the support profile with the receiving teacher, and plan a staggered start.",
    foundation: "Brief the Grade 4 team before the year starts. Name what will fall away when one teacher becomes many.",
    intermediate: "Walk the timetable before Grade 7 begins. Agree who the one named adult will be.",
    senior: "Decide subject choices with the support need in mind, not only with marks in mind. Start the concession evidence file now.",
    fet: "Register with the disability unit of the receiving college or university, or with the employer, before the learner arrives." }]
];
export const ACROSS_PHASES = [
  "A quiet, compliant learner is often identified late. Difficulty that shows as withdrawal rather than disruption is missed in every phase, and most often in the foundation phase.",
  "A learner who copes until Grade 4 has not changed. The scaffolding of one class teacher has been removed.",
  "A learner who collapses in Grade 7 is usually meeting an executive demand, not a new learning difficulty.",
  "A learner who passes everything until Grade 10 and then fails is often one who compensated by working twice as hard, at a volume that is no longer survivable.",
  "Masking is not dishonesty. A learner who is fine at school and falls apart at home is not fine at school."
];

/** The escalation ladder (page 10): each step must be documented before the next one is used. */
export const LADDER: [string, string, string, string][] = [
  ["Learner profile", "Opened on admission or at the start of a phase, and kept current.", "Learner profile", "Class teacher"],
  ["Classroom level support", "Differentiation tried and recorded. What was tried, for how long, and what happened.", "Recorded in the support plan", "Class teacher"],
  ["SNA 1", "Areas of concern, the learner's strengths and needs, and the classroom interventions already attempted.", "SNA 1", "Class teacher"],
  ["SBST involvement", "SNA 1 complete. The school support team reviews and plans.", "SNA 2", "School Based Support Team"],
  ["Individual Support Plan", "Agreed goals, named owners for each item, and a set review date rather than an open-ended intention.", "ISP", "SBST with the teacher and family"],
  ["District referral", "School level support has been tried and documented and is not enough.", "SNA 3 / DBE 120", "SBST to the DBST"],
  ["Curriculum differentiation record", "What was changed at content, method, assessment or environment level.", "DBE 125", "Teacher and SBST"],
  ["Accommodation or exemption", "Evidence file, current assessment report, and a history of the accommodation being used in internal assessments.", "DBE 124", "SBST and DBST"],
  ["Health and disability assessment", "Where a health or disability input is needed for the support or concession decision.", "DBE 126", "Qualified health professional"]
];
