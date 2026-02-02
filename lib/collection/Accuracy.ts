export enum Accuracy {
  LessThan50,
  From50To60,
  From60To70,
  From70To80,
  From80To90,
  From90To100,
}

export type AccuracyDescription = {
  accuracy: Accuracy;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const accuracyDescriptions = [
  {
    accuracy: Accuracy.From90To100,
    localizedDescription: "90-100%",
    localizedLongDescription: "Between 90% and 100% accuracy",
    num: 5,
  },
  {
    accuracy: Accuracy.From80To90,
    localizedDescription: "80-90%",
    localizedLongDescription: "Between 80% and 90% accuracy",
    num: 4,
  },
  {
    accuracy: Accuracy.From70To80,
    localizedDescription: "70-80%",
    localizedLongDescription: "Between 70% and 80% accuracy",
    num: 3,
  },
  {
    accuracy: Accuracy.From60To70,
    localizedDescription: "60-70%",
    localizedLongDescription: "Between 60% and 70% accuracy",
    num: 2,
  },
  {
    accuracy: Accuracy.From50To60,
    localizedDescription: "50-60%",
    localizedLongDescription: "Between 50% and 60% accuracy",
    num: 1,
  },
  {
    accuracy: Accuracy.LessThan50,
    localizedDescription: "<50%",
    localizedLongDescription: "Less fuel scored than missed.",
    num: 0,
  },
] as const satisfies AccuracyDescription[];
