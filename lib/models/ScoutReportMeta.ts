import { AllianceColor } from "./AllianceColor";
import { MatchIdentity } from "./match";

export type ScoutReportMeta = {
    scouterUUID: string;
    matchIdentity: MatchIdentity;
    teamNumber: number;
    allianceColor: AllianceColor;
};
