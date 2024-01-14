
export enum HighNote {
    None = "NONE",
    Fail = "FAIL",
    Success = "SUCCESS"
}

export type HighNoteDescription = {
    localizedDescription: string;
    localizedLongDescription: string;
    num: number;
};

export const highNoteDescriptions: Record<HighNote, HighNoteDescription> = {
    [HighNote.None]: {
        localizedDescription: "None",
        localizedLongDescription: "The human player did not attempt to score a high note.",
        num: 0,
    },
    [HighNote.Fail]: {
        localizedDescription: "Fail",
        localizedLongDescription: "The human player attempted to score a high note but failed.",
        num: 1,
    },
    [HighNote.Success]: {
        localizedDescription: "Success",
        localizedLongDescription: "The human player successfully scored a high note.",
        num: 2,
    },
};
