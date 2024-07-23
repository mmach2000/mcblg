import type { readingTime } from 'reading-time-estimator';

export interface GitInfo {
  created?: string;
  lastUpdated?: string;
  lastUpdatedHash?: string;
}

export interface RuntimePageInfo {
  title: string;
  routePath: string;
  gitInfo?: GitInfo;
  readTime: ReturnType<typeof readingTime>;
}

export type TagToRoutes = Record<string, string[]>;
export type RouteToPageInfo = Record<string, RuntimePageInfo>;
