export enum MatchEventPosition {
  None,
  StartRedProcessor,
  StartRedNet,
  StartBlueNet,
  StartBlueProcessor,
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

export const startingPositions: Record<string, MatchEventPosition> = {
  StartRedProcessor: MatchEventPosition.StartRedProcessor,
  StartRedNet: MatchEventPosition.StartRedNet,
  StartBlueNet: MatchEventPosition.StartBlueNet,
  StartBlueProcessor: MatchEventPosition.StartBlueProcessor,
} as const;

export const groundPiecePositions: Record<string, MatchEventPosition> = {
  GroundPieceA: MatchEventPosition.GroundPieceA,
  GroundPieceB: MatchEventPosition.GroundPieceB,
  GroundPieceC: MatchEventPosition.GroundPieceC,
};

// Can be used for the robot and/or ground pieces
export type PieceContainerContents = {
  algae: boolean;
  coral: boolean;
};
