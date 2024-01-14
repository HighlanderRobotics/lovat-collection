export enum MatchEventPosition {
  None = "None",
  WingNearAmp = "WingNearAmp",
  WingFrontOfSpeaker = "WingFrontOfSpeaker",
  WingCenter = "WingCenter",
  WingNearSource = "WingNearSource",
  Amp = "Amp",
  Speaker = "Speaker",
  Trap = "Stage",

  GroundNoteAllianceNearAmp = "GroundNoteAllianceNearAmp",
  GroundNoteAllianceFrontOfSpeaker = "GroundNoteAllianceFrontOfSpeaker",
  GroundNoteAllianceByStage = "GroundNoteAllianceByStage",
  GroundNoteCenterFarthestAmpSide = "GroundNoteCenterFarthestAmpSide",
  GroundNoteCenterTowardAmpSide = "GroundNoteCenterTowardAmpSide",
  GroundNoteCenterCenter = "GroundNoteCenterCenter",
  GroundNoteCenterTowardSourceSide = "GroundNoteCenterTowardSourceSide",
  GroundNoteCenterFarthestSourceSide = "GroundNoteCenterFarthestSourceSide",
}

export type MatchEventPositionDetails = {
  num: number;
}

export const matchEventPositions: Record<MatchEventPosition, MatchEventPositionDetails> = {
  [MatchEventPosition.None]: { num: 0 },
  [MatchEventPosition.WingNearAmp]: { num: 4 },
  [MatchEventPosition.WingFrontOfSpeaker]: { num: 5 },
  [MatchEventPosition.WingCenter]: { num: 6 },
  [MatchEventPosition.WingNearSource]: { num: 7 },
  [MatchEventPosition.Amp]: { num: 1 },
  [MatchEventPosition.Speaker]: { num: 2 },
  [MatchEventPosition.Trap]: { num: 3 },
  [MatchEventPosition.GroundNoteAllianceNearAmp]: { num: 8 },
  [MatchEventPosition.GroundNoteAllianceFrontOfSpeaker]: { num: 9 },
  [MatchEventPosition.GroundNoteAllianceByStage]: { num: 10 },
  [MatchEventPosition.GroundNoteCenterFarthestAmpSide]: { num: 11 },
  [MatchEventPosition.GroundNoteCenterTowardAmpSide]: { num: 12 },
  [MatchEventPosition.GroundNoteCenterCenter]: { num: 13 },
  [MatchEventPosition.GroundNoteCenterTowardSourceSide]: { num: 14 },
  [MatchEventPosition.GroundNoteCenterFarthestSourceSide]: { num: 15 },
};

export type StartingPosition =
  MatchEventPosition.WingNearAmp
  | MatchEventPosition.WingFrontOfSpeaker
  | MatchEventPosition.WingCenter
  | MatchEventPosition.WingNearSource;

export type GroundNotePositionDetails = {
  fieldCoordinates: {
    x: number,
    y: number,
  };
}

export let groundNotePositions: {
  [key in MatchEventPosition]?: GroundNotePositionDetails;
} = {
  [MatchEventPosition.GroundNoteAllianceNearAmp]: {
    fieldCoordinates: {
      x: 0.179,
      y: 0.16,
    },
  },
  [MatchEventPosition.GroundNoteAllianceFrontOfSpeaker]: {
    fieldCoordinates: {
      x: 0.179,
      y: 0.33,
    },
  },
  [MatchEventPosition.GroundNoteAllianceByStage]: {
    fieldCoordinates: {
      x: 0.179,
      y: 0.5,
    },
  },
  [MatchEventPosition.GroundNoteCenterFarthestAmpSide]: {
    fieldCoordinates: {
      x: 0.5,
      y: 0.106,
    },
  },
  [MatchEventPosition.GroundNoteCenterTowardAmpSide]: {
    fieldCoordinates: {
      x: 0.5,
      y: 0.303,
    },
  },
  [MatchEventPosition.GroundNoteCenterCenter]: {
    fieldCoordinates: {
      x: 0.5,
      y: 0.5,
    },
  },
  [MatchEventPosition.GroundNoteCenterTowardSourceSide]: {
    fieldCoordinates: {
      x: 0.5,
      y: 0.697,
    },
  },
  [MatchEventPosition.GroundNoteCenterFarthestSourceSide]: {
    fieldCoordinates: {
      x: 0.5,
      y: 0.894,
    },
  },
};

export type GroundNotePosition = keyof typeof groundNotePositions;
