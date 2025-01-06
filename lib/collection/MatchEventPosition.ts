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
  // Ground Piece Positions?
}

export type StartingPosition =
  | MatchEventPosition.StartOne
  | MatchEventPosition.StartTwo
  | MatchEventPosition.StartThree;


export enum GroundPieceContents {
  None,
  Coral,
  Algae,
  Both,
}