import { atom } from "jotai";

export enum FieldOrientation {
    Auspicious, // Blue on the left, red on the right
    Sinister, // Red on the left, blue on the right
}

export const fieldOrientationAtom = atom<FieldOrientation>(FieldOrientation.Auspicious);
