export enum Accuracy {
  LessThan50,
  From50To60,
  From60To70,
  From70To80,
  From80To90,
  From90To100,
}

export type AccuracyDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const accuracyDescriptions: Record<Accuracy, AccuracyDescription> = {
  [Accuracy.LessThan50]: {
    localizedDescription: "<50%",
    localizedLongDescription: "Less fuel scored than missed.",
    num: 0,
  },
  [Accuracy.From50To60]: {
    localizedDescription: "50-60%",
    localizedLongDescription: "Between 50% and 60% accuracy.",
    num: 1,
  },
  [Accuracy.From60To70]: {
    localizedDescription: "60-70%",
    localizedLongDescription: "Between 60% and 70% accuracy.",
    num: 2,
  },
  [Accuracy.From70To80]: {
    localizedDescription: "70-80%",
    localizedLongDescription: "Between 70% and 80% accuracy.",
    num: 3,
  },
  [Accuracy.From80To90]: {
    localizedDescription: "80-90%",
    localizedLongDescription: "Between 80% and 90% accuracy.",
    num: 4,
  },
  [Accuracy.From90To100]: {
    localizedDescription: "90-100%",
    localizedLongDescription: "Between 90% and 100% accuracy.",
    num: 5,
  },
};
