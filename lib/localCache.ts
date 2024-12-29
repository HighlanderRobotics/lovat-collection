import z from "zod";

export enum DataSource {
  Cache,
  Server,
}

export type LocalCache<T> = {
  sourcedAt: number;
  source: DataSource;
  data: T;
};

export const nullSchema = z.literal(null);

export function localCacheSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    sourcedAt: z.number(),
    source: z.nativeEnum(DataSource),
    data: schema,
  });
}
