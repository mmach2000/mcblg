export interface GitInfo {
  created?: string;
  lastUpdated?: string;
  lastUpdatedHash?: string;
}

export interface ReadingTime {
  minutes: number;
  words: number;
  text: string;
}

export interface RuntimePageInfo {
  title: string;
  routePath: string;
  gitInfo?: GitInfo;
  readTime: ReadingTime;
}

export type TagToRoutes = Record<string, string[]>;
export type RouteToPageInfo = Record<string, RuntimePageInfo>;
