export enum MatchEventPosition {
    None = "None",

    // Starting Positions
    StartOne = "StartOne",
    StartTwo = "StartTwo",
    StartThree = "StartThree",

    // Teleop Scoring
    ScoreLow = "ScoreLow",
    ScoreMid = "ScoreMid",
    ScoreHigh = "ScoreHigh",

    // Auto Scoring
    GridOneLow = "GridOneLow",
    GridOneMid = "GridOneMid",
    GridOneHigh = "GridOneHigh",
    GridTwoLow = "GridTwoLow",
    GridTwoMid = "GridTwoMid",
    GridTwoHigh = "GridTwoHigh",
    GridThreeLow = "GridThreeLow",
    GridThreeMid = "GridThreeMid",
    GridThreeHigh = "GridThreeHigh",

    // Auto Ground Pieces
    AutoPieceOne = "AutoPieceOne",
    AutoPieceTwo = "AutoPieceTwo",
    AutoPieceThree = "AutoPieceThree",
    AutoPieceFour = "AutoPieceFour",
}

export type MatchEventPositionDetails = {
    num: number;
}

export const matchEventPositions: Record<MatchEventPosition, MatchEventPositionDetails> = Object.values(MatchEventPosition).reduce((prev, curr, currInd) => ({
    ...prev, curr: {num: currInd}
}), {} as Record<MatchEventPosition, MatchEventPositionDetails>);

export type StartingPosition =
  MatchEventPosition.StartOne
  | MatchEventPosition.StartTwo
  | MatchEventPosition.StartThree

export let groundPieces = [
    MatchEventPosition.AutoPieceOne,
    MatchEventPosition.AutoPieceTwo,
    MatchEventPosition.AutoPieceThree,
    MatchEventPosition.AutoPieceFour,
]
