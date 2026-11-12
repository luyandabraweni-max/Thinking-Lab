// Public interface of the voice module.
export { LANGUAGES, NativeSpeechEngine, WebSpeechEngine, pickEngine, speak, stopSpeaking, type Heard, type ListenOptions, type SpeechEngine } from "./engines";
export { command, digits, forField, normaliseDose, soundAlikes, wordsToNumber, type Command, type FieldKind } from "./parse";
