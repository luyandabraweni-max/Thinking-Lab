// Types for the generated drawing module (legacy-avatar.js).
import type { AvatarLook } from "@tl/data";
type Opt = [value: string, label: string];
export const AV: { skin: Opt[]; hairCol: Opt[]; hair: Opt[]; eyes: Opt[]; mouth: Opt[]; extra: Opt[]; cloth: Opt[]; prop: Opt[]; top: Opt[]; bg: Opt[]; names: string[] };
export const AV_NAME_MAX: number;
export const AV_SETS: [name: string, look: Partial<AvatarLook>][];
export const AV_DRAW: { scene(a: AvatarLook, full: boolean, calm: boolean): string };
export function avatarCode(a: Partial<AvatarLook>): string | null;
export function avatarFromCode(code: string, name?: string): AvatarLook;
export function cleanAvatarName(v: string): string;
export function defaultAvatar(): AvatarLook;
export function describeAvatar(a: Partial<AvatarLook>): string;
export function fullAvatar(a: Partial<AvatarLook> | null | undefined): AvatarLook;
