export enum DataSource {
  Cache,
  Server,
}

export type LocalCache<T> = {
  sourcedAt: number;
  source: DataSource;
  data: T;
};
