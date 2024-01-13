export enum MatchEventPosition {
  None = "None",
  WingNearAmp = "WingNearAmp",
  WingFrontOfSpeaker = "WingFrontOfSpeaker",
  WingCenter = "WingCenter",
  WingNearSource = "WingNearSource",
  Amp = "Amp",
  Speaker = "Speaker",
  Stage = "Stage",

  GroundNoteAllianceNearAmp = "GroundNoteAllianceNearAmp",
  GroundNoteAllianceFrontOfSpeaker = "GroundNoteAllianceFrontOfSpeaker",
  GroundNoteAllianceByStage = "GroundNoteAllianceByStage",
  GroundNoteCenterFarthestAmpSide = "GroundNoteCenterFarthestAmpSide",
  GroundNoteCenterTowardAmpSide = "GroundNoteCenterTowardAmpSide",
  GroundNoteCenterCenter = "GroundNoteCenterCenter",
  GroundNoteCenterTowardSourceSide = "GroundNoteCenterTowardSourceSide",
  GroundNoteCenterFarthestSourceSide = "GroundNoteCenterFarthestSourceSide",
}

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
