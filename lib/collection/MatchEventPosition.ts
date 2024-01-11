export enum MatchEventPosition {
    WingNearAmp,
    WingFrontOfSpeaker,
    WingCenter,
    WingNearSource,
}

export type StartingPosition = 
      MatchEventPosition.WingNearAmp
    | MatchEventPosition.WingFrontOfSpeaker
    | MatchEventPosition.WingCenter 
    | MatchEventPosition.WingNearSource;
