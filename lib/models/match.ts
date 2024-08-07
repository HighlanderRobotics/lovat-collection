export enum MatchType {
  Qualifier = "QUALIFIER",
  Elimination = "PLAYOFF",
}

export type MatchTypeDescription = {
  type: MatchType;
  localizedDescription: string;
  localizedDescriptionPlural: string;
  localizedDescriptionAbbreviated: string;
  localizedDescriptionAbbreviatedPlural: string;
  shortName: string;
  num: number;
};

export const matchTypes: MatchTypeDescription[] = [
  {
    type: MatchType.Qualifier,
    localizedDescription: "Qualifier",
    localizedDescriptionPlural: "Qualifiers",
    localizedDescriptionAbbreviated: "Qual",
    localizedDescriptionAbbreviatedPlural: "Quals",
    shortName: "QM",
    num: 0,
  },
  {
    type: MatchType.Elimination,
    localizedDescription: "Elimination",
    localizedDescriptionPlural: "Eliminations",
    localizedDescriptionAbbreviated: "Elim",
    localizedDescriptionAbbreviatedPlural: "Elims",
    shortName: "EM",
    num: 1,
  },
];

export type MatchIdentity = {
  tournamentKey: string;
  matchType: MatchType;
  matchNumber: number;
};

export enum MatchIdentityLocalizationFormat {
  Short,
  Long,
  Full,
}

export function localizeMatchIdentity(
  matchIdentity: MatchIdentity,
  format: MatchIdentityLocalizationFormat,
): string {
  const matchType = matchTypes.find(
    (matchType) => matchType.type === matchIdentity.matchType,
  );
  if (!matchType) {
    throw new Error(`No match type for ${matchIdentity.matchType}`);
  }
  switch (format) {
    case MatchIdentityLocalizationFormat.Short:
      return `${matchType.shortName}${matchIdentity.matchNumber}`;
    case MatchIdentityLocalizationFormat.Long:
      return `${matchType.localizedDescription} ${matchIdentity.matchNumber}`;
    case MatchIdentityLocalizationFormat.Full:
      return `${matchIdentity.tournamentKey} ${matchType.localizedDescription} ${matchIdentity.matchNumber}`;
  }
}
