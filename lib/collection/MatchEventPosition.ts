export enum MatchEventPosition {
  None,
  StartOne,
  StartTwo,
  StartThree,
  // Teleop is listed to provide abstraction
  LevelOneTeleop,
  LevelTwoTeleop,
  LevelThreeTeleop,
  LevelFourTeleop,
  LevelOneA,
  LevelOneB,
  LevelOneC,
  LevelTwoA,
  LevelTwoB,
  LevelTwoC,
  LevelThreeA,
  LevelThreeB,
  LevelThreeC,
  LevelFourA,
  LevelFourB,
  LevelFourC,
  GroundPieceA,
  GroundPieceB,
  GroundPieceC,
  CoralStationA,
  CoralStationB,
}

export type StartingPosition =
  | MatchEventPosition.StartOne
  | MatchEventPosition.StartTwo
  | MatchEventPosition.StartThree;

export enum GroundPiecePosition {
  GroundPieceA = MatchEventPosition.GroundPieceA,
  GroundPieceB = MatchEventPosition.GroundPieceB,
  GroundPieceC = MatchEventPosition.GroundPieceC,
}

// Can be used for the robot and/or ground pieces
export type PieceContainerContents = {
  algae: boolean;
  coral: boolean;
};
