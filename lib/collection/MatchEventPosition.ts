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
  GroundPieceRedBarge,
  GroundPieceCenter,
  GroundPieceBlueBarge,
  CoralStationRedBarge,
  CoralStationBlueBarge,
}

export const startingPositions = {
  StartRedProcessor: MatchEventPosition.StartRedProcessor,
  StartRedNet: MatchEventPosition.StartRedNet,
  StartBlueNet: MatchEventPosition.StartBlueNet,
  StartBlueProcessor: MatchEventPosition.StartBlueProcessor,
} as const satisfies Record<string, MatchEventPosition>;

export const groundPiecePositions: Record<string, MatchEventPosition> = {
  GroundPieceA: MatchEventPosition.GroundPieceRedBarge,
  GroundPieceB: MatchEventPosition.GroundPieceCenter,
  GroundPieceC: MatchEventPosition.GroundPieceBlueBarge,
};

// Can be used for the robot and/or ground pieces
export type PieceContainerContents = {
  algae: boolean;
  coral: boolean;
};
