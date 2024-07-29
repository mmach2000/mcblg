// noinspection JSUnusedGlobalSymbols

declare module 'my-virtual-posts-routes' {
  const routes: string[];
  export default routes;
}

declare module 'my-virtual-posts-tags' {
  const tagToPageInfos: import('./index').TagToRoutes;
  export default tagToPageInfos;
}

declare module 'my-virtual-posts-page-info' {
  const routeToPageInfo: import('./index').RouteToPageInfo;
  export default routeToPageInfo;
}

declare module 'my-virtual-series-routes' {
  const routes: string[];
  export default routes;
}

declare module 'my-virtual-series-tags' {
  const tagToPageInfos: import('./index').TagToRoutes;
  export default tagToPageInfos;
}

declare module 'my-virtual-series-page-info' {
  const routeToPageInfo: import('./index').RouteToPageInfo;
  export default routeToPageInfo;
}

declare module 'my-virtual-notes-routes' {
  const routes: string[];
  export default routes;
}

declare module 'my-virtual-notes-tags' {
  const tagToPageInfos: import('./index').TagToRoutes;
  export default tagToPageInfos;
}

declare module 'my-virtual-notes-page-info' {
  const routeToPageInfo: import('./index').RouteToPageInfo;
  export default routeToPageInfo;
}
