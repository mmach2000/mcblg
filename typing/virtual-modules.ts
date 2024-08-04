// noinspection JSUnusedGlobalSymbols

declare module 'my-virtual-*-routes' {
  const routes: string[];
  export default routes;
}

declare module 'my-virtual-*-tags' {
  const tagToPageInfos: import('./index').TagToRoutes;
  export default tagToPageInfos;
}

declare module 'my-virtual-*-page-info' {
  const routeToPageInfo: import('./index').RouteToPageInfo;
  export default routeToPageInfo;
}
