import { z } from "zod";

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
    shortName: "Q",
    num: 0,
  },
  {
    type: MatchType.Elimination,
    localizedDescription: "Playoff",
    localizedDescriptionPlural: "Playoffs",
    localizedDescriptionAbbreviated: "Elim",
    localizedDescriptionAbbreviatedPlural: "Elims",
    shortName: "P",
    num: 1,
  },
];

export const matchIdentitySchema = z.object({
  tournamentKey: z.string(),
  matchType: z.nativeEnum(MatchType),
  matchNumber: z.number(),
});

export type MatchIdentity = z.infer<typeof matchIdentitySchema>;

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
