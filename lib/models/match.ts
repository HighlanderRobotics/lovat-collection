export enum MatchType {
    Qualifier = "QUALIFIER",
    Playoff = "PLAYOFF",
}

export type MatchTypeDescription = {
    localizedDescription: string;
    localizedDescriptionPlural: string;
    shortName: string;
}

export const matchTypes = [
    {
        type: MatchType.Qualifier,
        localizedDescription: 'Qualifier',
        localizedDescriptionPlural: 'Qualifiers',
        shortName: 'QM',
    },
    {
        type: MatchType.Playoff,
        localizedDescription: 'Playoff',
        localizedDescriptionPlural: 'Playoffs',
        shortName: 'EM',
    },
];

export type MatchIdentity = {
    tournamentKey: string;
    matchType: MatchType;
    matchNumber: number;
}
