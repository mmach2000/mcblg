export interface GitInfo {
  created: string;
  lastUpdated: string;
  lastUpdatedHash: string;
}

export interface HydratedGitInfo {
  created: Date;
  lastUpdated: Date;
  lastUpdatedHash: string;
}

export interface RuntimePageInfo {
  title: string;
  routePath: string;
  gitInfo: GitInfo;
  wordCount: number;
}

export type TagToRoutes = Record<string, string[]>;
export type RouteToPageInfo = Record<string, RuntimePageInfo>;
