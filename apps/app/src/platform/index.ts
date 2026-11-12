// Public interface of the platform layer (composition root, sign-in adapters, shared-device learner lock).
export { DEMO_CODE, type AuthAdapter } from "./auth";
export { addDeviceLearner, checkPictures, deviceLearners, PICTURES, removeDeviceLearner, type DeviceLearner } from "./learner-lock";
export { createServices, ServicesProvider, useServices, useWho, WhoContext, type Services, type Who } from "./services";
