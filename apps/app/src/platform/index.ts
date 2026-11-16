// Public interface of the platform layer (composition root, sign-in adapters, shared-device learner lock).
export { checkPassword, DEMO_CODE, PASSWORD_RULE, type AuthAdapter } from "./auth";
export { addDeviceLearner, checkPictures, deviceLearners, PICTURES, removeDeviceLearner, type DeviceLearner } from "./learner-lock";
export { createServices, ServicesProvider, useServices, useWho, WhoContext, type NewLearner, type Services, type Who } from "./services";
